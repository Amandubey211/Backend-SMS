/* CalculatorDrawer.jsx */
import React, { useState, useCallback } from "react";
import { Button, Input, message, Drawer, Switch } from "antd";
import { CalculatorOutlined, CloseOutlined } from "@ant-design/icons";

const CalculatorDrawer = ({ open, onClose, highContrast }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(false);
  const OPERATORS = ["+", "-", "*", "/", "%"];
  const isOperator = (ch) => OPERATORS.includes(ch);
  const lastChar = (str) => str.trim().slice(-1);

  /* Key layouts */
  const basicButtons = [
    ["C", "⌫", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "=", ""],
  ];

  const scientificButtons = [
    ["sin", "cos", "tan", "√"],
    ["π", "e", "^", "log"],
    ["(", ")", "!", "ln"],
  ];

  /* Button styles based on high contrast */
  const getButtonStyle = (type) => {
    const baseStyle = "flex-1 h-12 rounded-md text-xl font-medium border";

    if (highContrast) {
      switch (type) {
        case "number":
          return `${baseStyle} bg-[#505055] text-white border-[#555] hover:bg-[#606065]`;
        case "operator":
          return `${baseStyle} bg-[#3A3A7A] text-white border-[#444] hover:bg-[#4A4A8A]`;
        case "function":
          return `${baseStyle} bg-[#7A3A3A] text-white border-[#744] hover:bg-[#8A4A4A]`;
        case "equals":
          return `${baseStyle} bg-[#3A7A3A] text-white border-[#474] hover:bg-[#4A8A4A]`;
        case "scientific":
          return `${baseStyle} bg-[#5A3A7A] text-white border-[#646] hover:bg-[#6A4A8A]`;
        default:
          return `${baseStyle} bg-[#404045] text-white border-[#555]`;
      }
    } else {
      switch (type) {
        case "number":
          return `${baseStyle} bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200`;
        case "operator":
          return `${baseStyle} bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200`;
        case "function":
          return `${baseStyle} bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200`;
        case "equals":
          return `${baseStyle} bg-green-500 hover:bg-green-600 text-white border-green-500`;
        case "scientific":
          return `${baseStyle} bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200`;
        default:
          return `${baseStyle} bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200`;
      }
    }
  };

  /* ────────────────────────────────
     Button Click Handler
     ──────────────────────────────── */
  const handleButtonClick = (value) => {
    try {
      /* =========  EVALUATE  ========= */
      if (value === "=") {
        if (!input.trim()) {
          return message.warning("Please enter an expression");
        }

        /* Validate parentheses */
        const stack = [];
        for (const ch of input) {
          if (ch === "(") stack.push(ch);
          if (ch === ")") {
            if (!stack.length) throw new Error("Unbalanced parentheses");
            stack.pop();
          }
        }
        if (stack.length) throw new Error("Unbalanced parentheses");

        /* Replace constants & functions */
        let expr = input
          .replace(/π/g, "Math.PI")
          .replace(/e/g, "Math.E")
          .replace(/√/g, "Math.sqrt")
          .replace(/sin/g, "Math.sin")
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan")
          .replace(/log/g, "Math.log10")
          .replace(/ln/g, "Math.log")
          .replace(/\^/g, "**");

        /* Factorial */
        expr = expr.replace(/(\d+)!/g, (_, n) => {
          let res = 1;
          for (let i = 2; i <= Number(n); i++) res *= i;
          return res;
        });

        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${expr})`)();
        if (Number.isNaN(result)) throw new Error("Invalid calculation");
        if (!Number.isFinite(result)) throw new Error("Result is too large");

        const record = `${input} = ${result}`;
        setHistory((prev) => [record, ...prev.slice(0, 9)]);
        return setInput(String(result));
      }

      /* =========  CLEAR / BACKSPACE / %  ========= */
      if (value === "C") return setInput("");
      if (value === "⌫") return setInput((prev) => prev.slice(0, -1));
      if (value === "%") {
        return setInput((prev) => (prev ? `(${prev})/100` : prev));
      }

      /* =========  NUMBERS / DOT / OPERATORS  ========= */
      setInput((prev) => {
        const last = lastChar(prev);

        /* 1️⃣ Block double operators (replace instead) */
        if (isOperator(value)) {
          if (!prev && value === "-") return value; // allow leading minus
          if (!prev || isOperator(last)) {
            return prev.slice(0, -1) + value; // replace previous operator
          }
        }

        /* 2️⃣ Prevent multiple dots in the same number */
        if (value === ".") {
          const parts = prev.split(/[\+\-\*\/\%]/);
          if (parts[parts.length - 1].includes(".")) return prev;
        }

        return prev + value;
      });
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };

  /* ────────────────────────────────
     History Helpers
     ──────────────────────────────── */
  const clearHistory = () => {
    setHistory([]);
    message.success("History cleared");
  };
  const removeHistoryItem = (idx) =>
    setHistory((h) => h.filter((_, i) => i !== idx));

  /* ────────────────────────────────
     Render
     ──────────────────────────────── */
  return (
    <Drawer
      placement="right"
      width={380}
      onClose={onClose}
      open={open}
      bodyStyle={{
        padding: 16,
        background: highContrast ? "#404045" : "#fff",
      }}
      title={
        <div
          className="flex items-center justify-between"
          style={{ color: highContrast ? "#fff" : undefined }}
        >
          <span className="flex items-center gap-2">
            <CalculatorOutlined />
            Advanced Calculator
          </span>
          <Switch
            checked={isScientific}
            onChange={setIsScientific}
            checkedChildren="Sci"
            unCheckedChildren="Basic"
          />
        </div>
      }
      headerStyle={{
        background: highContrast ? "#404045" : "#fff",
        borderBottom: highContrast ? "1px solid #555" : "1px solid #eee",
        color: highContrast ? "#fff" : undefined,
      }}
    >
      {/* Display */}
      <Input.TextArea
        rows={2}
        value={input}
        readOnly
        style={{
          resize: "none",
          background: highContrast ? "#505055" : "#f0f0f0",
          border: highContrast ? "1px solid #555" : "1px solid #d9d9d9",
          borderRadius: 8,
          padding: 12,
          fontSize: 24,
          fontFamily: "monospace",
          textAlign: "right",
          marginBottom: 16,
          color: highContrast ? "#fff" : undefined,
        }}
      />

      {/* History */}
      {history.length > 0 && (
        <div
          className="mb-4 p-3 rounded-lg border"
          style={{
            background: highContrast ? "#505055" : "#f0f0f0",
            borderColor: highContrast ? "#555" : "#d9d9d9",
          }}
        >
          <div
            className="flex justify-between items-center mb-2"
            style={{ color: highContrast ? "#ddd" : "#666" }}
          >
            <span className="text-xs font-medium">History:</span>
            <Button
              type="text"
              size="small"
              onClick={clearHistory}
              style={{ color: highContrast ? "#ddd" : undefined }}
            >
              Clear All
            </Button>
          </div>
          {history.map((item, idx) => (
            <div
              className="flex justify-between items-center py-1 rounded px-1"
              style={{
                background: highContrast ? "#606065" : "#f8f8f8",
                color: highContrast ? "#fff" : "#666",
              }}
              key={idx}
            >
              <div
                className="text-sm font-mono truncate flex-1 cursor-pointer"
                onClick={() => setInput(item.split("=")[0].trim())}
              >
                {item}
              </div>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined className="text-xs" />}
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistoryItem(idx);
                }}
                style={{ color: highContrast ? "#ddd" : undefined }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Keypad */}
      <div className="flex flex-col justify-end gap-2">
        {isScientific &&
          scientificButtons.map((row, r) => (
            <div key={`sci-${r}`} className="flex gap-2">
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className={getButtonStyle("scientific")}
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}

        {basicButtons.map((row, r) => (
          <div key={`basic-${r}`} className="flex gap-2">
            {row.map((btn) => {
              const isNumber = !isNaN(btn) || btn === ".";
              const isFunc = ["C", "⌫", "="].includes(btn);
              const isOp = isOperator(btn);

              let type = "";
              if (isNumber) type = "number";
              else if (isOp) type = "operator";
              else if (isFunc) {
                type = btn === "=" ? "equals" : "function";
              }

              return (
                <button
                  key={btn || `empty-${r}`}
                  onClick={() => btn && handleButtonClick(btn)}
                  className={getButtonStyle(type)}
                >
                  {btn === "*" ? "×" : btn === "/" ? "÷" : btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default CalculatorDrawer;
