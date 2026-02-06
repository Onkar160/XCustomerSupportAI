import './Sidebar.css'

function Sidebar({ onNewQuery, onPastConversations, isPastConversationsActive }) {
  return (
    <div className="sidebar">
      <div className="new-query-section" onClick={onNewQuery}>
        <div className="new-query-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="url(#gradient)"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span>New Query?</span>
        <div className="plus-icon">+</div>
      </div>
      <button 
        className={`past-conversations-btn ${isPastConversationsActive ? 'active' : ''}`}
        onClick={onPastConversations}
      >
        Past Conversations
      </button>
    </div>
  )
}

export default Sidebar
