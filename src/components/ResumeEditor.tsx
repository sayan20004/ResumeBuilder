import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, MapPin, Mail, Phone, Globe, Image } from 'lucide-react';
import type {
  ResumeData,
  Experience,
  Education,
  Skill,
  Project,
  Language,
} from '@/types/resume';

const uid = () => Math.random().toString(36).slice(2, 10);

const inputCls =
  'w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider';
const btnCls =
  'inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}

function Field({ label, value, onChange, placeholder, type = 'text', icon }: FieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3 text-gray-400">{icon}</span>}
        <input
          type={type}
          className={`${inputCls} ${icon ? 'pl-9' : ''}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: Omit<FieldProps, 'icon'>) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        className={`${inputCls} min-h-[90px] resize-y`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Card({
  title,
  children,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  title: string;
  children: React.ReactNode;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 relative group hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button onClick={onMoveUp} className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-50 transition" title="Move up">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-50 transition" title="Move down">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition" title="Remove">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${btnCls} w-full justify-center border border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50/30 py-2.5`}
    >
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function move<T>(arr: T[], idx: number, dir: -1 | 1): T[] {
  const next = [...arr];
  const target = idx + dir;
  if (target < 0 || target >= next.length) return arr;
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

export default function ResumeEditor({
  data,
  onChange,
  openSection,
  setOpenSection,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
  openSection: string;
  setOpenSection: (s: string) => void;
}) {
  const toggle = (s: string) => setOpenSection(openSection === s ? '' : s);

  const set = (patch: Partial<ResumeData>) => onChange({ ...data, ...patch });

  /* personal */
  const setPersonal = (patch: Partial<ResumeData['personal']>) =>
    set({ personal: { ...data.personal, ...patch } });

  /* experience */
  const addExp = () =>
    set({
      experience: [
        ...data.experience,
        {
          id: uid(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        } as Experience,
      ],
    });
  const updateExp = (id: string, patch: Partial<Experience>) =>
    set({ experience: data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const removeExp = (id: string) =>
    set({ experience: data.experience.filter((e) => e.id !== id) });

  /* education */
  const addEdu = () =>
    set({
      education: [
        ...data.education,
        { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' } as Education,
      ],
    });
  const updateEdu = (id: string, patch: Partial<Education>) =>
    set({ education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const removeEdu = (id: string) =>
    set({ education: data.education.filter((e) => e.id !== id) });

  /* skills */
  const addSkill = () =>
    set({ skills: [...data.skills, { id: uid(), name: '', level: 80 } as Skill] });
  const updateSkill = (id: string, patch: Partial<Skill>) =>
    set({ skills: data.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const removeSkill = (id: string) =>
    set({ skills: data.skills.filter((s) => s.id !== id) });

  /* projects */
  const addProj = () =>
    set({ projects: [...data.projects, { id: uid(), name: '', description: '', link: '' } as Project] });
  const updateProj = (id: string, patch: Partial<Project>) =>
    set({ projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const removeProj = (id: string) =>
    set({ projects: data.projects.filter((p) => p.id !== id) });

  /* languages */
  const addLang = () =>
    set({ languages: [...data.languages, { id: uid(), name: '', proficiency: 'Professional' } as Language] });
  const updateLang = (id: string, patch: Partial<Language>) =>
    set({ languages: data.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  const removeLang = (id: string) =>
    set({ languages: data.languages.filter((l) => l.id !== id) });

  const SectionHeader = ({ id, title, count }: { id: string; title: string; count?: number }) => {
    const isOpen = openSection === id;
    return (
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100"
      >
        <span className="font-semibold text-gray-700 text-sm flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
              {count}
            </span>
          )}
        </span>
        <Plus className={`w-4 h-4 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-45 text-blue-600' : ''}`} />
      </button>
    );
  };

  return (
    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Contacts / Personal */}
      <div>
        <SectionHeader id="personal" title="Personal Info" />
        {openSection === 'personal' && (
          <div className="p-4 space-y-4 bg-gray-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={data.personal.fullName} onChange={(v) => setPersonal({ fullName: v })} placeholder="Jane Doe" />
              <Field label="Job Title" value={data.personal.jobTitle} onChange={(v) => setPersonal({ jobTitle: v })} placeholder="Software Engineer" />
              <Field label="Email" value={data.personal.email} onChange={(v) => setPersonal({ email: v })} placeholder="jane@email.com" icon={<Mail className="w-4 h-4" />} />
              <Field label="Phone" value={data.personal.phone} onChange={(v) => setPersonal({ phone: v })} placeholder="+1 555 000 0000" icon={<Phone className="w-4 h-4" />} />
              <Field label="Location" value={data.personal.location} onChange={(v) => setPersonal({ location: v })} placeholder="New York, NY" icon={<MapPin className="w-4 h-4" />} />
              <Field label="Website" value={data.personal.website} onChange={(v) => setPersonal({ website: v })} placeholder="jane.dev" icon={<Globe className="w-4 h-4" />} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Profile Picture</label>
              <div className="flex items-center gap-4 bg-white p-3 border border-gray-200 rounded-lg">
                {data.personal.photo ? (
                  <div className="relative group/avatar">
                    <img
                      src={data.personal.photo}
                      alt="Profile Preview"
                      className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                    />
                    <button
                      onClick={() => setPersonal({ photo: '' })}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition shadow-sm"
                      title="Remove Photo"
                    >
                      <Plus className="w-3 h-3 rotate-45" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <Image className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="inline-flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white text-xs font-semibold text-gray-700 cursor-pointer transition select-none text-center">
                    <Plus className="w-3.5 h-3.5" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setPersonal({ photo: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={data.personal.photo}
                    onChange={(e) => setPersonal({ photo: e.target.value })}
                    placeholder="Or paste image URL here..."
                    className="w-full text-[10px] bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div>
        <SectionHeader id="summary" title="Professional Summary" />
        {openSection === 'summary' && (
          <div className="p-4 bg-gray-50/30">
            <TextArea label="Summary Content" value={data.summary} onChange={(v) => set({ summary: v })} placeholder="A short, catchy summary of your professional expertise..." />
            {data.summary.trim() === '' && (
              <button
                onClick={() => set({ summary: 'Enthusiastic and results-driven professional with expertise in building scalable web applications, designing user experiences, and driving team success. Skilled in JavaScript, TypeScript, React, and modern UI design.' })}
                className="mt-3 w-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
              >
                Add my summary
              </button>
            )}
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div>
        <SectionHeader id="experience" title="Work Experience" count={data.experience.length} />
        {openSection === 'experience' && (
          <div className="p-4 space-y-4 bg-gray-50/30">
            {data.experience.map((e, i) => (
              <Card
                key={e.id}
                title={e.position || e.company || `Experience ${i + 1}`}
                onRemove={() => removeExp(e.id)}
                onMoveUp={i > 0 ? () => set({ experience: move(data.experience, i, -1) }) : undefined}
                onMoveDown={i < data.experience.length - 1 ? () => set({ experience: move(data.experience, i, 1) }) : undefined}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Position" value={e.position} onChange={(v) => updateExp(e.id, { position: v })} placeholder="Senior Designer" />
                  <Field label="Company" value={e.company} onChange={(v) => updateExp(e.id, { company: v })} placeholder="Acme Inc." />
                  <Field label="Location" value={e.location} onChange={(v) => updateExp(e.id, { location: v })} placeholder="San Francisco, CA" />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start Month/Year" value={e.startDate} onChange={(v) => updateExp(e.id, { startDate: v })} type="month" />
                    <Field label="End Month/Year" value={e.current ? '' : e.endDate} onChange={(v) => updateExp(e.id, { endDate: v })} type="month" />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-600 mt-2 select-none cursor-pointer">
                  <input type="checkbox" checked={e.current} onChange={(ev) => updateExp(e.id, { current: ev.target.checked })} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300" />
                  I currently work here
                </label>
                <TextArea label="Description" value={e.description} onChange={(v) => updateExp(e.id, { description: v })} placeholder="What did you accomplish? Bullets will render on separate lines." />
              </Card>
            ))}
            <AddButton label="Add Work Experience" onClick={addExp} />
          </div>
        )}
      </div>

      {/* Education */}
      <div>
        <SectionHeader id="education" title="Education" count={data.education.length} />
        {openSection === 'education' && (
          <div className="p-4 space-y-4 bg-gray-50/30">
            {data.education.map((e, i) => (
              <Card
                key={e.id}
                title={e.degree || e.institution || `Education ${i + 1}`}
                onRemove={() => removeEdu(e.id)}
                onMoveUp={i > 0 ? () => set({ education: move(data.education, i, -1) }) : undefined}
                onMoveDown={i < data.education.length - 1 ? () => set({ education: move(data.education, i, 1) }) : undefined}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Institution" value={e.institution} onChange={(v) => updateEdu(e.id, { institution: v })} placeholder="Harvard University" />
                  <Field label="Degree" value={e.degree} onChange={(v) => updateEdu(e.id, { degree: v })} placeholder="B.S. / B.A." />
                  <Field label="Field of Study" value={e.field} onChange={(v) => updateEdu(e.id, { field: v })} placeholder="Computer Science" />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start Month/Year" value={e.startDate} onChange={(v) => updateEdu(e.id, { startDate: v })} type="month" />
                    <Field label="End Month/Year" value={e.endDate} onChange={(v) => updateEdu(e.id, { endDate: v })} type="month" />
                  </div>
                </div>
                <TextArea label="Description (optional)" value={e.description} onChange={(v) => updateEdu(e.id, { description: v })} placeholder="Academics, honors, societies, etc." />
              </Card>
            ))}
            <AddButton label="Add Education" onClick={addEdu} />
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <SectionHeader id="skills" title="Skills" count={data.skills.length} />
        {openSection === 'skills' && (
          <div className="p-4 space-y-4 bg-gray-50/30">
            {data.skills.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
                <input
                  className={`${inputCls} flex-1`}
                  value={s.name}
                  placeholder="Skill name"
                  onChange={(e) => updateSkill(s.id, { name: e.target.value })}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.level}
                  onChange={(e) => updateSkill(s.id, { level: parseInt(e.target.value, 10) })}
                  className="w-24 accent-blue-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-500 w-8 text-right">{s.level}%</span>
                <button onClick={() => removeSkill(s.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <AddButton label="Add Skill" onClick={addSkill} />
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <SectionHeader id="projects" title="Organization Experience & Projects" count={data.projects.length} />
        {openSection === 'projects' && (
          <div className="p-4 space-y-4 bg-gray-50/30">
            {data.projects.map((p, i) => (
              <Card
                key={p.id}
                title={p.name || `Project ${i + 1}`}
                onRemove={() => removeProj(p.id)}
                onMoveUp={i > 0 ? () => set({ projects: move(data.projects, i, -1) }) : undefined}
                onMoveDown={i < data.projects.length - 1 ? () => set({ projects: move(data.projects, i, 1) }) : undefined}
              >
                <Field label="Project / Org Name" value={p.name} onChange={(v) => updateProj(p.id, { name: v })} placeholder="My Awesome Project" />
                <TextArea label="Description" value={p.description} onChange={(v) => updateProj(p.id, { description: v })} placeholder="Outline key details, contributions, and tools used." />
                <Field label="Link" value={p.link} onChange={(v) => updateProj(p.id, { link: v })} placeholder="github.com/..." />
              </Card>
            ))}
            <AddButton label="Add Project / Org" onClick={addProj} />
          </div>
        )}
      </div>

      {/* Languages */}
      <div>
        <SectionHeader id="languages" title="Languages & Certifications" count={data.languages.length} />
        {openSection === 'languages' && (
          <div className="p-4 space-y-4 bg-gray-50/30">
            {data.languages.map((l) => (
              <div key={l.id} className="flex items-center gap-3 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
                <input
                  className={inputCls}
                  value={l.name}
                  placeholder="e.g. English, AWS Certified"
                  onChange={(e) => updateLang(l.id, { name: e.target.value })}
                />
                <select
                  className="bg-[#f9fafb] rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 focus:outline-none transition w-36"
                  value={l.proficiency}
                  onChange={(e) => updateLang(l.id, { proficiency: e.target.value })}
                >
                  {['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button onClick={() => removeLang(l.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <AddButton label="Add Language / Certification" onClick={addLang} />
          </div>
        )}
      </div>
    </div>
  );
}
