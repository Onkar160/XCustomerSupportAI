import { useState } from 'react'
import data from './data.json'
import './App.css'

function App() {
  const [messageInput, setMessageInput] = useState('')

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
          <div className="empty-state">
            <div className="empty-title">Hi, Please tell me your query!</div>
            <div className="avatar bot-avatar large" />
            <div className="demo-grid">
              {data.responses.map((entry) => (
                <button key={entry.question} type="button" className="demo-card">
                  <div className="demo-title">{entry.question}</div>
                  <div className="demo-subtitle">
                    Get immediate AI generated response
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form className="composer">
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
