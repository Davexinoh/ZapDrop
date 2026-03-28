/**
 * components/Confetti.jsx
 * ─────────────────────────────────────────────────────────────────
 * Lightweight pure-CSS confetti. No canvas, no library.
 * Colours are ZapDrop brand palette.
 */

import React, { useMemo } from 'react'

const COLORS = [
  '#FF5C1A', '#FF8C00', '#34d399',
  '#c084fc', '#22d3ee', '#ffffff',
  '#facc15', '#f472b6',
]

export default function Confetti({ count = 48 }) {
  const pieces = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id:     i,
      color:  COLORS[i % COLORS.length],
      left:   Math.random() * 100,
      delay:  Math.random() * 1.8,
      dur:    2.2 + Math.random() * 2,
      size:   5 + Math.random() * 9,
      rotate: Math.random() * 360,
      isRect: Math.random() > 0.5,
    }))
  , [count])

  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      pointerEvents: 'none',
      zIndex:        999,
      overflow:      'hidden',
    }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position:     'absolute',
            top:          '-16px',
            left:         `${p.left}%`,
            width:        p.size,
            height:       p.isRect ? p.size * 0.4 : p.size,
            background:   p.color,
            borderRadius: p.isRect ? '1px' : '50%',
            transform:    `rotate(${p.rotate}deg)`,
            animation:    `confetti ${p.dur}s ${p.delay}s ease-in forwards`,
            opacity:      0.9,
          }}
        />
      ))}
    </div>
  )
}
