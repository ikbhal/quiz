import React, { useState } from 'react'


const QuizData = ({questions}) => {
  // const [currentIndex, setCurrentIndex] = useState(0)
  console.log(questions)
 return (

    <div>
      
        {
          questions.map((question,index)=>(
            <div>
            <p key={index}>{question.question}</p>
            <ul>
               {question.options.map((option)=>(
                <li>{option}</li>
               ))}
              
             
            </ul>

            </div>
          ))
        }
      
    </div>
 )
 
}

export default QuizData