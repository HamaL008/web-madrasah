import { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import api from '../../../api/axios'

const field = (label, name, value, onChange, type = 'text') => (
  <div key={name}>
    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange}
      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-xs md:text-sm" />
  </div>
)

export default function PanelContent({ notify }) {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/content').then((res) => {
      const d = res.data
      setForm({
        logo_name: d.logo_name ?? '',
        announcement: d.announcement ?? '',
        hero_title: d.hero_title ?? '',
        hero_subtitle: d.hero_subtitle ?? '',
        sambutan: d.sambutan ?? '',
        sejarah: d.sejarah ?? '',
        visi: d.visi ?? '',
        misi: d.misi ?? [],
        kurikulum: d.kurikulum ?? [],
        biaya: d.biaya ?? [],
        drive_legalitas: d.drive_legalitas ?? '',
        galeri: d.galeri ?? [],
        alamat: d.alamat ?? '',
        telepon: d.telepon ?? '',
        email: d.email ?? '',
        whatsapp: d.whatsapp ?? '',
        instagram: d.instagram ?? '',
      })
    }).catch(() => notify('Gagal memuat konten.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleArray = (arrayKey, idx, value) => {
    setForm((p) => {
      const arr = [...p[arrayKey]]
      arr[idx] = value
      return { ...p, [arrayKey]: arr }
    })
  }

  const addArrayItem = (arrayKey, empty) => {
    setForm((p) => ({ ...p, [arrayKey]: [...p[arrayKey], empty] }))
  }

  const removeArrayItem = (arrayKey, idx) => {
    setForm((p) => ({ ...p, [arrayKey]: p[arrayKey].filter((_, i) => i !== idx) }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    // normalize empty strings to null for nullable fields
    const payload = {
      ...form,
      drive_legalitas: form.drive_legalitas || null,
      hero_background: form.hero_background || null,
      announcement: form.announcement || null,
    }
    try {
      await api.put('/admin/content', payload)
      notify('Konten berhasil disimpan!')
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = errors ? Object.values(errors)[0]?.[0] : (err.response?.data?.message || 'Gagal menyimpan.')
      notify(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-slate-400 text-sm">Memuat konten...</div>
  if (!form) return null

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Kelola Konten Website</h1>
          <p className="text-slate-500 text-xs mt-1">Perubahan langsung tampil di halaman utama.</p>
        </div>
        <button type="submit" disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow transition-all ${saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'}`}>
          <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <Section title="Informasi Umum">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Nama Madrasah (Logo)', 'logo_name', form.logo_name, handleChange)}
          {field('URL Drive Legalitas', 'drive_legalitas', form.drive_legalitas, handleChange)}
        </div>
        <Textarea label="Teks Pengumuman (Running Text)" name="announcement" value={form.announcement} onChange={handleChange} rows={2} />
      </Section>

      <Section title="Hero & Sambutan">
        {field('Judul Hero', 'hero_title', form.hero_title, handleChange)}
        <Textarea label="Subtitle Hero" name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} rows={2} />
        <Textarea label="Sambutan Kepala Madrasah" name="sambutan" value={form.sambutan} onChange={handleChange} rows={5} />
      </Section>

      <Section title="Profil Madrasah">
        <Textarea label="Sejarah" name="sejarah" value={form.sejarah} onChange={handleChange} rows={4} />
        <Textarea label="Visi" name="visi" value={form.visi} onChange={handleChange} rows={2} />
        <ArrayEditor label="Misi" items={form.misi} onChange={(i, v) => handleArray('misi', i, v)}
          onAdd={() => addArrayItem('misi', '')} onRemove={(i) => removeArrayItem('misi', i)} />
        <ArrayEditor label="Kurikulum" items={form.kurikulum} onChange={(i, v) => handleArray('kurikulum', i, v)}
          onAdd={() => addArrayItem('kurikulum', '')} onRemove={(i) => removeArrayItem('kurikulum', i)} />
      </Section>

      <Section title="Biaya PPDB">
        <div className="space-y-3">
          {form.biaya.map((fee, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={fee.item} onChange={(e) => setForm((p) => { const b = [...p.biaya]; b[i] = { ...b[i], item: e.target.value }; return { ...p, biaya: b } })}
                placeholder="Nama item biaya" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600" />
              <input type="number" value={fee.nominal} onChange={(e) => setForm((p) => { const b = [...p.biaya]; b[i] = { ...b[i], nominal: +e.target.value }; return { ...p, biaya: b } })}
                placeholder="Nominal (Rp)" className="w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600" />
              <button type="button" onClick={() => removeArrayItem('biaya', i)} className="text-red-500 p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('biaya', { id: `b-${Date.now()}`, item: '', nominal: 0 })}
            className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Tambah Item Biaya
          </button>
        </div>
      </Section>

      <Section title="Kontak">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('WhatsApp Panitia', 'whatsapp', form.whatsapp, handleChange)}
          {field('Email', 'email', form.email, handleChange, 'email')}
          {field('Telepon', 'telepon', form.telepon, handleChange)}
          {field('Instagram', 'instagram', form.instagram, handleChange)}
        </div>
        <Textarea label="Alamat" name="alamat" value={form.alamat} onChange={handleChange} rows={2} />
      </Section>
    </form>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">{title}</h2>
      {children}
    </div>
  )
}

function Textarea({ label, name, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows={rows}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-xs md:text-sm" />
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
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600" />
            <button type="button" onClick={() => onRemove(i)} className="text-red-500 p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button type="button" onClick={onAdd} className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>
    </div>
  )
}
