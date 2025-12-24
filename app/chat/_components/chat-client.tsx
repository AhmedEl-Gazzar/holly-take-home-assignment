'use client'

import { useState } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'
import { sendChatMessage } from '@/_lib/actions'

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatClient() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    setError(null)

    if (!input) return

    try {
      const response = await sendChatMessage({
        input,
      })
      console.log(response)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
        },
      ])
    } catch (error) {
      const e = error as Error
      setError(e.message)
    }

    setIsLoading(false)
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex-1 overflow-y-auto w-full">
        <ChatMessages messages={messages} />
      </div>
      <div className="w-full bg-gray-100 h-30 p-2 rounded-lg ">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ChatInput
          input={input}
          onChange={e => setInput(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
