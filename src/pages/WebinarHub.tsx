import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, PlayCircle, ExternalLink, ChevronRight, Send, X, CheckCircle, RefreshCw, Mic, BookOpen } from 'lucide-react';
import { supabase, Webinar } from '../lib/supabase';

type Tab = 'upcoming' | 'past';

interface RegForm {
  name: string;
  email: string;
  organization: string;
}

const topicColors: Record<string, string> = {
  'Kebijakan Pendidikan': 'bg-blue-100 text-blue-700',
  'Data & Transparansi': 'bg-forest-100 text-forest-700',
  'Pendidikan 3T': 'bg-orange-100 text-orange-700',
  'Tutorial Platform': 'bg-amber-100 text-amber-700',
  'Inklusi Pendidikan': 'bg-forest-100 text-forest-700',
  'Kebijakan KIP': 'bg-blue-100 text-blue-700',
  'Open Data': 'bg-neutral-100 text-neutral-700',
  'Pendidikan Perbatasan': 'bg-red-100 text-red-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  return timeStr.slice(0, 5) + ' WIB';
}

export default function WebinarHub() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerModal, setRegisterModal] = useState<Webinar | null>(null);
  const [form, setForm] = useState<RegForm>({ name: '', email: '', organization: '' });
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchWebinars();
  }, [activeTab]);

  async function fetchWebinars() {
    setLoading(true);
    const { data, error } = await supabase
      .from('webinars')
      .select('*')
      .eq('is_upcoming', activeTab === 'upcoming')
      .order('webinar_date', { ascending: activeTab === 'upcoming' });

    if (!error && data) setWebinars(data);
    setLoading(false);
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerModal) return;
    setRegStatus('loading');

    try {
      const { error } = await supabase.from('webinar_registrations').insert({
        webinar_id: registerModal.id,
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim() || null,
      });
      if (error) throw error;
      setRegStatus('success');
    } catch {
      setRegStatus('error');
    }
  };

  const closeModal = () => {
    setRegisterModal(null);
    setForm({ name: '', email: '', organization: '' });
    setRegStatus('idle');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-forest-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Webinar Hub</h1>
          <p className="text-forest-300">Edukasi hak pendidikan, transparansi data, dan advokasi kebijakan KIP bersama para ahli</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Webinar', value: '8', icon: Video },
            { label: 'Webinar Mendatang', value: '5', icon: Calendar },
            { label: 'Total Peserta', value: '1.048+', icon: Users },
            { label: 'Narasumber Ahli', value: '8', icon: Mic },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm text-center">
              <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon size={18} className="text-forest-600" />
              </div>
              <div className="text-xl font-bold text-neutral-900">{value}</div>
              <div className="text-neutral-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-6 max-w-xs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'upcoming' ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Mendatang
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'past' ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Rekaman
          </button>
        </div>

        {/* Webinar List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-10 h-10 border-3 border-forest-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: '3px' }} />
            <p className="text-neutral-500 text-sm">Memuat jadwal webinar...</p>
          </div>
        ) : webinars.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <Video size={36} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">Tidak ada webinar saat ini</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {webinars.map((webinar) => (
              <div key={webinar.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                {/* Card top */}
                <div className="bg-gradient-to-br from-forest-800 to-forest-900 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-8 -translate-y-8" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-4 translate-y-4" />
                  <div className="relative">
                    <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${
                      topicColors[webinar.topic] || 'bg-neutral-700 text-neutral-300'
                    }`}>
                      {webinar.topic}
                    </div>
                    <h3 className="text-white font-bold text-base leading-snug mb-3 line-clamp-2">{webinar.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {webinar.speaker.split(' ').slice(-1)[0].charAt(0)}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium leading-none">{webinar.speaker}</div>
                        {webinar.speaker_title && (
                          <div className="text-forest-400 text-xs mt-0.5 leading-none">{webinar.speaker_title}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  {webinar.description && (
                    <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2">{webinar.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar size={14} className="text-forest-500 flex-shrink-0" />
                      <span>{formatDate(webinar.webinar_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock size={14} className="text-forest-500 flex-shrink-0" />
                      <span>{formatTime(webinar.webinar_time)} · {webinar.duration_minutes} menit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Video size={14} className="text-forest-500 flex-shrink-0" />
                      <span>{webinar.platform}</span>
                    </div>
                    {!webinar.is_upcoming && webinar.participant_count > 0 && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Users size={14} className="text-forest-500 flex-shrink-0" />
                        <span>{webinar.participant_count.toLocaleString('id')} peserta hadir</span>
                      </div>
                    )}
                  </div>

                  {webinar.is_upcoming ? (
                    <button
                      onClick={() => setRegisterModal(webinar)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-forest-700 hover:bg-forest-600 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                      <ChevronRight size={16} />
                      Daftar Sekarang
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {webinar.recording_url ? (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-forest-700 hover:bg-forest-600 text-white font-semibold rounded-xl text-sm transition-colors">
                          <PlayCircle size={16} />
                          Tonton Rekaman
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-100 text-neutral-400 font-semibold rounded-xl text-sm cursor-not-allowed">
                          <PlayCircle size={16} />
                          Rekaman Segera
                        </div>
                      )}
                      <button className="p-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                        <BookOpen size={16} className="text-neutral-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past webinars CTA */}
        {activeTab === 'upcoming' && (
          <div className="mt-8 bg-forest-50 border border-forest-200 rounded-2xl p-6 text-center">
            <BookOpen size={28} className="text-forest-600 mx-auto mb-3" />
            <h3 className="font-bold text-forest-900 mb-2">Lewatkan Webinar Sebelumnya?</h3>
            <p className="text-forest-700 text-sm mb-4">Akses rekaman dan materi dari semua webinar yang telah berlangsung</p>
            <button
              onClick={() => setActiveTab('past')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-600 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              <PlayCircle size={16} />
              Lihat Rekaman
            </button>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {registerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {regStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-forest-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Pendaftaran Berhasil!</h3>
                <p className="text-neutral-600 text-sm mb-2">
                  Anda terdaftar untuk webinar:
                </p>
                <p className="font-semibold text-neutral-800 text-sm mb-4 line-clamp-2">{registerModal.title}</p>
                <p className="text-neutral-600 text-sm mb-6">
                  Link Zoom/Meet akan dikirimkan ke email Anda menjelang hari webinar.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-forest-700 hover:bg-forest-600 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">Daftar Webinar</h3>
                    <p className="text-neutral-500 text-sm mt-0.5 line-clamp-1">{registerModal.title}</p>
                  </div>
                  <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-600 p-1">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-forest-50 rounded-xl p-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-forest-700">
                    <Calendar size={14} />
                    <span className="font-medium">{formatDate(registerModal.webinar_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-forest-600 mt-1">
                    <Clock size={14} />
                    <span>{formatTime(registerModal.webinar_time)} · {registerModal.platform}</span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {[
                    { label: 'Nama Lengkap', key: 'name', placeholder: 'Nama Anda', required: true, type: 'text' },
                    { label: 'Email', key: 'email', placeholder: 'email@contoh.com', required: true, type: 'email' },
                    { label: 'Institusi/Organisasi', key: 'organization', placeholder: 'Sekolah, NGO, dll (opsional)', required: false, type: 'text' },
                  ].map(({ label, key, placeholder, required, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={type}
                        value={form[key as keyof RegForm]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        required={required}
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                  ))}

                  {regStatus === 'error' && (
                    <p className="text-red-600 text-sm text-center">Gagal mendaftar. Silakan coba lagi.</p>
                  )}

                  <button
                    type="submit"
                    disabled={regStatus === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-forest-700 hover:bg-forest-600 disabled:bg-neutral-300 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    {regStatus === 'loading' ? (
                      <><RefreshCw size={16} className="animate-spin" /> Mendaftarkan...</>
                    ) : (
                      <><Send size={16} /> Daftar Webinar</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
