import React, { useState, useEffect } from "react";
import { apiService, UPLOAD_URL } from "../services/api";
import { useSettings } from "../context/SettingsContext";
import { FiCheckCircle, FiXCircle, FiRotateCcw, FiEye } from "react-icons/fi";
import LoadingScreen from "./LoadingScreen";
import "../../src/assets/css/local-fonts.css";

const Quiz = () => {
  const {
    logo,
    backgroundColor,
    textColor,
    fontFamily,
    isLoading: settingsLoading,
    error: settingsError,
    logoWidth,
    logoHeight,
    backgroundImage,
  } = useSettings();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFinalOptions, setShowFinalOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);

  useEffect(() => {
    if (!settingsLoading) {
      loadQuiz();
      fetchBackgroundImage();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsLoading]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);

      const data = await apiService.getActiveQuiz();
      if (data) {
        setQuizData(data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error in loadQuiz:", error);
      setError(error.message || "Failed to load quiz. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchBackgroundImage = async () => {
    try {
      // Only fetch if backgroundImage exists in settings
      if (backgroundImage) {
        // Normalize path: replace backslashes with forward slashes
        const normalizedPath = backgroundImage
          .replace(/\\/g, "/")
          .replace(/\\/g, "/");
        const isFullUrl =
          normalizedPath.startsWith("http://") ||
          normalizedPath.startsWith("https://");
        setBgImageUrl(
          isFullUrl ? normalizedPath : `${UPLOAD_URL}${normalizedPath}`
        );
      } else {
        // fallback: try to fetch from API (if needed)
        const data = await apiService.getBackground();
        if (data && data.backgroundImage) {
          // Normalize path: replace backslashes with forward slashes
          const normalizedPath = data.backgroundImage
            .replace(/\\/g, "/")
            .replace(/\\/g, "/");
          const isFullUrl =
            normalizedPath.startsWith("http://") ||
            normalizedPath.startsWith("https://");
          setBgImageUrl(
            isFullUrl ? normalizedPath : `${UPLOAD_URL}${normalizedPath}`
          );
        } else {
          setBgImageUrl(null);
        }
      }
    } catch (e) {
      setBgImageUrl(null);
    }
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) return;

    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() === quizData.answer.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setShowSuccessModal(true);
    } else {
      // Move to next question or show final options
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setUserAnswer("");
          setIsCorrect(null);
        }, 1500);
      } else {
        setShowFinalOptions(true);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setShowFinalOptions(false);
  };

  const handleShowAnswer = () => {
    setShowFinalOptions(false);
    setUserAnswer(quizData.answer);
    setIsCorrect(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAnswerSubmit();
    }
  };

  // Show loading screen while settings are loading
  if (settingsLoading) {
    return <LoadingScreen />;
  }

  // Show error if settings failed to load
  if (settingsError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Failed to load settings: {settingsError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: textColor }}
          ></div>
          <p style={{ color: textColor, fontFamily }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center">
          <p style={{ color: textColor, fontFamily }}>
            No active quiz available.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  // Style for background (image or color)
  const backgroundStyle = bgImageUrl
    ? {
        backgroundImage: `url('${bgImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }
    : { backgroundColor, minHeight: "100vh" };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-9"
      style={backgroundStyle}
    >
      <div className="max-w-2xl w-full">
        {/* Logo */}
        {logo && (
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="mx-auto object-contain"
              style={{
                width: logoWidth ? `${logoWidth}px` : undefined,
                height: logoHeight ? `${logoHeight}px` : undefined,
              }}
            />
          </div>
        )}

        {/* Quiz Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Quiz Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: textColor, fontFamily }}
            >
              {quizData.title}
            </h1>
            <p style={{ color: textColor, fontFamily }}>
              {quizData.description}
            </p>
          </div>

          {/* Question Counter */}
          <div className="text-center mb-6">
            <span
              className="inline-block bg-blue-100 x-4 py-2 px-4 rounded-full text-sm font-medium"
              style={{ color: textColor, fontFamily }}
            >
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
          </div>

          {/* Current Question */}
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: textColor, fontFamily }}
            >
              {currentQuestion.question}
            </h2>

            {/* Answer Input */}
            <div className="mb-6">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your answer..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-lg"
                style={{ fontFamily }}
                disabled={isCorrect !== null}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAnswerSubmit}
              disabled={!userAnswer.trim() || isCorrect !== null}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily }}
            >
              Confirm Answer
            </button>
          </div>

          {/* Answer Feedback */}
          {isCorrect !== null && (
            <div
              className={`text-center p-4 rounded-lg mb-4 ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isCorrect ? (
                  <>
                    <FiCheckCircle className="text-2xl" />
                    <span className="font-semibold">Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <FiXCircle className="text-2xl" />
                    <span className="font-semibold">Incorrect Answer</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Final Options */}
          {showFinalOptions && (
            <div className="text-center">
              <p className="text-gray-600 mb-6" style={{ fontFamily }}>
                You've answered all questions. Would you like to try again or
                see the answer?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  style={{ fontFamily }}
                >
                  <FiRotateCcw />
                  Retry
                </button>
                <button
                  onClick={handleShowAnswer}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  style={{ fontFamily }}
                >
                  <FiEye />
                  Show Answer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-green-500 mb-4">
              <FiCheckCircle className="text-6xl mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: textColor, fontFamily }}
            >
              Congratulations!
            </h3>
            <p className="text-gray-600 mb-6" style={{ fontFamily }}>
              You found the correct answer!
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                handleRetry();
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              style={{ fontFamily }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
