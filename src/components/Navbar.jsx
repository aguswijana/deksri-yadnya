import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Navbar({ onCartClick }) {
  const { itemCount } = useCart()
  const { user, profile } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FBF5E9]/95 backdrop-blur border-b border-[#B8863E]/25">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-[#6B1E23]">Deksri Yadnya</Link>
        <div className="flex items-center gap-4 text-sm">
          {onCartClick && (
            <button id="cart-icon" onClick={onCartClick} className="font-medium text-[#2B2018] hover:text-[#6B1E23]">
              🛒 Keranjang ({itemCount})
            </button>
          )}

          {user ? (
            <>
              <Link to="/riwayat" className="font-medium text-[#2B2018] hover:text-[#6B1E23]">
                Riwayat Pesanan
              </Link>
              <span className="text-[#2B2018]/40">|</span>
              <span className="text-[#2B2018]/60">Hai, {profile?.full_name || 'Pelanggan'}</span>
              <button onClick={handleLogout} className="text-[#6B1E23] font-semibold hover:underline">
                Keluar
              </button>
            </>
          ) : (
            <Link to="/login" className="text-[#6B1E23] font-semibold hover:underline">
              Masuk / Daftar
            </Link>
          )}

          <a href="https://wa.me/6289681297582" target="_blank" rel="noopener noreferrer" className="bg-[#6B1E23] text-white rounded-full px-5 py-2.5 font-semibold hover:bg-[#4A1418] transition-colors">
            Hubungi Kami
          </a>
        </div>
      </div>
    </header>
  )
}