import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    const cleanUsername = form.username.trim().toLowerCase().replace(/\s+/g, '')

    if (cleanUsername.length < 3) {
      setError('Nama untuk login minimal 3 karakter, tanpa spasi.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)

    // Cek apakah username sudah dipakai
    const { data: existing } = await supabase
      .from('auth_lookup')
      .select('username')
      .eq('username', cleanUsername)
      .maybeSingle()

    if (existing) {
      setError('Nama untuk login ini sudah dipakai, coba yang lain.')
      setLoading(false)
      return
    }

    const internalEmail = `${cleanUsername}@deksriyadnya.local`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: internalEmail,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Simpan pemetaan username -> email internal
    const { error: lookupError } = await supabase
      .from('auth_lookup')
      .insert({ username: cleanUsername, login_email: internalEmail })

    if (lookupError) {
      setError('Gagal menyimpan username: ' + lookupError.message)
      setLoading(false)
      return
    }

    // Simpan nomor HP di profile
    if (data.user) {
      await supabase.from('profiles').update({ phone: form.phone }).eq('id', data.user.id)
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9] flex items-center justify-center px-6">
      <form onSubmit={handleRegister} className="bg-[#F4ECDB] rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-semibold text-[#6B1E23]">Daftar Akun</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input required placeholder="Nama Lengkap" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input required placeholder="No. WhatsApp" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <div>
          <input required placeholder="Nama untuk Login (tanpa spasi)" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
            value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <p className="text-xs text-[#2B2018]/50 mt-1">Ini yang kamu pakai buat masuk nanti, bukan nama lengkap.</p>
        </div>

        <input required type="password" placeholder="Password (min. 6 karakter)" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button disabled={loading} className="w-full bg-[#6B1E23] text-white rounded-lg py-3 font-semibold hover:bg-[#4A1418] disabled:opacity-50">
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
        <p className="text-sm text-center text-[#2B2018]/70">
          Sudah punya akun? <Link to="/login" className="text-[#6B1E23] font-semibold">Masuk</Link>
        </p>
      </form>
    </div>
  )
}