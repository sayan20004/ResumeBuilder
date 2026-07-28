import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Save, Plus, Trash2, Eye, Pencil, Check, Loader2, ChevronDown, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Share2, Info
} from 'lucide-react';
import {
  type ResumeData, type Resume, sampleResumeData, emptyResumeData,
} from '@/types/resume';
import { themes } from '@/themes/resumeThemes';
import ResumeEditor from '@/components/ResumeEditor';

const ACCENT_PRESETS = [
  '#2563eb', '#0ea5e9', '#059669', '#dc2626', '#ea580c',
  '#7c3aed', '#db2777', '#0d9488', '#ca8a04', '#1b1b1b',
];

const FONTS = [
  { id: 'Inter', name: 'Inter (Sans)' },
  { id: 'Geist', name: 'Geist (Modern)' },
  { id: 'Plus Jakarta Sans', name: 'Jakarta (Sleek)' },
  { id: 'Outfit', name: 'Outfit (Clean)' },
  { id: 'Playfair Display', name: 'Playfair (Classic Serif)' },
  { id: 'Merriweather', name: 'Merriweather (Readability)' },
  { id: 'Lora', name: 'Lora (Elegant Serif)' },
];

export default function App() {
  // Database states
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [data, setData] = useState<ResumeData>(sampleResumeData);
  const [theme, setTheme] = useState('modern');
  const [accent, setAccent] = useState('#2563eb');
  const [title, setTitle] = useState('My Resume');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);

  // Undo / Redo history states
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Editor states
  const [activeTab, setActiveTab] = useState<'builder' | 'templates'>('builder');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [resumesDropdownOpen, setResumesDropdownOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string>('personal');

  // Dynamic layout formatting states
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('14px');
  const [lineHeight, setLineHeight] = useState('Auto');
  const [letterSpacing, setLetterSpacing] = useState('-1.5%');
  const [align, setAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  // Size constraints (A4 aspect is roughly 1 / 1.414)
  const [width, setWidth] = useState(820);
  const [height, setHeight] = useState(1160);

  const previewRef = useRef<HTMLDivElement>(null);

  // Load database resumes list initially
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/resumes');
        if (!res.ok) throw new Error('Failed to fetch resumes');
        const list = (await res.json()) as Resume[];
        setResumes(list);
        if (list.length > 0) {
          const r = list[0];
          setCurrentId(r.id);
          setData(r.data);
          setTheme(r.theme);
          setAccent(r.accent_color);
          setTitle(r.title);
          setHistory([r.data]);
          setHistoryIndex(0);
        } else {
          // Initialize history for empty initial state
          setHistory([sampleResumeData]);
          setHistoryIndex(0);
        }
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update data & history stack (for Undo/Redo)
  const handleDataChange = useCallback((newData: ResumeData) => {
    setData(newData);

    // Push state to history
    setHistory((prevHistory) => {
      const nextHistory = prevHistory.slice(0, historyIndex + 1);
      return [...nextHistory, newData];
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setData(history[prevIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setData(history[nextIndex]);
    }
  };

  const save = useCallback(async () => {
    setSaving(true);
    const payload = {
      title,
      data: data as unknown as Record<string, unknown>,
      theme,
      accent_color: accent,
    };
    try {
      if (currentId) {
        const res = await fetch(`/api/resumes/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update resume');
        const updated = (await res.json()) as Resume;
        if (updated) {
          setResumes((prev) =>
            prev.map((r) => (r.id === currentId ? { ...updated } : r)),
          );
        }
      } else {
        const res = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create resume');
        const created = (await res.json()) as Resume;
        if (created) {
          setCurrentId(created.id);
          setResumes((prev) => [created, ...prev]);
        }
      }
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1800);
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  }, [currentId, data, theme, accent, title]);

  const newResume = () => {
    setCurrentId(null);
    setData(emptyResumeData);
    setTheme('modern');
    setAccent('#2563eb');
    setTitle('Untitled Resume');
    setHistory([emptyResumeData]);
    setHistoryIndex(0);
    setResumes((prev) => [
      {
        id: '__new',
        title: 'Untitled Resume',
        data: emptyResumeData,
        theme: 'modern',
        accent_color: '#2563eb',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Resume,
      ...prev.filter((r) => r.id !== '__new'),
    ]);
  };

  const loadResume = (r: Resume) => {
    if (r.id === '__new') {
      setCurrentId(null);
      setData(emptyResumeData);
      setTitle('Untitled Resume');
      setTheme('modern');
      setAccent('#2563eb');
      setHistory([emptyResumeData]);
      setHistoryIndex(0);
      return;
    }
    setCurrentId(r.id);
    setData(r.data);
    setTitle(r.title);
    setTheme(r.theme);
    setAccent(r.accent_color);
    setHistory([r.data]);
    setHistoryIndex(0);
  };

  const deleteResume = async (id: string) => {
    if (id === '__new') {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (currentId === id) newResume();
      return;
    }
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete resume');

      setResumes((prev) => {
        const next = prev.filter((r) => r.id !== id);
        if (currentId === id) {
          if (next.length > 0) {
            loadResume(next[0]);
          } else {
            newResume();
          }
        }
        return next;
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };



  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.innerText || target.textContent || '';

    let current: HTMLElement | null = target;
    let textTrace = '';
    while (current && current !== previewRef.current) {
      if (current.tagName === 'HEADER' || current.className.includes('header')) {
        setOpenSection('personal');
        setActiveTab('builder');
        return;
      }
      textTrace += ' ' + (current.innerText || '');
      current = current.parentElement;
    }

    const lowercaseTrace = textTrace.toLowerCase() + ' ' + text.toLowerCase();

    if (lowercaseTrace.includes('experience') || lowercaseTrace.includes('work') || lowercaseTrace.includes('company') || lowercaseTrace.includes('position')) {
      setOpenSection('experience');
      setActiveTab('builder');
    } else if (lowercaseTrace.includes('education') || lowercaseTrace.includes('institution') || lowercaseTrace.includes('degree') || lowercaseTrace.includes('school')) {
      setOpenSection('education');
      setActiveTab('builder');
    } else if (lowercaseTrace.includes('skills') || lowercaseTrace.includes('tool') || lowercaseTrace.includes('level')) {
      setOpenSection('skills');
      setActiveTab('builder');
    } else if (lowercaseTrace.includes('project') || lowercaseTrace.includes('organization')) {
      setOpenSection('projects');
      setActiveTab('builder');
    } else if (lowercaseTrace.includes('languages') || lowercaseTrace.includes('certification') || lowercaseTrace.includes('basic') || lowercaseTrace.includes('native') || lowercaseTrace.includes('fluent')) {
      setOpenSection('languages');
      setActiveTab('builder');
    } else if (lowercaseTrace.includes('summary') || lowercaseTrace.includes('profile') || lowercaseTrace.includes('about')) {
      setOpenSection('summary');
      setActiveTab('builder');
    } else {
      setOpenSection('personal');
      setActiveTab('builder');
    }
  };

  // Make preview elements contentEditable
  useEffect(() => {
    if (!previewRef.current) return;

    // Find all text container nodes
    const editableTags = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'li', 'div'];
    const elements: HTMLElement[] = [];

    editableTags.forEach(tag => {
      previewRef.current?.querySelectorAll(tag).forEach(el => {
        elements.push(el as HTMLElement);
      });
    });

    elements.forEach((el) => {
      // Only make leaf node text elements contenteditable
      if (el.children.length > 0) {
        return;
      }

      const text = el.textContent?.trim() || '';
      if (!text) return;

      // Skip static structural labels
      const staticLabels = [
        'Profile', 'Experience', 'Education', 'Skills', 'Projects', 'Languages',
        'Profile Summary', 'Work Experience', 'Organization Experience', 'Certifications',
        'Contacts', 'Website & Links', 'My Resume', 'Untitled Resume', 'Present'
      ];
      if (staticLabels.includes(text)) return;

      // Enable editing
      el.setAttribute('contenteditable', 'true');
      el.style.cursor = 'text';

      // Store original value
      const originalText = el.textContent || '';

      el.onblur = () => {
        const newText = el.textContent || '';
        if (newText.trim() !== originalText.trim()) {
          // Recursive find and replace in data
          const updateValueRecursive = (obj: unknown, oldVal: string, newVal: string): unknown => {
            if (typeof obj === 'string') {
              if (obj.trim() === oldVal.trim()) {
                return newVal;
              }
              return obj;
            }
            if (Array.isArray(obj)) {
              return obj.map(item => updateValueRecursive(item, oldVal, newVal));
            }
            if (typeof obj === 'object' && obj !== null) {
              const next: Record<string, unknown> = {};
              const typedObj = obj as Record<string, unknown>;
              for (const key in typedObj) {
                next[key] = updateValueRecursive(typedObj[key], oldVal, newVal);
              }
              return next;
            }
            return obj;
          };

          const updatedData = updateValueRecursive(data, originalText, newText) as ResumeData;
          handleDataChange(updatedData);
        }
      };

      // Add keyboard controls: Enter to blur
      el.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          el.blur();
        }
      };
    });
  }, [data, theme, handleDataChange]);

  const printResume = () => {
    window.print();
  };

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading Talently Editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaedf2] flex flex-col font-sans text-gray-800 antialiased selection:bg-blue-100">

      {/* 2. Sub-Header: Undo/Redo, Title, Save & Share */}
      <section className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between gap-4 print:hidden sticky top-0 z-20 shadow-sm">

        {/* Left Side: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-lg hover:bg-gray-50 border border-gray-200 transition ${historyIndex <= 0 ? 'opacity-40 cursor-not-allowed' : 'text-gray-700'}`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-lg hover:bg-gray-50 border border-gray-200 transition ${historyIndex >= history.length - 1 ? 'opacity-40 cursor-not-allowed' : 'text-gray-700'}`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-gray-200 mx-1" />

          <span className="text-xs font-semibold text-gray-400 italic">
            {saving ? 'Saving changes...' : 'Saved just now'}
          </span>
        </div>

        {/* Middle: Document Title / Dropdown Selector */}
        <div className="relative">
          <div
            onClick={() => setResumesDropdownOpen(!resumesDropdownOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-200 transition"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-none text-center cursor-pointer w-40 sm:w-60 truncate"
            />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {resumesDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 max-h-60 overflow-y-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3.5 py-1.5">My Resumes</p>
              {resumes.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-semibold ${r.id === currentId ? 'bg-blue-50/50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => {
                    loadResume(r);
                    setResumesDropdownOpen(false);
                  }}
                >
                  <span className="truncate flex-1 pr-2">{r.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(r.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="border-t border-gray-100 my-1 pt-1">
                <button
                  onClick={() => {
                    newResume();
                    setResumesDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" /> New Resume
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tools & Save */}
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#f1f5f9] hover:bg-[#e2e8f0] text-gray-700 px-4 py-2 rounded-xl transition border border-gray-200"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : savedTick ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : savedTick ? 'Saved' : 'Analyze'}</span>
          </button>

          <button
            onClick={printResume}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/10"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </section>

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Column: Builder Content / Templates Tab */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10 print:hidden hidden md:flex">
          {/* Tab Selector */}
          <div className="p-4 border-b border-gray-100 flex gap-2">
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition ${activeTab === 'builder' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Builder
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition ${activeTab === 'templates' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Templates
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'builder' ? (
              <ResumeEditor
                data={data}
                onChange={handleDataChange}
                openSection={openSection}
                setOpenSection={setOpenSection}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Choose layout style</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${theme === t.id
                        ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">{t.name}</span>
                        {theme === t.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal font-semibold">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Middle Column: Paper Preview */}
        <main className="flex-1 bg-[#eaedf2] overflow-auto flex flex-col relative z-0">

          {/* Middle Toolbar: Inline Formatting controls (Font, B/I/U/S, list controls) */}
          <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between gap-4 print:hidden sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Font Selector */}
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="bg-[#f8fafc] border border-gray-200 rounded-lg text-xs font-bold text-gray-700 px-3 py-1.5 focus:outline-none transition w-40"
              >
                {FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <div className="h-4 w-[1px] bg-gray-200" />

              {/* Text formatting styles */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setAlign('left')}
                  className={`p-1.5 rounded ${align === 'left' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAlign('center')}
                  className={`p-1.5 rounded ${align === 'center' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAlign('right')}
                  className={`p-1.5 rounded ${align === 'right' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAlign('justify')}
                  className={`p-1.5 rounded ${align === 'justify' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color indicator */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition" style={{ backgroundColor: accent }} />
                <span className="text-[10px] font-bold text-gray-400 uppercase">{accent}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                A4 Document
              </span>
            </div>
          </div>

          {/* Interactive Document Sheet Workspace */}
          <div className="flex-1 p-8 print:p-0 flex justify-center items-start min-h-[calc(100vh-200px)]">
            <div
              ref={previewRef}
              onClick={handlePreviewClick}
              className="bg-white print:shadow-none print:max-w-none print:w-full print:h-auto overflow-hidden relative border border-gray-200 rounded-xl preview-interactive"
              style={{
                width: `${width}px`,
                minHeight: `${height}px`,
                fontFamily: `${fontFamily}, sans-serif`,
                fontSize: fontSize,
                lineHeight: lineHeight === 'Auto' ? 'normal' : lineHeight,
                letterSpacing: letterSpacing,
                textAlign: align,
                boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Active Theme Rendering Content */}
              <div className="print:h-full">
                {activeTheme.render({ data, accent })}
              </div>
            </div>
          </div>
        </main>

        {/* Right Column: Formatting Controls & AI Widget */}
        <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto p-4 space-y-5 print:hidden hidden xl:block z-10 flex-shrink-0">


          <hr className="border-gray-100" />

          {/* Alignment Selector */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Alignment</h3>
            <div className="grid grid-cols-4 gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-1">
              {(['left', 'center', 'right', 'justify'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAlign(a)}
                  className={`flex justify-center items-center py-2 rounded-md transition ${align === a ? 'bg-white shadow-sm text-blue-600 border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {a === 'left' && <AlignLeft className="w-4 h-4" />}
                  {a === 'center' && <AlignCenter className="w-4 h-4" />}
                  {a === 'right' && <AlignRight className="w-4 h-4" />}
                  {a === 'justify' && <AlignJustify className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size parameters */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Size</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(400, Number(e.target.value)))}
                  className="w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(600, Number(e.target.value)))}
                  className="w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Text Styling parameters */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Typography</h3>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Font family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                {FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold focus:outline-none"
                >
                  {['12px', '13px', '14px', '15px', '16px'].map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Line Height</label>
                <select
                  value={lineHeight}
                  onChange={(e) => setLineHeight(e.target.value)}
                  className="w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold focus:outline-none"
                >
                  {['Auto', '1.2', '1.3', '1.4', '1.5', '1.6'].map((lh) => (
                    <option key={lh} value={lh}>{lh}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Letter Spacing</label>
              <select
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(e.target.value)}
                className="w-full bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                {['-2%', '-1.5%', '-1%', '0%', '1%', '2%'].map((ls) => (
                  <option key={ls} value={ls}>{ls}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Color selector */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Accent Colors</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className={`w-6 h-6 rounded-full transition ring-offset-2 hover:scale-105 border border-gray-100 ${accent === c ? 'ring-2 ring-blue-600 scale-105' : ''
                    }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="bg-[#f9fafb] rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700 w-full focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-gray-100 bg-[#f8fafc] p-3.5 flex gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-400 leading-normal font-semibold">
              Tip: Standard A4 width is usually set between 800px and 850px. Height can be expanded to multi-page.
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile Toggle Navigation View */}
      <div className="md:hidden fixed bottom-4 right-4 flex gap-2 print:hidden z-30">
        <button
          onClick={() => setMobileView('edit')}
          className={`p-3.5 rounded-full shadow-xl transition-all duration-200 ${mobileView === 'edit' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`p-3.5 rounded-full shadow-xl transition-all duration-200 ${mobileView === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
