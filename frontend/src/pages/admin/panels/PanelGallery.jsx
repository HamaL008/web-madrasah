import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Image as ImageIcon, Upload, X, GripVertical } from 'lucide-react'
import api from '../../../api/axios'

const BACKEND = 'http://localhost:8000'

export default function PanelGallery({ notify }) {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState({ title: '', description: '', urutan: '' })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview]   = useState(null)
  const [saving, setSaving]     = useState(false)
  const [editId, setEditId]     = useState(null) // null = tambah baru
  const fileRef = useRef()

  const load = () => {
    api.get('/gallery')
      .then((r) => setItems(r.data ?? []))
      .catch(() => notify('Gagal memuat galeri.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      notify('Ukuran gambar maksimal 2 MB.', 'error')
      return
    }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setForm({ title: '', description: '', urutan: '' })
    setImageFile(null)
    setPreview(null)
    setEditId(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const startEdit = (item) => {
    setEditId(item.id)
    setForm({
      title:       item.title,
      description: item.description ?? '',
      urutan:      item.urutan ?? '',
    })
    setImageFile(null)
    setPreview(item.image_url || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { notify('Judul wajib diisi.', 'error'); return }
    setSaving(true)

    const fd = new FormData()
    fd.append('title',       form.title)
    fd.append('description', form.description)
    fd.append('urutan',      form.urutan || 0)
    if (imageFile) fd.append('image', imageFile)

    try {
      if (editId) {
        // Update — pakai POST karena FormData
        const res = await api.post(`/admin/gallery/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setItems((p) => p.map((i) => i.id === editId ? res.data : i))
        notify('Foto berhasil diperbarui!')
      } else {
        const res = await api.post('/admin/gallery', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setItems((p) => [res.data, ...p])
        notify('Foto berhasil ditambahkan!')
      }
      resetForm()
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = errors
        ? Object.values(errors)[0]?.[0]
        : (err.response?.data?.message || 'Gagal menyimpan.')
      notify(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus foto ini dari galeri?')) return
    try {
      await api.delete(`/admin/gallery/${id}`)
      setItems((p) => p.filter((i) => i.id !== id))
      if (editId === id) resetForm()
      notify('Foto berhasil dihapus.')
    } catch {
      notify('Gagal menghapus.', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Kelola Galeri</h1>
        <p className="text-slate-500 text-xs mt-1">Tambah, edit, atau hapus foto kegiatan madrasah.</p>
      </div>

      {/* Form tambah / edit */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-5">
          {editId ? 'Edit Foto Galeri' : 'Tambah Foto Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload area */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Foto {editId ? '(kosongkan jika tidak ingin mengganti)' : ''}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center overflow-hidden"
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                    Klik untuk ganti gambar
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Klik atau drag foto ke sini</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP — maks. 2 MB</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Judul Foto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Hafalan Qur'an Pagi"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Deskripsi
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Deskripsi singkat kegiatan..."
                rows={2}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <GripVertical className="w-3.5 h-3.5" /> Urutan Tampil
              </label>
              <input
                type="number"
                value={form.urutan}
                onChange={(e) => setForm((p) => ({ ...p, urutan: e.target.value }))}
                placeholder="0 = paling awal"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah ke Galeri')}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar foto */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">
            Total: {items.length} foto
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat galeri...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-400 text-sm">Belum ada foto di galeri.</p>
            <p className="text-slate-300 text-xs">Tambahkan foto kegiatan madrasah menggunakan form di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border overflow-hidden group transition-all ${
                  editId === item.id
                    ? 'border-emerald-400 ring-2 ring-emerald-300'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Thumbnail */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-amber-400 mb-1" />
                      <span className="text-[10px] text-emerald-300 font-bold uppercase">Belum ada foto</span>
                    </div>
                  )}
                  {/* Urutan badge */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    #{item.urutan ?? 0}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                  {item.description && (
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
