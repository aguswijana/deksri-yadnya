import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Yakin mau hapus produk ini?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert('Gagal hapus: ' + error.message)
    else fetchProducts()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#FBF5E9] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#6B1E23]">Kelola Produk</h1>
          <div className="flex gap-3">
            <button
              onClick={() => { setEditingProduct(null); setShowForm(true) }}
              className="bg-[#6B1E23] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4A1418]"
            >
              + Tambah Produk
            </button>
            <button
              onClick={handleLogout}
              className="border border-[#6B1E23]/30 text-[#6B1E23] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#6B1E23]/5"
            >
              Keluar
            </button>
          </div>
        </div>

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <div className="bg-[#F4ECDB] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#B8863E]/15 text-left">
                <tr>
                  <th className="p-3">Foto</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Stok</th>
                  <th className="p-3">Aktif</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-[#B8863E]/10">
                    <td className="p-3">
                      <div className="w-12 h-12 bg-[#B8863E]/10 rounded overflow-hidden">
                        {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">Rp{p.price.toLocaleString('id-ID')}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">{p.is_active ? '✅' : '❌'}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => { setEditingProduct(p); setShowForm(true) }}
                        className="text-[#6B1E23] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchProducts() }}
        />
      )}
    </div>
  )
}

function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price || '',
    stock: product?.stock || 0,
    description: product?.description || '',
    is_active: product?.is_active ?? true,
    image_url: product?.image_url || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let imageUrl = form.image_url

    // Upload foto baru kalau ada
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
  .from('product-image')
  .upload(fileName, imageFile)

      if (uploadError) {
        alert('Gagal upload foto: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage.from('product-image').getPublicUrl(fileName)
      imageUrl = urlData.publicUrl
    }

    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), image_url: imageUrl }

    let error
    if (product) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', product.id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }

    setSaving(false)
    if (error) alert('Gagal simpan: ' + error.message)
    else onSaved()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <form onSubmit={handleSubmit} className="relative bg-[#FBF5E9] rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto space-y-3">
        <h2 className="text-xl font-semibold text-[#6B1E23]">
          {product ? 'Edit Produk' : 'Tambah Produk'}
        </h2>

        <input required placeholder="Nama Produk" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input required placeholder="Slug (contoh: canang-sari)" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />

        <input required type="number" placeholder="Harga" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input required type="number" placeholder="Stok" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />

        <textarea placeholder="Deskripsi" className="w-full border border-[#B8863E]/30 rounded-lg p-3 bg-white"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div>
          <label className="text-sm text-[#2B2018]/70">Foto Produk</label>
          <input type="file" accept="image/*" className="w-full mt-1"
            onChange={(e) => setImageFile(e.target.files[0])} />
          {form.image_url && !imageFile && (
            <img src={form.image_url} alt="" className="w-20 h-20 object-cover rounded mt-2" />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Tampilkan di toko (aktif)
        </label>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-[#6B1E23]/30 text-[#6B1E23] rounded-lg py-2.5 font-semibold">
            Batal
          </button>
          <button disabled={saving} className="flex-1 bg-[#6B1E23] text-white rounded-lg py-2.5 font-semibold disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  )
}