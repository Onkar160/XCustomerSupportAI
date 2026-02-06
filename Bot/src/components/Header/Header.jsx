import './Header.css'

function Header({ theme, onThemeToggle }) {
  return (
    <header className="header">
      <h1>Customer Support AI</h1>
      <button className="theme-toggle" onClick={onThemeToggle}>
        <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2V4M10 16V18M4 10H2M6.31412 6.31412L4.8999 4.8999M15.1001 15.1001L13.6859 13.6859M18 10H16M15.1001 4.8999L13.6859 6.31412M6.31412 13.6859L4.8999 15.1001M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  )
}

export default Header
