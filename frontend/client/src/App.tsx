import React from 'react'
import { Outlet } from 'react-router-dom'
import GlobalHeader from './components/GlobalHeader'

export default function App() {
  return (
    <div className="app">
      <GlobalHeader />
      <Outlet />
    </div>
  )
}
