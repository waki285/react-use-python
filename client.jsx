import React, { useState } from "react";
import ReactDOM from "react-dom";

// I haven't used any of this bs in a year, hopefully it still the same

/// Look mum! I am so cool, I put strings into a different file
function css(strings) {
  let style = document.getElementById("css-in-js-style-thing");
  if (!style) {
    style = document.createElement("style");
    style.id = "css-in-js-style-thing";
    document.head.appendChild(style);
  }

  const randomClassId = Math.random().toString(36).slice(2);
  style.textContent += `
.${randomClassId} {
${strings[0]}
}`;
  return randomClassId;
}

async function runPython(code) {
  const res = await fetch("/rpc/rce", {
    method: "POST",
    body: JSON.stringify({ code: code }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

const appStyles = css`
  margin: 3rem auto;
  max-width: 600px;
  padding: 0 1rem;
`;

const App = () => (
  <div className={appStyles}>
    <h1>React use Python demo</h1>
    <Demo />
  </div>
);

const Demo = () => {
  const [output, setOutput] = useState(null);
  const pyHelloWorld = async () => {
"use python";
import numpy as np
# 配列の平均値を計算
arr = np.array([1, 2, 3, 4, 5])
print(np.mean(arr))
  };
  const onClick = async () => {
    const out = await pyHelloWorld();
    setOutput(out.stdout);
  };

  return (
    <div>
      <button onClick={onClick}>Run Python code!</button>
      <p>Output from Python:</p>
      <pre>{ output }</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
