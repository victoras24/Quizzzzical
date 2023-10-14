import React, { useEffect, useState } from "react";

export default function Questions() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answerSelectionDisabled, setAnswerSelectionDisabled] = useState(false);

  useEffect(() => {
    // Simulate loading by setting a timeout
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      fetchData(); // Load questions after the loading timeout
    }, 3000); // Adjust the timeout duration as needed (3-5 seconds)

    // Clear the timeout if the component unmounts
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  const fetchData = () => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then(response => response.json())
      .then(data => {
        const shuffledQuestions = data.results.map((question) => {
          const answers = [question.correct_answer, ...question.incorrect_answers];
          for (let i = answers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
          }
          const correctAnswerIndex = answers.findIndex((answer) => answer === question.correct_answer);
          return {
            ...question,
            answers,
            correctAnswerIndex,
            userAnswer: null,
          };
        });
        setQuestions(shuffledQuestions);
        setSelectedAnswers(Array(shuffledQuestions.length).fill(null));
        setShowResults(false);
        setScore(0);
        setAnswerSelectionDisabled(false); // Enable answer selection
      });
  }

  const decodeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent;
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (!answerSelectionDisabled) {
      const updatedSelectedAnswers = [...selectedAnswers];
      updatedSelectedAnswers[questionIndex] = answerIndex;
      setSelectedAnswers(updatedSelectedAnswers);
    }
  }

  const checkAnswers = () => {
    setShowResults(true);
    setAnswerSelectionDisabled(true); // Disable answer selection
    // Calculate the score based on correct answers
    const currentScore = selectedAnswers.reduce((score, answerIndex, index) => {
      if (questions[index].correctAnswerIndex === answerIndex) {
        return score + 1;
      }
      return score;
    }, 0);
    setScore(currentScore);

    setTimeout(() => {
      setShowResults(true); // Set showResults to true after a delay
      setAnswerSelectionDisabled(true); // Disable answer selection
    }, 1000);
  }

  return (
    <div className="game-wrap">
      {loading ? (
      <div className="loader-container">
        <p className="loader-description">Loading...</p>
        <div class="progress-6"></div>
      </div>
      ) : (
        <ul>
          {questions.map((question, questionIndex) => (
            <li key={questionIndex} className={`question ${showResults ? "fade-in" : ""}`}>
              <p className="questions">{decodeHTML(question.question)}</p>
              <ul className="answer-buttons-wrap">
                {question.answers.map((answer, answerIndex) => (
                  <li key={answerIndex}>
                    <div className="button-wrap">
                      <button
                        onClick={() => handleAnswerSelect(questionIndex, answerIndex)}
                        className={
                          showResults && question.correctAnswerIndex === answerIndex
                            ? "correct"
                            : showResults && selectedAnswers[questionIndex] === answerIndex
                            ? "incorrect"
                            : selectedAnswers[questionIndex] === answerIndex
                            ? "selected"
                            : ""
                        }
                        disabled={answerSelectionDisabled}
                      >
                        {decodeHTML(answer)}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {!loading && showResults && (
        <div className="score-wrapper">
          <p>{`You scored ${score}/${questions.length} correct answers`}</p>
          <button
            className="check-answer-button"
           onClick={fetchData}>Play Again</button>
        </div>
      )}
      <div className="check-answer-wrapper">
        {!loading && !showResults && (
          <button 
            className="check-answer-button"
            onClick={checkAnswers} disabled={answerSelectionDisabled}
          >
            Check answers
          </button>
        )}
      </div>
    </div>
  );
}
