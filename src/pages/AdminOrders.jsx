import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const STATUS_OPTIONS = ['pending', 'diproses', 'dikirim', 'selesai']

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-800',
  diproses: 'bg-blue-100 text-blue-800',
  dikirim: 'bg-purple-100 text-purple-800',
  selesai: 'bg-green-100 text-green-800',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('semua')
  const [expandedId, setExpandedId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setOrders(data)
    }
    setLoading(false)
  }

  async function updateStatus(orderId, newStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      alert('Gagal update status: ' + error.message)
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const filteredOrders =
    filterStatus === 'semua' ? orders : orders.filter((o) => o.status === filterStatus)

  return (
    <div className="min-h-screen bg-[#FBF5E9] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#6B1E23]">Pesanan Masuk</h1>
            <div className="flex gap-4 mt-2 text-sm">
              <Link to="/admin" className="text-[#6B1E23] hover:underline">
                Kelola Produk
              </Link>
              <span className="text-[#2B2018]/40">|</span>
              <span className="font-semibold text-[#6B1E23]">Pesanan</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="border border-[#6B1E23]/30 text-[#6B1E23] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#6B1E23]/5"
          >
            Keluar
          </button>
        </div>

        {/* Filter status */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterStatus('semua')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              filterStatus === 'semua' ? 'bg-[#6B1E23] text-white' : 'bg-[#F4ECDB]'
            }`}
          >
            Semua ({orders.length})
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                filterStatus === s ? 'bg-[#6B1E23] text-white' : 'bg-[#F4ECDB]'
              }`}
            >
              {s} ({orders.filter((o) => o.status === s).length})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[#2B2018]/60">Memuat pesanan...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-[#2B2018]/60">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-[#F4ECDB] rounded-2xl overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div>
                    <p className="font-semibold text-[#2B2018]">{order.customer_name}</p>
                    <p className="text-sm text-[#2B2018]/60">
                      {new Date(order.created_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#6B1E23]">
                      Rp{order.total_amount.toLocaleString('id-ID')}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLOR[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-[#2B2018]/40">
                      {expandedId === order.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {expandedId === order.id && (
                  <div className="border-t border-[#B8863E]/20 p-4 space-y-3">
                    <div className="text-sm space-y-1">
                      <p><span className="text-[#2B2018]/60">No. HP:</span> {order.customer_phone}</p>
                      <p><span className="text-[#2B2018]/60">Alamat:</span> {order.customer_address}</p>
                      {order.notes && (
                        <p><span className="text-[#2B2018]/60">Catatan:</span> {order.notes}</p>
                      )}
                    </div>

                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-sm font-semibold mb-2">Item Pesanan:</p>
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm py-1">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#2B2018]/60">Ubah status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-[#B8863E]/30 rounded-lg px-3 py-1.5 text-sm bg-white"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>

                      <a
                        href={`https://wa.me/62${order.customer_phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-sm text-[#6B1E23] hover:underline"
                      >
                        Chat WhatsApp →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}