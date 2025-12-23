import ChatClient from './_components/chat-client'

export default function ChatPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-4 p-5 max-w-4xl mx-auto">
      <main className="h-full w-full">
        <ChatClient />
      </main>
    </div>
  )
}
