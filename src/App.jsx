/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * Root component. Owns wallet state, renders ambient BG + navbar,
 * routes between SendPage and ClaimPage.
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar    from './components/Navbar'
import SendPage  from './pages/SendPage'
import ClaimPage from './pages/ClaimPage'
import { useWallet } from './hooks/useWallet'

export default function App() {
  const { address, isConnected, login, logout, isLoading } = useWallet()

  return (
    <>
      {/* ── Starknet-style ambient corner glow ── */}
      <div className="ambient" aria-hidden="true" />

      {/* ── Grid dot background ── */}
      <div className="grid-bg" aria-hidden="true" />

      {/* ── Navigation ── */}
      <Navbar
        address={address}
        onLogin={login}
        onLogout={logout}
        isLoading={isLoading}
      />

      {/* ── Routes ── */}
      <Routes>
        <Route path="/"      element={<SendPage  />} />
        <Route path="/claim" element={<ClaimPage />} />
        {/* Fallback */}
        <Route path="*"      element={
          <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <h2 style={{ fontSize: '1.5rem' }}>404 — Page not found</h2>
            <a href="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>Go home</a>
          </div>
        } />
      </Routes>

      {/* ── Footer ── */}
      <footer style={{
        borderTop:  '1px solid var(--border-subtle)',
        padding:    '20px 24px',
        textAlign:  'center',
        position:   'relative',
        zIndex:     1,
        marginTop:  'auto',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-500)' }}>
          Built with{' '}
          <a href="https://starkzap.com" target="_blank" rel="noreferrer">Starkzap</a>
          {' '}·{' '}
          <a href="https://starknet.io" target="_blank" rel="noreferrer">Starknet</a>
          {' '}·{' '}
          <span style={{ color: 'var(--text-500)' }}>Sepolia Testnet</span>
        </p>
      </footer>
    </>
  )
}
