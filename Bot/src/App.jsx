import { useEffect, useMemo, useState } from 'react'
import data from './data.json'
import './App.css'

const DEFAULT_RESPONSE = 'Sorry, Did not understand your query!'

const makeTime = (date = new Date()) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

const uid = () => Math.random().toString(36).slice(2)

const loadHistory = () => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem('cs-ai-history')
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function Star({ filled }) {
  return (
    <svg className={`star ${filled ? 'filled' : ''}`} viewBox="0 0 24 24">
      <path d="M12 3.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 18.9l-5.8 3.47 1.11-6.47-4.7-4.58 6.49-.94L12 3.5z" />
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 10.5v9H4v-9h4.5zM9.5 10.5l3.2-5.6c.3-.6 1.1-.9 1.8-.6.6.3.9 1 .7 1.6l-.8 3h5.1c1.2 0 2.1 1.1 1.9 2.3l-1.1 6.2c-.2 1-1.1 1.7-2.1 1.7h-6.7l-2.9-1.7V10.5z" />
    </svg>
  )
}

function ThumbDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 13.5v-9H20v9h-4.5zM14.5 13.5l-3.2 5.6c-.3.6-1.1.9-1.8.6-.6-.3-.9-1-.7-1.6l.8-3H4.5c-1.2 0-2.1-1.1-1.9-2.3l1.1-6.2c.2-1 1.1-1.7 2.1-1.7h6.7l2.9 1.7v7.9z" />
    </svg>
  )
}

function App() {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
  const [feedbackModalId, setFeedbackModalId] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [ratingFilter, setRatingFilter] = useState('all')
  const [route, setRoute] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )

  useEffect(() => {
    window.localStorage.setItem('cs-ai-history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const responseMap = useMemo(() => {
    const map = new Map()
    data.responses.forEach((entry) => {
      map.set(entry.question.toLowerCase(), entry.answer)
    })
    return map
  }, [])

  const filteredHistory = useMemo(() => {
    if (ratingFilter === 'all') return history
    const value = Number(ratingFilter)
    return history.filter((chat) => chat.rating === value)
  }, [history, ratingFilter])

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
      rating: null,
      showRating: false,
      feedback: '',
    }
    setMessages((prev) => [...prev, userMessage, botMessage])
    setMessageInput('')
  }

  const handleRate = (messageId, rating) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, rating, showRating: false }
          : msg
      )
    )
  }

  const handleThumbUp = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, showRating: true } : msg
      )
    )
  }

  const handleThumbDown = (messageId) => {
    setFeedbackModalId(messageId)
    setFeedbackText('')
  }

  const handleFeedbackSubmit = () => {
    if (!feedbackModalId) return
    const text = feedbackText.trim()
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === feedbackModalId ? { ...msg, feedback: text } : msg
      )
    )
    setFeedbackModalId(null)
    setFeedbackText('')
  }

  const handleSaveConversation = () => {
    if (!messages.length) return
    const rated = [...messages]
      .reverse()
      .find((msg) => msg.sender === 'bot' && msg.rating)
    const entry = {
      id: uid(),
      messages: messages.map((msg) => ({ ...msg })),
      savedAt: new Date().toISOString(),
      rating: rated?.rating ?? null,
    }
    setHistory((prev) => [entry, ...prev])
    navigate('/history')
  }

  const handleReset = () => {
    setMessages([])
    setMessageInput('')
    navigate('/')
  }

  const navigate = (path) => {
    if (typeof window === 'undefined') return
    window.history.pushState({}, '', path)
    setRoute(path)
  }

  const MessageList = ({ items, showActions = true }) => (
    <div className="messages">
      {items.map((msg) => (
        <div
          key={msg.id}
          className={`message-card ${msg.sender === 'user' ? 'user' : 'bot'}`}
        >
          <div className={`avatar ${msg.sender}-avatar`} />
          <div className="message-body">
            <div className="message-author">
              {msg.sender === 'user' ? 'You' : 'Customer Support AI'}
            </div>
            <div className="message-text">{msg.text}</div>
            <div className="message-time">{msg.time}</div>
            {msg.sender === 'bot' && showActions && (
              <div className="message-actions">
                <div className="thumbs">
                  <button
                    type="button"
                    className="thumb-button"
                    onClick={() => handleThumbUp(msg.id)}
                  >
                    <ThumbUpIcon />
                  </button>
                  <button
                    type="button"
                    className="thumb-button"
                    onClick={() => handleThumbDown(msg.id)}
                  >
                    <ThumbDownIcon />
                  </button>
                </div>
              </div>
            )}
            {msg.sender === 'bot' && showActions && msg.showRating && (
              <div className="rating-block">
                <div className="rating-label">Rate this response:</div>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-button"
                      onClick={() => handleRate(msg.id, star)}
                    >
                      <Star filled={star <= (msg.rating || 0)} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msg.sender === 'bot' && msg.feedback && (
              <div className="feedback-line">Feedback: {msg.feedback}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <button type="button" className="new-query" onClick={handleReset}>
            <span className="brand-icon" aria-hidden="true" />
            <span className="new-query-text">New Query?</span>
          </button>
          <button type="button" className="icon-button" onClick={handleReset}>
            +
          </button>
        </div>
        <button
          type="button"
          className="sidebar-action"
          onClick={() => navigate('/history')}
        >
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

        {route === '/history' ? (
          <section className="history-area">
            <div className="history-header">
              <h2>Conversation History</h2>
            </div>
            <div className="history-filter">
              <label htmlFor="ratingFilter">Filter by rating</label>
              <select
                id="ratingFilter"
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="history-list">
              <div className="history-section-title">Today's chats</div>
              {filteredHistory.length ? (
                filteredHistory.map((chat) => (
                  <div key={chat.id} className="history-chat">
                    <MessageList items={chat.messages} showActions={false} />
                  </div>
                ))
              ) : (
                <div className="empty-history">No chats found.</div>
              )}
            </div>
          </section>
        ) : (
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
              <MessageList items={messages} />
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
              <button
                type="button"
                className="ghost"
                onClick={handleSaveConversation}
                disabled={!messages.length}
              >
                Save
              </button>
            </form>
          </section>
        )}
      </main>

      {feedbackModalId && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Provide Additional Feedback</div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setFeedbackModalId(null)}
                aria-label="Close"
              >
                <span className="close-x" />
              </button>
            </div>
            <textarea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="primary"
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
