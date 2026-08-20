import { useCart } from '../context/CartContext'

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay gelap di belakang */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>

      {/* Panel keranjang */}
      <div className="relative w-full max-w-md bg-[#FBF5E9] h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[#B8863E]/20">
          <h2 className="text-xl font-semibold text-[#6B1E23]">Keranjang Belanja</h2>
          <button onClick={onClose} className="text-2xl text-[#2B2018]/50 hover:text-[#2B2018]">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-[#2B2018]/60 text-center mt-10">Keranjang masih kosong</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-[#F4ECDB] rounded-xl p-3">
                  <div className="w-16 h-16 bg-[#B8863E]/10 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#2B2018]">{item.name}</p>
                    <p className="text-[#6B1E23] font-semibold text-sm mt-1">
                      Rp{item.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-[#B8863E]/20 text-[#6B1E23] font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-[#B8863E]/20 text-[#6B1E23] font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-xs text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#B8863E]/20">
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span className="text-[#6B1E23]">Rp{total.toLocaleString('id-ID')}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-[#6B1E23] text-white rounded-lg py-3 font-semibold hover:bg-[#4A1418] transition-colors"
            >
              Lanjut ke Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}