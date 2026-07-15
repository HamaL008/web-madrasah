import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, ChevronDown } from 'lucide-react'
import api from '../../../api/axios'

// ── Accordion Section ──────────────────────────────────────────
function Section({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="text-left">
          <p className="text-sm font-extrabold text-slate-800">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Field helpers ──────────────────────────────────────────────
function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs md:text-sm" />
    </div>
  )
}

function Textarea({ label, name, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows={rows}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs md:text-sm resize-none" />
    </div>
  )
}

function ArrayEditor({ label, items, onChange, onAdd, onRemove }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={item} onChange={(e) => onChange(i, e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="button" onClick={() => onRemove(i)}
              className="text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={onAdd}
          className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline mt-1">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export default function PanelContent({ notify }) {
  const [form, setForm]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    api.get('/content').then((res) => {
      const d = res.data
      setForm({
        logo_name:       d.logo_name       ?? '',
        announcement:    d.announcement    ?? '',
        hero_title:      d.hero_title      ?? '',
        hero_subtitle:   d.hero_subtitle   ?? '',
        sambutan:        d.sambutan        ?? '',
        sejarah:         d.sejarah         ?? '',
        visi:            d.visi            ?? '',
        misi:            d.misi            ?? [],
        kurikulum:       d.kurikulum       ?? [],
        biaya:           d.biaya           ?? [],
        drive_legalitas: d.drive_legalitas ?? '',
        alamat:          d.alamat          ?? '',
        telepon:         d.telepon         ?? '',
        email:           d.email           ?? '',
        whatsapp:        d.whatsapp        ?? '',
        instagram:       d.instagram       ?? '',
      })
    }).catch(() => notify('Gagal memuat konten.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleArray = (key, idx, value) => {
    setForm((p) => { const arr = [...p[key]]; arr[idx] = value; return { ...p, [key]: arr } })
  }

  const addItem = (key, empty) => setForm((p) => ({ ...p, [key]: [...p[key], empty] }))

  const removeItem = (key, idx) => setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }))

  const handleBiaya = (idx, field, value) => {
    setForm((p) => {
      const b = [...p.biaya]
      b[idx] = { ...b[idx], [field]: field === 'nominal' ? +value : value }
      return { ...p, biaya: b }
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/content', {
        ...form,
        drive_legalitas: form.drive_legalitas || null,
        announcement:    form.announcement    || null,
      })
      notify('Konten berhasil disimpan!')
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = errors
        ? Object.values(errors)[0]?.[0]
        : (err.response?.data?.message ?? 'Gagal menyimpan.')
      notify(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-slate-400 text-sm py-10">Memuat konten...</div>
  if (!form) return null

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Kelola Konten Website</h1>
          <p className="text-slate-500 text-xs mt-1">Klik bagian di bawah untuk membuka dan mengedit.</p>
        </div>
        <button type="submit" disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow transition-all shrink-0 ${
            saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
          }`}>
          <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* ── 1. Informasi Umum ── */}
      <Section title="Informasi Umum" subtitle="Nama madrasah, pengumuman, dan link legalitas" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nama Madrasah (Logo)" name="logo_name" value={form.logo_name} onChange={handleChange} />
          <Field label="URL Drive Legalitas" name="drive_legalitas" value={form.drive_legalitas} onChange={handleChange} />
        </div>
        <Textarea label="Teks Pengumuman (Running Text)" name="announcement" value={form.announcement} onChange={handleChange} rows={2} />
      </Section>

      {/* ── 2. Hero & Sambutan ── */}
      <Section title="Hero & Sambutan" subtitle="Judul halaman utama dan kata sambutan kepala madrasah">
        <Field label="Judul Hero" name="hero_title" value={form.hero_title} onChange={handleChange} />
        <Textarea label="Subtitle Hero" name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} rows={2} />
        <Textarea label="Sambutan Kepala Madrasah" name="sambutan" value={form.sambutan} onChange={handleChange} rows={5} />
      </Section>

      {/* ── 3. Profil Madrasah ── */}
      <Section title="Profil Madrasah" subtitle="Sejarah, visi, dan misi madrasah">
        <Textarea label="Sejarah" name="sejarah" value={form.sejarah} onChange={handleChange} rows={5} />
        <Textarea label="Visi" name="visi" value={form.visi} onChange={handleChange} rows={2} />
        <ArrayEditor label="Misi"
          items={form.misi}
          onChange={(i, v) => handleArray('misi', i, v)}
          onAdd={() => addItem('misi', '')}
          onRemove={(i) => removeItem('misi', i)}
        />
      </Section>

      {/* ── 4. Biaya PPDB ── */}
      <Section title="Biaya PPDB" subtitle="Rincian biaya pendaftaran santri baru">
        <div className="space-y-3">
          {form.biaya.map((fee, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={fee.item}
                onChange={(e) => handleBiaya(i, 'item', e.target.value)}
                placeholder="Nama item biaya"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="number" value={fee.nominal}
                onChange={(e) => handleBiaya(i, 'nominal', e.target.value)}
                placeholder="Nominal (Rp)"
                className="w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="button" onClick={() => removeItem('biaya', i)}
                className="text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => addItem('biaya', { id: `b-${Date.now()}`, item: '', nominal: 0 })}
            className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Tambah Item Biaya
          </button>
        </div>
      </Section>

      {/* ── 5. Kontak ── */}
      <Section title="Kontak" subtitle="Informasi kontak yang tampil di footer dan halaman utama">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="WhatsApp Panitia" name="whatsapp" value={form.whatsapp} onChange={handleChange} />
          <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          <Field label="Telepon" name="telepon" value={form.telepon} onChange={handleChange} />
          <Field label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} />
        </div>
        <Textarea label="Alamat" name="alamat" value={form.alamat} onChange={handleChange} rows={2} />
      </Section>
    </form>
  )
}
