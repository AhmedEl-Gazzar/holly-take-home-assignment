'use client'

import { useState } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatClient() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')

    if (!input) return
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: 'Hello, how can I help you today?' },
    ])

    setIsLoading(false)
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex-1 overflow-y-auto w-full">
        <ChatMessages messages={messages} />
      </div>
      <div className="w-full bg-gray-100 h-30 p-2 rounded-lg ">
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
