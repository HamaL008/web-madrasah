import { Megaphone } from 'lucide-react'

export default function RunningText({ text }) {
  if (!text) return null
  return (
    <div className="bg-amber-400 text-emerald-950 font-sans font-semibold text-xs py-2 px-4 border-b border-amber-500/30 overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex items-center gap-1.5 bg-amber-500 text-emerald-950 px-2.5 py-0.5 rounded shadow-sm z-10 shrink-0 font-bold border border-amber-600/20 text-[10px]">
          <Megaphone className="w-3.5 h-3.5 animate-pulse" />
          <span>PENGUMUMAN</span>
        </div>
        <div className="overflow-hidden w-full ml-3 flex items-center">
          <div className="animate-marquee inline-flex gap-12 whitespace-nowrap font-medium text-[11px]">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
