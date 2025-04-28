import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Auth/Signup.jsx";
import Login from "./components/Auth/Login.jsx";
import CreateQuiz from "./components/Quiz/CreateQuiz.jsx";
import TakeQuiz from "./components/Quiz/TakeQuiz.jsx";
import Navbar from "./components/Navbar.jsx";
import { ToastContainer } from "react-toastify";
import { auth } from "./firebase/config.js";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once Firebase finishes checking
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking auth state
  }

  return (
    <Router>
      {user && <Navbar />} {/* Render Navbar only if the user is logged in */}
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/create-quiz"
          element={user ? <CreateQuiz /> : <Navigate to="/login" />}
        />
        <Route
          path="/take-quiz"
          element={user ? <TakeQuiz /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            user ? (
              <div className="welcome-container">
                <h1>Welcome to the Quiz App</h1>
                <p>Test your knowledge or create your own quizzes!</p>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;