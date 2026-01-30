import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaCheck,
  FaUserMd,
  FaStethoscope,
  FaHeartbeat,
  FaMicrochip,
  FaWifi,
  FaTimesCircle,
} from "react-icons/fa";

const LanguageSelection = () => {
  const { changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const languages = [
    {
      code: "en",
      nativeName: "English",
    },
    {
      code: "ur",
      nativeName: "اردو",
    },
    {
      code: "sd",
      nativeName: "سنڌي",
    },
  ];

  const getDescription = (langCode) => {
    const descriptions = {
      en: "Continue in English",
      ur: "اردو میں جاری رکھیں",
      sd: "سنڌي ۾ جاري رکو",
    };
    return descriptions[langCode] || "";
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLanguageSelect = (langCode) => {
    setSelectedLang(langCode);
    setIsAnimating(true);

    setTimeout(() => {
      changeLanguage(langCode);
      setIsAnimating(false);
      // Navigate to age verification page
      navigate("/age-verification");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Internet Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg ${
            isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isOnline ? (
            <>
              <FaWifi className="text-sm" />
              <span className="text-sm font-medium">Online</span>
            </>
          ) : (
            <>
              <FaTimesCircle className="text-sm" />
              <span className="text-sm font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Digital Doctor Logo */}
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative flex items-center justify-center">
                  <FaUserMd className="text-5xl text-white z-10" />
                </div>
              </div>
              {/* Pulse effect - Medical icons */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <FaHeartbeat className="text-2xl text-indigo-300 animate-pulse absolute -left-10 opacity-70" />
                <FaStethoscope className="text-2xl text-purple-300 animate-pulse absolute -right-10 opacity-70" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
            MediScan AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-6 text-center">
            Lightweight Edge AI Models for Disease Detection
          </p>
          <p className="text-base md:text-lg text-gray-600 mx-auto leading-relaxed text-center w-full">
            Using Images and Clinical Reports: Case Studies on Conjunctivitis,
            Leishmaniasis, Dengue, and Acute Respiratory Infections
          </p>
        </div>

        {/* Language Selection Section */}
        <div className="my-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            Select Your Language
          </h2>
          <p className="text-gray-600 text-lg mb-8 text-center">
            Choose your preferred language to continue
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {languages.map((lang, index) => (
            <div
              key={lang.code}
              className={`relative group cursor-pointer transform transition-all duration-500 ${
                selectedLang === lang.code
                  ? "scale-105 z-10"
                  : "hover:scale-110"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              {/* Glowing background effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500" />

              <div
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 transition-all duration-500 h-full flex flex-col items-center justify-center text-center ${
                  selectedLang === lang.code
                    ? "border-green-500 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 ring-4 ring-green-200"
                    : "border-transparent group-hover:border-green-300 group-hover:shadow-2xl"
                }`}
              >
                {/* Check Icon - Top Right */}
                {selectedLang === lang.code && (
                  <div className="absolute top-4 right-4 bg-green-600 rounded-full p-2 shadow-lg">
                    <FaCheck className="text-white text-xl" />
                  </div>
                )}

                {/* Language Name - Centered */}
                <div className="mb-6">
                  <p
                    className="text-4xl font-semibold text-gray-900 mb-4 text-center"
                    dir="auto"
                  >
                    {lang.nativeName}
                  </p>
                  <p className="text-gray-600 text-base text-center" dir="auto">
                    {getDescription(lang.code)}
                  </p>
                </div>

                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500 pointer-events-none" />

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </div>
          ))}
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

export default LanguageSelection;
