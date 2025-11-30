import React, { useEffect, useRef, useState } from 'react'
import ProfileAvatar from './ProfileAvatar'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useFavourites } from '../contexts/FavouritesContext'

export default function GlobalHeader() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const { count } = useFavourites()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])
  return (
    <header className="global-header" style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--gray-200)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div className="header-left" style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <Link to="/" style={{ textDecoration:'none', color:'var(--primary-color)', fontWeight:600, fontSize:'1.1rem' }}>Ndlela</Link>
      </div>
      <div className="header-right" style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        {/* Search Icon */}
        <button
          aria-label="Open search"
          className="icon-button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('focus-main-search'))
            navigate('/search')
          }}
        >
          🔎
        </button>

        {/* Favourites Icon with badge */}
        <button
          aria-label="Favourites"
          className="icon-button"
          onClick={() => navigate('/favourites')}
          style={{ position:'relative' }}
        >
          ❤️
          <span className="badge" aria-label={`Favourites count ${count}`} style={{ position:'absolute', top:-6, right:-8 }}>
            {count}
          </span>
        </button>

        {/* Cart Icon with badge */}
        <button
          aria-label="Cart"
          className="icon-button"
          onClick={() => {
            // Scroll to cart widget if present
            const el = document.querySelector('.cart-widget') as HTMLElement | null
            if (el) el.scrollIntoView({ behavior:'smooth', block:'start' })
            else navigate('/search')
          }}
          style={{ position:'relative' }}
        >
          🛒
          <span className="badge" aria-label={`Cart items ${getTotalItems()}`} style={{ position:'absolute', top:-6, right:-8 }}>
            {getTotalItems()}
          </span>
        </button>

        {/* Avatar with menu */}
        <div ref={menuRef} style={{ position:'relative' }}>
          <button
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="icon-button"
            onClick={() => setMenuOpen(v => !v)}
          >
            <ProfileAvatar size="small" />
          </button>
          {menuOpen && (
            <div role="menu" className="dropdown-menu" style={{ position:'absolute', right:0, top:'110%', background:'#fff', border:'1px solid var(--gray-200)', borderRadius:8, boxShadow:'0 6px 24px rgba(0,0,0,0.08)', minWidth:180, zIndex:10 }}>
              {!user ? (
                <button role="menuitem" className="dropdown-item" onClick={() => navigate('/login')}>Login / Register</button>
              ) : (
                <>
                  <button role="menuitem" className="dropdown-item" onClick={() => { navigate('/profile'); setMenuOpen(false) }}>Profile</button>
                  <button role="menuitem" className="dropdown-item" onClick={() => { logout(); setMenuOpen(false) }}>Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
