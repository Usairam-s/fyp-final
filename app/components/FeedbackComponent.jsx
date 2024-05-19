// FeedbackComponent.js

import React, { useState, useEffect } from "react";
import Testimonial from "./Testomonial";

const FeedbackComponent = () => {
  const [feedback, setFeedback] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getallfeedback"
        );
        const data = await response.json();
        setFeedback(data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) =>
        prevIndex === feedback.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [currentFeedbackIndex, feedback.length]);

  return (
    <div className="px-4 pt-6 pb-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white border rounded-lg drop-shadow-2xl   ">
      <h2 className="text-3xl underline font-semibold mb-4">User Feedback</h2>
      {feedback.length > 0 && (
        <Testimonial
          username={feedback[currentFeedbackIndex].username}
          email={feedback[currentFeedbackIndex].email}
          feedback={feedback[currentFeedbackIndex].feedback}
        />
      )}
    </div>
  );
};

export default FeedbackComponent;
