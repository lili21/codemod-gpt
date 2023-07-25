'use client';

import { FormEventHandler, useState } from 'react';
import { CodeEditer, CodeViewer } from './Code';

export default function Home() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // console.log(Object.fromEntries(formData))
    const originCode = formData.get('originCode');
    const newCode = formData.get('newCode');
    if (!originCode || !newCode) {
      alert('invalid!!!!');
      return;
    }
    try {
      setLoading(true);
      setCode('Generating...');
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const result = await res.json();
        console.log(result);

        setCode(result.choices[0].message.content)
      }
    } catch (e) {
      setCode('')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <main className="flex flex-col min-h-screen p-8">
        <div className='flex justify-center mb-4'>
          <button disabled={loading} type='submit' className="bg-fuchsia-400 hover:bg-fuchsia-500 text-white py-2 px-8 rounded text-lg">
            Generate!
          </button>
        </div>
        <div className='flex flex-1 gap-4'>
          <div className='flex flex-1 flex-col gap-8'>
            <CodeEditer name="originCode" title="Origin Code" defaultCode={`import { Divider, Button } from 'antd'

<Divider type="vertical" />`} />
            <CodeEditer name="newCode" title="New Code" defaultCode={`import { Button } from 'antd'
import { Divider } from '@douyinfe/semi-ui'

<Divider type="vertical" />`} />
          </div>
          <CodeViewer title="GPT generated code" code={code} />
        </div>
      </main>
    </form>
  )
}
