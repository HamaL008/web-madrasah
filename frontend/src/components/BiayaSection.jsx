import { CreditCard, Info } from 'lucide-react'

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export default function BiayaSection({ biaya = [] }) {
  if (!biaya.length) return null

  const total = biaya.reduce((acc, curr) => acc + curr.nominal, 0)

  return (
    <section id="biaya" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5" /> Transparansi Biaya
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-emerald-950 mb-3">
            Rincian Biaya PPDB
          </h2>
          <p className="text-slate-500 text-sm">
            Rincian kebutuhan biaya awal santri baru yang transparan untuk memudahkan perencanaan orang tua.
          </p>
        </div>

        <div className="max-w-2xl mx-auto reveal reveal-scale">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                  <th className="py-3.5 px-5 text-left w-8">No</th>
                  <th className="py-3.5 px-5 text-left">Rincian Biaya</th>
                  <th className="py-3.5 px-5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {biaya.map((fee, i) => (
                  <tr key={fee.id ?? i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 text-slate-400 text-xs">{i + 1}</td>
                    <td className="py-4 px-5 font-medium text-slate-700">{fee.item}</td>
                    <td className="py-4 px-5 text-right font-bold text-slate-800">{formatRupiah(fee.nominal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50 border-t-2 border-emerald-100">
                  <td colSpan={2} className="py-4 px-5 font-extrabold text-emerald-900 text-sm uppercase tracking-wide">
                    Total Biaya Awal
                  </td>
                  <td className="py-4 px-5 text-right font-extrabold text-emerald-900 text-base">
                    {formatRupiah(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-amber-800">Catatan:</span> Biaya di atas merupakan rincian awal masuk. Pembayaran dapat diangsur sesuai ketentuan Panitia PPDB.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
