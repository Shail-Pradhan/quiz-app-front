import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../../api.js";

function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [title, setTitle] = useState("");
  const [creatorName, setCreatorName] = useState(""); // State for creator's name
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else {
      updatedQuestions[index].options[field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = parseInt(value);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!creatorName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    for (const question of questions) {
      if (!question.question.trim()) {
        alert("Please enter a valid question.");
        return;
      }

      if (question.options.some((option) => !option.trim())) {
        alert("Please fill in all options for each question.");
        return;
      }

      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        alert("Please select a valid correct answer for each question.");
        return;
      }
    }

    try {
      // Map frontend question structure to backend structure
      const formattedQuestions = questions.map((q) => ({
        questionText: q.question, // Map 'question' to 'questionText'
        options: q.options,
        correctAnswerIndex: q.correctAnswer, // Map 'correctAnswer' to 'correctAnswerIndex'
      }));

      const quizData = {
        title,
        questions: formattedQuestions,
        createdBy: creatorName, // Include the creator's name
      };

      await createQuiz(quizData);
      alert("Quiz created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create Quiz</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={creatorName}
        onChange={(e) => setCreatorName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((q, index) => (
        <div className="question-card" key={index}>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
          />
          {q.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleQuestionChange(index, idx, e.target.value)}
            />
          ))}
          <select
            value={q.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
}

export default CreateQuiz;