import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFavourites } from "../contexts/FavouritesContext";
export default function GlobalHeader() {
  const { user, logout } = useAuth(),
    { count } = useFavourites(),
    [lowData, setLowData] = useState(
      localStorage.getItem("ndlela_low_data") === "true",
    );
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="nd-header">
        <Link className="nd-brand" to="/">
          ndlela<span> / find your way</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/search">Explore</NavLink>
          <NavLink to="/planner">Plan a weekend</NavLink>
          <NavLink to="/favourites">Saved {count > 0 && `(${count})`}</NavLink>
          <NavLink to="/trips">My trips</NavLink>
        </nav>
        <div className="header-actions">
          <label className="data-toggle">
            <input
              type="checkbox"
              checked={lowData}
              onChange={(e) => {
                localStorage.setItem(
                  "ndlela_low_data",
                  String(e.target.checked),
                );
                setLowData(e.target.checked);
                window.location.reload();
              }}
            />
            Low data
          </label>
          {user ? (
            <>
              <Link className="account-link" to="/profile">
                {user.name.split(" ")[0]}
              </Link>
              <button className="text-link" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <Link className="nd-button outline" to="/login">
              Sign in ↗
            </Link>
          )}
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavLink to="/search">
          ⌕<span>Explore</span>
        </NavLink>
        <NavLink to="/favourites">
          ♡<span>Saved</span>
        </NavLink>
        <NavLink to="/trips">
          ↗<span>Trips</span>
        </NavLink>
        <NavLink to={user ? "/profile" : "/login"}>
          ◎<span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
}
