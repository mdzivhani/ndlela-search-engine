import React from 'react'
import ProfileAvatar from './ProfileAvatar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function GlobalHeader() {
  const { user } = useAuth()
  return (
    <header className="global-header" style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--gray-200)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div className="header-left" style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <Link to="/" style={{ textDecoration:'none', color:'var(--primary-color)', fontWeight:600, fontSize:'1.1rem' }}>Ndlela</Link>
      </div>
      <div className="header-right" style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <ProfileAvatar size="small" />
        <span className="header-username" style={{ fontSize:'0.875rem', fontWeight:500 }}>{user?.name || 'Guest'}</span>
      </div>
    </header>
  )
}
