/**
 * lib/starkzap.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for Starkzap v1.0.0 SDK.
 *
 * v1 API (correct):
 *   sdk.onboard({ strategy, account, deploy })  → { wallet }
 *   wallet.transfer(token, [{ to, amount }])     → tx
 *   await tx.wait()
 *   Amount.parse("10", STRK)
 *   fromAddress("0x...")
 */

import {
  StarkZap,
  StarkSigner,
  OnboardStrategy,
  Amount,
  fromAddress,
  sepoliaTokens,
} from 'starkzap'

const NETWORK = import.meta.env.VITE_NETWORK || 'sepolia'

let _sdk = null

export function getSDK() {
  if (_sdk) return _sdk
  _sdk = new StarkZap({ network: NETWORK })
  return _sdk
}

// Re-export everything components need
export {
  StarkSigner,
  OnboardStrategy,
  Amount,
  fromAddress,
  sepoliaTokens,
}

export const STRK        = sepoliaTokens.STRK
export const EXPLORER    = 'https://sepolia.starkscan.co'
