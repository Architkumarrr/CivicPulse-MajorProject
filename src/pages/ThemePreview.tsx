import { useState } from 'react';
import { Activity, ArrowUpRight, Bell, CheckCircle2, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';

type ThemeKey = 'signal' | 'luxe' | 'current';

const THEMES: Record<ThemeKey, { name: string; tagline: string; bg: string; panel: string; ink: string; muted: string; accent: string; secondary: string; danger: string; border: string }> = {
  signal: {
    name: 'Civic Signal',
    tagline: 'Professional civic operations',
    bg: '#08100e', panel: '#10221b', ink: '#effaf4', muted: '#9eb9aa', accent: '#63f5b0', secondary: '#72a9f8', danger: '#ff6477', border: 'rgba(99,245,176,.22)'
  },
  luxe: {
    name: 'Civic Luxe',
    tagline: 'Premium public-service platform',
    bg: '#10151c', panel: '#1b242d', ink: '#f6f1e7', muted: '#b6b9b4', accent: '#d8b36a', secondary: '#86a9c4', danger: '#e7766f', border: 'rgba(216,179,106,.28)'
  },
  current: {
    name: 'Neon Emerald',
    tagline: 'Futuristic civic-tech prototype',
    bg: '#050d0a', panel: '#0c2217', ink: '#f3fcf8', muted: '#82a895', accent: '#00ff88', secondary: '#534ab7', danger: '#ff2d55', border: 'rgba(29,158,117,.28)'
  }
};

export default function ThemePreview() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('signal');
  const theme = THEMES[themeKey];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: theme.bg, color: theme.ink }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 space-y-8">
        <header className="max-w-3xl">
          <p className="text-[10px] font-mono uppercase tracking-[.2em]" style={{ color: theme.accent }}>Theme preview lab</p>
          <h1 className="font-grotesk font-bold text-4xl md:text-6xl mt-3 tracking-tight">Choose the feeling of CivicPulse.</h1>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: theme.muted }}>Switch themes below. This preview uses the same product surfaces you will see in the live landing page, dashboard, report flow, and admin portal.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(THEMES) as ThemeKey[]).map(key => {
            const option = THEMES[key];
            return <button key={key} onClick={() => setThemeKey(key)} className="text-left p-4 rounded-xl border transition-all" style={{ background: option.panel, borderColor: key === themeKey ? option.accent : option.border, color: option.ink }}>
              <span className="block text-sm font-grotesk font-bold">{option.name}</span>
              <span className="block text-xs mt-1" style={{ color: option.muted }}>{option.tagline}</span>
              <span className="flex gap-1.5 mt-4"><i className="w-5 h-5 rounded-full" style={{ background: option.accent }} /><i className="w-5 h-5 rounded-full" style={{ background: option.secondary }} /><i className="w-5 h-5 rounded-full" style={{ background: option.danger }} /></span>
            </button>;
          })}
        </div>

        <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
          <div className="rounded-2xl border p-6 relative overflow-hidden" style={{ background: theme.panel, borderColor: theme.border }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${theme.accent} 1px, transparent 1px), linear-gradient(90deg, ${theme.accent} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
            <div className="relative">
              <div className="flex justify-between items-start"><div><p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.muted }}>Live ward pulse</p><h2 className="font-grotesk font-bold text-3xl mt-2">Your city, in motion.</h2></div><Bell size={18} style={{ color: theme.accent }} /></div>
              <p className="text-sm mt-4 max-w-md" style={{ color: theme.muted }}>AI routes the right issue to the right department and keeps the public timeline visible.</p>
              <div className="grid grid-cols-3 gap-3 mt-10">
                {['87% resolved', '8.4h response', '2.4k citizens'].map(value => <div key={value} className="rounded-xl p-3 border" style={{ background: `${theme.bg}bb`, borderColor: theme.border }}><span className="text-sm font-grotesk font-bold" style={{ color: theme.accent }}>{value.split(' ')[0]}</span><span className="block text-[9px] uppercase font-mono mt-1" style={{ color: theme.muted }}>{value.substring(value.indexOf(' ') + 1)}</span></div>)}
              </div>
              <div className="flex items-end justify-between mt-12 h-28">
                {[42, 58, 48, 76, 62, 88, 70, 94, 80].map((height, index) => <motion.span key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * .04 }} className="w-full mx-1 rounded-t-sm" style={{ background: index === 7 ? theme.accent : `${theme.secondary}aa` }} />)}
              </div>
              <div className="flex items-center gap-2 text-xs mt-4" style={{ color: theme.muted }}><Activity size={14} style={{ color: theme.accent }} /> Latest movement: streetlight restored 12 min ago</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border p-6" style={{ background: theme.panel, borderColor: theme.border }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.accent}20`, color: theme.accent }}><Sparkles size={20} /></div><div><p className="font-grotesk font-bold">AI report insight</p><p className="text-xs mt-1" style={{ color: theme.muted }}>92% confidence · Electricity</p></div></div><p className="text-sm mt-5 leading-relaxed" style={{ color: theme.muted }}>“The image appears to show a non-functional streetlight near a residential road. Route to the electricity department.”</p><div className="flex items-center gap-2 mt-5 text-xs" style={{ color: theme.accent }}><CheckCircle2 size={14} /> Explainable classification</div></div>
            <div className="rounded-2xl border p-6" style={{ background: theme.panel, borderColor: theme.border }}><div className="flex justify-between items-center"><p className="font-grotesk font-bold">Make your neighborhood heard</p><ShieldCheck size={18} style={{ color: theme.secondary }} /></div><div className="flex gap-3 mt-5"><button className="rounded-lg px-4 py-3 text-xs font-bold flex items-center gap-2" style={{ background: theme.accent, color: theme.bg }}>Report issue <ArrowUpRight size={14} /></button><button className="rounded-lg px-4 py-3 text-xs font-bold flex items-center gap-2 border" style={{ borderColor: theme.border, color: theme.ink }}><MapPin size={14} style={{ color: theme.accent }} /> Open radar</button></div></div>
          </div>
        </section>
        <p className="text-xs" style={{ color: theme.muted }}>Current preview: <strong style={{ color: theme.accent }}>{theme.name}</strong>. Open <span className="font-mono">/themes</span> anytime to compare again.</p>
      </main>
    </div>
  );
}