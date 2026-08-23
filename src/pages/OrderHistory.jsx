import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-800',
  diproses: 'bg-blue-100 text-blue-800',
  dikirim: 'bg-purple-100 text-purple-800',
  selesai: 'bg-green-100 text-green-800',
}

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data)
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBF5E9]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-[#2B2018]/70">Silakan masuk dulu untuk melihat riwayat pesanan.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#6B1E23] mb-6">Riwayat Pesanan</h1>

        {loading ? (
          <p>Memuat...</p>
        ) : orders.length === 0 ? (
          <p className="text-[#2B2018]/60">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#F4ECDB] rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-[#2B2018]/60">
                    {new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLOR[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                {order.order_items.map((item) => (
                  <p key={item.id} className="text-sm">
                    {item.product_name} x{item.quantity}
                  </p>
                ))}
                <p className="font-semibold text-[#6B1E23] mt-2">
                  Total: Rp{order.total_amount.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}