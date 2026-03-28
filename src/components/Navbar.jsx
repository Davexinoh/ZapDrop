/**
 * components/Navbar.jsx
 * ─────────────────────────────────────────────────────────────────
 * Starknet-style sticky nav — blur backdrop, orange accent, Syne type.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { shortAddr } from '../lib/zaplink'

export default function Navbar({ address, onLogin, onLogout, isLoading }) {
  return (
    <nav style={{
      position:       'sticky',
      top:            0,
      zIndex:         200,
      borderBottom:   '1px solid var(--border-subtle)',
      background:     'rgba(9,9,15,0.80)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth:       960,
        margin:         '0 auto',
        padding:        '0 24px',
        height:         60,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Lightning icon — SVG so no hosting needed */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#navgrad)" />
            <path d="M16 4L9 15.5H14L12 24L20 12.5H15L16 4Z" fill="white" />
            <defs>
              <linearGradient id="navgrad" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#FF5C1A" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      '1.1rem',
            color:         'var(--text-100)',
            letterSpacing: '-0.02em',
          }}>
            Zap<span style={{ color: 'var(--orange)' }}>Drop</span>
          </span>
          {/* Testnet pill */}
          <span style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '0.6rem',
            fontWeight:    700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color:         'var(--orange-bright)',
            background:    'var(--orange-glow)',
            border:        '1px solid var(--border-orange)',
            borderRadius:  'var(--r-full)',
            padding:       '2px 8px',
          }}>
            Sepolia
          </span>
        </Link>

        {/* ── Right ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {address ? (
            <>
              {/* Address chip */}
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          6,
                background:   'var(--bg-raised)',
                border:       '1px solid var(--border-default)',
                borderRadius: 'var(--r-full)',
                padding:      '5px 12px 5px 8px',
              }}>
                {/* Green dot */}
                <span style={{
                  width: 7, height: 7,
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 6px #34d399',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '0.78rem',
                  color:      'var(--text-300)',
                  letterSpacing: '0.01em',
                }}>
                  {shortAddr(address)}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={onLogout}
                style={{ fontSize: '0.78rem', padding: '7px 14px' }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onLogin}
              disabled={isLoading}
              style={{ fontSize: '0.85rem', padding: '9px 22px' }}
            >
              {isLoading
                ? <span className="spinner" style={{ width: 16, height: 16 }} />
                : 'Connect'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
