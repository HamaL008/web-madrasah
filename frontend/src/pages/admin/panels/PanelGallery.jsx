import { useState, useEffect, useRef, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search, X, Image as ImageIcon, Upload, GripVertical } from 'lucide-react'
import api from '../../../api/axios'

const EMPTY_FORM = { title: '', description: '', urutan: '', category: '' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-800 text-base">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  )
}

function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4 mt-6 border-t border-slate-100">
      <button disabled={current === 1} onClick={() => onPageChange(current - 1)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">Prev</button>
      {Array.from({length: total}).map((_, i) => (
        <button key={i} onClick={() => onPageChange(i + 1)} className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors ${current === i + 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
          {i + 1}
        </button>
      ))}
      <button disabled={current === total} onClick={() => onPageChange(current + 1)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">Next</button>
    </div>
  )
}

export default function PanelGallery({ notify }) {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [catFilter, setCat]     = useState('Semua')
  const [modal, setModal]       = useState(null) // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview]   = useState(null)
  const [saving, setSaving]     = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT = 9
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    api.get('/gallery')
      .then((r) => setItems(r.data ?? []))
      .catch(() => notify('Gagal memuat galeri.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Kategori unik dari data
  const categories = useMemo(() => (
    ['Semua', ...[...new Set(items.map((i) => i.category).filter(Boolean))].sort()]
  ), [items])

  const filtered = useMemo(() => {
    let list = catFilter === 'Semua' ? items : items.filter((i) => i.category === catFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((i) =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      )
    }
    return list
  }, [items, catFilter, search])

  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT)
  }, [filtered, currentPage])
  const totalPages = Math.ceil(filtered.length / LIMIT)

  useEffect(() => { setCurrentPage(1) }, [catFilter, search])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setImageFile(null)
    setPreview(null)
    setSelected(null)
    setModal('create')
  }

  const openEdit = (item) => {
    setSelected(item)
    setForm({
      title:       item.title,
      description: item.description ?? '',
      urutan:      item.urutan ?? '',
      category:    item.category ?? '',
    })
    setImageFile(null)
    setPreview(item.image_url ?? null)
    setModal('edit')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { notify('Ukuran gambar maksimal 5 MB.', 'error'); return }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { notify('Judul wajib diisi.', 'error'); return }
    setSaving(true)
    const fd = new FormData()
    fd.append('title',       form.title)
    fd.append('description', form.description)
    fd.append('urutan',      form.urutan || 0)
    fd.append('category',    form.category || 'Umum')
    if (imageFile) fd.append('image', imageFile)

    try {
      if (modal === 'create') {
        const res = await api.post('/admin/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setItems((p) => [res.data, ...p])
        notify('Foto berhasil ditambahkan!')
      } else {
        const res = await api.post(`/admin/gallery/${selected.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setItems((p) => p.map((i) => i.id === selected.id ? res.data : i))
        notify('Foto berhasil diperbarui!')
      }
      setModal(null)
    } catch (err) {
      const errors = err.response?.data?.errors
      notify(errors ? Object.values(errors)[0]?.[0] : (err.response?.data?.message ?? 'Gagal menyimpan.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus foto ini dari galeri?')) return
    try {
      await api.delete(`/admin/gallery/${id}`)
      setItems((p) => p.filter((i) => i.id !== id))
      notify('Foto berhasil dihapus.')
    } catch { notify('Gagal menghapus.', 'error') }
  }

  const catCounts = useMemo(() => {
    const c = { Semua: items.length }
    categories.slice(1).forEach((cat) => { c[cat] = items.filter((i) => i.category === cat).length })
    return c
  }, [items, categories])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Kelola Galeri</h1>
          <p className="text-slate-500 text-xs mt-1">Tambah, edit, atau hapus foto kegiatan madrasah.</p>
        </div>
        <button onClick={openCreate}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Tambah Foto
        </button>
      </div>

      {/* Filter kategori */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                catFilter === cat
                  ? 'bg-emerald-900 text-white border-emerald-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}>
              {cat}
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                catFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{catCounts[cat] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Cari judul atau kategori..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid foto */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Memuat galeri...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-slate-300">
          <ImageIcon className="w-12 h-12" />
          <p className="text-sm text-slate-400">
            {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada foto di galeri.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((item) => (
              <div key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                {/* Thumbnail */}
                <div className="h-40 bg-slate-100 overflow-hidden relative shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950">
                        <ImageIcon className="w-8 h-8 text-amber-400 mb-1" />
                        <span className="text-[10px] text-emerald-300 font-bold uppercase">Belum ada foto</span>
                      </div>
                  }
                  {/* Urutan badge */}
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    #{item.urutan ?? 0}
                  </span>
                  {/* Kategori badge */}
                  {item.category && (
                    <span className="absolute top-2 right-2 bg-emerald-700/80 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-slate-800 text-sm truncate mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 mt-auto">
                    <button onClick={() => openEdit(item)}
                      className="flex-1 text-center text-xs font-semibold text-slate-600 hover:text-emerald-800 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
          
          {!loading && filtered.length > 0 && (
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Menampilkan <span className="font-bold text-slate-600">{paginated.length}</span> dari{' '}
              <span className="font-bold text-slate-600">{filtered.length}</span> foto
            </p>
          )}
        </>
      )}

      {/* ── Modal Create / Edit ── */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Tambah Foto Baru' : 'Edit Foto'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {/* Upload foto */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Foto {modal === 'edit' ? '(kosongkan jika tidak ingin mengganti)' : ''}
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="relative w-full h-44 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center overflow-hidden"
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full z-10">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">Klik untuk ganti</div>
                  </>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Klik untuk upload foto</p>
                    <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP — maks. 5 MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Judul */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Judul Foto *</label>
              <input type="text" value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Hafalan Qur'an Pagi"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Deskripsi</label>
              <textarea value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2} placeholder="Deskripsi singkat kegiatan..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Kategori */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kategori</label>
                <input type="text" list="gal-cat-list" value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="Ketik bebas..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <datalist id="gal-cat-list">
                  {[...new Set(items.map((i) => i.category).filter(Boolean))].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* Urutan */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1">
                  <GripVertical className="w-3 h-3" /> Urutan
                </label>
                <input type="number" value={form.urutan}
                  onChange={(e) => setForm((p) => ({ ...p, urutan: e.target.value }))}
                  placeholder="0 = paling awal"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs disabled:opacity-60">
                {saving ? 'Menyimpan...' : modal === 'create' ? 'Tambah ke Galeri' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
