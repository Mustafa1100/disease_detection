import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaPhone, FaCheckCircle, FaHeartbeat } from "react-icons/fa";

const PhoneNumberInput = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Format: +92 - 3XXXXXXXXX
    if (digits.length === 0) {
      return "";
    }
    
    // If starts with 92, keep it
    if (digits.startsWith("92")) {
      const rest = digits.slice(2);
      if (rest.length === 0) {
        return "+92";
      } else if (rest.length <= 1) {
        return `+92 - ${rest}`;
      } else {
        return `+92 - ${rest.slice(0, 1)}${rest.slice(1)}`;
      }
    } else if (digits.startsWith("0")) {
      // If starts with 0, convert to +92 format
      const rest = digits.slice(1);
      if (rest.length === 0) {
        return "+92";
      } else if (rest.length <= 1) {
        return `+92 - ${rest}`;
      } else {
        return `+92 - ${rest.slice(0, 1)}${rest.slice(1)}`;
      }
    } else {
      // Assume it's a local number starting with 3
      if (digits.length <= 1) {
        return `+92 - ${digits}`;
      } else {
        return `+92 - ${digits.slice(0, 1)}${digits.slice(1)}`;
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    setError("");
  };

  const validatePhoneNumber = (phone) => {
    // Remove formatting to check digits
    const digits = phone.replace(/\D/g, "");
    // Valid formats:
    // 923001234567 (12 digits: 92 + 3 + 9 digits)
    // 03001234567 (11 digits: 0 + 3 + 9 digits)
    // 3001234567 (10 digits: 3 + 9 digits)
    // All should start with 3 after country code/0
    if (digits.length === 12 && digits.startsWith("92") && digits[2] === "3") {
      return digits.length === 12;
    }
    if (digits.length === 11 && digits.startsWith("03") && digits[1] === "3") {
      return digits.length === 11;
    }
    if (digits.length === 10 && digits.startsWith("3")) {
      return digits.length === 10;
    }
    return false;
  };

  const handleContinue = () => {
    if (!phoneNumber.trim()) {
      setError(t("phoneNumber.error"));
      return;
    }

    const isValid = validatePhoneNumber(phoneNumber);
    if (!isValid) {
      setError(t("phoneNumber.error"));
      return;
    }

    // Save phone number in standard format: +92 - 3XXXXXXXXX
    const digits = phoneNumber.replace(/\D/g, "");
    let formattedPhone = "";
    
    if (digits.length === 12 && digits.startsWith("92")) {
      // 923001234567 -> +92 - 3001234567
      formattedPhone = `+92 - ${digits.slice(2)}`;
    } else if (digits.length === 11 && digits.startsWith("0")) {
      // 03001234567 -> +92 - 3001234567
      formattedPhone = `+92 - ${digits.slice(1)}`;
    } else if (digits.length === 10 && digits.startsWith("3")) {
      // 3001234567 -> +92 - 3001234567
      formattedPhone = `+92 - ${digits}`;
    } else {
      formattedPhone = phoneNumber;
    }
    
    // Ensure final format is correct (should be 10 digits after +92 -)
    const finalDigits = formattedPhone.replace(/\D/g, "");
    if (finalDigits.length === 12 && finalDigits.startsWith("92")) {
      formattedPhone = `+92 - ${finalDigits.slice(2)}`;
    }

    localStorage.setItem("phoneNumber", formattedPhone);
    console.log("Phone number saved:", formattedPhone);
    
    // Navigate to disease selection
    navigate("/disease-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Small Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            MediScan AI
          </h2>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative flex items-center justify-center">
                <FaPhone className="text-5xl text-white z-10" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center leading-[100px]">
            {t("phoneNumber.title")}
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-2 text-center">
            {t("phoneNumber.instruction")}
          </p>
          <p className="text-sm text-gray-500 text-center">
            {t("phoneNumber.format")}
          </p>
        </div>

        {/* Phone Number Input Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                {t("phoneNumber.label")}
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={t("phoneNumber.placeholder")}
                className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                  error
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                }`}
                dir="ltr"
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}
            </div>

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaCheckCircle className="text-xl" />
              <span>{t("phoneNumber.continue")}</span>
            </button>
          </div>
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

export default PhoneNumberInput;

