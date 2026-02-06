import { useMemo, useState } from 'react'
import data from './data.json'
import './App.css'

const DEFAULT_RESPONSE = 'Sorry, Did not understand your query!'

const makeTime = (date = new Date()) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

const uid = () => Math.random().toString(36).slice(2)

function App() {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])

  const responseMap = useMemo(() => {
    const map = new Map()
    data.responses.forEach((entry) => {
      map.set(entry.question.toLowerCase(), entry.answer)
    })
    return map
  }, [])

  const handleSend = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMessage = {
      id: uid(),
      sender: 'user',
      text: trimmed,
      time: makeTime(),
    }
    const response =
      responseMap.get(trimmed.toLowerCase()) || DEFAULT_RESPONSE
    const botMessage = {
      id: uid(),
      sender: 'bot',
      text: response,
      time: makeTime(),
    }
    setMessages((prev) => [...prev, userMessage, botMessage])
    setMessageInput('')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <button type="button" className="new-query">
            <span className="brand-icon" aria-hidden="true" />
            <span className="new-query-text">New Query?</span>
          </button>
          <button type="button" className="icon-button">
            +
          </button>
        </div>
        <button type="button" className="sidebar-action">
          Past Conversations
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1 className="title">Customer Support AI</h1>
          <div className="theme-toggle">
            <span className="theme-label">Light</span>
            <button type="button" className="icon-button">
              <span className="gear" />
            </button>
          </div>
        </header>

        <section className="chat-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">Hi, Please tell me your query!</div>
              <div className="avatar bot-avatar large" />
              <div className="demo-grid">
                {data.responses.map((entry) => (
                  <button
                    key={entry.question}
                    type="button"
                    className="demo-card"
                    onClick={() => handleSend(entry.question)}
                  >
                    <div className="demo-title">{entry.question}</div>
                    <div className="demo-subtitle">
                      Get immediate AI generated response
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-card ${
                    msg.sender === 'user' ? 'user' : 'bot'
                  }`}
                >
                  <div className={`avatar ${msg.sender}-avatar`} />
                  <div className="message-body">
                    <div className="message-author">
                      {msg.sender === 'user' ? 'You' : 'Customer Support AI'}
                    </div>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault()
              handleSend(messageInput)
            }}
          >
            <input
              type="text"
              placeholder="Please tell me about your query!"
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
            />
            <button type="submit" className="primary">
              Ask
            </button>
            <button type="button" className="ghost">
              Save
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
