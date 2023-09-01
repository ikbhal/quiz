
import React, { useState } from 'react';
import { useEffect } from 'react';
import { QUIZ_API } from '../Utils/Constant';
import './quiz.css'

const Quiz = () => {

  const [questions, setQuestions] = useState([])
      const fetchQuestions = async() =>{
            const fetchData = await fetch(QUIZ_API)
            const data = await fetchData.json()
            console.log(data)
            setQuestions(data)
      } 
      useEffect(()=>{
        fetchQuestions()
      },[])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (optionIndex) => {
    setSelectedOptionIndex(optionIndex);

    if (optionIndex === currentQuestion.correctOption) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOptionIndex(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className='card'>
      {currentQuestion && (
        <div>
          <h3>{currentQuestion.question}</h3>
          <ol type='a'>
            {currentQuestion.options.map((option, optionIndex) => (
              <li
                key={optionIndex}
                onClick={() => handleOptionClick(optionIndex)}
                style={{
                  backgroundColor:
                    selectedOptionIndex === optionIndex
                      ? optionIndex === currentQuestion.correctOption
                        ? 'green' 
                        : 'red' 
                      : 'white',
                }}
              >
                {option}
              </li>
            ))}
          </ol>
          {selectedOptionIndex !== null && (
            <button onClick={nextQuestion}>
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      )}
      {currentQuestionIndex === questions.length - 1 && (
        <p>Your total score: {score}</p>
      )}
    </div>
  );
};

export default Quiz;

