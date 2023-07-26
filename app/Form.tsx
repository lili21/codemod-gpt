'use client';

import { FormEventHandler, ReactNode, useState } from 'react';
import { CodeViewer } from './Code';

export default function Form({ apiPath, children }: { apiPath: string, children: ReactNode }) {
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
      setCode('');
      setLoading(true);
      const res = await fetch(apiPath, {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        // const result = await res.json();
        // console.log(result);
        const reader = res.body?.getReader();
        const readStream = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              console.log('stream reading complete')
            } else {
              const chunk = new TextDecoder().decode(value);
              console.log('Recieved chunk:', chunk);
              // todo - better way to show result
              setCode(c => c + chunk.replace(/```\n?/, '').replace(/javascript\n?/, ''));
              readStream();
            }
          }).catch

        }
        readStream();
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <main className="flex flex-col min-h-screen p-8">
        <div className='flex justify-center mb-4'>
          <button disabled={loading} type='submit' className="py-2 px-8 rounded text-lg font-medium bg-blue-500 text-white">
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className='flex flex-1 gap-4'>
          {children}
          <CodeViewer code={code} />
        </div>
      </main>
    </form>
  )
}
