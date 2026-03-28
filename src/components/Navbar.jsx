import React from 'react'
import { Link } from 'react-router-dom'
import { shortAddr } from '../lib/zaplink'

export default function Navbar({ address, onLogin, onLogout, isLoading }) {
  return (
    <nav style={{
      position:             'sticky',
      top:                  0,
      zIndex:               200,
      borderBottom:         '1px solid rgba(255,77,0,0.12)',
      background:           'rgba(8,8,15,0.82)',
      backdropFilter:       'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      {/* Orange glow line at very top */}
      <div style={{
        position:   'absolute',
        top:        0, left: 0, right: 0,
        height:     '1px',
        background: 'linear-gradient(90deg,transparent,rgba(255,107,0,0.6),rgba(255,184,0,0.4),transparent)',
      }}/>

      <div style={{
        maxWidth:       960,
        margin:         '0 auto',
        padding:        '0 24px',
        height:         62,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          {/* Flame+lightning circle logo */}
          <div style={{
            width:        36,
            height:       36,
            borderRadius: '50%',
            overflow:     'hidden',
            flexShrink:   0,
            boxShadow:    '0 0 16px rgba(255,100,0,0.5), 0 0 4px rgba(255,180,0,0.3)',
            border:       '1px solid rgba(255,120,0,0.35)',
          }}>
            <img src="/ZapDrop/logo.svg" alt="ZapDrop" width={36} height={36} style={{ display:'block' }} />
          </div>

          {/* Wordmark */}
          <span style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      '1.15rem',
            letterSpacing: '-0.025em',
            color:         'var(--text-100)',
          }}>
            Zap<span style={{
              background:             'linear-gradient(135deg,#FF4D00,#FFB800)',
              WebkitBackgroundClip:   'text',
              WebkitTextFillColor:    'transparent',
              backgroundClip:         'text',
            }}>Drop</span>
          </span>

          {/* Sepolia pill */}
          <span style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '0.58rem',
            fontWeight:    700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color:         '#FF8C00',
            background:    'rgba(255,77,0,0.10)',
            border:        '1px solid rgba(255,77,0,0.25)',
            borderRadius:  'var(--r-full)',
            padding:       '2px 8px',
          }}>
            Sepolia
          </span>
        </Link>

        {/* ── Right side ── */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {address ? (
            <>
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          7,
                background:   'var(--bg-raised)',
                border:       '1px solid var(--border-2)',
                borderRadius: 'var(--r-full)',
                padding:      '5px 13px 5px 8px',
              }}>
                <span style={{
                  width:        7, height: 7,
                  borderRadius: '50%',
                  background:   '#34d399',
                  boxShadow:    '0 0 8px #34d399',
                  flexShrink:   0,
                }}/>
                <span style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.78rem',
                  color:         'var(--text-300)',
                  letterSpacing: '0.01em',
                }}>
                  {shortAddr(address)}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={onLogout}
                style={{ fontSize:'0.78rem', padding:'7px 14px' }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onLogin}
              disabled={isLoading}
              style={{ fontSize:'0.85rem', padding:'9px 22px' }}
            >
              {isLoading
                ? <span className="spinner" style={{ width:16, height:16 }}/>
                : 'Connect'
              }
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
