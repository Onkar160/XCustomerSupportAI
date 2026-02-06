import './DemoQuestions.css'
import aiRepliesData from '../../data/aiReplies.json'

function DemoQuestions({ onQuestionClick }) {
  const demoQuestions = aiRepliesData.questions.slice(0, 4)

  return (
    <div className="demo-questions-container">
      <div className="greeting-section">
        <div className="greeting-avatar">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="40" fill="#E5E7EB"/>
            {/* Head */}
            <circle cx="40" cy="30" r="14" fill="#10B981"/>
            {/* Hair */}
            <path d="M26 24C26 20 30 16 40 16C50 16 54 20 54 24C54 28 50 32 40 32C30 32 26 28 26 24Z" fill="#065F46"/>
            {/* Headset */}
            <path d="M20 28C20 24 24 20 30 20C32 20 34 21 35 23L37 27C38 29 39 30 41 30C43 30 44 29 45 27L47 23C48 21 50 20 52 20C58 20 62 24 62 28V32H20V28Z" fill="#1F2937" opacity="0.8"/>
            <path d="M20 32H62V36C62 40 58 44 52 44C50 44 48 43 47 41L45 37C44 35 43 34 41 34C39 34 38 35 37 37L35 41C34 43 32 44 30 44C24 44 20 40 20 36V32Z" fill="#374151"/>
            {/* Body */}
            <path d="M24 56C24 48 30 44 40 44C50 44 56 48 56 56V64H24V56Z" fill="#F3F4F6"/>
            {/* Shirt/Jacket */}
            <rect x="28" y="48" width="24" height="12" fill="#6EE7B7"/>
            <rect x="32" y="52" width="16" height="8" fill="#34D399"/>
          </svg>
        </div>
        <p className="greeting-text">Hi, Please tell me your query!</p>
      </div>
      
      <div className="demo-questions-grid">
        {demoQuestions.map((item, index) => (
          <div
            key={index}
            className="demo-question-card"
            onClick={() => onQuestionClick(item.question)}
          >
            <div className="demo-question-text">{item.question}</div>
            <div className="demo-question-hint">Get immediate AI generated response</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DemoQuestions
