import React, { useState, useEffect } from "react";
import { fetchQuizzes, fetchQuizById } from "../../api.js";

function TakeQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const { data } = await fetchQuizzes();
        setQuizzes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    getQuizzes();
  }, []);

  const handleQuizSelect = async (quizId) => {
    setLoading(true);
    try {
      const { data } = await fetchQuizById(quizId);
      setSelectedQuiz(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    let score = 0;

    // Compare user's answers with the correct answers
    selectedQuiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        score++;
      }
    });

    // Display the score
    alert(`You scored ${score} out of ${selectedQuiz.questions.length}`);
    
    // Reset the quiz state
    setSelectedQuiz(null);
    setAnswers({});
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedQuiz) {
    return (
      <div className="quiz-container">
        <h1>{selectedQuiz.title}</h1>
        {selectedQuiz.questions.map((question, index) => (
          <div key={index} className="question-card">
            <h3>{question.questionText}</h3>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  id={`question-${index}-option-${optionIndex}`}
                  checked={answers[index] === optionIndex}
                  onChange={() => handleAnswerChange(index, optionIndex)}
                />
                <label htmlFor={`question-${index}-option-${optionIndex}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleSubmit}>Submit Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>Available Quizzes</h1>
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="quiz-card">
          <h2>{quiz.title}</h2>
          <p>Created by: {quiz.createdBy}</p>
          <button onClick={() => handleQuizSelect(quiz._id)}>Take Quiz</button>
        </div>
      ))}
    </div>
  );
}

export default TakeQuiz;