import { useState, useEffect } from 'react'
import { Save, Calendar, Clock, Info, ToggleLeft, ToggleRight, CheckCircle, XCircle } from 'lucide-react'
import api from '../../../api/axios'

function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function PanelPPDBSetting({ notify }) {
  const [form, setForm] = useState({
    force_closed:  false,
    tanggal_buka:  '',
    tanggal_tutup: '',
    tahun_ajaran:  '2026/2027',
    pesan_tutup:   'Pendaftaran PPDB saat ini sedang ditutup. Pantau terus informasi pembukaan pendaftaran berikutnya.',
  })
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    api.get('/admin/ppdb-setting')
      .then((res) => {
        const d = res.data
        if (d) {
          setForm({
            force_closed:  d.force_closed ?? false,
            tanggal_buka:  d.tanggal_buka  ?? '',
            tanggal_tutup: d.tanggal_tutup ?? '',
            tahun_ajaran:  d.tahun_ajaran  ?? '2026/2027',
            pesan_tutup:   d.pesan_tutup   ?? '',
          })
          setIsActive(d.is_active ?? false)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        force_closed:  form.force_closed ? 1 : 0,
        tanggal_buka:  form.tanggal_buka  || null,
        tanggal_tutup: form.tanggal_tutup || null,
      }
      const res = await api.put('/admin/ppdb-setting', payload)
      setIsActive(res.data.is_active ?? false)
      setForm((p) => ({ ...p, force_closed: res.data.force_closed ?? p.force_closed }))
      notify('Pengaturan PPDB berhasil disimpan!')
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

  if (loading) return <div className="text-slate-400 text-sm">Memuat pengaturan...</div>

  // Hitung status berdasarkan form (untuk preview live sebelum save)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const buka  = form.tanggal_buka  ? new Date(form.tanggal_buka)  : null
  const tutup = form.tanggal_tutup ? new Date(form.tanggal_tutup) : null
  let previewStatus = 'Belum dikonfigurasi'
  let previewColor  = 'slate'
  if (form.force_closed) {
    previewStatus = 'Ditutup paksa oleh admin'
    previewColor  = 'red'
  } else if (!buka && !tutup) {
    previewStatus = 'Belum ada tanggal — formulir tertutup'
    previewColor  = 'slate'
  } else if (buka && today < buka) {
    previewStatus = `Akan dibuka ${formatTanggal(form.tanggal_buka)}`
    previewColor  = 'amber'
  } else if (tutup && today > tutup) {
    previewStatus = `Sudah ditutup sejak ${formatTanggal(form.tanggal_tutup)}`
    previewColor  = 'red'
  } else {
    previewStatus = tutup
      ? `Aktif hingga ${formatTanggal(form.tanggal_tutup)}`
      : 'Aktif (tanpa batas waktu tutup)'
    previewColor  = 'emerald'
  }

  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber:   'bg-amber-50 border-amber-200 text-amber-800',
    red:     'bg-red-50 border-red-200 text-red-700',
    slate:   'bg-slate-100 border-slate-200 text-slate-600',
  }
  const dotMap = {
    emerald: 'bg-emerald-500 animate-pulse',
    amber:   'bg-amber-400 animate-pulse',
    red:     'bg-red-500',
    slate:   'bg-slate-400',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Pengaturan Periode PPDB</h1>
        <p className="text-slate-500 text-xs mt-1">
          Formulir pendaftaran otomatis buka dan tutup sesuai tanggal yang diatur.
        </p>
      </div>

      {/* Status card */}
      <div className={`flex items-center gap-4 p-5 rounded-2xl border ${colorMap[previewColor]}`}>
        <div className={`w-3 h-3 rounded-full shrink-0 ${dotMap[previewColor]}`} />
        <div>
          <p className="font-extrabold text-sm">{previewStatus}</p>
          <p className="text-xs opacity-70 mt-0.5">
            {isActive
              ? 'Siswa dapat mengisi formulir pendaftaran sekarang.'
              : 'Formulir pendaftaran tidak dapat diakses siswa saat ini.'}
          </p>
        </div>
        {isActive
          ? <CheckCircle className="w-5 h-5 ml-auto shrink-0" />
          : <XCircle    className="w-5 h-5 ml-auto shrink-0 opacity-50" />
        }
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Rentang tanggal otomatis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
              Periode Pendaftaran Otomatis
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Formulir akan otomatis terbuka saat tanggal buka tercapai dan tertutup saat tanggal tutup terlampaui.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200/60 p-3 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Kosongkan <span className="font-bold">Tanggal Buka</span> jika ingin langsung aktif sekarang.
              Kosongkan <span className="font-bold">Tanggal Tutup</span> jika tidak ada batas waktu akhir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Tanggal Buka
              </label>
              <input type="date" name="tanggal_buka" value={form.tanggal_buka} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm" />
              <p className="text-[10px] text-slate-400 mt-1">
                {form.tanggal_buka ? formatTanggal(form.tanggal_buka) : 'Kosong = mulai aktif sekarang'}
              </p>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-500" /> Tanggal Tutup
              </label>
              <input type="date" name="tanggal_tutup" value={form.tanggal_tutup} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm" />
              <p className="text-[10px] text-slate-400 mt-1">
                {form.tanggal_tutup ? formatTanggal(form.tanggal_tutup) : 'Kosong = tidak ada batas tutup'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Tahun Ajaran
            </label>
            <input type="text" name="tahun_ajaran" value={form.tahun_ajaran} onChange={handleChange}
              placeholder="Contoh: 2026/2027"
              className="w-full sm:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm" />
          </div>
        </div>

        {/* Tutup paksa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
            Tutup Paksa (Override)
          </h2>
          <p className="text-xs text-slate-500">
            Aktifkan ini untuk menutup pendaftaran seketika, meskipun masih dalam rentang tanggal aktif.
            Berguna saat kuota penuh atau ada kondisi darurat.
          </p>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className={`text-sm font-bold ${form.force_closed ? 'text-red-700' : 'text-slate-700'}`}>
                {form.force_closed ? 'Pendaftaran ditutup paksa' : 'Ikuti jadwal otomatis'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {form.force_closed
                  ? 'Formulir tidak dapat diakses siswa walau masih dalam periode aktif.'
                  : 'Formulir buka/tutup otomatis sesuai tanggal di atas.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, force_closed: !p.force_closed }))}
              className="focus:outline-none ml-4 shrink-0"
              aria-label="Toggle tutup paksa"
            >
              {form.force_closed
                ? <ToggleRight className="w-10 h-10 text-red-500" />
                : <ToggleLeft  className="w-10 h-10 text-slate-400" />
              }
            </button>
          </div>
        </div>

        {/* Pesan saat ditutup */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
            Pesan Saat Ditutup
          </h2>
          <p className="text-xs text-slate-500">Ditampilkan kepada calon pendaftar saat PPDB tidak aktif.</p>
          <textarea name="pesan_tutup" value={form.pesan_tutup} onChange={handleChange} rows={3}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 text-sm resize-none"
            placeholder="Contoh: Pendaftaran PPDB saat ini sedang ditutup. Pantau informasi selanjutnya." />
        </div>

        <button type="submit" disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow transition-all ${
            saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
          }`}>
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </div>
  )
}
