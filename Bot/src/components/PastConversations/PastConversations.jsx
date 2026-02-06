import { useState, useMemo } from 'react'
import './PastConversations.css'

function PastConversations({ conversations, onFilterChange }) {
  const [selectedRating, setSelectedRating] = useState('all')

  const filteredConversations = useMemo(() => {
    if (selectedRating === 'all') {
      return conversations
    }
    const rating = parseInt(selectedRating)
    return conversations.filter(conv => {
      // Check if any bot message in the conversation has the selected rating
      return conv.messages.some(msg => msg.sender === 'bot' && msg.rating === rating)
    })
  }, [conversations, selectedRating])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today's chats"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's chats"
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  const groupByDate = (convs) => {
    const groups = {}
    convs.forEach(conv => {
      const dateKey = formatDate(conv.timestamp)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(conv)
    })
    return groups
  }

  const groupedConversations = groupByDate(filteredConversations)

  const handleRatingChange = (e) => {
    const value = e.target.value
    setSelectedRating(value)
    if (onFilterChange) {
      onFilterChange(value)
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
    <div className="past-conversations-container">
      <h2 className="conversations-title">Conversation History</h2>
      
      <div className="filter-section">
        <label htmlFor="rating-filter">Filter by rating:</label>
        <select
          id="rating-filter"
          value={selectedRating}
          onChange={handleRatingChange}
          className="rating-filter"
        >
          <option value="all">All Ratings</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      <div className="conversations-list">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="empty-conversations">
            <p>No conversations found</p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([dateKey, convs]) => (
            <div key={dateKey} className="conversation-group">
              <h3 className="group-title">{dateKey}</h3>
              {convs.map((conv, index) => (
                <div key={index} className="conversation-item">
                  {conv.messages.map((msg, msgIndex) => (
                    <div key={msgIndex} className="history-message">
                      <div className="history-message-sender">
                        {msg.sender === 'user' ? 'You' : 'Customer Support AI'}
                      </div>
                      <div className="history-message-text">{msg.text}</div>
                      <div className="history-message-time">{formatTime(msg.timestamp)}</div>
                      {msg.sender === 'bot' && msg.rating && (
                        <div className="history-rating">
                          <span>Rate this response:</span>
                          <div className="history-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star ${star <= msg.rating ? 'filled' : ''}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {msg.sender === 'bot' && msg.feedback && (
                        <div className="history-feedback">
                          <span>Feedback: {msg.feedback}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PastConversations
