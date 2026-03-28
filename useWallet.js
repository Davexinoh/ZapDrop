/**
 * hooks/useWallet.js
 * ─────────────────────────────────────────────────────────────────
 * Wraps Starkzap social login (Privy).
 * Returns address, login, logout, isConnected, isLoading, error.
 */

import { useState, useCallback } from 'react'
import { getSDK } from '../lib/starkzap'

export function useWallet() {
  const [address,   setAddress]   = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const sdk    = getSDK()
      const wallet = await sdk.login()   // Privy social login modal
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

  const logout = useCallback(async () => {
    try {
      await getSDK().logout()
      setAddress(null)
    } catch (err) {
      console.error('[useWallet] logout:', err)
    }
  }, [])

  return {
    address,
    isConnected: Boolean(address),
    isLoading,
    error,
    login,
    logout,
  }
}
