import { evaluate } from "mathjs";
import { useEffect, useMemo, useState } from "react";

const buttonRows = [
  [
    { label: "AC", action: "clear", type: "utility" },
    { label: "DEL", action: "delete", type: "utility" },
    { label: "(", value: "(", type: "utility" },
    { label: ")", value: ")", type: "utility" },
    { label: "/", value: "/", type: "operator" },
  ],
  [
    { label: "sin", value: "sin(", type: "function" },
    { label: "cos", value: "cos(", type: "function" },
    { label: "tan", value: "tan(", type: "function" },
    { label: "sqrt", value: "sqrt(", type: "function" },
    { label: "^", value: "^", type: "operator" },
  ],
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "%", action: "percent", type: "operator" },
    { label: "*", value: "*", type: "operator" },
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "+/-", action: "toggleSign", type: "operator" },
    { label: "-", value: "-", type: "operator" },
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "pi", value: "pi", type: "function" },
    { label: "+", value: "+", type: "operator" },
  ],
  [
    { label: "0", value: "0", wide: true },
    { label: ".", value: "." },
    { label: "ans", action: "answer", type: "function" },
    { label: "=", action: "equals", type: "equals" },
  ],
];

const memoryButtons = [
  { label: "MC", action: "memoryClear" },
  { label: "MR", action: "memoryRecall" },
  { label: "M+", action: "memoryAdd" },
  { label: "M-", action: "memorySubtract" },
];

function formatValue(value) {
  if (typeof value !== "number") return value;
  if (!Number.isFinite(value)) return "Error";
  return Number.isInteger(value) ? String(value) : Number(value.toPrecision(12)).toString();
}

export default function App() {
  const [expression, setExpression] = useState("");
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [answer, setAnswer] = useState("");
  const [angleMode, setAngleMode] = useState("deg");

  const scope = useMemo(
    () => ({
      ans: answer || 0,
      sin: (value) => Math.sin(angleMode === "deg" ? (value * Math.PI) / 180 : value),
      cos: (value) => Math.cos(angleMode === "deg" ? (value * Math.PI) / 180 : value),
      tan: (value) => Math.tan(angleMode === "deg" ? (value * Math.PI) / 180 : value),
    }),
    [angleMode, answer]
  );

  useEffect(() => {
    if (!expression) {
      setPreview("");
      return;
    }

    try {
      const nextPreview = formatValue(evaluate(expression, scope));
      setPreview(nextPreview === "Error" ? "" : nextPreview);
    } catch {
      setPreview("");
    }
  }, [expression, scope]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/^[0-9.+\-*/()^]$/.test(key)) {
        event.preventDefault();
        appendValue(key);
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
      } else if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
      } else if (key === "Escape") {
        event.preventDefault();
        clearAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const appendValue = (value) => {
    setExpression((current) => current + value);
  };

  const clearAll = () => {
    setExpression("");
    setPreview("");
  };

  const deleteLast = () => {
    setExpression((current) => current.slice(0, -1));
  };

  const calculate = () => {
    if (!expression) return;

    try {
      const result = formatValue(evaluate(expression, scope));
      if (result === "Error") throw new Error("Invalid result");

      setAnswer(result);
      setPreview(result);
      setHistory((current) => [{ expression, result }, ...current].slice(0, 8));
      setExpression(result);
    } catch {
      setPreview("Error");
    }
  };

  const applyPercent = () => {
    if (!expression) return;
    setExpression((current) => `${current}/100`);
  };

  const toggleSign = () => {
    if (!expression) {
      setExpression("-");
      return;
    }

    setExpression((current) => {
      const match = current.match(/(-?\d*\.?\d+)$/);
      if (!match) return current.startsWith("-") ? current.slice(1) : `-${current}`;

      const value = match[0];
      const start = current.slice(0, match.index);
      const toggled = value.startsWith("-") ? value.slice(1) : `-${value}`;
      return `${start}${toggled}`;
    });
  };

  const getCurrentNumber = () => {
    if (!preview || preview === "Error") return 0;
    return Number(preview);
  };

  const handleMemory = (action) => {
    const currentNumber = getCurrentNumber();

    if (action === "memoryClear") setMemory(0);
    if (action === "memoryRecall") setExpression((current) => current + formatValue(memory));
    if (action === "memoryAdd") setMemory((current) => current + currentNumber);
    if (action === "memorySubtract") setMemory((current) => current - currentNumber);
  };

  const handleAction = (button) => {
    if (button.value) appendValue(button.value);
    if (button.action === "clear") clearAll();
    if (button.action === "delete") deleteLast();
    if (button.action === "equals") calculate();
    if (button.action === "percent") applyPercent();
    if (button.action === "toggleSign") toggleSign();
    if (button.action === "answer") appendValue("ans");
    if (button.action?.startsWith("memory")) handleMemory(button.action);
  };

  return (
    <main className="page-shell">
      <section className="calculator" aria-label="Calculator">
        <header className="calculator-header">
          <div>
            <p className="eyebrow">Scientific calculator</p>
            <h1>Calculator</h1>
          </div>
          <button
            className="mode-toggle"
            type="button"
            onClick={() => setAngleMode((mode) => (mode === "deg" ? "rad" : "deg"))}
          >
            {angleMode.toUpperCase()}
          </button>
        </header>

        <div className="display" aria-live="polite">
          <div className="expression">{expression || "0"}</div>
          <div className={preview === "Error" ? "result error" : "result"}>
            {preview || "Ready"}
          </div>
        </div>

        <div className="memory-row">
          {memoryButtons.map((button) => (
            <button key={button.label} type="button" onClick={() => handleAction(button)}>
              {button.label}
            </button>
          ))}
          <span>Memory: {formatValue(memory)}</span>
        </div>

        <div className="buttons-grid">
          {buttonRows.flat().map((button) => (
            <button
              className={`${button.type || "number"} ${button.wide ? "wide" : ""}`}
              key={button.label}
              type="button"
              onClick={() => handleAction(button)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </section>

      <aside className="history-panel" aria-label="Calculation history">
        <div className="history-heading">
          <h2>History</h2>
          <button type="button" onClick={() => setHistory([])}>
            Clear
          </button>
        </div>
        {history.length === 0 ? (
          <p className="empty-state">Your recent calculations will appear here.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={`${item.expression}-${index}`}>
                <button type="button" onClick={() => setExpression(item.result)}>
                  <span>{item.expression}</span>
                  <strong>{item.result}</strong>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  );
}
