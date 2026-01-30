import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCheck, FaHeartbeat, FaEye, FaLungs, FaHandPaper, FaVirus } from "react-icons/fa";

const DiseaseSelection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedDisease, setSelectedDisease] = useState(null);

  const diseases = [
    {
      id: "eyes",
      label: t("diseaseSelection.eyes"),
      icon: FaEye,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "breathing",
      label: t("diseaseSelection.breathing"),
      icon: FaLungs,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "skin",
      label: t("diseaseSelection.skin"),
      icon: FaHandPaper,
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "dengue",
      label: t("diseaseSelection.dengue"),
      icon: FaVirus,
      color: "from-red-500 to-pink-500",
    },
  ];

  const handleDiseaseSelect = (diseaseId) => {
    setSelectedDisease(diseaseId);
    setTimeout(() => {
      // Navigate to disease-specific capture page
      navigate(`/disease-capture/${diseaseId}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Small Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            MediScan AI
          </h2>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center leading-[100px]">
            {t("diseaseSelection.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-2 text-center">
            {t("diseaseSelection.instruction")}
          </p>
        </div>

        {/* Disease Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {diseases.map((disease, index) => {
            const IconComponent = disease.icon;
            return (
              <div
                key={disease.id}
                className={`relative group cursor-pointer transform transition-all duration-500 ${
                  selectedDisease === disease.id
                    ? "scale-105 z-10"
                    : "hover:scale-110"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleDiseaseSelect(disease.id)}
              >
                {/* Glowing background effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${disease.color} rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500`} />

                <div
                  className={`relative bg-white rounded-2xl shadow-xl p-10 border-2 transition-all duration-500 h-full flex flex-col items-center justify-center text-center ${
                    selectedDisease === disease.id
                      ? `border-indigo-500 shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 ring-4 ring-indigo-200`
                      : "border-transparent group-hover:border-indigo-300 group-hover:shadow-2xl"
                  }`}
                >
                  {/* Check Icon */}
                  {selectedDisease === disease.id && (
                    <div className="absolute top-4 right-4 bg-indigo-600 rounded-full p-2 shadow-lg animate-bounce">
                      <FaCheck className="text-white text-xl" />
                    </div>
                  )}

                  {/* Disease Icon and Label */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${disease.color} mb-4 shadow-lg`}>
                      <IconComponent className="text-white text-4xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-center" dir="auto">
                      {disease.label}
                    </p>
                  </div>

                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none`} />

                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </div>
            );
          })}
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

export default DiseaseSelection;

