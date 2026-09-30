import React from 'react'
import { Outlet } from 'react-router-dom'
import GlobalHeader from './components/GlobalHeader'

export default function App() {
  return (
    <div className="app">
      <GlobalHeader />
      <main id="main-content"><Outlet /></main>
      <footer className="nd-footer"><div><strong>ndlela /</strong><p>Find your way. Make it a story.</p></div><nav aria-label="Footer"><a href="/browse">Discover provinces</a><a href="/operator">For local businesses</a><a href="/enquiries">My enquiries</a><a href="/planner">Plan a weekend</a></nav><small>Made for the journey. Made for South Africa.</small></footer>
    </div>
  )
}
