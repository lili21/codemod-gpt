'use client';

import React, { MouseEventHandler, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

export function CodeEditer({ title, name, defaultCode = '' }: { name: string, title: string, defaultCode?: string }) {
  const [code, setCode] = useState(defaultCode);
  return (
    <div className='flex-1 relative'>
      <Editor
        name={name}
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.javascript, 'jsx')}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          height: '100%',
          border: '1px solid black',
          borderRadius: '4px',
          overflow: 'auto'
        }}
      />
      <span className="absolute right-1 top-1 w-24 text-center py-1 rounded-sm text-sm font-medium bg-blue-100 text-blue-800">
        {title}
      </span>
    </div>
  );
}

export function CodeViewer({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy: MouseEventHandler = async (e) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000)
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy');
    }
  }
  return (
    <div className='flex-1 relative'>
      <Editor
        onValueChange={() => { }}
        value={code}
        highlight={code => highlight(code, languages.javascript, 'js')}
        padding={10}
        placeholder='Generated code will appear here'
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          height: '100%',
          border: '1px solid black',
          borderRadius: '4px'
        }}
      />
      <button type="button" onClick={copy} className='w-20 py-2 absolute top-1 right-1 rounded text-sm font-medium bg-blue-500 text-white'>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}
