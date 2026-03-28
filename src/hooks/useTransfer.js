/**
 * hooks/useTransfer.js
 * ─────────────────────────────────────────────────────────────────
 * Wraps Starkzap gasless STRK transfer via AVNU Paymaster.
 * Sender pays no gas. Recipient pays no gas.
 */

import { useState, useCallback } from 'react'
import { getSDK, STRK_TOKEN } from '../lib/starkzap'

export function useTransfer() {
  const [txHash,    setTxHash]    = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error,     setError]     = useState(null)

  /**
   * send({ to: '0x...starknet_address', amount: '5' })
   * amount → human-readable STRK (e.g. '5' = 5 STRK)
   */
  const send = useCallback(async ({ to, amount }) => {
    if (!to || !amount) { setError('Missing recipient or amount'); return null }

    setIsLoading(true)
    setIsSuccess(false)
    setError(null)
    setTxHash(null)

    try {
      const sdk  = getSDK()
      const hash = await sdk.transfer({
        token:   STRK_TOKEN,
        to,
        amount:  String(amount),
        gasless: true,   // AVNU Paymaster — no ETH required
      })
      setTxHash(hash)
      setIsSuccess(true)
      return hash
    } catch (err) {
      console.error('[useTransfer] send:', err)
      setError(err?.message ?? 'Transfer failed. Check balance and try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setTxHash(null)
    setIsLoading(false)
    setIsSuccess(false)
    setError(null)
  }, [])

  return { send, txHash, isLoading, isSuccess, error, reset }
}
