import { useState } from 'react'
import './FeedbackModal.css'

function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [feedback, setFeedback] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit(feedback.trim())
      setFeedback('')
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="exclamation-icon">!</span>
            <h3>Provide Additional Feedback</h3>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="feedback-section">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please share your feedback..."
            className="feedback-textarea"
            rows="6"
          />
        </div>
        <div className="modal-footer">
          <button className="submit-btn" onClick={handleSubmit} disabled={!feedback.trim()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
