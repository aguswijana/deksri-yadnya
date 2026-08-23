import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Password tidak cocok, coba periksa lagi.')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9] flex items-center justify-center px-6">
      <div className="bg-[#F4ECDB] rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-semibold text-[#6B1E23]">Buat Password Baru</h1>

        {success ? (
          <p className="text-sm text-green-700">
            Password berhasil diubah! Mengarahkan ke halaman masuk...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <input
              required
              type="password"
              placeholder="Password Baru"
              className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Ulangi Password Baru"
              className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-[#6B1E23] text-white rounded-lg py-3 font-semibold hover:bg-[#4A1418] disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}