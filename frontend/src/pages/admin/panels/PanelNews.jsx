import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search, X, Eye, EyeOff, Newspaper, Image as ImageIcon, Archive, Globe } from 'lucide-react'
import api from '../../../api/axios'

const EMPTY_FORM = {
  title: '', excerpt: '', content: '',
  is_published: true, image: null,
}

const STATUS_TABS = [
  { key: 'semua',  label: 'Semua',  icon: Newspaper },
  { key: 'publik', label: 'Publik', icon: Globe },
  { key: 'draft',  label: 'Draft / Arsip', icon: Archive },
]

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
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

export default function PanelNews({ notify }) {
  const [news, setNews]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [tab, setTab]           = useState('semua')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [preview, setPreview]   = useState(null)
  const [saving, setSaving]     = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT = 9

  const load = () => {
    setLoading(true)
    api.get('/admin/news')
      .then((res) => setNews(res.data))
      .catch(() => notify('Gagal memuat berita.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const counts = useMemo(() => ({
    semua:  news.length,
    publik: news.filter((n) => n.is_published).length,
    draft:  news.filter((n) => !n.is_published).length,
  }), [news])

  const filtered = useMemo(() => {
    let list = news
    if (tab === 'publik') list = list.filter((n) => n.is_published)
    if (tab === 'draft')  list = list.filter((n) => !n.is_published)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((n) =>
        n.title?.toLowerCase().includes(q) ||
        n.excerpt?.toLowerCase().includes(q)
      )
    }
    return list
  }, [news, search, tab])

  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT)
  }, [filtered, currentPage])
  const totalPages = Math.ceil(filtered.length / LIMIT)

  useEffect(() => { setCurrentPage(1) }, [tab, search])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setPreview(null)
    setSelected(null)
    setModal('create')
  }

  const openEdit = (item) => {
    setSelected(item)
    setForm({
      title: item.title, excerpt: item.excerpt ?? '',
      content: item.content,
      is_published: item.is_published, image: null,
    })
    setPreview(item.image_url ?? null)
    setModal('edit')
  }

  const openDetail = (item) => { setSelected(item); setModal('detail') }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm((p) => ({ ...p, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      notify('Judul dan isi berita wajib diisi.', 'error'); return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('excerpt', form.excerpt)
      fd.append('content', form.content)
      fd.append('is_published', form.is_published ? '1' : '0')
      if (form.image) fd.append('image', form.image)

      if (modal === 'create') {
        const res = await api.post('/admin/news', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setNews((p) => [res.data, ...p])
        notify('Berita berhasil ditambahkan.')
      } else {
        const res = await api.post(`/admin/news/${selected.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setNews((p) => p.map((n) => n.id === selected.id ? res.data : n))
        notify('Berita berhasil diperbarui.')
      }
      setModal(null)
    } catch (err) {
      notify(err.response?.data?.message ?? 'Gagal menyimpan berita.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (item) => {
    try {
      const fd = new FormData()
      fd.append('title', item.title)
      fd.append('content', item.content)
      fd.append('is_published', item.is_published ? '0' : '1')
      const res = await api.post(`/admin/news/${item.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setNews((p) => p.map((n) => n.id === item.id ? res.data : n))
      notify(`Berita ${res.data.is_published ? 'dipublikasikan' : 'disembunyikan'}.`)
    } catch { notify('Gagal mengubah status.', 'error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus berita ini?')) return
    try {
      await api.delete(`/admin/news/${id}`)
      setNews((p) => p.filter((n) => n.id !== id))
      notify('Berita berhasil dihapus.')
    } catch { notify('Gagal menghapus berita.', 'error') }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Kelola Berita</h1>
          <p className="text-slate-500 text-xs mt-1">Tulis, edit, dan publikasikan berita & pengumuman madrasah.</p>
        </div>
        <button onClick={openCreate}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Tulis Berita
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              tab === key
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Cari judul berita..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid berita */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Memuat berita...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada berita.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                <div className="h-40 bg-slate-100 overflow-hidden relative shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                        <Newspaper className="w-8 h-8 text-emerald-200" />
                      </div>
                  }
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.is_published
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {item.is_published ? 'Publik' : 'Draft'}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-2">{item.excerpt}</p>
                  )}
                  <p className="text-slate-400 text-[10px] mt-auto mb-3">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <button onClick={() => openDetail(item)}
                      className="flex-1 text-center text-xs font-semibold text-slate-600 hover:text-emerald-800 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                      Detail
                    </button>
                    <button onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => togglePublish(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors">
                      {item.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
              Menampilkan <span className="font-bold text-slate-600">{paginated.length}</span> dari <span className="font-bold text-slate-600">{filtered.length}</span> berita
            </p>
          )}
        </>
      )}

      {/* Modal Create / Edit */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Tulis Berita Baru' : 'Edit Berita'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Foto Sampul</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-36 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors"
                onClick={() => document.getElementById('news-img-input').click()}>
                {preview
                  ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
                  : <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">Klik untuk upload gambar</span>
                    </div>
                }
              </div>
              <input id="news-img-input" type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Judul *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Judul berita..." />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className={`w-10 h-5 rounded-full transition-colors relative ${form.is_published ? 'bg-emerald-600' : 'bg-slate-300'}`}
                  onClick={() => setForm((p) => ({ ...p, is_published: !p.is_published }))}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_published ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-xs font-bold text-slate-600">{form.is_published ? 'Publik' : 'Draft'}</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Ringkasan</label>
              <textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Ringkasan singkat..." />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Isi Berita *</label>
              <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                rows={8} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
                placeholder="Tulis isi berita di sini..." />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs disabled:opacity-60">
                {saving ? 'Menyimpan...' : modal === 'create' ? 'Publikasikan' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Detail */}
      {modal === 'detail' && selected && (
        <Modal title="Detail Berita" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {selected.image_url && (
              <img src={selected.image_url} alt={selected.title} className="w-full h-48 object-cover rounded-xl" />
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selected.is_published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {selected.is_published ? 'Publik' : 'Draft'}
              </span>
              <span className="text-[10px] text-slate-400 ml-auto">
                {new Date(selected.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-800">{selected.title}</h2>
            {selected.excerpt && <p className="text-slate-500 text-xs italic border-l-2 border-emerald-400 pl-3">{selected.excerpt}</p>}
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-4">{selected.content}</div>
          </div>
        </Modal>
      )}
    </div>
  )
}
