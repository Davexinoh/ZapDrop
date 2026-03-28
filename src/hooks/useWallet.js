/**
 * hooks/useWallet.js
 * ─────────────────────────────────────────────────────────────────
 * Starkzap v1 wallet onboarding via Cartridge Controller.
 * Cartridge = social login (Google/email/passkey) fully client-side.
 * No server needed. No seed phrase exposed.
 *
 * Returns { wallet, address, isConnected, isLoading, error, login, logout }
 */

import { useState, useCallback, useRef } from 'react'
import { getSDK, OnboardStrategy } from '../lib/starkzap'

export function useWallet() {
  const [address,   setAddress]   = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)
  const walletRef                 = useRef(null)

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const sdk = getSDK()

      // Cartridge Controller — fully client-side social login
      // Opens Cartridge popup → user signs in with Google/email/passkey
      const { wallet } = await sdk.onboard({
        strategy: OnboardStrategy.Cartridge,
        deploy:   'if_needed',
      })

      walletRef.current = wallet
      setAddress(wallet.address)
      return wallet
    } catch (err) {
      console.error('[useWallet] login:', err)
      setError(err?.message ?? 'Login failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    walletRef.current = null
    setAddress(null)
    setError(null)
  }, [])

  return {
    wallet:      walletRef.current,
    address,
    isConnected: Boolean(address),
    isLoading,
    error,
    login,
    logout,
  }
}
