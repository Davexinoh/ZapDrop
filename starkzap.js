/**
 * lib/starkzap.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for Starkzap SDK.
 * Every file in the app imports from here — never from 'starkzap' directly.
 * This ensures the SDK is initialised exactly once.
 */

import { StarkZap, sepoliaTokens } from 'starkzap'

const NETWORK = import.meta.env.VITE_NETWORK || 'sepolia'

let _sdk = null

export function getSDK() {
  if (_sdk) return _sdk
  _sdk = new StarkZap({
    network:    NETWORK,
    privyAppId: import.meta.env.VITE_PRIVY_APP_ID,
  })
  return _sdk
}

// Token constants — never hardcode token addresses elsewhere
export { sepoliaTokens }
export const STRK_TOKEN = sepoliaTokens?.STRK ?? 'STRK'

// Starkscan explorer base
export const EXPLORER = 'https://sepolia.starkscan.co'
