import { useState, useEffect, useMemo } from 'react'
import { Check, X, Trash2, FileSpreadsheet, Search, Clock, CheckCircle, XCircle, Users, FileQuestion } from 'lucide-react'
import api from '../../../api/axios'
import * as XLSX from 'xlsx'

const STATUS_TABS = [
  { key: 'Semua',       label: 'Semua',        icon: Users,        color: 'text-slate-600'  },
  { key: 'Menunggu',    label: 'Menunggu',      icon: Clock,        color: 'text-amber-600'  },
  { key: 'Diverifikasi',label: 'Diverifikasi',  icon: CheckCircle,  color: 'text-emerald-700'},
  { key: 'Ditolak',     label: 'Ditolak',       icon: XCircle,      color: 'text-red-600'    },
]

const STATUS_STYLE = {
  Diverifikasi: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Ditolak:      'bg-red-50 text-red-800 border-red-200',
  Menunggu:     'bg-amber-50 text-amber-800 border-amber-200',
}

function DeleteModal({ isOpen, onClose, onConfirm, title = "Apakah Anda yakin ingin menghapus data ini?", subtitle = "Aksi ini tidak dapat dibatalkan." }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex-1">
            Batal
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm transition-colors flex-1">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
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

export default function PanelPendaftaran({ notify }) {
  const [registrants, setRegistrants] = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState('Semua')
  const [search, setSearch]           = useState('')
  const [deleteId, setDeleteId]       = useState(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT = 10

  const load = () => {
    setLoading(true)
    api.get('/admin/registrants')
      .then((res) => setRegistrants(res.data.data ?? res.data))
      .catch(() => notify('Gagal memuat data.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Hitung jumlah per status untuk badge tab
  const counts = useMemo(() => ({
    Semua:        registrants.length,
    Menunggu:     registrants.filter((r) => r.status === 'Menunggu').length,
    Diverifikasi: registrants.filter((r) => r.status === 'Diverifikasi').length,
    Ditolak:      registrants.filter((r) => r.status === 'Ditolak').length,
  }), [registrants])

  // Filter berdasarkan tab aktif + search
  const filtered = useMemo(() => {
    let list = activeTab === 'Semua' ? registrants : registrants.filter((r) => r.status === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) =>
        r.nama?.toLowerCase().includes(q) ||
        r.nama_ortu?.toLowerCase().includes(q) ||
        r.whatsapp?.includes(q) ||
        r.alamat?.toLowerCase().includes(q) ||
        r.asal_sekolah?.toLowerCase().includes(q)
      )
    }
    return list
  }, [registrants, activeTab, search])

  const paginatedRegistrants = useMemo(() => {
    return filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT)
  }, [filtered, currentPage])
  const totalPages = Math.ceil(filtered.length / LIMIT)

  // Reset page when filter changes
  useEffect(() => { setCurrentPage(1) }, [activeTab, search])

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/admin/registrants/${id}/status`, { status })
      setRegistrants((prev) => prev.map((r) => r.id === id ? res.data : r))
      notify(`Pendaftaran berhasil ${status === 'Diverifikasi' ? 'diverifikasi' : 'ditolak'}.`)
    } catch { notify('Gagal update status.', 'error') }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/admin/registrants/${deleteId}`)
      setRegistrants((prev) => prev.filter((r) => r.id !== deleteId))
      notify('Pendaftar berhasil dihapus.')
      const newTotal = Math.ceil((filtered.length - 1) / LIMIT)
      if (currentPage > newTotal && newTotal > 0) setCurrentPage(newTotal)
    } catch { notify('Gagal menghapus.', 'error') }
    setDeleteId(null)
  }

  const exportExcel = async () => {
    const source = filtered.length ? filtered : registrants
    if (!source.length) { notify('Data kosong.', 'error'); return }
    const data = source.map((r, i) => {
      const formattedDate = r.created_at 
        ? new Date(r.created_at).toLocaleString('id-ID', { 
            day: 'numeric', month: 'long', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          }).replace(/\./g, ':') // Some browsers use '.' for time separator in id-ID
        : '-';
      
      return {
        'No': i + 1, 'Nama': r.nama, 'Jenis Kelamin': r.jenis_kelamin, 'Tempat Lahir': r.tempat_lahir,
        'Tanggal Lahir': r.tanggal_lahir, 'Asal Sekolah': r.asal_sekolah, 'Jenjang': r.jenjang, 'Alamat': r.alamat,
        'Orang Tua': r.nama_ortu, 'WhatsApp': r.whatsapp, 'Status': r.status,
        'Tanggal Daftar': formattedDate,
      };
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Pendaftar')
    const suffix = activeTab !== 'Semua' ? `_${activeTab}` : ''
    XLSX.writeFile(wb, `Data_Pendaftar${suffix}_${new Date().getFullYear()}.xlsx`)
    notify('File Excel berhasil diunduh.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Daftar Pendaftar</h1>
          <p className="text-slate-500 text-xs mt-1">Kelola dan verifikasi formulir calon santri baru.</p>
        </div>
        <button onClick={exportExcel}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0">
          <FileSpreadsheet className="w-4 h-4" /> Ekspor ke Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === key
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-800'
            }`}>
            <Icon className={`w-3.5 h-3.5 ${activeTab === key ? 'text-white' : color}`} />
            {label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama, orang tua, WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                {['Tanggal Daftar', 'Nama', 'L/P', 'TTL', 'Orang Tua', 'WhatsApp', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr><td colSpan={8} className="p-10 text-center text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <FileQuestion className="w-10 h-10 text-slate-300" />
                      <p className="text-sm">
                        {search ? `Tidak ada hasil pencarian untuk "${search}"` : 'Belum ada data pendaftar.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRegistrants.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                    {reg.created_at?.slice(0, 16).replace('T', ' ')}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{reg.nama}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-bold">{reg.jenis_kelamin}</td>
                  <td className="px-4 py-3.5 text-slate-600">{reg.tempat_lahir}, {reg.tanggal_lahir}</td>
                  <td className="px-4 py-3.5 text-slate-600">{reg.nama_ortu}</td>
                  <td className="px-4 py-3.5">
                    <a href={`https://wa.me/${reg.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold">
                      +{reg.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLE[reg.status] ?? ''}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {reg.status === 'Menunggu' && (<>
                        <button onClick={() => updateStatus(reg.id, 'Diverifikasi')} title="Verifikasi"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 p-1.5 rounded-lg border border-emerald-200/50 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => updateStatus(reg.id, 'Ditolak')} title="Tolak"
                          className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg border border-red-200/50 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>)}
                      <button onClick={() => setDeleteId(reg.id)} title="Hapus"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-1.5 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Menampilkan <span className="font-bold text-slate-600">{paginatedRegistrants.length}</span> dari <span className="font-bold text-slate-600">{filtered.length}</span> pendaftar</span>
            {activeTab !== 'Semua' && (
              <span className="font-semibold text-emerald-700">Filter: {activeTab}</span>
            )}
          </div>
        )}
        <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
      </div>

      <DeleteModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  )
}
