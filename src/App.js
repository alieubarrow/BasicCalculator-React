import { evaluate } from "mathjs";
import { useState } from "react";

export default function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState(null);

  const handleClick = (digit) => {
    setDisplay((prevDisplay) => prevDisplay + digit);
  };
 
  const handleClear = () => {
    setDisplay("");
    setResult(null);
  };

  const handleEqual = () => {
    if (!display) return;
    try {
      setResult(evaluate(display));
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <>
      <div className="container">
        <input type="text" value={result !== null ? result : display} className="output" readOnly/>
        <div className="buttons-container">
          <button className="symbol" onClick={handleClear}>AC</button>
          <button className="symbol" onClick={() => handleClick("(")}>(</button>
          <button className="symbol" onClick={() => handleClick(")")}>)</button>
          <button className="sign" onClick={() => handleClick("/")}>÷</button>
          <button className="numbers" onClick={() => handleClick("7")}>7</button>
          <button className="numbers" onClick={() => handleClick("8")}>8</button>
          <button className="numbers" onClick={() => handleClick("9")}>9</button>
          <button className="sign" onClick={() => handleClick("*")}>×</button>
          <button className="numbers" onClick={() => handleClick("4")}>4</button>
          <button className="numbers" onClick={() => handleClick("5")}>5</button>
          <button className="numbers" onClick={() => handleClick("6")}>6</button>
          <button className="sign" onClick={() => handleClick("-")}>−</button>
          <button className="numbers" onClick={() => handleClick("1")}>1</button>
          <button className="numbers" onClick={() => handleClick("2")}>2</button>
          <button className="numbers" onClick={() => handleClick("3")}>3</button>
          <button className="sign" onClick={() => handleClick("+")}>+</button>
          <button className="numbers" onClick={() => handleClick("0")}>0</button>
          <button className="numbers" onClick={() => handleClick("^")}>^</button>
          <button className="numbers" onClick={() => handleClick(".")}>.</button>
          <button className="sign" onClick={handleEqual}>=</button>
        </div>
      </div>
    </>
  );
}




