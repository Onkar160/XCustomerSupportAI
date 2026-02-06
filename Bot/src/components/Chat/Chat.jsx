import { useState, useRef, useEffect } from 'react'
import Message from '../Message/Message'
import ChatInput from '../ChatInput/ChatInput'
import DemoQuestions from '../DemoQuestions/DemoQuestions'
import './Chat.css'

function Chat({ messages, onSendMessage, onSaveChat, onRateMessage, onFeedbackMessage }) {
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleDemoQuestionClick = (question) => {
    onSendMessage(question)
  }

  return (
    <div className="chat-container">
      <div className={`chat-messages ${messages.length === 0 ? 'demo-state' : ''}`}>
        {messages.length === 0 ? (
          <DemoQuestions onQuestionClick={handleDemoQuestionClick} />
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message
                key={msg.id || index}
                message={msg}
                onRate={onRateMessage}
                onFeedback={onFeedbackMessage}
              />
            ))}
            <div ref={chatEndRef} />
          </>
        )}
      </div>
      <ChatInput onSendMessage={onSendMessage} onSaveChat={onSaveChat} />
    </div>
  )
}

export default Chat
