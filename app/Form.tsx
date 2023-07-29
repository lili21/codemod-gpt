'use client'

import { FormEventHandler, ReactNode, useState } from 'react'
import MessageRender from './MessageRender'

export default function Form({
  apiPath,
  children,
}: {
  apiPath: string
  children: ReactNode
}) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const originCode = formData.get('originCode')
    const newCode = formData.get('newCode')
    if (!originCode || !newCode) {
      alert('invalid!!!!')
      return
    }
    try {
      setMessage('')
      setLoading(true)
      const res = await fetch(apiPath, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const reader = res.body?.getReader()
        const readStream = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              console.log('stream reading complete')
            } else {
              const chunk = new TextDecoder().decode(value)
              console.log('Recieved chunk:', chunk)
              setMessage((c) => c + chunk)
              readStream()
            }
          }).catch
        }
        readStream()
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
        <div className="flex justify-center mb-4">
          <button
            disabled={loading}
            type="submit"
            className="py-2 px-8 rounded text-lg font-medium bg-blue-500 text-white"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className="flex flex-1 gap-4">
          {children}
          <MessageRender>{message}</MessageRender>
        </div>
      </main>
    </form>
  )
}
