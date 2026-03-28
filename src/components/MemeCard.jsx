/**
 * components/MemeCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Renders the ZapDrop meme card.
 * Uses html2canvas for PNG export — no server, no cost.
 *
 * Props:
 *   memeId   — template id from lib/memes.js
 *   handle   — recipient X handle (without @)
 *   amount   — STRK amount string
 *   compact  — smaller variant for form preview
 */

import React, { useRef } from 'react'
import html2canvas from 'html2canvas'
import { getMemeById } from '../lib/memes'
import { fmtSTRK } from '../lib/zaplink'

export default function MemeCard({ memeId, handle, amount, compact = false }) {
  const ref  = useRef(null)
  const meme = getMemeById(memeId)
  const amt  = fmtSTRK(amount)

  const download = async () => {
    if (!ref.current) return
    try {
      const canvas = await html2canvas(ref.current, {
        scale:           2,
        backgroundColor: null,
        useCORS:         true,
        logging:         false,
      })
      const a       = document.createElement('a')
      a.download    = `zapdrop-${handle}.png`
      a.href        = canvas.toDataURL('image/png')
      a.click()
    } catch (e) {
      console.error('[MemeCard] export failed:', e)
    }
  }

  const pad  = compact ? '20px 18px' : '28px 24px'
  const size = compact ? '1.8rem'    : '2.8rem'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Card ── */}
      <div
        ref={ref}
        style={{
          background:    meme.bg,
          borderRadius:  'var(--r-lg)',
          border:        `1px solid ${meme.accent}40`,
          padding:       pad,
          position:      'relative',
          overflow:      'hidden',
          aspectRatio:   '16 / 9',
          display:       'flex',
          flexDirection: 'column',
          justifyContent:'space-between',
          boxShadow:     `0 0 48px ${meme.accent}1a, 0 4px 24px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Glow — top right */}
        <div style={{
          position:     'absolute',
          top: -80, right: -80,
          width: 220, height: 220,
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${meme.accent}35 0%, transparent 70%)`,
          pointerEvents:'none',
        }} />

        {/* Glow — bottom left */}
        <div style={{
          position:     'absolute',
          bottom: -60, left: -60,
          width: 160, height: 160,
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${meme.accent}20 0%, transparent 70%)`,
          pointerEvents:'none',
        }} />

        {/* Top label */}
        <p style={{
          fontFamily:    'var(--font-display)',
          fontWeight:    700,
          fontSize:      compact ? '0.6rem' : '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         meme.accent,
          opacity:       0.9,
        }}>
          {meme.topText}
        </p>

        {/* Amount — centre stage */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      size,
            color:         '#fff',
            lineHeight:    1,
            letterSpacing: '-0.03em',
            textShadow:    `0 0 40px ${meme.accent}90`,
          }}>
            {amt}{' '}
            <span style={{ color: meme.accent }}>STRK</span>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   compact ? '0.62rem' : '0.78rem',
            color:      'rgba(255,255,255,0.4)',
            marginTop:  5,
          }}>
            for @{handle || 'you'}
          </p>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <p style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    700,
            fontSize:      compact ? '0.58rem' : '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         meme.accent,
            opacity:       0.8,
          }}>
            {meme.bottomText}
          </p>
          {/* Brand mark */}
          <p style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    800,
            fontSize:      compact ? '0.55rem' : '0.65rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.22)',
          }}>
            ⚡ ZapDrop
          </p>
        </div>
      </div>

      {/* ── Download — full view only ── */}
      {!compact && (
        <button
          className="btn btn-ghost"
          onClick={download}
          style={{ fontSize: '0.82rem', padding: '9px 18px', alignSelf: 'flex-start' }}
        >
          ↓ Save as image
        </button>
      )}
    </div>
  )
}
