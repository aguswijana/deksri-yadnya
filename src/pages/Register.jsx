import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Update nomor HP di profile (dibuat otomatis lewat trigger)
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
        <input required type="email" placeholder="Email" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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