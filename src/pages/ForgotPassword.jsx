import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9] flex items-center justify-center px-6">
      <div className="bg-[#F4ECDB] rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-semibold text-[#6B1E23]">Lupa Password</h1>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-[#2B2018]/80">
              Link reset password sudah dikirim ke <strong>{email}</strong>. Silakan cek email kamu (termasuk folder spam) dan klik link di dalamnya.
            </p>
            <Link to="/login" className="block text-center text-[#6B1E23] font-semibold hover:underline">
              Kembali ke Masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[#2B2018]/70">
              Masukkan email akun kamu, nanti kami kirimkan link untuk membuat password baru.
            </p>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-[#6B1E23] text-white rounded-lg py-3 font-semibold hover:bg-[#4A1418] disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
            <p className="text-sm text-center text-[#2B2018]/70">
              <Link to="/login" className="text-[#6B1E23] font-semibold">Kembali ke Masuk</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}