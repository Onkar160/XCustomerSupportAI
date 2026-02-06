import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Chat from './components/Chat/Chat'
import PastConversations from './components/PastConversations/PastConversations'
import RatingModal from './components/RatingModal/RatingModal'
import FeedbackModal from './components/FeedbackModal/FeedbackModal'
import aiRepliesData from './data/aiReplies.json'
import './App.css'

function App() {
  const [theme, setTheme] = useState('light')
  const [currentView, setCurrentView] = useState('chat')
  const [messages, setMessages] = useState([])
  const [savedConversations, setSavedConversations] = useState([])
  const [ratingModal, setRatingModal] = useState({ isOpen: false, messageId: null })
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, messageId: null })

  // Load theme and conversations from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }

    const savedChats = localStorage.getItem('chat')
    if (savedChats) {
      try {
        setSavedConversations(JSON.parse(savedChats))
      } catch (error) {
        console.error('Error parsing saved chats:', error)
      }
    }

    // Don't initialize with messages - let DemoQuestions component show instead
  }, [])

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Set initial theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const findReply = (question) => {
    const normalizedQuestion = question.trim().toLowerCase()
    const found = aiRepliesData.questions.find(
      (q) => q.question.toLowerCase() === normalizedQuestion
    )
    return found ? found.reply : aiRepliesData.sorryMessage
  }

  const handleSendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    }

    const botReply = findReply(text)
    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: botReply,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage, botMessage])
  }

  const handleSaveChat = () => {
    if (messages.length === 0) return

    const conversation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        ...msg,
        rating: msg.rating || null,
        feedback: msg.feedback || null,
      })),
    }

    const updatedConversations = [...savedConversations, conversation]
    setSavedConversations(updatedConversations)
    localStorage.setItem('chat', JSON.stringify(updatedConversations))
    
    // Clear current chat after saving
    setMessages([])
  }

  const handleNewQuery = () => {
    setMessages([])
    setCurrentView('chat')
  }

  const handlePastConversations = () => {
    setCurrentView('history')
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleRateMessage = (messageId, type, rating = null) => {
    if (type === 'up' && !rating) {
      // Open rating modal
      setRatingModal({ isOpen: true, messageId })
    } else if (type === 'up' && rating) {
      // Apply rating
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, rating } : msg
        )
      )
      setRatingModal({ isOpen: false, messageId: null })
    }
  }

  const handleRatingSubmit = (rating) => {
    if (ratingModal.messageId !== null) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === ratingModal.messageId ? { ...msg, rating } : msg
        )
      )
    }
    setRatingModal({ isOpen: false, messageId: null })
  }

  const handleFeedbackMessage = (messageId) => {
    setFeedbackModal({ isOpen: true, messageId })
  }

  const handleFeedbackSubmit = (feedback) => {
    if (feedbackModal.messageId !== null) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === feedbackModal.messageId ? { ...msg, feedback } : msg
        )
      )
    }
    setFeedbackModal({ isOpen: false, messageId: null })
  }

  return (
    <div className="app">
      <Sidebar
        onNewQuery={handleNewQuery}
        onPastConversations={handlePastConversations}
        isPastConversationsActive={currentView === 'history'}
      />
      <div className="main-content">
        <Header theme={theme} onThemeToggle={handleThemeToggle} />
        {currentView === 'chat' ? (
          <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            onSaveChat={handleSaveChat}
            onRateMessage={handleRateMessage}
            onFeedbackMessage={handleFeedbackMessage}
          />
        ) : (
          <PastConversations conversations={savedConversations} />
        )}
      </div>
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, messageId: null })}
        onSubmit={handleRatingSubmit}
      />
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, messageId: null })}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  )
}

export default App
