import { useState, useEffect } from 'react'
import { Check, X, Trash2, FileSpreadsheet } from 'lucide-react'
import api from '../../../api/axios'

const statusClass = {
  Diverifikasi: 'bg-emerald-50 text-emerald-800',
  Ditolak: 'bg-red-50 text-red-800',
  Menunggu: 'bg-amber-50 text-amber-800',
}

export default function PanelPPDB({ notify }) {
  const [registrants, setRegistrants] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/admin/registrants')
      .then((res) => setRegistrants(res.data.data ?? res.data))
      .catch(() => notify('Gagal memuat data.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/admin/registrants/${id}/status`, { status })
      setRegistrants((prev) => prev.map((r) => r.id === id ? res.data : r))
      notify(`Pendaftaran berhasil ${status === 'Diverifikasi' ? 'diverifikasi' : 'ditolak'}.`)
    } catch { notify('Gagal update status.', 'error') }
  }

  const deleteReg = async (id) => {
    if (!confirm('Hapus data pendaftar ini?')) return
    try {
      await api.delete(`/admin/registrants/${id}`)
      setRegistrants((prev) => prev.filter((r) => r.id !== id))
      notify('Pendaftar berhasil dihapus.')
    } catch { notify('Gagal menghapus.', 'error') }
  }

  const exportExcel = async () => {
    const { default: XLSX } = await import('xlsx')
    if (!registrants.length) { notify('Data kosong.', 'error'); return }
    const data = registrants.map((r, i) => ({
      'No': i + 1, 'ID': r.id, 'Nama': r.nama, 'Tempat Lahir': r.tempat_lahir,
      'Tanggal Lahir': r.tanggal_lahir, 'Alamat': r.alamat,
      'Orang Tua': r.nama_ortu, 'WhatsApp': r.whatsapp, 'Status': r.status,
      'Tanggal Daftar': r.created_at,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'PPDB')
    XLSX.writeFile(wb, `Pendaftar_PPDB_${new Date().getFullYear()}.xlsx`)
    notify('File Excel berhasil diunduh.')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Daftar Pendaftar PPDB</h1>
          <p className="text-slate-500 text-xs mt-1">Kelola data formulir calon santri baru.</p>
        </div>
        <button onClick={exportExcel} className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" /> Ekspor ke Excel
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                {['Tanggal', 'Nama', 'TTL', 'Orang Tua', 'WhatsApp', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
              ) : registrants.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Belum ada data pendaftar.</td></tr>
              ) : registrants.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500 whitespace-nowrap">{reg.created_at?.slice(0, 16).replace('T', ' ')}</td>
                  <td className="p-4 font-bold">{reg.nama}</td>
                  <td className="p-4">{reg.tempat_lahir}, {reg.tanggal_lahir}</td>
                  <td className="p-4">{reg.nama_ortu}</td>
                  <td className="p-4">
                    <a href={`https://wa.me/${reg.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold">+{reg.whatsapp}</a>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusClass[reg.status] ?? ''}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {reg.status === 'Menunggu' && (<>
                        <button onClick={() => updateStatus(reg.id, 'Diverifikasi')} title="Verifikasi"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 p-1.5 rounded-lg border border-emerald-200/30">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(reg.id, 'Ditolak')} title="Tolak"
                          className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg border border-red-200/30">
                          <X className="w-4 h-4" />
                        </button>
                      </>)}
                      <button onClick={() => deleteReg(reg.id)} title="Hapus"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
