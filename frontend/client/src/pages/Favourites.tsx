import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFavourites } from '../contexts/FavouritesContext'

export default function Favourites() {
  const { user } = useAuth()
  const { ids } = useFavourites()

  return (
    <div className="page-container">
      <h1>Favourites</h1>
      {!user && (
        <div className="info-banner">You are browsing as a guest. Login to save and sync favourites across devices.</div>
      )}
      {ids.length === 0 ? (
        <p>You have no favourites yet.</p>
      ) : (
        <ul>
          {ids.map((id) => (
            <li key={id}>Item {id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
