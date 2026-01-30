import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCheckCircle, FaHeartbeat } from "react-icons/fa";
import { diseaseQuestions } from "../data/questions";

const Questionnaire = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (diseaseId && diseaseQuestions[diseaseId]) {
      const lang = language === "sd" ? "sd" : language === "ur" ? "ur" : "en";
      setQuestions(diseaseQuestions[diseaseId][lang] || diseaseQuestions[diseaseId].en);
    }
  }, [diseaseId, language]);

  const handleAnswer = (answer) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion]: answer,
    };
    
    setAnswers(updatedAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // If it's the last question, submit automatically with updated answers
        const questionnaireData = {
          diseaseId,
          answers: updatedAnswers,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem("questionnaireAnswers", JSON.stringify(questionnaireData));
        navigate("/results");
      }
    }, 500);
  };

  const getAnswerOptions = () => {
    return [
      { value: "yes", label: t("questionnaire.yes") },
      { value: "no", label: t("questionnaire.no") },
      { value: "sometimes", label: t("questionnaire.sometimes") },
    ];
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answerOptions = getAnswerOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Small Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            MediScan AI
          </h2>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t("questionnaire.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("questionnaire.question")} {currentQuestion + 1} {t("questionnaire.of")} {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-6">
          <div className="space-y-8">
            {/* Question */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center" dir="auto">
                {questions[currentQuestion]}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {answerOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                    answers[currentQuestion] === option.value
                      ? "bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auto-advance indicator */}
        {answers[currentQuestion] && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 animate-pulse">
              {currentQuestion === questions.length - 1
                ? "Submitting answers..."
                : "Moving to next question..."}
            </p>
          </div>
        )}

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

export default Questionnaire;

