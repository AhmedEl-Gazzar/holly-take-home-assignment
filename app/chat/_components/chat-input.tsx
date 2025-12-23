'use client'

export function ChatInput({
  input,
  onChange,
  onSubmit,
  isLoading,
}: {
  input: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}) {
  return (
    <form className="flex flex-row justify-center gap-4 w-full my-auto h-full">
      <textarea
        value={input}
        onChange={onChange}
        placeholder="Type a message..."
        className={'p-2 border rounded-lg w-full resize-none bg-white'}
        disabled={isLoading}
        rows={2}
      />

      <button
        type="submit"
        onClick={onSubmit}
        className="bg-blue-500 text-white p-2 rounded-lg w-24 h-10 my-auto"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
