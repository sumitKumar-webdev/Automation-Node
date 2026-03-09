import { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, Type } from 'lucide-react';
import { Position } from 'reactflow';
import { NodeShell } from './Base-Node/nodeBase';

const variableTokenRegex = /\{\{\s*([A-Za-z_$][\w$]*)\s*\}\}/g;

const splitTextAndVariables = (value) => {
  const foundVariables = [];
  const cleanedText = value.replace(variableTokenRegex, (_, variableName) => {
    foundVariables.push(variableName);
    return '';
  });
  return {
    cleanedText,
    foundVariables: Array.from(new Set(foundVariables)),
  };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  const lines = text.split('\n');
  const longestLine = lines.reduce((maxLen, line) => Math.max(maxLen, line.length), 0);
  const lineCount = Math.max(lines.length, 1);
  const avgLineLength = Math.round(text.length / lineCount);

  const width = clamp(
    250 + longestLine * 6 + avgLineLength * 1.6,
    250,
    680,
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'output' },
  ].map((handle) => ({
    ...handle,
    id: `${id}-${handle.id}`,
  }));

  const handleTextChange = (event) => {
    const nextValue = event.target.value;
    const { cleanedText, foundVariables } = splitTextAndVariables(nextValue);
    setText(cleanedText);
    if (foundVariables.length) {
      setVariables((prev) => Array.from(new Set([...prev, ...foundVariables])));
    }
  };

  const removeVariableFromText = (variableName) => {
    setVariables((prev) => prev.filter((variable) => variable !== variableName));
  };

  return (
    <NodeShell
      nodeId={id}
      title="Text"
      icon={Type}
      keyColor="#fde68a"
      handles={handles}
      className="text-node-shell"
      style={{width}}
    >
      <div className="node-field">
        <label htmlFor={`${id}-text`}>Text</label>
        <div className="text-input-shell">
          {variables.length > 0 && (
            <div className="text-variable-list">
              {variables.map((variable) => (
                <span className="text-variable-chip" key={variable}>
                  <CornerDownLeft size={12} strokeWidth={2.2} />
                  <span>{variable}</span>
                  <button
                    type="button"
                    className="text-variable-chip-remove"
                    onClick={() => removeVariableFromText(variable)}
                    aria-label={`Remove variable ${variable}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
          <textarea
            className="text-node-textarea"
            ref={textareaRef}
            id={`${id}-text`}
            name="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Type template text"
            rows={1}
          />
        </div>
      </div>
    </NodeShell>
  );
};
