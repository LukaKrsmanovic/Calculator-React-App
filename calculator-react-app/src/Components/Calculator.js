import React, { useState, useEffect } from "react";

const numberEl = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

export const Calculator = () => {
  const [result, setResult] = useState(0);
  const [value, setValue] = useState("");
  const [values, setValues] = useState([]);
  const [operations, setOperations] = useState([]);
  const [fullInput, setFullInput] = useState("");
  const [clicking, setClicking] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);

  const errorMsg = "Incorrect input, press Clear";

  const buttonClick = (e) => {
    if (isCorrect) {
      const targetVal = e.target.textContent;
      if (numberEl.includes(targetVal)) {
        setValue((prevVal) => prevVal + targetVal);
      } else {
        let temp = Number(value);
        if (isNaN(temp) || value === "") {
          temp = 0;
          setIsCorrect(false);
          setResult(errorMsg);
        }
        setValues((prevVals) => [...prevVals, temp]);
        setOperations((prevOpers) => [...prevOpers, targetVal.trim()]);
        setValue("");
      }
      setFullInput((prevInput) => prevInput + targetVal);
      setClicking(true);
    } else {
      setClicking(false);
    }
  };

  const inputClear = (res = 0) => {
    if (res === 0) {
      setResult(0);
      setValue("");
      setFullInput("");
    } else {
      setValue(`${res}`);
      setFullInput(`${res}`);
    }
    setValues([]);
    setOperations([]);
    setClicking(false);
    setIsCorrect(true);
  };

  const calcResult = () => {
    setClicking(false);

    let correct = isCorrect;

    let temp = Number(value);
    if (isNaN(temp) || value === "") {
      temp = 0;
      correct = false;
    }
    values.push(temp);

    if (correct) {
      const priorityOps = ["*", "/"];
      let res = 0;

      for (let i = 0; i < operations.length; i++) {
        if (priorityOps.includes(operations[i])) {
          if (i === 0) {
            res = operationResolve(values[i], values[i + 1], operations[i]);
            values[i] = 0;
          } else if (!priorityOps.includes(operations[i - 1])) {
            // we have to check which operation was before the first priority (+ or -)
            res = operationResolve(
              res,
              operationResolve(values[i], values[i + 1], operations[i]),
              operations[i - 1]
            );
            values[i] = 0;
          } else {
            res = operationResolve(res, values[i + 1], operations[i]);
          }
          // removing from regular array
          values[i + 1] = 0;
        }
      }

      // removing priority operations from regular array
      for (let i = 0; i < operations.length; i++) {
        if (priorityOps.includes(operations[i])) {
          operations[i] = "+";
        }
      }

      res += values[0];
      for (let i = 0; i < operations.length; i++) {
        res = operationResolve(res, values[i + 1], operations[i]);
      }
      if (isNaN(res)) {
        inputClear(0);
      } else {
        setResult(res);
        inputClear(res);
      }
    } else {
      setResult(errorMsg);
    }
  };

  const operationResolve = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
    }
  };

  return (
    <div className="calculator">
      <div className="c-result">{clicking ? fullInput : result}</div>
      <div className="ui grid button-pad">
        <div className="twelve wide column">
          <button onClick={() => inputClear(0)}>Clear</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}> / </button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>7</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>8</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>9</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}> * </button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>4</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>5</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>6</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}> - </button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>1</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>2</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>3</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}> + </button>
        </div>
        <div className="eight wide column">
          <button onClick={buttonClick}>0</button>
        </div>
        <div className="four wide column">
          <button onClick={buttonClick}>.</button>
        </div>
        <div className="four wide column">
          <button onClick={calcResult}>=</button>
        </div>
      </div>
    </div>
  );
};
