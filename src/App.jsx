import "./App.css";
import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { html } from "@codemirror/lang-html";
import { color } from "@uiw/codemirror-extensions-color";
import pretty from "pretty";

export default function App() {
  const [code, setCode] = useState("");
  const [debouncedCode, setDebouncedCode] = useState("");

  const onChange = (value) => {
    setCode(value);
  };

  const handleKeyDown = (event) => {
    if (event.shiftKey && event.altKey && event.key === "F") {
      event.preventDefault();
      setCode(pretty(code));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 2000);

    return () => clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    const iframe = document.getElementById("preview");

    const blob = new Blob([debouncedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    iframe.src = url;

    return () => URL.revokeObjectURL(url);
  }, [debouncedCode]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <CodeMirror
          value={code}
          height="100dvh"
          width="50dvw"
          onChange={onChange}
          theme={dracula}
          indentWithTab={true}
          extensions={[html({ matchClosingTags: true }), color]}
          onKeyDown={handleKeyDown}
        />
      </div>
      <iframe
        id="preview"
        title="HTML Preview"
        style={{
          width: "50vw",
          height: "100vh",
          border: "none",
        }}
      ></iframe>
    </>
  );
}
