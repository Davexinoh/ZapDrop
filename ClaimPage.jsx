/**
 * pages/ClaimPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * The page a recipient lands on after clicking a ZapDrop link.
 * URL: /claim?d=<base64encoded_payload>
 *
 * Flow:
 *   1. Decode ?d param → { sender, handle, amount, memeId, txHash }
 *   2. Show meme card + prompt Google login
 *   3. After login, auto-receive STRK (already sent by sender)
 *   4. Show confetti + success screen
 */

import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import MemeCard from '../components/MemeCard'
import Confetti from '../components/Confetti'
import { decodeZapLink, shortAddr, fmtSTRK } from '../lib/zaplink'
import { EXPLORER } from '../lib/starkzap'
import { useWallet } from '../hooks/useWallet'

/* ── Small info row ────────────────────────────────────────────── */
function InfoRow({ label, value, mono = false }) {
  return (
    <div style={{
      display:       'flex',
      justifyContent:'space-between',
      alignItems:    'center',
      padding:       '11px 0',
      borderBottom:  '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>{label}</span>
      <span style={{
        fontSize:    '0.82rem',
        color:       'var(--text-200)',
        fontWeight:  500,
        fontFamily:  mono ? 'monospace' : 'var(--font-body)',
        letterSpacing: mono ? '0.01em' : 'normal',
      }}>
        {value}
      </span>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function ClaimPage() {
  const [params]                    = useSearchParams()
  const [drop,       setDrop]       = useState(null)
  const [invalid,    setInvalid]    = useState(false)
  const [claimed,    setClaimed]    = useState(false)
  const [showConf,   setShowConf]   = useState(false)

  const { address, isConnected, login, isLoading, error: walletError } = useWallet()

  /* ── Decode link on mount ── */
  useEffect(() => {
    const encoded = params.get('d')
    if (!encoded) { setInvalid(true); return }
    const payload = decodeZapLink(encoded)
    if (!payload) { setInvalid(true); return }
    setDrop(payload)
  }, [params])

  /* ── After login, mark claimed + confetti ── */
  useEffect(() => {
    if (isConnected && drop && !claimed) {
      // The STRK was already transferred by the sender.
      // Login auto-deploys the recipient's wallet and makes it accessible.
      // In a full implementation you'd verify receipt via SDK here.
      setClaimed(true)
      setShowConf(true)
      setTimeout(() => setShowConf(false), 4000)
    }
  }, [isConnected, drop, claimed])

  /* ── Invalid link ── */
  if (invalid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔗</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 10 }}>Invalid ZapDrop link</h2>
            <p style={{ marginBottom: 28, fontSize: '0.9rem' }}>
              This link is broken or has expired. Ask the sender to generate a new one.
            </p>
            <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', padding: '13px 28px', fontSize: '0.9rem' }}>
              ⚡ Send a ZapDrop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Loading decode ── */
  if (!drop) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    )
  }

  const { sender, handle, amount, memeId, txHash, createdAt } = drop
  const droppedAt = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <>
      {showConf && <Confetti count={56} />}

      <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

        {/* ── Hero text ── */}
        <div style={{
          textAlign:  'center',
          padding:    '52px 24px 36px',
          position:   'relative',
          zIndex:     1,
        }}>
          <div className="anim-fade-up stagger" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span className="badge badge-orange">⚡ You got ZapDropped</span>

            <h1 style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)' }}>
              {claimed
                ? <>STRK claimed! 🎉</>
                : <>@{handle}, someone<br />
                    <span style={{
                      background:        'linear-gradient(90deg,var(--orange),var(--orange-bright))',
                      WebkitBackgroundClip:'text',
                      WebkitTextFillColor:'transparent',
                      backgroundClip:    'text',
                    }}>
                      zapped you
                    </span>
                  </>
              }
            </h1>

            <p style={{ maxWidth: 340, fontSize: '0.95rem' }}>
              {claimed
                ? `${fmtSTRK(amount)} STRK is now in your wallet. Welcome to Starknet.`
                : `${fmtSTRK(amount)} STRK is waiting for you. Claim it with Google — no wallet needed.`
              }
            </p>
          </div>
        </div>

        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Meme card ── */}
          <div className="anim-fade-up" style={{ animationDelay: '80ms' }}>
            <MemeCard memeId={memeId} handle={handle} amount={amount} />
          </div>

          {/* ── Drop details card ── */}
          <div className="card anim-fade-up" style={{ padding: '4px 20px 8px', animationDelay: '160ms' }}>
            <InfoRow label="Amount"     value={`${fmtSTRK(amount)} STRK`} />
            <InfoRow label="From"       value={shortAddr(sender)} mono />
            <InfoRow label="Dropped on" value={droppedAt} />
            {txHash && (
              <div style={{
                display:       'flex',
                justifyContent:'space-between',
                alignItems:    'center',
                padding:       '11px 0',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Transaction</span>
                <a
                  href={`${EXPLORER}/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize:   '0.78rem',
                    color:      'var(--orange)',
                    fontFamily: 'monospace',
                  }}
                >
                  {txHash.slice(0, 10)}…{txHash.slice(-6)} ↗
                </a>
              </div>
            )}
          </div>

          {/* ════════════════════════════════
              Pre-claim: prompt login
              ════════════════════════════════ */}
          {!claimed && (
            <div className="card card-glow anim-fade-up" style={{ padding: '28px 24px', animationDelay: '240ms' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Claim your STRK</h3>
              <p style={{ fontSize: '0.88rem', marginBottom: 24 }}>
                Sign in with Google to auto-create your Starknet wallet
                and receive your STRK. Takes 10 seconds. Costs nothing.
              </p>

              {walletError && (
                <div style={{
                  background: 'rgba(239,68,68,0.07)',
                  border:     '1px solid rgba(239,68,68,0.2)',
                  borderRadius:'var(--r-md)',
                  padding:    '10px 14px',
                  fontSize:   '0.82rem',
                  color:      '#f87171',
                  marginBottom:14,
                }}>
                  ⚠ {walletError}
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={login}
                disabled={isLoading}
                style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
              >
                {isLoading
                  ? <><span className="spinner" /> Connecting…</>
                  : <>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM7.5 12.75L3.75 9L4.8075 7.9425L7.5 10.6275L13.1925 4.935L14.25 6L7.5 12.75Z" fill="white"/>
                      </svg>
                      Claim with Google
                    </>
                }
              </button>

              {/* Trust row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 18 }}>
                {['No wallet needed', 'Powered by Privy', 'Gasless claim'].map((t, i) => (
                  <React.Fragment key={t}>
                    {i > 0 && <span style={{ color: 'var(--border-strong)', fontSize: '0.65rem' }}>·</span>}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-500)' }}>{t}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              Post-claim: success state
              ════════════════════════════════ */}
          {claimed && (
            <div className="card card-glow anim-scale-in" style={{ padding: '28px 24px', textAlign: 'center' }}>

              {/* Checkmark */}
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ display: 'block', margin: '0 auto 16px' }}>
                <circle cx="28" cy="28" r="27" stroke="var(--orange)" strokeWidth="2" opacity="0.25" />
                <path d="M18 28L24 34L38 20"
                  stroke="var(--orange)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="52"
                  style={{ animation: 'checkmark 0.55s 0.05s ease forwards', strokeDashoffset: 52 }}
                />
              </svg>

              <h3 style={{ fontSize: '1.3rem', marginBottom: 8 }}>
                {fmtSTRK(amount)} STRK claimed 🔥
              </h3>
              <p style={{ fontSize: '0.88rem', marginBottom: 26 }}>
                Your wallet address:{' '}
                <span style={{ color: 'var(--orange)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                  {shortAddr(address)}
                </span>
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a
                  href={`${EXPLORER}/contract/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.88rem', padding: '12px' }}
                >
                  View wallet on Starkscan ↗
                </a>
                <Link
                  to="/"
                  className="btn btn-primary"
                  style={{ fontSize: '0.88rem', padding: '12px' }}
                >
                  ⚡ Send a ZapDrop
                </Link>
              </div>

              {/* Social nudge */}
              <button
                className="btn btn-ghost"
                onClick={() => {
                  const t = encodeURIComponent(`Just claimed ${fmtSTRK(amount)} STRK via @ZapDrop on @Starknet ⚡\n\nNo wallet needed. Just Google login. This is the future.\n\n#Starkzap #Starknet`)
                  window.open(`https://twitter.com/intent/tweet?text=${t}`, '_blank')
                }}
                style={{ marginTop: 10, width: '100%', fontSize: '0.85rem', padding: '11px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Flex on X
              </button>
            </div>
          )}

          {/* ── Send one yourself ── */}
          {!claimed && (
            <div style={{ textAlign: 'center', paddingTop: 8, animation: 'fadeIn 0.4s 0.4s ease both' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-500)' }}>
                Want to ZapDrop someone?{' '}
                <Link to="/" style={{ color: 'var(--orange)' }}>Send STRK →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
