import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CheckoutForm({ isOpen, onClose }) {
  const { items, total } = useCart()
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const orderId = crypto.randomUUID()

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_id: user?.id || null,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        notes: form.notes,
        total_amount: total,
      })

    if (orderError) {
      alert('Gagal membuat pesanan: ' + orderError.message)
      setSubmitting(false)
      return
    }

    const orderItems = items.map((i) => ({
      order_id: orderId,
      product_id: i.id,
      product_name: i.name,
      price: i.price,
      quantity: i.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      alert('Gagal menyimpan item: ' + itemsError.message)
      setSubmitting(false)
      return
    }

    const orderDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const itemsList = items
      .map((i) => `• ${i.name}\n  ${i.quantity} x Rp${i.price.toLocaleString('id-ID')} = *Rp${(i.price * i.quantity).toLocaleString('id-ID')}*`)
      .join('\n\n')

    const message =
      `Halo *Deksri Yadnya* 🙏\n` +
      `Saya ingin memesan:\n\n` +
      `━━━━━━━━━━━━━━\n` +
      `${itemsList}\n` +
      `━━━━━━━━━━━━━━\n\n` +
      `*Total: Rp${total.toLocaleString('id-ID')}*\n\n` +
      `📋 *Detail Pemesan*\n` +
      `Nama: ${form.name}\n` +
      `No. HP: ${form.phone}\n` +
      `Alamat: ${form.address}\n` +
      `Catatan: ${form.notes ? form.notes : '-'}` +
      `\n\nTanggal pesan: ${orderDate}\n\n` +
      `Mohon konfirmasi ketersediaan dan proses selanjutnya. Terima kasih 🙏`

    window.location.href = `https://wa.me/6289681297582?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-[#FBF5E9] rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#6B1E23]">Checkout</h2>
          <button onClick={onClose} className="text-2xl text-[#2B2018]/50 hover:text-[#2B2018]">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Nama Lengkap"
            className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            placeholder="No. WhatsApp"
            className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            required
            placeholder="Alamat Lengkap"
            className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <textarea
            placeholder="Catatan (opsional)"
            className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div className="flex justify-between font-semibold text-lg py-2">
            <span>Total</span>
            <span className="text-[#6B1E23]">Rp{total.toLocaleString('id-ID')}</span>
          </div>

          <button
            disabled={submitting}
            className="w-full bg-[#6B1E23] text-white rounded-lg py-3 font-semibold hover:bg-[#4A1418] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Memproses...' : 'Konfirmasi via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  )
}