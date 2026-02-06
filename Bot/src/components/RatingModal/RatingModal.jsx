import { useState } from 'react'
import './RatingModal.css'

function RatingModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating)
      setRating(0)
      setHoveredRating(0)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Rate this response</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="rating-section">
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="submit-btn" onClick={handleSubmit} disabled={rating === 0}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingModal
