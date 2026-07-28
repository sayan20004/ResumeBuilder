import type { ResumeData } from '@/types/resume';
import { dateRange } from '@/types/resume';

export interface ThemeProps {
  data: ResumeData;
  accent: string;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/* ---------- Modern ---------- */
export function ModernTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="px-10 py-8" style={{ backgroundColor: accent }}>
        <div className="flex items-center gap-5">
          {p.photo ? (
            <img src={p.photo} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white/30" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {initials(p.fullName)}
            </div>
          )}
          <div className="text-white">
            <h1 className="text-3xl font-bold">{p.fullName}</h1>
            <p className="text-lg opacity-90">{p.jobTitle}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/90">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-10 py-6">
        {summary && (
          <Section title="Profile" accent={accent}>
            <p className="text-sm leading-relaxed">{summary}</p>
          </Section>
        )}
        {experience.length > 0 && (
          <Section title="Experience" accent={accent}>
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{e.position}</h3>
                  <span className="text-xs text-gray-500">{dateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <p className="text-sm" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>
              </div>
            ))}
          </Section>
        )}
        {education.length > 0 && (
          <Section title="Education" accent={accent}>
            {education.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{e.degree}{e.field && `, ${e.field}`}</h3>
                  <span className="text-xs text-gray-500">{dateRange(e.startDate, e.endDate, false)}</span>
                </div>
                <p className="text-sm" style={{ color: accent }}>{e.institution}</p>
                {e.description && <p className="text-sm mt-1">{e.description}</p>}
              </div>
            ))}
          </Section>
        )}
        {skills.length > 0 && (
          <Section title="Skills" accent={accent}>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}
        {projects.length > 0 && (
          <Section title="Projects" accent={accent}>
            {projects.map((p) => (
              <div key={p.id} className="mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                <p className="text-sm">{p.description}</p>
                {p.link && <p className="text-xs" style={{ color: accent }}>{p.link}</p>}
              </div>
            ))}
          </Section>
        )}
        {languages.length > 0 && (
          <Section title="Languages" accent={accent}>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {languages.map((l) => (
                <span key={l.id}><span className="font-medium">{l.name}</span> · {l.proficiency}</span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ---------- Minimal ---------- */
export function MinimalTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="px-10 pt-12 pb-4">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{p.fullName}</h1>
        <p className="text-lg font-light text-gray-500 mt-1">{p.jobTitle}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-10 pb-12">
        {summary && (
          <section className="mb-6 mt-4">
            <p className="text-sm leading-relaxed text-gray-600 font-light">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-5 grid grid-cols-[1fr_2fr] gap-6">
                <div>
                  <p className="text-xs text-gray-400">{dateRange(e.startDate, e.endDate, e.current)}</p>
                  <p className="text-sm font-medium" style={{ color: accent }}>{e.company}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{e.position}</h3>
                  <p className="text-sm mt-1 whitespace-pre-line leading-relaxed text-gray-600">{e.description}</p>
                </div>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Education</h2>
              {education.map((e) => (
                <div key={e.id} className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{e.degree}{e.field && `, ${e.field}`}</h3>
                  <p className="text-sm" style={{ color: accent }}>{e.institution}</p>
                  <p className="text-xs text-gray-400">{dateRange(e.startDate, e.endDate, false)}</p>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
                {skills.map((s) => <span key={s.id}>{s.name}</span>)}
              </div>
            </section>
          )}
        </div>
        {projects.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Languages</h2>
            <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
              {languages.map((l) => <span key={l.id}>{l.name} ({l.proficiency})</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Classic ---------- */
export function ClassicTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="px-10 py-8 text-center border-b-2" style={{ borderColor: accent }}>
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">{p.fullName}</h1>
        <p className="text-lg mt-1" style={{ color: accent }}>{p.jobTitle}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-10 py-6">
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Summary</h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{e.position}, {e.company}</h3>
                  <span className="text-sm text-gray-500 italic">{dateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Education</h2>
            {education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{e.degree}{e.field && `, ${e.field}`}</h3>
                  <span className="text-sm text-gray-500 italic">{dateRange(e.startDate, e.endDate, false)}</span>
                </div>
                <p className="text-sm" style={{ color: accent }}>{e.institution}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Skills</h2>
            <p className="text-sm">{skills.map((s) => s.name).join(' · ')}</p>
          </section>
        )}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-1">
                <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                <p className="text-sm">{p.description}</p>
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>Languages</h2>
            <p className="text-sm">{languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */
export function SidebarTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800 flex" style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100%' }}>
      <aside className="w-1/3 p-8 text-white" style={{ backgroundColor: accent }}>
        <div className="flex flex-col items-center text-center mb-6">
          {p.photo ? (
            <img src={p.photo} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white/20 mb-4" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-4">
              {initials(p.fullName)}
            </div>
          )}
          <h1 className="text-2xl font-bold">{p.fullName}</h1>
          <p className="text-sm opacity-90 mt-1">{p.jobTitle}</p>
        </div>
        <div className="space-y-2 text-sm mb-8">
          {p.email && <p className="break-all">{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
          {p.website && <p className="break-all">{p.website}</p>}
        </div>
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-white/30">Skills</h2>
            <div className="space-y-3">
              {skills.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{s.name}</span><span>{s.level}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-white/30">Languages</h2>
            <div className="space-y-1 text-sm">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span>{l.name}</span><span className="opacity-80">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 p-8">
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: accent }}>Profile</h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-3" style={{ color: accent }}>Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-4 pl-4 border-l-2" style={{ borderColor: accent }}>
                <h3 className="font-semibold text-gray-900">{e.position}</h3>
                <p className="text-sm text-gray-500">{e.company} · {dateRange(e.startDate, e.endDate, e.current)}</p>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-3" style={{ color: accent }}>Education</h2>
            {education.map((e) => (
              <div key={e.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: accent }}>
                <h3 className="font-semibold text-gray-900 text-sm">{e.degree}{e.field && `, ${e.field}`}</h3>
                <p className="text-sm text-gray-500">{e.institution} · {dateRange(e.startDate, e.endDate, false)}</p>
              </div>
            ))}
          </section>
        )}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: accent }}>Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: accent }}>
                <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                <p className="text-sm">{p.description}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

/* ---------- Elegant ---------- */
export function ElegantTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="px-10 pt-12 pb-6 text-center">
        <div className="inline-block">
          <h1 className="text-4xl font-normal tracking-[0.15em] text-gray-900">{p.fullName.toUpperCase()}</h1>
          <div className="flex items-center gap-3 my-3">
            <div className="h-px flex-1" style={{ backgroundColor: accent }} />
            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: accent }}>{p.jobTitle}</p>
            <div className="h-px flex-1" style={{ backgroundColor: accent }} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-500 tracking-wide">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-12 pb-12">
        {summary && (
          <section className="mb-6 text-center max-w-2xl mx-auto">
            <p className="text-sm leading-relaxed text-gray-600 italic">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-4 text-center">
                <h3 className="font-bold text-gray-900">{e.position}</h3>
                <p className="text-sm italic" style={{ color: accent }}>{e.company} · {dateRange(e.startDate, e.endDate, e.current)}</p>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed text-gray-600">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Education</h2>
            {education.map((e) => (
              <div key={e.id} className="mb-2 text-center">
                <h3 className="font-bold text-gray-900 text-sm">{e.degree}{e.field && `, ${e.field}`}</h3>
                <p className="text-sm italic" style={{ color: accent }}>{e.institution} · {dateRange(e.startDate, e.endDate, false)}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section className="mb-6 text-center">
            <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-3" style={{ color: accent }}>Skills</h2>
            <p className="text-sm text-gray-600">{skills.map((s) => s.name).join(' · ')}</p>
          </section>
        )}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-2 text-center">
                <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section className="text-center">
            <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-3" style={{ color: accent }}>Languages</h2>
            <p className="text-sm text-gray-600">{languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Bold ---------- */
export function BoldTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="px-10 py-10" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
        <h1 className="text-5xl font-black text-white tracking-tight leading-none">{p.fullName}</h1>
        <p className="text-xl font-bold text-white/80 mt-2 uppercase tracking-wide">{p.jobTitle}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/90 font-medium">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-10 py-8">
        {summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-2" style={{ color: accent }}>About</h2>
            <p className="text-base leading-relaxed">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: accent }}>Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-5 border-l-4 pl-4" style={{ borderColor: accent }}>
                <h3 className="text-lg font-bold">{e.position}</h3>
                <p className="font-semibold text-sm" style={{ color: accent }}>{e.company} · {dateRange(e.startDate, e.endDate, e.current)}</p>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: accent }}>Education</h2>
            {education.map((e) => (
              <div key={e.id} className="mb-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                <h3 className="font-bold">{e.degree}{e.field && `, ${e.field}`}</h3>
                <p className="text-sm" style={{ color: accent }}>{e.institution} · {dateRange(e.startDate, e.endDate, false)}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: accent }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="text-sm font-bold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: accent }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: accent }}>Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm">{p.description}</p>
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section>
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: accent }}>Languages</h2>
            <div className="flex flex-wrap gap-x-6 font-bold">
              {languages.map((l) => <span key={l.id}>{l.name} · <span className="font-normal" style={{ color: accent }}>{l.proficiency}</span></span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Compact ---------- */
export function CompactTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="px-8 py-5 border-b" style={{ borderColor: `${accent}30` }}>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{p.fullName}</h1>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.website && <span>{p.website}</span>}
          </div>
        </div>
        <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>{p.jobTitle}</p>
      </header>
      <div className="px-8 py-5 text-sm">
        {summary && (
          <p className="mb-4 leading-relaxed text-gray-600">{summary}</p>
        )}
        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">{e.position}, {e.company}</span>
                  <span className="text-xs text-gray-400">{dateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <p className="text-xs mt-0.5 whitespace-pre-line leading-snug">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>Education</h2>
              {education.map((e) => (
                <div key={e.id} className="mb-1.5">
                  <p className="font-semibold text-gray-900 text-xs">{e.degree}{e.field && `, ${e.field}`}</p>
                  <p className="text-xs" style={{ color: accent }}>{e.institution}</p>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>Skills</h2>
              <p className="text-xs">{skills.map((s) => s.name).join(', ')}</p>
            </section>
          )}
        </div>
        {projects.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-1">
                <span className="font-semibold text-gray-900 text-xs">{p.name}: </span>
                <span className="text-xs">{p.description}</span>
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>Languages</h2>
            <p className="text-xs">{languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Creative ---------- */
export function CreativeTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-gray-50 text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="px-10 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: accent, transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: accent, transform: 'translate(-30%, 30%)' }} />
        <div className="relative flex items-center gap-5">
          {p.photo ? (
            <img src={p.photo} alt="" className="w-24 h-24 rounded-2xl object-cover" style={{ border: `3px solid ${accent}` }} />
          ) : (
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: accent }}>
              {initials(p.fullName)}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{p.fullName}</h1>
            <p className="text-lg font-medium" style={{ color: accent }}>{p.jobTitle}</p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-10 pb-12">
        {summary && (
          <section className="mb-6 p-5 rounded-xl bg-white shadow-sm">
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Experience
            </h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-4 p-4 rounded-xl bg-white shadow-sm">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{e.position}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>
                    {dateRange(e.startDate, e.endDate, e.current)}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: accent }}>{e.company}{e.location && ` · ${e.location}`}</p>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-5">
          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
                Education
              </h2>
              {education.map((e) => (
                <div key={e.id} className="mb-3 p-4 rounded-xl bg-white shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-sm">{e.degree}{e.field && `, ${e.field}`}</h3>
                  <p className="text-sm" style={{ color: accent }}>{e.institution}</p>
                  <p className="text-xs text-gray-400">{dateRange(e.startDate, e.endDate, false)}</p>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
                Skills
              </h2>
              <div className="p-4 rounded-xl bg-white shadow-sm space-y-2">
                {skills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium">{s.name}</span><span className="text-gray-400">{s.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        {projects.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {languages.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((l) => (
                <div key={l.id} className="px-4 py-2 rounded-xl bg-white shadow-sm text-sm">
                  <span className="font-medium">{l.name}</span> · <span style={{ color: accent }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Executive ---------- */
export function ExecutiveTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="px-10 pt-10 pb-6 border-b-4 double" style={{ borderColor: accent }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide">{p.fullName}</h1>
            <p className="text-base mt-1 tracking-widest uppercase" style={{ color: accent }}>{p.jobTitle}</p>
          </div>
          <div className="text-right text-sm text-gray-600 space-y-0.5">
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.location && <p>{p.location}</p>}
            {p.website && <p>{p.website}</p>}
          </div>
        </div>
      </header>
      <div className="px-10 py-6">
        {summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Executive Summary</h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>Professional Experience</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{e.company}</h3>
                  <span className="text-sm text-gray-500 italic">{dateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: accent }}>{e.position}</p>
                <p className="text-sm mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Education</h2>
              {education.map((e) => (
                <div key={e.id} className="mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">{e.degree}{e.field && `, ${e.field}`}</h3>
                  <p className="text-sm" style={{ color: accent }}>{e.institution}</p>
                  <p className="text-xs text-gray-500 italic">{dateRange(e.startDate, e.endDate, false)}</p>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Core Competencies</h2>
              <p className="text-sm">{skills.map((s) => s.name).join(' · ')}</p>
            </section>
          )}
        </div>
        {projects.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Notable Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-1">
                <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                <p className="text-sm">{p.description}</p>
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Languages</h2>
            <p className="text-sm">{languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Tech ---------- */
export function TechTheme({ data, accent }: ThemeProps) {
  const { personal: p, summary, experience, education, skills, projects, languages } = data;
  return (
    <div className="bg-[#0f172a] text-slate-200" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
      <header className="px-10 py-8 border-b" style={{ borderColor: `${accent}40` }}>
        <div className="flex items-center gap-3">
          <span style={{ color: accent }}>~$</span>
          <h1 className="text-2xl font-bold text-white">{p.fullName}</h1>
        </div>
        <p className="text-sm mt-1 ml-7" style={{ color: accent }}>{`// ${p.jobTitle}`}</p>
        <div className="mt-3 ml-7 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>
      <div className="px-10 py-6">
        {summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold mb-2" style={{ color: accent }}>{'## summary'}</h2>
            <p className="text-sm leading-relaxed text-slate-300 ml-4 border-l-2 pl-4" style={{ borderColor: `${accent}40` }}>{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold mb-3" style={{ color: accent }}>{'## experience'}</h2>
            {experience.map((e) => (
              <div key={e.id} className="mb-4 ml-4 border-l-2 pl-4" style={{ borderColor: `${accent}40` }}>
                <h3 className="font-bold text-white text-sm">{e.position} <span style={{ color: accent }}>@ {e.company}</span></h3>
                <p className="text-xs text-slate-400 mb-1">{dateRange(e.startDate, e.endDate, e.current)}</p>
                <p className="text-sm whitespace-pre-line leading-relaxed text-slate-300">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold mb-3" style={{ color: accent }}>{'## education'}</h2>
            {education.map((e) => (
              <div key={e.id} className="mb-2 ml-4 border-l-2 pl-4" style={{ borderColor: `${accent}40` }}>
                <h3 className="font-bold text-white text-sm">{e.degree}{e.field && `, ${e.field}`}</h3>
                <p className="text-xs" style={{ color: accent }}>{e.institution} · {dateRange(e.startDate, e.endDate, false)}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold mb-3" style={{ color: accent }}>{'## skills'}</h2>
            <div className="flex flex-wrap gap-2 ml-4">
              {skills.map((s) => (
                <span key={s.id} className="text-xs px-2 py-1 rounded border" style={{ borderColor: `${accent}60`, color: accent }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold mb-3" style={{ color: accent }}>{'## projects'}</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-2 ml-4 border-l-2 pl-4" style={{ borderColor: `${accent}40` }}>
                <h3 className="font-bold text-white text-sm">{p.name}</h3>
                <p className="text-sm text-slate-300">{p.description}</p>
                {p.link && <p className="text-xs" style={{ color: accent }}>{p.link}</p>}
              </div>
            ))}
          </section>
        )}
        {languages.length > 0 && (
          <section>
            <h2 className="text-sm font-bold mb-3" style={{ color: accent }}>{'## languages'}</h2>
            <div className="flex flex-wrap gap-x-4 ml-4 text-sm text-slate-300">
              {languages.map((l) => <span key={l.id}>{l.name}: <span style={{ color: accent }}>{l.proficiency}</span></span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export interface ThemeDef {
  id: string;
  name: string;
  description: string;
  render: (props: ThemeProps) => React.ReactNode;
}

export const themes: ThemeDef[] = [
  { id: 'modern', name: 'Modern', description: 'Clean header with colored banner', render: (p) => <ModernTheme {...p} /> },
  { id: 'minimal', name: 'Minimal', description: 'Light, airy, lots of whitespace', render: (p) => <MinimalTheme {...p} /> },
  { id: 'classic', name: 'Classic', description: 'Traditional serif layout', render: (p) => <ClassicTheme {...p} /> },
  { id: 'sidebar', name: 'Sidebar', description: 'Colored sidebar with skills', render: (p) => <SidebarTheme {...p} /> },
  { id: 'elegant', name: 'Elegant', description: 'Centered, refined typography', render: (p) => <ElegantTheme {...p} /> },
  { id: 'bold', name: 'Bold', description: 'Strong gradient header', render: (p) => <BoldTheme {...p} /> },
  { id: 'compact', name: 'Compact', description: 'Dense, single-page layout', render: (p) => <CompactTheme {...p} /> },
  { id: 'creative', name: 'Creative', description: 'Cards with soft shadows', render: (p) => <CreativeTheme {...p} /> },
  { id: 'executive', name: 'Executive', description: 'Formal, double-border style', render: (p) => <ExecutiveTheme {...p} /> },
  { id: 'tech', name: 'Tech', description: 'Dark, monospace, terminal vibe', render: (p) => <TechTheme {...p} /> },
];
