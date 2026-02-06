import { useState } from 'react'
import './ChatInput.css'

function ChatInput({ onSendMessage, onSaveChat }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleSave = () => {
    if (onSaveChat) {
      onSaveChat()
    }
  }

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Please tell me about your query!"
          className="chat-input"
        />
        <button type="submit" className="ask-btn">
          Ask
        </button>
        <button type="button" className="save-btn" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  )
}

export default ChatInput
