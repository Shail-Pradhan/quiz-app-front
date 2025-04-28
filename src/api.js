import axios from "axios";

const API = axios.create({ baseURL: "https://quiz-app-server-kjh8.onrender.com/api" });

// Fetch all quizzes
export const fetchQuizzes = () => API.get("/quizzes");

// Fetch a quiz by ID
export const fetchQuizById = (id) => API.get(`/quizzes/${id}`);

// Create a new quiz
export const createQuiz = (quizData) => API.post("/quizzes", quizData);
