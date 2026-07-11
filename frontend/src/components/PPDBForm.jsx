import { useState, useEffect } from 'react'
import { User, MapPin, Calendar, Phone, Users, Send, CheckCircle, AlertCircle, Clock, Lock } from 'lucide-react'
import api from '../api/axios'

const inputClass = "block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-colors text-xs md:text-sm"

function formatTanggal(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PPDBForm({ panitiaWa }) {
  const [ppdbStatus, setPpdbStatus] = useState(null) // null = loading
  const [formData, setFormData] = useState({
    nama: '', tempat_lahir: '', tanggal_lahir: '',
    alamat: '', nama_ortu: '', whatsapp: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

  useEffect(() => {
    api.get('/ppdb/status')
      .then((res) => setPpdbStatus(res.data))
      .catch(() => setPpdbStatus({ is_active: false, pesan_tutup: 'Gagal memuat status pendaftaran.' }))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/ppdb', formData)
      setSubmittedName(formData.nama)
      setFormData({ nama: '', tempat_lahir: '', tanggal_lahir: '', alamat: '', nama_ortu: '', whatsapp: '' })
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ppdb" className="py-20 bg-white relative">
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            PPDB Online {ppdbStatus?.tahun_ajaran ?? ''}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-3">
            Formulir Pendaftaran Santri Baru
          </h2>
          <p className="text-slate-600 text-xs md:text-sm">
            Isi formulir secara lengkap. Data Anda akan diverifikasi oleh Panitia Madrasah Miftahul Ulum.
          </p>
        </div>

        {/* Loading status */}
        {ppdbStatus === null && (
          <div className="max-w-2xl mx-auto flex justify-center py-12">
            <span className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
          </div>
        )}

        {/* PPDB DITUTUP */}
        {ppdbStatus !== null && !ppdbStatus.is_active && (
          <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-lg text-center space-y-5">
            <div className="inline-flex items-center justify-center bg-slate-200 text-slate-500 p-4 rounded-full">
              <Lock className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-700">Pendaftaran Saat Ini Ditutup</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                {ppdbStatus.pesan_tutup}
              </p>
            </div>

            {/* Tampilkan info periode jika ada */}
            {(ppdbStatus.tanggal_buka || ppdbStatus.tanggal_tutup) && (
              <div className="bg-white border border-slate-100 rounded-2xl p-4 inline-flex flex-col sm:flex-row gap-4 text-sm">
                {ppdbStatus.tanggal_buka && (
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      <span className="font-semibold">Dibuka:</span> {formatTanggal(ppdbStatus.tanggal_buka)}
                    </span>
                  </div>
                )}
                {ppdbStatus.tanggal_tutup && (
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      <span className="font-semibold">Ditutup:</span> {formatTanggal(ppdbStatus.tanggal_tutup)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <a href={`https://wa.me/${panitiaWa}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              <Phone className="w-4 h-4" /> Hubungi Panitia via WhatsApp
            </a>
          </div>
        )}

        {/* PPDB AKTIF — Success state */}
        {ppdbStatus !== null && ppdbStatus.is_active && success && (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center bg-emerald-600 text-white p-4 rounded-full shadow-md">
              <CheckCircle className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-emerald-950">Pendaftaran Berhasil!</h3>
              <p className="text-slate-700 text-sm mt-2">
                Terima kasih, data atas nama <span className="font-bold text-emerald-900">{submittedName}</span> telah berhasil disimpan.
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 text-xs text-slate-600">
              <p className="font-semibold text-emerald-950 mb-1">📋 Langkah Selanjutnya:</p>
              Silakan konfirmasi pemberkasan (KK, Akta Kelahiran) dengan menghubungi Panitia PPDB via WhatsApp.
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a href={`https://wa.me/${panitiaWa}?text=Assalamualaikum%20Panitia%20PPDB%2C%20saya%20ingin%20konfirmasi%20pendaftaran%20atas%20nama%20${encodeURIComponent(submittedName)}`}
                target="_blank" rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 fill-white" /> Hubungi Panitia (WhatsApp)
              </a>
              <button onClick={() => setSuccess(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl text-sm">
                Daftar Santri Lain
              </button>
            </div>
          </div>
        )}

        {/* PPDB AKTIF — Form */}
        {ppdbStatus !== null && ppdbStatus.is_active && !success && (
          <form onSubmit={handleSubmit}
            className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100 space-y-6 max-w-2xl mx-auto">

            {/* Info periode aktif */}
            {ppdbStatus.tanggal_tutup && (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pendaftaran ditutup pada <span className="font-bold">{formatTanggal(ppdbStatus.tanggal_tutup)}</span></span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200/50 p-4 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><User className="w-4 h-4" /></div>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange}
                  placeholder="Contoh: Muhammad Rayhan" className={inputClass} required />
              </div>
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tempat Lahir <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><MapPin className="w-4 h-4" /></div>
                  <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange}
                    placeholder="Contoh: Bogor" className={inputClass} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Calendar className="w-4 h-4" /></div>
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange}
                    className={inputClass} required />
                </div>
              </div>
            </div>

            {/* Nama Ortu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Orang Tua / Wali <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Users className="w-4 h-4" /></div>
                <input type="text" name="nama_ortu" value={formData.nama_ortu} onChange={handleChange}
                  placeholder="Contoh: H. Budi Santoso" className={inputClass} required />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                No. WhatsApp Orang Tua <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Phone className="w-4 h-4" /></div>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                  placeholder="Contoh: 081234567890" className={inputClass} required />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea name="alamat" rows={3} value={formData.alamat} onChange={handleChange}
                placeholder="Contoh: Jl. Kenanga No. 12, RT 03/RW 04, Kel. Sumber Jaya, Bogor"
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-colors text-xs md:text-sm"
                required />
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900 hover:scale-[1.01]'
              }`}>
              {loading
                ? <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Mengirim...</>
                : <><Send className="w-4 h-4" /> Kirim Pendaftaran</>
              }
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
