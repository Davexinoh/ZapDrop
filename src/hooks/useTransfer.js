/**
 * hooks/useTransfer.js
 * ─────────────────────────────────────────────────────────────────
 * Starkzap v1 STRK transfer.
 * Uses wallet.transfer() with Amount.parse() — correct v1 API.
 * Gasless via AVNU Paymaster (feeMode: "sponsored").
 */

import { useState, useCallback } from 'react'
import { Amount, fromAddress, STRK } from '../lib/starkzap'

export function useTransfer() {
  const [txHash,    setTxHash]    = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error,     setError]     = useState(null)

  /**
   * send({ wallet, to: '0x...', amount: '5' })
   * wallet  — the wallet object returned from useWallet
   * to      — recipient Starknet address
   * amount  — human-readable STRK string e.g. "5"
   */
  const send = useCallback(async ({ wallet, to, amount }) => {
    if (!wallet)  { setError('Wallet not connected'); return null }
    if (!to)      { setError('Missing recipient address'); return null }
    if (!amount)  { setError('Missing amount'); return null }

    setIsLoading(true)
    setIsSuccess(false)
    setError(null)
    setTxHash(null)

    try {
      const tx = await wallet.transfer(
        STRK,
        [{ to: fromAddress(to), amount: Amount.parse(amount, STRK) }],
        { feeMode: 'sponsored' }  // gasless via AVNU Paymaster
      )

      await tx.wait()

      setTxHash(tx.hash)
      setIsSuccess(true)
      return tx.hash
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
