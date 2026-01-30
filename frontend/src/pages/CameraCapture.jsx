import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCamera, FaRedo, FaCheckCircle } from "react-icons/fa";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

const CameraCapture = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [faceFound, setFaceFound] = useState(false);
  const modelRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      await loadFaceDetectionModel();
      await startCamera();
    };
    initialize();
    return () => {
      stopCamera();
      stopFaceDetection();
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  const loadFaceDetectionModel = async () => {
    try {
      await tf.ready();
      const model = await blazeface.load();
      modelRef.current = model;
      setModelLoaded(true);
      console.log("Face detection model loaded successfully");
    } catch (err) {
      console.error("Error loading face detection model:", err);
      setError("modelLoadError");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current && modelLoaded) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => {
          console.error("Error playing video:", err);
        });
        // Wait a bit for video to start playing, then start face detection
        setTimeout(() => {
          if (!capturedImage && modelLoaded) {
            startFaceDetection();
          }
        }, 500);
      };
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      stopFaceDetection();
    };
  }, [stream, capturedImage, modelLoaded]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop any existing stream first
      if (stream) {
        stopCamera();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });
      
      setStream(mediaStream);
      setIsLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(err.name === "NotAllowedError" ? "permission" : "noCamera");
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startFaceDetection = () => {
    if (!modelRef.current || !videoRef.current || capturedImage || !modelLoaded) {
      console.log("Cannot start face detection:", { 
        hasModel: !!modelRef.current, 
        hasVideo: !!videoRef.current, 
        hasImage: !!capturedImage,
        modelLoaded 
      });
      return;
    }

    stopFaceDetection();
    console.log("Starting face detection...");

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !modelRef.current || capturedImage) {
        return;
      }

      const video = videoRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
        try {
          // Use returnTensors: false for better performance
          const predictions = await modelRef.current.estimateFaces(video, {
            returnTensors: false,
            flipHorizontal: true, // Account for mirrored video
            annotateBoxes: false
          });

          if (predictions.length > 0) {
            const face = predictions[0];
            const box = face.topLeft;
            const bottomRight = face.bottomRight;
            const width = bottomRight[0] - box[0];
            const height = bottomRight[1] - box[1];
            
            // Check if face is well-positioned (centered and of good size)
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const faceCenterX = box[0] + width / 2;
            const faceCenterY = box[1] + height / 2;
            const videoCenterX = videoWidth / 2;
            const videoCenterY = videoHeight / 2;
            
            // Calculate face position relative to center (normalized)
            const offsetX = Math.abs(faceCenterX - videoCenterX) / videoWidth;
            const offsetY = Math.abs(faceCenterY - videoCenterY) / videoHeight;
            const faceSize = (width * height) / (videoWidth * videoHeight);
            
            // More lenient requirements:
            // - Centered (within 40% of center - more forgiving)
            // - Good size (between 5% and 50% of frame - more flexible)
            const isWellPositioned = offsetX < 0.4 && offsetY < 0.4 && faceSize > 0.05 && faceSize < 0.5;
            
            setFaceFound(true);
            setFaceDetected(isWellPositioned);

            if (isWellPositioned && !countdown && !countdownIntervalRef.current) {
              // Start countdown before auto-capture
              setCountdown(3);
              let count = 3;
              countdownIntervalRef.current = setInterval(() => {
                count--;
                setCountdown(count);
                if (count <= 0) {
                  if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                  }
                  setCountdown(null);
                  autoCapture();
                }
              }, 1000);
            } else if (!isWellPositioned && countdown) {
              // Cancel countdown if face moves out of position
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              setCountdown(null);
            }
          } else {
            setFaceFound(false);
            setFaceDetected(false);
            if (countdown) {
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              setCountdown(null);
            }
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }
      }
    }, 300); // Check every 300ms
  };

  const stopFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setFaceDetected(false);
    setFaceFound(false);
    setCountdown(null);
  };

  const autoCapture = () => {
    stopFaceDetection();
    capturePhoto();
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(imageDataUrl);
      stopCamera();
      stopFaceDetection();
    }
  };

  const retakePhoto = async () => {
    // Clear the captured image
    setCapturedImage(null);
    setCountdown(null);
    setFaceDetected(false);
    // Stop any existing camera stream
    stopCamera();
    stopFaceDetection();
    // Wait a bit to ensure stream is fully stopped
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Restart the camera
    await startCamera();
  };

  const handleContinue = () => {
    // Save the captured image (you can store it in context, localStorage, or send to backend)
    if (capturedImage) {
      localStorage.setItem("patientPhoto", capturedImage);
      console.log("Photo captured and saved");
      
      // Check user age from localStorage
      const userAge = localStorage.getItem("userAge");
      
      // Navigate based on age
      if (userAge === "above18") {
        // Navigate to CNIC capture for users above 18
        navigate("/cnic-capture");
      } else {
        // Navigate directly to phone number for users under 18
        navigate("/phone-number");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center leading-[100px]">
            {t("cameraCapture.title")}
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-2 text-center">
            {t("cameraCapture.instruction")}
          </p>
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
              <p className="text-gray-600 text-lg">{t("cameraCapture.loading")}</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-gray-700 text-lg mb-4 text-center">
                {error === "permission"
                  ? t("cameraCapture.error")
                  : t("cameraCapture.noCamera")}
              </p>
              <button
                onClick={startCamera}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t("cameraCapture.retake")}
              </button>
            </div>
          )}

          {!isLoading && !error && !capturedImage && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl bg-gray-900"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 rounded-full w-64 h-64 transition-all duration-300 ${
                    faceDetected
                      ? "border-green-400 opacity-100 scale-110"
                      : "border-white opacity-50"
                  }`}
                ></div>
              </div>
              
              {/* Countdown overlay */}
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/70 rounded-full w-32 h-32 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white animate-pulse">
                      {countdown}
                    </span>
                  </div>
                </div>
              )}

              {/* Face detection status */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      faceDetected
                        ? "bg-green-400 animate-pulse"
                        : faceFound
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {!modelLoaded
                      ? "Loading face detection..."
                      : faceDetected
                      ? countdown
                        ? `Capturing in ${countdown}...`
                        : "Face detected - Positioning..."
                      : faceFound
                      ? "Face found - Move to center"
                      : "Looking for face..."}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaCamera className="text-2xl" />
                  <span>{t("cameraCapture.capture")}</span>
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-auto"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute top-4 right-4 bg-green-500 rounded-full p-3 shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={retakePhoto}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-600 text-white rounded-full font-semibold text-lg hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaRedo className="text-xl" />
                  <span>{t("cameraCapture.retake")}</span>
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaCheckCircle className="text-xl" />
                  <span>{t("cameraCapture.continue")}</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={detectionCanvasRef} className="hidden" />
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>
    </div>
  );
};

export default CameraCapture;

