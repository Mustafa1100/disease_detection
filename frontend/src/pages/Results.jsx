import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCheckCircle, FaHeartbeat, FaDownload, FaHome } from "react-icons/fa";

const Results = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Get questionnaire data from localStorage
    const questionnaireData = localStorage.getItem("questionnaireAnswers");
    if (questionnaireData) {
      const data = JSON.parse(questionnaireData);
      // Calculate results based on answers
      const calculatedResults = calculateResults(data);
      setResults(calculatedResults);
    }
  }, []);

  const calculateResults = (data) => {
    const { diseaseId, answers } = data;
    const answerValues = Object.values(answers);
    const yesCount = answerValues.filter((a) => a === "yes").length;
    const sometimesCount = answerValues.filter((a) => a === "sometimes").length;
    const totalQuestions = answerValues.length;

    // Calculate risk percentage
    const riskScore = ((yesCount * 1 + sometimesCount * 0.5) / totalQuestions) * 100;

    // Determine severity
    let severity = "mild";
    let severityLabel = t("questionnaire.mild");
    if (riskScore >= 70) {
      severity = "severe";
      severityLabel = t("questionnaire.severe");
    } else if (riskScore >= 40) {
      severity = "moderate";
      severityLabel = t("questionnaire.moderate");
    }

    // Generate recommendations based on disease and severity
    const recommendations = generateRecommendations(diseaseId, severity);

    return {
      diseaseId,
      riskScore: Math.round(riskScore),
      severity,
      severityLabel,
      yesCount,
      sometimesCount,
      totalQuestions,
      recommendations,
    };
  };

  const generateRecommendations = (diseaseId, severity) => {
    const recommendations = {
      eyes: {
        mild: [
          "Use artificial tears to keep your eyes moist",
          "Avoid rubbing your eyes",
          "Take regular breaks from screen time",
          "Consult an ophthalmologist if symptoms persist",
        ],
        moderate: [
          "Schedule an appointment with an ophthalmologist immediately",
          "Avoid wearing contact lenses until consultation",
          "Apply cold compresses to reduce inflammation",
          "Keep your eyes clean and avoid touching them",
        ],
        severe: [
          "Seek immediate medical attention",
          "Do not delay visiting an eye specialist",
          "Avoid self-medication",
          "Follow up with regular check-ups",
        ],
      },
      breathing: {
        mild: [
          "Practice deep breathing exercises",
          "Avoid exposure to allergens and pollutants",
          "Stay hydrated and maintain good air quality",
          "Monitor your symptoms and consult if they worsen",
        ],
        moderate: [
          "Consult a pulmonologist as soon as possible",
          "Avoid smoking and secondhand smoke",
          "Use a humidifier in your living space",
          "Keep your rescue inhaler handy if prescribed",
        ],
        severe: [
          "Seek emergency medical care immediately",
          "Do not ignore breathing difficulties",
          "Avoid strenuous activities",
          "Follow up with a respiratory specialist",
        ],
      },
      skin: {
        mild: [
          "Keep your skin clean and moisturized",
          "Use gentle, fragrance-free skincare products",
          "Avoid scratching or picking at affected areas",
          "Protect your skin from excessive sun exposure",
        ],
        moderate: [
          "Consult a dermatologist for proper diagnosis",
          "Avoid using harsh chemicals on your skin",
          "Follow a gentle skincare routine",
          "Consider patch testing for allergies",
        ],
        severe: [
          "Seek immediate dermatological consultation",
          "Do not self-treat with over-the-counter medications",
          "Keep affected areas clean and covered",
          "Follow medical advice strictly",
        ],
      },
      dengue: {
        mild: [
          "Rest and stay hydrated",
          "Monitor your temperature regularly",
          "Take paracetamol for fever (avoid aspirin)",
          "Watch for warning signs and seek medical help if needed",
        ],
        moderate: [
          "Consult a doctor immediately",
          "Maintain adequate fluid intake",
          "Monitor for signs of bleeding",
          "Avoid self-medication",
        ],
        severe: [
          "Seek emergency medical attention immediately",
          "Dengue can be life-threatening if not treated properly",
          "Do not delay medical consultation",
          "Follow hospital admission if recommended",
        ],
      },
    };

    return recommendations[diseaseId]?.[severity] || recommendations[diseaseId]?.mild || [];
  };

  const handleBackToHome = () => {
    // Clear all stored data
    localStorage.removeItem("questionnaireAnswers");
    navigate("/");
  };

  const handleDownloadReport = () => {
    // Create a simple text report
    const report = `
MediScan AI - Diagnosis Report
==============================

Disease Type: ${results.diseaseId}
Risk Score: ${results.riskScore}%
Severity: ${results.severityLabel}

Summary:
- Total Questions: ${results.totalQuestions}
- Positive Answers: ${results.yesCount}
- Sometimes Answers: ${results.sometimesCount}

Recommendations:
${results.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediscan-report-${results.diseaseId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const getSeverityColor = () => {
    if (results.severity === "severe") return "from-red-500 to-pink-500";
    if (results.severity === "moderate") return "from-orange-500 to-amber-500";
    return "from-green-500 to-emerald-500";
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
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className={`relative bg-gradient-to-br ${getSeverityColor()} rounded-3xl p-6 shadow-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-br opacity-50 rounded-3xl blur-xl"></div>
              <div className="relative flex items-center justify-center">
                <FaCheckCircle className="text-5xl text-white z-10" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t("results.title")}
          </h1>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-6">
          {/* Risk Score */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getSeverityColor()} mb-4 shadow-lg`}>
              <span className="text-4xl font-bold text-white">{results.riskScore}%</span>
            </div>
            <p className="text-2xl font-semibold text-gray-700">
              {t("results.severity")}: <span className={`font-bold bg-gradient-to-r ${getSeverityColor()} bg-clip-text text-transparent`}>{results.severityLabel}</span>
            </p>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("results.summary")}</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t("questionnaire.question")}s:</span>
                <span className="font-semibold text-gray-900">{results.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t("questionnaire.yes")} {t("questionnaire.question")}s:</span>
                <span className="font-semibold text-green-600">{results.yesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t("questionnaire.sometimes")} {t("questionnaire.question")}s:</span>
                <span className="font-semibold text-yellow-600">{results.sometimesCount}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("results.recommendations")}</h2>
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-indigo-50 rounded-xl p-4 border-l-4 border-indigo-500"
                >
                  <FaCheckCircle className="text-indigo-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700" dir="auto">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <FaDownload />
            <span>{t("results.downloadReport")}</span>
          </button>
          <button
            onClick={handleBackToHome}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <FaHome />
            <span>{t("results.backToHome")}</span>
          </button>
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

export default Results;


