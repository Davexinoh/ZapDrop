/**
 * lib/zaplink.js
 * ─────────────────────────────────────────────────────────────────
 * Encodes ZapDrop metadata into a shareable claim URL.
 *
 * Payload:  { sender, handle, amount, memeId, txHash, createdAt }
 * Encoding: base64(JSON) → URL param ?d=<encoded>
 */

export function encodeZapLink({ sender, handle, amount, memeId, txHash }) {
  const payload = {
    sender,
    handle,
    amount:    String(amount),
    memeId,
    txHash,
    createdAt: Date.now(),
  }
  return btoa(encodeURIComponent(JSON.stringify(payload)))
}

export function decodeZapLink(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}

export function buildClaimURL(encoded) {
  const origin = import.meta.env.VITE_APP_URL ?? window.location.origin
  return `${origin}/claim?d=${encoded}`
}

/** 0x1a2b3c4d…ef56 */
export function shortAddr(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

/** Format STRK with up to 4 decimals, strip trailing zeros */
export function fmtSTRK(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '0'
  return n % 1 === 0 ? String(n) : n.toFixed(4).replace(/\.?0+$/, '')
}
