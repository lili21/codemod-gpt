'use client';

import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

export function CodeEditer({ title, name, defaultCode = '' }: { name: string, title: string, defaultCode?: string }) {
  const [code, setCode] = useState(defaultCode);
  return (
    <div className='flex-1'>
      <h1>{title}</h1>
      <Editor
        name={name}
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.javascript)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          height: '100%',
          border: '1px solid black',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}

export function CodeViewer({ title, code }: { title: string, code: string }) {
  return (
    <div className='flex-1'>
      <h1>{title}</h1>
      <Editor
        onValueChange={() => { }}
        value={code}
        highlight={code => highlight(code, languages.javascript)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          height: '100%',
          border: '1px solid black',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}
