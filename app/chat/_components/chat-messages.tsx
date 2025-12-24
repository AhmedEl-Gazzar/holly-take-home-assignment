'use client'

import { Message } from './chat-client'

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3 w-full flex flex-col items-start my-2">
      {messages.map(({ role, content }, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg
            max-w-80
             ${role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'}`}
        >
          <div className="text-sm">{content}</div>
        </div>
      ))}
    </div>
  )
}
