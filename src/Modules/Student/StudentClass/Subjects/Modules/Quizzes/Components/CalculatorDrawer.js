import React, { useState, useCallback } from "react";
import { Button, Input, message, Drawer, Switch } from "antd";
import { CalculatorOutlined, CloseOutlined } from "@ant-design/icons";

const CalculatorDrawer = ({ open, onClose }) => {
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
      bodyStyle={{ padding: 16 }}
      title={
        <div className="flex items-center justify-between">
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
    >
      {/* Display */}
      <Input.TextArea
        rows={2}
        value={input}
        readOnly
        style={{
          resize: "none",
          background: "#f0f0f0",
          border: "1px solid #d9d9d9",
          borderRadius: 8,
          padding: 12,
          fontSize: 24,
          fontFamily: "monospace",
          textAlign: "right",
          marginBottom: 16,
        }}
      />

      {/* History */}
      {history.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 font-medium">History:</span>
            <Button type="text" size="small" onClick={clearHistory}>
              Clear All
            </Button>
          </div>
          {history.map((item, idx) => (
            <div
              className="flex justify-between items-center py-1 hover:bg-gray-100 rounded px-1"
              key={idx}
            >
              <div
                className="text-sm font-mono text-gray-600 truncate flex-1 cursor-pointer"
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
                  className={`flex-1 h-12 rounded-md text-lg font-medium border
                    ${
                      btn
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                        : "invisible"
                    }`}
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

              return (
                <button
                  key={btn || `empty-${r}`}
                  onClick={() => btn && handleButtonClick(btn)}
                  className={`flex-1 h-12 rounded-md text-xl font-medium border border-gray-200
                    ${!btn ? "invisible" : ""}
                    ${isNumber && "bg-gray-100 hover:bg-gray-200 text-gray-800"}
                    ${isOp && "bg-blue-100 hover:bg-blue-200 text-blue-800"}
                    ${
                      isFunc &&
                      (btn === "C"
                        ? "bg-red-100 hover:bg-red-200 text-red-800"
                        : btn === "="
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-orange-100 hover:bg-orange-200 text-orange-800")
                    }`}
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
