import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCamera, FaRedo, FaCheckCircle, FaHeartbeat } from "react-icons/fa";

const SkinCapture = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      };
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (stream) {
        stopCamera();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
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
    }
  };

  const retakePhoto = async () => {
    setCapturedImage(null);
    stopCamera();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await startCamera();
  };

  const handleContinue = () => {
    if (capturedImage) {
      localStorage.setItem("skinPhoto", capturedImage);
      navigate("/questionnaire/skin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Small Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            MediScan AI
          </h2>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center leading-[100px]">
            {t("skinCapture.title")}
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-2 text-center">
            {t("skinCapture.instruction")}
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
                {t("skinCapture.retake")}
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
              />
              {/* Affected area frame guide */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-lg w-96 h-72 opacity-50"></div>
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  {t("skinCapture.frameGuide")}
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaCamera className="text-2xl" />
                  <span>{t("skinCapture.capture")}</span>
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={capturedImage}
                  alt="Captured Skin"
                  className="w-full h-auto"
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
                  <span>{t("skinCapture.retake")}</span>
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaCheckCircle className="text-xl" />
                  <span>{t("skinCapture.continue")}</span>
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <FaHeartbeat className="w-5 h-5 text-indigo-500" />
              <p className="text-sm text-gray-500 font-medium">
                AI-Powered Medical Diagnosis at Your Fingertips
              </p>
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} MediScan AI. All rights reserved.
            </p>
          </div>
        </footer>
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

export default SkinCapture;

