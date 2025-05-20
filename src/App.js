import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import jsyaml from "js-yaml";
import { linter, lintGutter } from "@codemirror/lint";

function getYamlErrors(doc) {
  const errors = [];
  try {
    jsyaml.load(doc);
  } catch (e) {
    if (e.mark && typeof e.mark.line === "number") {
      errors.push({
        line: e.mark.line + 1,
        message: e.message,
      });
    } else {
      errors.push({
        line: null,
        message: e.message,
      });
    }
  }
  return errors;
}

function yamlLinter() {
  return (view) => {
    const diagnostics = [];
    try {
      jsyaml.load(view.state.doc.toString());
    } catch (e) {
      if (e.mark && typeof e.mark.line === "number") {
        diagnostics.push({
          from: view.state.doc.line(e.mark.line + 1).from,
          to: view.state.doc.line(e.mark.line + 1).to,
          severity: "error",
          message: e.message,
        });
      }
    }
    return diagnostics;
  };
}

function App() {
  const [value, setValue] = useState("key: value\nlist:\n  - item1\n  - item2");
  const errors = getYamlErrors(value);

  return (
    <div style={{ padding: 32 }}>
      <h2>YAML Validator with Syntax Highlighting & Gutter Error Highlight</h2>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div style={{ width: 1000 }}>
          <CodeMirror
            value={value}
            height="600px"
            extensions={[
              yaml(),
              linter(yamlLinter()),
              lintGutter(),
            ]}
            onChange={setValue}
            theme="light"
            basicSetup={{ lineNumbers: true }}
          />
        </div>
        {errors.length > 0 && (
          <div style={{
            marginLeft: 24,
            background: "#f8d7da",
            padding: 16,
            borderRadius: 4,
            minWidth: 300,
            maxWidth: 400
          }}>
            <h3 style={{ marginTop: 0, color: "#721c24" }}>YAML Errors</h3>
            <ul style={{ color: "#721c24", margin: 0, paddingLeft: 20 }}>
              {errors.map((err, idx) => (
                <li key={idx}>
                  {err.line !== null ? `Line ${err.line}: ` : ""}
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;