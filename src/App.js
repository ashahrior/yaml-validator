import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import jsyaml from "js-yaml";
import { linter, lintGutter } from "@codemirror/lint";

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

  return (
    <div style={{ padding: 32 }}>
      <h2>YAML Validator with Syntax Highlighting & Gutter Error Highlight</h2>
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
  );
}

export default App;