import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9] flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="bg-[#F4ECDB] rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-semibold text-[#6B1E23]">Masuk</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input required type="email" placeholder="Email" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <p className="text-sm text-right">
          <Link to="/lupa-password" className="text-[#6B1E23] hover:underline">Lupa password?</Link>
        </p>

        <button disabled={loading} className="w-full bg-[#6B1E23] text-white rounded-lg py-3 font-semibold hover:bg-[#4A1418] disabled:opacity-50">
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
        <p className="text-sm text-center text-[#2B2018]/70">
          Belum punya akun? <Link to="/register" className="text-[#6B1E23] font-semibold">Daftar</Link>
        </p>
      </form>
    </div>
  )
}