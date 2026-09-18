import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';
import { ArrowRight, Shield, Zap, Users, MapPin, Star, ChevronRight, CheckCircle, Flame, Target, Activity, Bell, ArrowUpRight, Navigation } from 'lucide-react';
import { NaviSVG } from '../components/Navi';
import ParticleBackground from '../components/ParticleBackground';
import Navbar from '../components/Navbar';

// Quotes reflecting civic duty
const QUOTES = [
  { text: "Your city is a mirror of its citizens. Every pothole you report is a vote for the city you deserve." },
  { text: "Swachh Bharat is not a government scheme. It is 1.4 billion daily decisions." },
  { text: "It takes 30 seconds to report a broken light. It takes one dark night to regret not doing it." },
  { text: "Gandhi did not ask who was responsible. He picked up the broom. Today, the broom is in your pocket." },
  { text: "Your tax rupees built that road. Your report fixes it. You are not complaining — you are governing." },
];

const FEATURES = [
  { icon: '📸', title: 'One-Photo Report', desc: 'Snap & submit. Gemini AI analyses the issue instantly.', color: '#1D9E75' },
  { icon: '🎤', title: 'Voice in Any Language', desc: 'Speak Hindi, Marathi, Kannada — CivicBot understands.', color: '#534AB7' },
  { icon: '⚡', title: 'Agentic SLA Enforcer', desc: 'AI automatically escalates ignored issues up the municipal hierarchy.', color: '#BA7517' },
  { icon: '🗺️', title: 'Live Radar Heatmap', desc: 'See every civic problem in your city mapped in real time.', color: '#185FA5' },
  { icon: '🏆', title: 'Civic Karma Tiers', desc: 'Earn points, unlock legendary ranks, and top your ward leaderboards.', color: '#D85A30' },
  { icon: '📊', title: 'AI Ward Report Cards', desc: 'Monthly performance grades issued publicly to municipal officials.', color: '#639922' },
  { icon: '🚨', title: 'Danger Escalation', desc: 'Life-threatening concerns automatically alert residents within 500m.', color: '#FF2D55' },
  { icon: '👥', title: 'Local Fix-It Squads', desc: 'Form micro-teams to organize physical community cleanup actions.', color: '#1D9E75' },
];

const STATS = [
  { label: 'Issues Reported', value: 3820, suffix: '+' },
  { label: 'Issues Resolved', value: 2195, suffix: '+' },
  { label: 'Cities Monitored', value: 18, suffix: '' },
  { label: 'Registered Heroes', value: 7600, suffix: '+' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [naviMood, setNaviMood] = useState('happy');
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(i => (i + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const statsRef = useRef<HTMLDivElement | null>(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="min-h-screen bg-[#050d0a] overflow-x-hidden relative">
      <Navbar />
      
      {/* HERO SECTION */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[760px] flex items-center pt-28 pb-16 overflow-hidden"
      >
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div className="absolute inset-0 aurora-bg pointer-events-none" />
        <div className="absolute -top-32 left-[42%] w-[34rem] h-[34rem] rounded-full bg-[#63f5b0]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono font-bold text-[#63f5b0] mb-7"
            >
              <span className="w-2 h-2 bg-[#63f5b0] rounded-full shadow-[0_0_14px_#63f5b0] animate-pulse" />
              Bengaluru ward network is live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="text-5xl md:text-7xl font-grotesk font-bold tracking-[-0.04em] leading-[0.95] mb-7"
            >
              The city gets
              <br />
              better when
              <br />
              <span className="gradient-text neon-text"><TypeAnimation sequence={['you speak.', 2200, 'we act.', 2200, 'issues move.', 2200]} wrapper="span" repeat={Infinity} /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-text-secondary text-base md:text-lg max-w-xl mb-9 leading-relaxed"
            >
              Snap a civic problem, let AI route it to the right department, and follow every step until your neighborhood sees the fix.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <motion.button onClick={() => navigate('/report')} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="group px-6 py-4 bg-[#63f5b0] text-[#07110d] rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_12px_35px_rgba(99,245,176,0.2)] cursor-pointer">
                Report an issue <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
              <motion.button onClick={() => navigate('/map')} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="px-6 py-4 bg-white/[0.04] border border-white/15 text-text-primary rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#63f5b0]/50 transition-colors cursor-pointer">
                <MapPin size={15} className="text-[#63f5b0]" /> Open live radar
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
              <span className="flex items-center gap-2"><CheckCircle size={13} className="text-[#63f5b0]" /> AI triage in seconds</span>
              <span className="flex items-center gap-2"><Shield size={13} className="text-[#72a9f8]" /> Public accountability</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="absolute -inset-5 bg-[#63f5b0]/5 blur-3xl rounded-[2rem]" />
            <div className="relative bg-[#0b1713]/90 border border-[#63f5b0]/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#63f5b0]/12 border border-[#63f5b0]/25 flex items-center justify-center"><Navigation size={15} className="text-[#63f5b0]" /></div>
                  <div><p className="text-xs font-grotesk font-bold text-text-primary">Ward pulse</p><p className="text-[9px] text-text-tertiary font-mono">LIVE CIVIC OPERATIONS</p></div>
                </div>
                <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#63f5b0] uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[#63f5b0] animate-pulse" /> Synced</span>
              </div>

              <div className="relative h-[270px] overflow-hidden bg-[#0c1d17]">
                <div className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(99,245,176,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,245,176,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <svg viewBox="0 0 600 270" className="absolute inset-0 w-full h-full opacity-50" aria-hidden="true">
                  <path d="M-20 210 C120 150 150 245 275 170 S460 70 620 125" fill="none" stroke="#72a9f8" strokeOpacity=".35" strokeWidth="14" />
                  <path d="M-10 78 L610 215 M130 -10 L180 280 M440 -10 L350 280 M20 150 C160 80 270 240 590 65" fill="none" stroke="#63f5b0" strokeOpacity=".24" strokeWidth="2" />
                  <path d="M0 40 H600 M0 240 H600" fill="none" stroke="#63f5b0" strokeOpacity=".12" strokeWidth="1" />
                </svg>
                {[
                  { x: '23%', y: '35%', color: '#ff6477', label: 'Drain overflow' },
                  { x: '66%', y: '28%', color: '#ffb547', label: 'Streetlight' },
                  { x: '48%', y: '68%', color: '#63f5b0', label: 'Resolved' },
                  { x: '79%', y: '71%', color: '#ff6477', label: 'Pothole' },
                ].map((pin, index) => (
                  <motion.div key={pin.label} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + index * 0.12 }} className="absolute" style={{ left: pin.x, top: pin.y }}>
                    <span className="absolute -inset-2 rounded-full animate-ping opacity-25" style={{ backgroundColor: pin.color }} />
                    <span className="relative block w-3 h-3 rounded-full border-2 border-[#0c1d17] shadow-lg" style={{ backgroundColor: pin.color }} />
                  </motion.div>
                ))}
                <div className="absolute left-4 bottom-4 px-3 py-2 rounded-lg bg-[#08100e]/85 border border-white/10 backdrop-blur-md"><p className="text-[9px] text-text-tertiary font-mono uppercase">Active in Ward 174</p><p className="text-lg font-grotesk font-bold text-text-primary">42 <span className="text-[10px] font-mono text-[#ffb547]">issues tracked</span></p></div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                {[
                  { label: 'Resolved', value: '87%', color: 'text-[#63f5b0]' },
                  { label: 'Avg response', value: '8.4h', color: 'text-[#72a9f8]' },
                  { label: 'Citizens', value: '2.4k', color: 'text-[#ffb547]' },
                ].map(stat => <div key={stat.label} className="px-4 py-4"><p className={`text-xl font-grotesk font-bold ${stat.color}`}>{stat.value}</p><p className="text-[9px] font-mono text-text-tertiary uppercase mt-1">{stat.label}</p></div>)}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between"><p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Latest movement</p><Activity size={14} className="text-[#63f5b0]" /></div>
                {[
                  { title: 'Drain overflow', meta: 'Assigned to BBMP Water', color: '#ff6477' },
                  { title: 'Streetlight restored', meta: 'Verified 12 min ago', color: '#63f5b0' },
                ].map(item => <div key={item.title} className="flex items-center gap-3"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /><div className="flex-1"><p className="text-[11px] font-semibold text-text-primary">{item.title}</p><p className="text-[9px] text-text-tertiary font-mono">{item.meta}</p></div><ArrowRight size={13} className="text-text-tertiary" /></div>)}
              </div>
            </div>
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-5 -bottom-7 w-20 h-20 rounded-2xl bg-[#12231d] border border-[#63f5b0]/25 flex items-center justify-center shadow-xl hidden sm:flex"><NaviSVG mood={naviMood} size={58} /></motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* STATS BENTO SECTION */}
      <section ref={statsRef} className="py-20 relative border-t border-[#1D9E75]/10 bg-[#061410]/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-[#1D9E75]/15"
              >
                <div className="text-3xl md:text-4xl font-grotesk font-extrabold text-[#00FF88]">
                  {statsInView && (
                    <CountUp end={stat.value} duration={2.5} separator="," />
                  )}
                  {stat.suffix}
                </div>
                <p className="text-text-tertiary text-[10px] uppercase font-mono tracking-wider mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#00FF88] text-xs font-mono font-bold uppercase tracking-widest">CIVIC ENGINE CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-grotesk font-extrabold text-text-primary mt-2 leading-tight">
              A civic platform built with
              <br />
              <span className="gradient-text">military-grade accountability.</span>
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto mt-4 leading-relaxed">
              We leverage large-multimodal LLMs to streamline validation, predict SLA resolutions, and automate public escalations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-5 border border-[#1D9E75]/15 card-hover flex flex-col h-full justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}35` }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-grotesk font-bold text-sm text-text-primary">{feature.title}</h3>
                    <p className="text-text-tertiary text-xs mt-2 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES HERO */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#050d0a] to-[#0c2217]/40 border-y border-[#1D9E75]/10">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden border border-[#1D9E75]/25 shadow-2xl">
            <div className="absolute -top-6 left-6 text-[140px] text-[#00FF88]/5 font-grotesk select-none leading-none">“</div>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quoteIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-2xl font-grotesk font-medium text-text-secondary leading-relaxed text-center relative z-10"
              >
                {QUOTES[quoteIndex].text}
              </motion.blockquote>
            </AnimatePresence>
            
            {/* Quote Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {QUOTES.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setQuoteIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${i === quoteIndex ? 'bg-[#00FF88] w-6' : 'bg-text-tertiary/40 w-1.5'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ESCALATION ENGINE */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[#FF2D55] text-xs font-mono font-bold uppercase tracking-widest">SLA SHAME ESCALATION PROTOCOL</span>
            <h2 className="text-3xl md:text-5xl font-grotesk font-extrabold text-text-primary mt-2">
              Our automated countdown
              <br />
              <span className="text-[#FF2D55]">escalates neglected complaints.</span>
            </h2>
          </motion.div>
          
          <div className="relative">
            {/* Timeline thread line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00FF88] via-[#BA7517] to-[#FF2D55]" />
            
            {[
              { time: 'T+0h', label: 'Civic Issue Filed', desc: 'Gemini assigns appropriate category and department. SLA timers initialize.', color: '#00FF88' },
              { time: 'SLA T-12h', label: 'Departmental Alert', desc: 'Shorthand warnings fired to engineers. Department staff prompted.', color: '#BA7517' },
              { time: 'SLA T+0h', label: 'Grade Penalty & Red Label', desc: 'SLA countdown expires. Ward grading drops. Ward Councillor carbon-copied.', color: '#FF2D55' },
              { time: 'SLA T+48h', label: 'Citizen Mobilisation Broadcast', desc: 'Platform alerts all users registered within 1km. Community voting surges.', color: '#FF2D55' },
              { time: 'SLA T+96h', label: 'RTI Auto-Filing Generation', desc: 'Gemini prepares custom Right to Information formats, downloadable with one tap.', color: '#FF2D55' },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 mb-8 ml-4 group relative z-10"
              >
                <div 
                  className="w-4.5 h-4.5 rounded-full mt-3 flex-shrink-0 -ml-8.5 border-4 border-[#050d0a] transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: step.color, boxShadow: `0 0 10px ${step.color}60` }} 
                />
                <div className="glass rounded-2xl p-5 flex-1 hover:border-[#00FF88]/30 transition-all card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold" style={{ backgroundColor: `${step.color}15`, color: step.color }}>{step.time}</span>
                    <h3 className="font-grotesk font-extrabold text-sm text-text-primary">{step.label}</h3>
                  </div>
                  <p className="text-text-tertiary text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1D9E75]/15 py-16 bg-[#040a08]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <NaviSVG size={36} mood="happy" />
            <div className="text-left">
              <p className="font-grotesk font-bold text-text-primary text-base">CivicPulse</p>
              <p className="text-text-tertiary text-xs">Powered by Gemini AI × Google Maps</p>
            </div>
          </div>
          <p className="text-text-tertiary text-xs text-center md:max-w-md leading-relaxed">
            Designed for civic transparency and citizen-led action. Built for Hackathons & Swachh city campaigns.
          </p>
          <div className="flex gap-6">
            {['Map Heatmap', 'Report Issue', 'Leaderboard'].map(link => (
              <button key={link} onClick={() => navigate(`/${link.toLowerCase().split(' ')[0]}`)}
                className="text-text-tertiary text-xs font-mono font-bold uppercase tracking-wider hover:text-[#00FF88] transition-colors cursor-pointer">{link}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
