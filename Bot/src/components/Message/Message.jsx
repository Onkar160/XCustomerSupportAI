import { useState } from 'react'
import './Message.css'

function Message({ message, onRate, onFeedback }) {
  const [showFeedback, setShowFeedback] = useState(false)

  const handleMouseEnter = () => {
    if (message.sender === 'bot' && !message.rating && !message.feedback) {
      setShowFeedback(true)
    }
  }

  const handleMouseLeave = () => {
    if (!message.rating && !message.feedback) {
      setShowFeedback(false)
    }
  }

  const handleThumbsUp = (e) => {
    e.stopPropagation()
    if (onRate && message.id !== undefined) {
      onRate(message.id, 'up')
    }
  }

  const handleThumbsDown = (e) => {
    e.stopPropagation()
    if (onFeedback && message.id !== undefined) {
      onFeedback(message.id)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutesStr} ${ampm}`
  }

  return (
    <div
      className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="message-avatar">
        {message.sender === 'user' ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
            {/* Head */}
            <circle cx="20" cy="15" r="7" fill="#D97706"/>
            {/* Hair */}
            <path d="M13 12C13 10 15 8 20 8C25 8 27 10 27 12C27 14 25 16 20 16C15 16 13 14 13 12Z" fill="#92400E"/>
            {/* Body */}
            <path d="M12 28C12 24 15 22 20 22C25 22 28 24 28 28V32H12V28Z" fill="#F3F4F6"/>
            {/* Shirt details */}
            <rect x="16" y="24" width="8" height="6" fill="#E5E7EB"/>
          </svg>
        ) : (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#E5E7EB"/>
            {/* Head */}
            <circle cx="20" cy="15" r="7" fill="#10B981"/>
            {/* Hair */}
            <path d="M13 12C13 10 15 8 20 8C25 8 27 10 27 12C27 14 25 16 20 16C15 16 13 14 13 12Z" fill="#065F46"/>
            {/* Headset */}
            <path d="M10 14C10 12 12 10 15 10C16 10 17 10.5 17.5 11.5L18.5 13.5C19 14.5 19.5 15 20.5 15C21.5 15 22 14.5 22.5 13.5L23.5 11.5C24 10.5 25 10 26 10C29 10 31 12 31 14V16H10V14Z" fill="#1F2937" opacity="0.8"/>
            <path d="M10 16H31V18C31 20 29 22 26 22C25 22 24 21.5 23.5 20.5L22.5 18.5C22 17.5 21.5 17 20.5 17C19.5 17 19 17.5 18.5 18.5L17.5 20.5C17 21.5 16 22 15 22C12 22 10 20 10 18V16Z" fill="#374151"/>
            {/* Body */}
            <path d="M12 28C12 24 15 22 20 22C25 22 28 24 28 28V32H12V28Z" fill="#F3F4F6"/>
            {/* Shirt/Jacket */}
            <rect x="14" y="24" width="12" height="6" fill="#6EE7B7"/>
            <rect x="16" y="26" width="8" height="4" fill="#34D399"/>
          </svg>
        )}
      </div>
      <div className="message-content">
        <div className="message-sender">{message.sender === 'user' ? 'You' : 'Customer Support AI'}</div>
        <p className="message-text">{message.text}</p>
        <div className="message-timestamp">{formatTime(message.timestamp)}</div>
        
        {message.sender === 'bot' && (
          <div className="message-feedback">
            {(showFeedback || message.rating || message.feedback) && (
              <div className="feedback-icons">
                <button 
                  className={`thumbs-btn ${message.rating ? 'active' : ''}`}
                  onClick={handleThumbsUp}
                  aria-label="Thumbs up"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                </button>
                <button 
                  className={`thumbs-btn ${message.feedback ? 'active' : ''}`}
                  onClick={handleThumbsDown}
                  aria-label="Thumbs down"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                  </svg>
                </button>
              </div>
            )}
            
            {message.rating && (
              <div className="rating-display">
                <span>Rate this response:</span>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= message.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {message.feedback && (
              <div className="feedback-display">
                <span>Feedback: {message.feedback}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
