import { evaluate } from "mathjs";
import { useState } from "react";

export default function App() {

  const [display, setDisplay] = useState("");
  const [result, setResult] = useState(null);

  const handlelClick = (digit) => {
    setDisplay(display + digit);
  }
 
  const handleClear = () => {
    setDisplay('');
    setResult(null);
  }

  const handleEqual = () => {
    try {
      const evalResult = evaluate(display); 
      setResult(evalResult);
    } catch (error) {
      setResult('Error');
    }
  }

  return (
    <>
    <div class="container">
    <input type="text" value ={result !== null ? result : display} class="output"/>
    <table>
      <tr>
        <td><button class="symbol" onClick={handleClear}>AC</button></td>
        <td><button class="symbol" onClick={() => {handlelClick("(")}}>(</button></td>
        <td><button class="symbol" onClick={() => {handlelClick(")")}}>)</button></td>
        <td><button class="sign" onClick={() => {handlelClick("/")}}>÷</button></td>
      </tr>
      <tr>
        <td><button class="numbers" onClick={() => {handlelClick("7")}}>7</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("8")}}>8</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("9")}}>9</button></td>
        <td><button class="sign" onClick={() => {handlelClick(" * ")}}>X</button></td>
      </tr>
      <tr>
        <td><button class="numbers" onClick={() => {handlelClick("4")}}>4</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("5")}}>5</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("6")}}>6</button></td>
        <td><button class="sign" onClick={() => {handlelClick(" - ")}}>-</button></td>
      </tr>
      <tr>
        <td><button class="numbers" onClick={() => {handlelClick("1")}}>1</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("2")}}>2</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("3")}}>3</button></td>
        <td><button class="sign" onClick={() => {handlelClick(" + ")}}>+</button></td>
      </tr>
      <tr>
        <td><button class="numbers" onClick={() => {handlelClick("0")}}>0</button></td>
        <td><button class="numbers" onClick={() => {handlelClick("^")}}>^</button></td>
        <td><button class="numbers" onClick={() => {handlelClick(".")}}>.</button></td>
        <td><button class="sign" onClick={handleEqual}>=</button></td>
      </tr>
    </table>
  </div>
    </>
  );
}




