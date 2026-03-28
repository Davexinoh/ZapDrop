/**
 * pages/SendPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Step 1 → Connect (Privy social login)
 * Step 2 → Build the drop (handle + amount + meme)
 * Step 3 → Share the meme card claim link
 */

import React, { useState } from 'react'
import MemeCard from '../components/MemeCard'
import { MEME_TEMPLATES } from '../lib/memes'
import { encodeZapLink, buildClaimURL } from '../lib/zaplink'
import { useWallet } from '../hooks/useWallet'
import { useTransfer } from '../hooks/useTransfer'

/* ── Step pip ──────────────────────────────────────────────────── */
function Pip({ n, label, active, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width:          26, height: 26,
        borderRadius:   '50%',
        background:     done ? 'var(--orange)' : active ? 'var(--orange-glow)' : 'var(--bg-raised)',
        border:         `1.5px solid ${done ? 'var(--orange)' : active ? 'var(--border-orange)' : 'var(--border-default)'}`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '0.68rem',
        fontWeight:     700,
        fontFamily:     'var(--font-display)',
        color:          done ? '#fff' : active ? 'var(--orange)' : 'var(--text-500)',
        flexShrink:     0,
        transition:     'all 0.3s ease',
        boxShadow:      done ? '0 0 12px rgba(255,92,26,0.4)' : 'none',
      }}>
        {done ? '✓' : n}
      </div>
      <span style={{
        fontSize:   '0.78rem',
        fontFamily: 'var(--font-display)',
        fontWeight: active || done ? 600 : 400,
        color:      active || done ? 'var(--text-200)' : 'var(--text-500)',
        transition: 'color 0.3s ease',
      }}>
        {label}
      </span>
    </div>
  )
}

/* ── Error banner ──────────────────────────────────────────────── */
function ErrorBanner({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      background:    'rgba(239,68,68,0.07)',
      border:        '1px solid rgba(239,68,68,0.2)',
      borderRadius:  'var(--r-md)',
      padding:       '11px 15px',
      fontSize:      '0.83rem',
      color:         '#f87171',
      marginBottom:  14,
    }}>
      ⚠ {msg}
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function SendPage() {
  const {
    wallet, address, isConnected,
    login, isLoading: walletLoading, error: walletError,
  } = useWallet()

  const {
    send, txHash,
    isLoading: sendLoading, isSuccess, error: sendError,
  } = useTransfer()

  const [handle,   setHandle]   = useState('')
  const [amount,   setAmount]   = useState('')
  const [memeId,   setMemeId]   = useState(MEME_TEMPLATES[0].id)
  const [claimURL, setClaimURL] = useState(null)
  const [copied,   setCopied]   = useState(false)

  const isLoading = walletLoading || sendLoading
  const step      = !isConnected ? 1 : !isSuccess ? 2 : 3

  /* ── Send handler ── */
  const handleSend = async () => {
    const n = Number(amount)
    if (!handle.trim() || !amount || isNaN(n) || n <= 0) return

    // NOTE: In production, resolve X handle → Starknet address via
    // your own registry or a lookup service.
    // Demo uses ETH on Starknet Sepolia as placeholder recipient.
    const DEMO_TO = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'

    const hash = await send({ wallet, to: DEMO_TO, amount })
    if (!hash) return

    const encoded = encodeZapLink({ sender: address, handle, amount, memeId, txHash: hash })
    setClaimURL(buildClaimURL(encoded))
  }

  /* ── Copy ── */
  const copyLink = async () => {
    if (!claimURL) return
    await navigator.clipboard.writeText(claimURL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  /* ── Tweet ── */
  const tweet = () => {
    if (!claimURL) return
    const text = encodeURIComponent(
      `Hey @${handle} — I ZapDropped you some STRK ⚡\n\nClaim it here (Google login, no wallet needed) 👇\n\n${claimURL}\n\n@Starknet #Starkzap #ZapDrop`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Hero ── */}
      <div style={{
        textAlign:  'center',
        padding:    '56px 24px 44px',
        position:   'relative',
        zIndex:     1,
      }}>
        <div className="anim-fade-up stagger" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <span className="badge badge-orange">⚡ Built on Starkzap · Sepolia</span>

          <h1 style={{ fontSize: 'clamp(2rem,6vw,3rem)', maxWidth: 420 }}>
            Drop STRK<br />
            <span style={{
              background:        'linear-gradient(90deg, var(--orange) 0%, var(--orange-bright) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:    'text',
            }}>
              like a meme
            </span>
          </h1>

          <p style={{ maxWidth: 380, fontSize: '1rem' }}>
            Send STRK to any X user. They get a meme card.
            They claim with Google. No wallet. No gas. No friction.
          </p>

          {/* Stats row — mirrors Starknet's metric chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Gas fees', val: '$0.00' },
              { label: 'Wallet needed', val: 'Nope' },
              { label: 'Network', val: 'Starknet' },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background:    'var(--bg-surface)',
                border:        '1px solid var(--border-default)',
                borderRadius:  'var(--r-full)',
                padding:       '6px 16px',
                display:       'flex',
                alignItems:    'center',
                gap:           8,
                fontSize:      '0.78rem',
              }}>
                <span style={{ color: 'var(--text-400)' }}>{label}</span>
                <span style={{ color: 'var(--orange)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step tracker ── */}
      <div className="container" style={{ marginBottom: 24 }}>
        <div style={{
          background:    'var(--bg-surface)',
          border:        '1px solid var(--border-subtle)',
          borderRadius:  'var(--r-md)',
          padding:       '14px 20px',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
        }}>
          <Pip n={1} label="Connect"  active={step === 1} done={step > 1} />
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <Pip n={2} label="Zap it"   active={step === 2} done={step > 2} />
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <Pip n={3} label="Share"    active={step === 3} done={false} />
        </div>
      </div>

      {/* ════════════════════════════════
          STEP 1 — Connect
          ════════════════════════════════ */}
      {!isConnected && (
        <div className="container anim-scale-in">
          <div className="card card-glow" style={{ padding: '40px 32px', textAlign: 'center' }}>

            {/* Icon */}
            <div style={{
              width:         64, height: 64,
              borderRadius:  'var(--r-md)',
              background:    'linear-gradient(135deg,var(--orange),var(--orange-bright))',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              margin:        '0 auto 22px',
              boxShadow:     'var(--shadow-btn)',
            }}>
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                <path d="M16 4L9 15.5H14L12 24L20 12.5H15L16 4Z" fill="white" />
              </svg>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: 10 }}>Connect to ZapDrop</h2>
            <p style={{ marginBottom: 30, fontSize: '0.92rem', maxWidth: 300, margin: '0 auto 30px' }}>
              Sign in with Google — your Starknet wallet is auto-created. No seed phrase ever.
            </p>

            <ErrorBanner msg={walletError} />

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
                    Sign in with Google
                  </>
              }
            </button>

            {/* Trust line */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 22 }}>
              {['Powered by Privy', 'Gasless via AVNU', 'Starknet L2'].map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span style={{ color: 'var(--border-strong)', fontSize: '0.7rem' }}>·</span>}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-500)' }}>{t}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          STEP 2 — Build the drop
          ════════════════════════════════ */}
      {isConnected && !isSuccess && (
        <div className="container anim-scale-in">
          <div className="card" style={{ padding: '28px 24px' }}>

            {/* X Handle */}
            <div style={{ marginBottom: 20 }}>
              <label className="label">X / Twitter handle</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position:  'absolute',
                  left:      15,
                  top:       '50%',
                  transform: 'translateY(-50%)',
                  color:     'var(--text-400)',
                  fontWeight:500,
                  fontSize:  '0.95rem',
                  pointerEvents: 'none',
                }}>@</span>
                <input
                  className="input"
                  style={{ paddingLeft: 30 }}
                  placeholder="elonmusk"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.replace('@','').trim())}
                  maxLength={50}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 24 }}>
              <label className="label">Amount (STRK)</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type="number"
                  placeholder="10"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ paddingRight: 70 }}
                />
                <span style={{
                  position:      'absolute',
                  right:         15,
                  top:           '50%',
                  transform:     'translateY(-50%)',
                  color:         'var(--orange)',
                  fontFamily:    'var(--font-display)',
                  fontWeight:    700,
                  fontSize:      '0.85rem',
                  pointerEvents: 'none',
                }}>STRK</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-500)', marginTop: 6 }}>
                Recipient claims for free — AVNU covers gas.
              </p>
            </div>

            {/* Meme picker */}
            <div style={{ marginBottom: 24 }}>
              <label className="label">Pick your meme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {MEME_TEMPLATES.map((m) => {
                  const active = memeId === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMemeId(m.id)}
                      style={{
                        background:    active ? 'var(--orange-glow)' : 'var(--bg-raised)',
                        border:        `1px solid ${active ? 'var(--border-orange-bright)' : 'var(--border-default)'}`,
                        borderRadius:  'var(--r-md)',
                        padding:       '10px 12px',
                        cursor:        'pointer',
                        textAlign:     'left',
                        transition:    'all 0.18s ease',
                        outline:       'none',
                      }}
                    >
                      <div style={{ fontSize: '1.15rem', marginBottom: 3 }}>{m.emoji}</div>
                      <div style={{
                        fontSize:   '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color:      active ? 'var(--orange)' : 'var(--text-200)',
                        marginBottom: 2,
                      }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-400)' }}>{m.vibe}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Live meme card preview */}
            {handle && amount && (
              <div style={{ marginBottom: 22, animation: 'fadeIn 0.3s ease' }}>
                <label className="label" style={{ marginBottom: 10 }}>Preview</label>
                <MemeCard memeId={memeId} handle={handle} amount={amount} compact />
              </div>
            )}

            <ErrorBanner msg={sendError} />

            {/* CTA */}
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={isLoading || !handle.trim() || !amount || Number(amount) <= 0}
              style={{
                width:     '100%',
                padding:   '16px',
                fontSize:  '1rem',
                animation: isLoading ? 'zapPulse 1.5s ease infinite' : 'none',
              }}
            >
              {isLoading
                ? <><span className="spinner" /> Sending…</>
                : `⚡ ZapDrop @${handle || 'someone'}`
              }
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          STEP 3 — Share
          ════════════════════════════════ */}
      {isSuccess && claimURL && (
        <div className="container anim-scale-in">
          <div className="card card-glow" style={{ padding: '28px 24px' }}>

            {/* Success header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              {/* Animated checkmark */}
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ display: 'block', margin: '0 auto 14px' }}>
                <circle cx="26" cy="26" r="25" stroke="var(--orange)" strokeWidth="2" opacity="0.3" />
                <circle cx="26" cy="26" r="25" stroke="var(--orange)" strokeWidth="2"
                  strokeDasharray="157" strokeDashoffset="0"
                  style={{ animation: 'none' }} />
                <path d="M16 26L22 32L36 18" stroke="var(--orange)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="50"
                  style={{ animation: 'checkmark 0.5s 0.1s ease forwards', strokeDashoffset: 50 }} />
              </svg>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>ZapDrop sent! ⚡</h2>
              <p style={{ fontSize: '0.88rem' }}>
                @{handle} can claim their STRK with just a Google login.
              </p>
            </div>

            {/* Full meme card */}
            <div style={{ marginBottom: 22 }}>
              <MemeCard memeId={memeId} handle={handle} amount={amount} />
            </div>

            {/* Claim URL box */}
            <div style={{
              background:    'var(--bg-raised)',
              border:        '1px solid var(--border-default)',
              borderRadius:  'var(--r-md)',
              padding:       '12px 14px',
              display:       'flex',
              alignItems:    'center',
              gap:           10,
              marginBottom:  12,
            }}>
              <span style={{
                flex:          1,
                fontSize:      '0.76rem',
                color:         'var(--text-400)',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                whiteSpace:    'nowrap',
                fontFamily:    'var(--font-body)',
              }}>
                {claimURL}
              </span>
              <button
                className="btn btn-outline"
                onClick={copyLink}
                style={{ padding: '6px 14px', fontSize: '0.76rem', flexShrink: 0 }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* Post on X */}
            <button
              className="btn btn-primary"
              onClick={tweet}
              style={{ width: '100%', padding: '15px', fontSize: '0.95rem', marginBottom: 14 }}
            >
              {/* X logo */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Post on X
            </button>

            {/* Tx link */}
            {txHash && (
              <p style={{ textAlign: 'center', fontSize: '0.71rem', color: 'var(--text-500)' }}>
                Tx:{' '}
                <a
                  href={`https://sepolia.starkscan.co/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--orange)' }}
                >
                  {txHash.slice(0, 10)}…{txHash.slice(-6)}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
            }
      
