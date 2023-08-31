import "./App.css";
import QuizData from "./Components/QuizData";
import { questions } from './Utils/questions'

function App() {
  return (
    <>
      <QuizData questions={questions} />
    </>
  );
}

export default App;
