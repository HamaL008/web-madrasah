import {
  CheckCircle, Users, GraduationCap, Award, BookOpen,
  ExternalLink, ShieldCheck, CreditCard, Image as ImageIcon
} from 'lucide-react'

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export default function ProfileSections({ sejarah, visi, misi, kurikulum, biaya, driveLegalitas, galeri }) {
  const totalBiaya = biaya.reduce((acc, curr) => acc + curr.nominal, 0)

  return (
    <div className="w-full">
      {/* SEJARAH */}
      <section id="sejarah" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> Sejarah & Latar Belakang
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950">Tumbuh Bersama Nilai-Nilai Islam</h2>
              <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                {sejarah.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-8 rounded-2xl shadow-xl border border-emerald-800">
                <h3 className="text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Identitas Madrasah
                </h3>
                <div className="space-y-4 text-xs md:text-sm">
                  {[
                    ['Lembaga Naungan', 'Yayasan Ponpes Hikmatul Furqon'],
                    ['Tahun Berdiri', '2012'],
                    ['Status Akreditasi', <span className="text-amber-300 bg-emerald-900/60 px-2 py-0.5 rounded text-[10px]">Terakreditasi A</span>],
                    ['Kurikulum Utama', 'Kemenag & Pesantren Salaf'],
                    ['Lokasi', 'Bogor, Jawa Barat'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between border-b border-emerald-900 pb-2">
                      <span className="text-emerald-300 font-medium">{label}</span>
                      <span className="font-bold text-right">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-emerald-900 text-center">
                  <p className="text-slate-300 text-xs italic">"Mencetak generasi yang mutafaqqih fid din dan berwawasan iptek."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="bg-emerald-900 py-10 border-y border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              [Users, '350+', 'Santri Aktif'],
              [GraduationCap, '15', 'Ustadz'],
              [GraduationCap, '12', 'Ustadzah'],
              [Award, '100%', 'Kelulusan'],
            ].map(([Icon, val, label]) => (
              <div key={label} className="flex flex-col items-center p-2">
                <div className="bg-emerald-800 text-amber-300 p-3 rounded-full mb-3">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <span className="text-2xl md:text-4xl font-extrabold text-white">{val}</span>
                <span className="text-xs text-emerald-200 mt-1 font-semibold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISI MISI KURIKULUM */}
      <section id="visi-misi" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-4">Visi, Misi & Kurikulum Unggulan</h2>
            <p className="text-slate-600 text-sm">Arah bimbingan dan kurikulum yang didesain secara integratif untuk mencetak generasi sholeh, cerdas, dan mandiri.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
              <h3 className="text-xl font-bold text-emerald-950 pb-3 border-b border-slate-100 flex items-center gap-2.5 mb-6">
                <span className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg"><CheckCircle className="w-5 h-5" /></span>
                Visi & Misi Madrasah
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">Visi</span>
              <p className="mt-3 text-emerald-950 font-bold text-base italic leading-relaxed mb-6">"{visi}"</p>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">Misi</span>
              <ul className="mt-4 space-y-3">
                {misi.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-950 text-white p-8 rounded-2xl shadow-md border border-emerald-900">
              <h3 className="text-xl font-bold pb-3 border-b border-emerald-900 flex items-center gap-2.5 mb-5">
                <span className="bg-emerald-900 text-amber-300 p-1.5 rounded-lg"><BookOpen className="w-5 h-5" /></span>
                Program Kurikulum Terpadu
              </h3>
              <p className="text-slate-300 text-sm mb-5">Mengintegrasikan kurikulum resmi Kementerian Agama dengan khazanah keilmuan pesantren salafiyah tradisional.</p>
              <ul className="space-y-4">
                {kurikulum.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-emerald-900/40 border border-emerald-900/60 p-3 rounded-xl">
                    <span className="flex items-center justify-center bg-amber-400 text-emerald-950 font-bold rounded-full w-5 h-5 text-xs shrink-0">{i + 1}</span>
                    <span className="text-sm font-semibold text-emerald-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BIAYA */}
      <section id="biaya" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <CreditCard className="w-3.5 h-3.5" /> Transparansi Biaya
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-3">Rincian Biaya PPDB</h2>
            <p className="text-slate-600 text-sm">Rincian kebutuhan biaya awal santri baru yang transparan untuk memudahkan perencanaan orang tua wali.</p>
          </div>
          <div className="max-w-3xl mx-auto bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-emerald-900/20 text-emerald-950 uppercase font-bold text-[10px]">
                  <th className="py-3 px-2">No</th>
                  <th className="py-3 px-4">Rincian</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {biaya.map((fee, i) => (
                  <tr key={fee.id} className="hover:bg-slate-100/50 transition-colors">
                    <td className="py-3.5 px-2">{i + 1}</td>
                    <td className="py-3.5 px-4 font-medium">{fee.item}</td>
                    <td className="py-3.5 px-4 text-right font-bold">{formatRupiah(fee.nominal)}</td>
                  </tr>
                ))}
                <tr className="bg-emerald-50 text-emerald-900 font-bold border-t-2 border-emerald-900/30">
                  <td colSpan={2} className="py-4 px-4 font-bold uppercase tracking-wider">Total Biaya Awal</td>
                  <td className="py-4 px-4 text-right font-extrabold">{formatRupiah(totalBiaya)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 bg-amber-50 border border-amber-200/50 p-4 rounded-xl text-xs text-slate-600 flex items-start gap-3">
              <span className="font-bold text-amber-700 text-base">ℹ</span>
              <p><span className="font-bold text-amber-800">Catatan:</span> Biaya di atas merupakan rincian awal masuk. Pembayaran dapat diangsur sesuai ketentuan panitia PPDB.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <ImageIcon className="w-3.5 h-3.5" /> Dokumentasi Kegiatan
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-3">Galeri Kegiatan Madrasah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {galeri.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-all group">
                <div className="h-52 w-full bg-slate-200 overflow-hidden flex items-center justify-center">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-amber-400 mb-2 animate-pulse" />
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Dokumentasi</span>
                      </div>
                  }
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-emerald-950 mb-1.5 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Legalitas */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 md:p-8 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Legalitas & Perizinan Yayasan
              </h3>
              <p className="text-slate-300 text-xs max-w-xl">Madrasah Miftahul Ulum beroperasi secara resmi di bawah Yayasan Pondok Pesantren Hikmatul Furqon. Seluruh berkas SK dan Akreditasi dapat diakses publik.</p>
            </div>
            <a href={driveLegalitas} target="_blank" rel="noopener noreferrer"
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 w-full md:w-auto justify-center">
              Lihat Dokumen Legalitas <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
