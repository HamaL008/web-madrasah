import { useState, useEffect } from 'react'
import { User, MapPin, Calendar, Phone, Users, Send, CheckCircle, AlertCircle, Clock, Lock, CreditCard, Info, ArrowRight } from 'lucide-react'
import api from '../api/axios'

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const inputClass = "block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-xs md:text-sm"

export default function PPDBForm({ panitiaWa, biaya = [] }) {
  const [ppdbStatus, setPpdbStatus] = useState(null)
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

  function formatTanggal(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const totalBiaya = biaya.reduce((acc, curr) => acc + curr.nominal, 0)

  return (
    <section id="ppdb" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row reveal">
          
          {/* KOLOM KIRI: Info & Biaya */}
          <div className="w-full lg:w-5/12 bg-emerald-900 text-white p-8 md:p-12 lg:p-16 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-950 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="inline-flex self-start items-center gap-2 bg-emerald-800/50 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                PPDB Online {ppdbStatus?.tahun_ajaran ?? ''}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Bergabunglah Bersama Generasi Qur'ani
              </h2>
              <p className="text-emerald-100 text-sm leading-relaxed mb-10">
                Pendaftaran santri baru Madrasah Miftahul Ulum kini lebih mudah. Isi formulir pendaftaran untuk segera menjadi bagian dari keluarga besar kami.
              </p>

              {/* Tabel Biaya */}
              {biaya.length > 0 && (
                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider mb-4">
                    <CreditCard className="w-4 h-4" /> Rincian Biaya Masuk
                  </div>
                  <div className="bg-emerald-950/50 rounded-2xl border border-emerald-800/50 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-emerald-800/50">
                        {biaya.map((fee, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4 text-emerald-100">{fee.item}</td>
                            <td className="py-3 px-4 text-right font-bold text-white">{formatRupiah(fee.nominal)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-emerald-800/50 border-t border-emerald-700">
                          <td className="py-3 px-4 font-extrabold text-emerald-100 uppercase tracking-wider">Total Biaya</td>
                          <td className="py-3 px-4 text-right font-extrabold text-amber-400 text-sm">{formatRupiah(totalBiaya)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-emerald-200/80 text-[10px] leading-relaxed">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <p>Biaya di atas merupakan rincian awal masuk. Pembayaran dapat diangsur sesuai ketentuan panitia PPDB.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Form */}
          <div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16 bg-white relative">
            <h3 className="text-2xl font-extrabold text-emerald-950 mb-8">Formulir Pendaftaran</h3>
            
            {/* Loading status */}
            {ppdbStatus === null && (
              <div className="flex justify-center py-12">
                <span className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
              </div>
            )}

            {/* PPDB DITUTUP */}
            {ppdbStatus !== null && !ppdbStatus.is_active && (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center space-y-4">
                <div className="inline-flex items-center justify-center bg-slate-200 text-slate-500 p-4 rounded-full">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-700">Pendaftaran Saat Ini Ditutup</h3>
                  <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                    {ppdbStatus.pesan_tutup}
                  </p>
                </div>
                <a href={`https://wa.me/${panitiaWa}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all mt-2">
                  <Phone className="w-4 h-4" /> Hubungi Panitia via WhatsApp
                </a>
              </div>
            )}

            {/* PPDB AKTIF — Success state */}
            {ppdbStatus !== null && ppdbStatus.is_active && success && (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-5 animate-fade-in">
                <div className="inline-flex items-center justify-center bg-emerald-600 text-white p-3 rounded-full">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-emerald-950">Berhasil Terdaftar!</h3>
                  <p className="text-slate-600 text-sm mt-2">
                    Data atas nama <span className="font-bold text-emerald-900">{submittedName}</span> telah tersimpan.
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <a href={`https://wa.me/${panitiaWa}?text=Assalamualaikum%20Panitia%20PPDB%2C%20saya%20ingin%20konfirmasi%20pendaftaran%20atas%20nama%20${encodeURIComponent(submittedName)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Konfirmasi ke WhatsApp
                  </a>
                  <button onClick={() => setSuccess(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl text-sm transition-colors">
                    Daftar Santri Lain
                  </button>
                </div>
              </div>
            )}

            {/* PPDB AKTIF — Form */}
            {ppdbStatus !== null && ppdbStatus.is_active && !success && (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Info Periode */}
                {ppdbStatus.tanggal_tutup && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-900">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pendaftaran akan ditutup pada <span className="font-bold">{formatTanggal(ppdbStatus.tanggal_tutup)}</span></span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><User className="w-4 h-4" /></div>
                    <input type="text" name="nama" value={formData.nama} onChange={handleChange}
                      placeholder="Contoh: Muhammad Rayhan" className={inputClass} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><MapPin className="w-4 h-4" /></div>
                      <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange}
                        placeholder="Contoh: Bogor" className={inputClass} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Calendar className="w-4 h-4" /></div>
                      <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange}
                        className={inputClass} required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Nama Orang Tua / Wali <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Users className="w-4 h-4" /></div>
                    <input type="text" name="nama_ortu" value={formData.nama_ortu} onChange={handleChange}
                      placeholder="Contoh: H. Budi Santoso" className={inputClass} required />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    No. WhatsApp Orang Tua <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Phone className="w-4 h-4" /></div>
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                      placeholder="Contoh: 081234567890" className={inputClass} required />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea name="alamat" rows={3} value={formData.alamat} onChange={handleChange}
                    placeholder="Contoh: Jl. Kenanga No. 12, Kel. Sumber Jaya, Bogor"
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-xs md:text-sm"
                    required />
                </div>

                <button type="submit" disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${
                    loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5'
                  }`}>
                  {loading
                    ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Sedang Memproses...</>
                    : <>Kirim Pendaftaran Sekarang <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
