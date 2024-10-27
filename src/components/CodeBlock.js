// src/CodeBlock.js
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ codeString }) => {
  return (
    <SyntaxHighlighter language="javascript" style={solarizedlight}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
