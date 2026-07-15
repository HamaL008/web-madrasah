import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2, X, GripVertical, BookOpen, UploadCloud } from 'lucide-react'
import api from '../../../api/axios'

const ICON_OPTIONS = [
  'BookOpen','BookMarked','GraduationCap','Star','Layers',
  'Lightbulb','Heart','Globe','Award','Users','Mosque',
]

const EMPTY_FORM = { title: '', description: '', icon: 'BookOpen', urutan: '' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
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

export default function PanelProgram({ notify }) {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [programImage, setProgramImage] = useState(null)
  const [programImagePreview, setProgramImagePreview] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/programs')
      .then((r) => setPrograms(r.data))
      .catch(() => notify('Gagal memuat program.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setProgramImage(null)
    setProgramImagePreview(null)
    setModal('form')
  }

  const openEdit = (item) => {
    setSelected(item)
    setForm({
      title:       item.title,
      description: item.description ?? '',
      icon:        item.icon ?? 'BookOpen',
      urutan:      item.urutan ?? '',
    })
    setProgramImage(null)
    setProgramImagePreview(item.image_url || null)
    setModal('form')
  }

  const handleProgramImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return notify('Ukuran gambar maksimal 5MB.', 'error')
    setProgramImage(file)
    setProgramImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { notify('Judul wajib diisi.', 'error'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('icon', form.icon || 'BookOpen')
      fd.append('urutan', form.urutan || 0)
      if (programImage) fd.append('image', programImage)

      if (selected) {
        fd.append('_method', 'PUT')
        const res = await api.post(`/admin/programs/${selected.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setPrograms((p) => p.map((i) => i.id === selected.id ? res.data : i))
        notify('Program berhasil diperbarui.')
      } else {
        const res = await api.post('/admin/programs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setPrograms((p) => [...p, res.data])
        notify('Program berhasil ditambahkan.')
      }
      setModal(null)
    } catch (err) {
      notify(err.response?.data?.message ?? 'Gagal menyimpan.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus program ini?')) return
    try {
      await api.delete(`/admin/programs/${id}`)
      setPrograms((p) => p.filter((i) => i.id !== id))
      notify('Program berhasil dihapus.')
    } catch { notify('Gagal menghapus.', 'error') }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Kelola Program</h1>
          <p className="text-slate-500 text-xs mt-1">Tambah dan kelola program & kurikulum pendidikan.</p>
        </div>
        <button onClick={openCreate}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Tambah Program
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Memuat program...</div>
      ) : programs.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-slate-300">
          <BookOpen className="w-12 h-12" />
          <p className="text-sm text-slate-400">Belum ada program.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {programs.map((item, i) => (
            <div key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Program #{String(item.urutan || i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.icon}</span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 border-t border-slate-100 px-4 py-3">
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
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modal === 'form' && (
        <Modal title={selected ? 'Edit Program' : 'Tambah Program'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {/* Upload Foto Dropzone */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">Gambar Utama (Opsional, max 5MB)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-emerald-500 transition-colors group overflow-hidden relative">
                {programImagePreview ? (
                  <img src={programImagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <UploadCloud className="w-6 h-6 mb-2" />
                    <p className="text-xs font-semibold">Klik untuk unggah foto</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleProgramImage} />
              </label>
              <p className="text-[10px] text-slate-400 mt-1.5 italic">Rekomendasi rasio 4:3 (Landscape) agar optimal di halaman depan.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Judul Program *</label>
              <input type="text" value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Program Tahfidzul Qur'an"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Deskripsi</label>
              <textarea value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4} placeholder="Deskripsi program..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Icon</label>
                <select value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1">
                  <GripVertical className="w-3 h-3" /> Urutan
                </label>
                <input type="number" value={form.urutan}
                  onChange={(e) => setForm((p) => ({ ...p, urutan: e.target.value }))}
                  placeholder="1, 2, 3..."
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
                {saving ? 'Menyimpan...' : selected ? 'Simpan Perubahan' : 'Tambah Program'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
