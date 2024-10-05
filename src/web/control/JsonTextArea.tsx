import Editor from '@monaco-editor/react';
import React from 'react';

interface JsonTextAreaProps {
  onBlur?: (value: string) => void;
  className?: string;
  error?: string;
}

function JsonTextArea({ onBlur, className, error }: JsonTextAreaProps) {
  return (
    <div className={className}>
      <Editor
        defaultValue={'{\n}'}
        className="min-h-48"
        language="json"
        wrapperProps={{
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) =>
            onBlur?.(ev.target.value),
        }}
        options={{
          lineNumbers: 'off',
        }}
      />
      {error && <div className="text-red-500 m-1">{error}</div>}
    </div>
  );
}

export default JsonTextArea;
