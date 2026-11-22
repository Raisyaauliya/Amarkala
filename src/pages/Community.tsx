import { useState } from 'react';
import { Users, Heart, BookOpen, Megaphone, Calendar, MapPin, ChevronDown, Send, CheckCircle, RefreshCw, Star, Globe, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Role = 'student' | 'teacher' | 'parent' | 'activist' | 'researcher' | 'journalist' | 'government' | 'other';
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const roles: { value: Role; label: string; icon: string }[] = [
  { value: 'student', label: 'Pelajar / Mahasiswa', icon: '🎓' },
  { value: 'teacher', label: 'Guru / Pengajar', icon: '📚' },
  { value: 'parent', label: 'Orang Tua / Wali', icon: '👨‍👩‍👧' },
  { value: 'activist', label: 'Aktivis Pendidikan', icon: '✊' },
  { value: 'researcher', label: 'Peneliti / Akademisi', icon: '🔬' },
  { value: 'journalist', label: 'Jurnalis / Media', icon: '📰' },
  { value: 'government', label: 'Aparatur Pemerintah', icon: '🏛️' },
  { value: 'other', label: 'Lainnya', icon: '🌟' },
];

const provinces = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Bengkulu', 'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Lampung',
  'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Maluku', 'Maluku Utara',
  'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya',
];

const communityValues = [
  {
    icon: Heart,
    title: 'Peduli & Berani',
    desc: 'Kami adalah mereka yang peduli dan berani menyuarakan kebenaran demi pendidikan yang lebih adil.',
  },
  {
    icon: Globe,
    title: 'Terbuka & Inklusif',
    desc: 'Semua orang — dari Papua hingga Sabang — dapat berkontribusi. Tidak ada batas wilayah, latar belakang, atau profesi.',
  },
  {
    icon: BookOpen,
    title: 'Berbasis Data',
    desc: 'Kami mengambil keputusan dan mendorong perubahan berdasarkan fakta dan data yang bisa diverifikasi.',
  },
  {
    icon: Star,
    title: 'Dampak Nyata',
    desc: 'Setiap laporan, setiap verifikasi, dan setiap webinar yang Anda hadiri berkontribusi pada perubahan sistem.',
  },
];

const activities = [
  {
    icon: Megaphone,
    title: 'Community Reporting',
    desc: 'Laporkan blindspot dan ketidaksesuaian data KIP di daerah Anda. Setiap laporan ditindaklanjuti.',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-500',
  },
  {
    icon: Calendar,
    title: 'Monthly Webinars',
    desc: 'Ikuti webinar bulanan bersama para ahli kebijakan, aktivis, dan pejabat pendidikan.',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Regional Chapters',
    desc: 'Bergabung atau bentuk chapter AMARKALA di provinsi Anda. Target: 1 chapter per provinsi pada 2027.',
    color: 'bg-forest-50 border-forest-200',
    iconColor: 'text-forest-600',
  },
  {
    icon: BookOpen,
    title: 'Education Rights Workshops',
    desc: 'Workshop tatap muka tentang hak pendidikan anak dan cara mengadvokasikannya.',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
  },
];

const communityStats = [
  { value: '62+', label: 'Peserta Pilot', sub: 'Juni 2026' },
  { value: '3', label: 'Sekolah Pilot', sub: 'Cimahi & Jakarta' },
  { value: '8', label: 'Narasumber Ahli', sub: 'Webinar Series' },
  { value: '5', label: 'Laporan Aktif', sub: 'Sedang ditindaklanjuti' },
];

const ambassadors = [
  { name: 'Yuliana K.', role: 'Guru SD, Papua', province: 'Papua', initial: 'YK' },
  { name: 'Ahmad F.', role: 'Aktivis Pendidikan', province: 'Jawa Barat', initial: 'AF' },
  { name: 'Siti R.', role: 'Ibu Rumah Tangga', province: 'Sulawesi Barat', initial: 'SR' },
  { name: 'Samuel P.', role: 'Mahasiswa', province: 'Maluku', initial: 'SP' },
  { name: 'Doni P.', role: 'Kepala Sekolah', province: 'Jawa Tengah', initial: 'DP' },
  { name: 'Markus W.', role: 'Orang Tua Siswa', province: 'Papua', initial: 'MW' },
];

export default function Community() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '' as Role | '',
    province: '',
    motivation: '',
    newsletter: true,
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setStatus('loading');

    try {
      const { error } = await supabase.from('community_members').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        province: form.province || null,
        motivation: form.motivation.trim() || null,
        newsletter: form.newsletter,
      });
      if (error) {
        if (error.code === '23505') {
          // duplicate email - still treat as success
          setStatus('success');
          return;
        }
        throw error;
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="relative bg-forest-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-400 transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-gold-400 transform -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-300 text-xs font-semibold mb-6">
              <Users size={13} />
              Komunitas AMARKALA
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
              Bersama Kita Wujudkan{' '}
              <span className="text-gold-400">Pendidikan yang Adil</span>
            </h1>
            <p className="text-forest-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Komunitas AMARKALA adalah gerakan warga untuk transparansi pendidikan. Bergabunglah dengan aktivis, guru, orang tua, peneliti, dan jurnalis yang percaya bahwa setiap anak Indonesia berhak atas data yang jujur.
            </p>
            <div className="flex flex-wrap gap-6">
              {communityStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{stat.value}</div>
                  <div className="text-white text-sm font-medium">{stat.label}</div>
                  <div className="text-forest-400 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Mengapa Bergabung?</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">Komunitas kami bukan sekadar forum — ini adalah gerakan nyata yang menghasilkan perubahan.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityValues.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-forest-300 hover:shadow-md transition-all duration-200">
                  <div className="w-11 h-11 bg-forest-800 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-gold-400" />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">{val.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Apa yang Bisa Kamu Lakukan?</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">Banyak cara untuk berkontribusi — pilih yang paling sesuai dengan waktu dan kemampuanmu.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.title} className={`flex gap-4 p-5 rounded-2xl border ${act.color}`}>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon size={20} className={act.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">{act.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ambassadors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Community Champions</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">Mereka sudah memulai. Bergabunglah dan jadilah bagian dari perubahan.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ambassadors.map((amb) => (
              <div key={amb.name} className="text-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center text-gold-400 font-bold text-sm mx-auto mb-3">
                  {amb.initial}
                </div>
                <div className="font-semibold text-neutral-900 text-sm">{amb.name}</div>
                <div className="text-neutral-500 text-xs mt-0.5">{amb.role}</div>
                <div className="flex items-center justify-center gap-1 text-xs text-forest-600 mt-1.5">
                  <MapPin size={10} />
                  {amb.province}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-20 bg-forest-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left copy */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-300 text-xs font-semibold mb-6">
                <Users size={13} />
                Bergabung Gratis
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
                Jadilah bagian dari{' '}
                <span className="text-gold-400">gerakan ini</span>
              </h2>
              <p className="text-forest-200 leading-relaxed mb-8">
                Pendaftaran komunitas gratis dan terbuka untuk semua. Dengan mendaftar, Anda akan mendapatkan akses ke newsletter bulanan, undangan webinar eksklusif, dan koneksi dengan komunitas di seluruh Indonesia.
              </p>
              <ul className="space-y-3">
                {[
                  'Newsletter bulanan tentang perkembangan AMARKALA',
                  'Undangan eksklusif webinar & workshop',
                  'Akses awal ke fitur-fitur baru platform',
                  'Bergabung dengan komunitas 34 provinsi',
                  'Kesempatan menjadi Regional Ambassador',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-forest-200">
                    <CheckCircle size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={30} className="text-gold-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Selamat Datang!</h3>
                  <p className="text-neutral-600 text-sm mb-1">Anda telah bergabung dengan Komunitas AMARKALA.</p>
                  <p className="text-neutral-500 text-sm">Cek email Anda untuk informasi lebih lanjut.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-neutral-900 text-xl mb-6">Daftar Komunitas</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Nama Anda"
                          required
                          className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="email@contoh.com"
                          required
                          className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Saya adalah... <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {roles.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setForm({ ...form, role: r.value })}
                            className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                              form.role === r.value
                                ? 'border-forest-600 bg-forest-50 text-forest-800'
                                : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                            }`}
                          >
                            <div className="text-lg mb-0.5">{r.icon}</div>
                            <div className="font-medium leading-tight">{r.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        Provinsi
                      </label>
                      <div className="relative">
                        <select
                          value={form.province}
                          onChange={(e) => setForm({ ...form, province: e.target.value })}
                          className="w-full appearance-none border border-neutral-300 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                        >
                          <option value="">Pilih Provinsi (opsional)</option>
                          {provinces.map((p) => <option key={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        Mengapa bergabung? <span className="text-neutral-400 font-normal">(opsional)</span>
                      </label>
                      <textarea
                        value={form.motivation}
                        onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                        placeholder="Ceritakan motivasi Anda bergabung dengan komunitas AMARKALA..."
                        rows={3}
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="newsletter"
                        type="checkbox"
                        checked={form.newsletter}
                        onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-300 text-forest-600 focus:ring-forest-500"
                      />
                      <label htmlFor="newsletter" className="text-sm text-neutral-600">
                        Saya ingin menerima newsletter bulanan AMARKALA
                      </label>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-600 text-sm text-center">Gagal mendaftar. Silakan coba lagi.</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading' || !form.name || !form.email || !form.role}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-forest-800 hover:bg-forest-700 disabled:bg-neutral-300 text-white font-semibold rounded-xl transition-colors"
                    >
                      {status === 'loading' ? (
                        <><RefreshCw size={16} className="animate-spin" /> Mendaftar...</>
                      ) : (
                        <><Send size={16} /> Bergabung ke Komunitas</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming activities */}
      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Kegiatan Komunitas Mendatang</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: 'Workshop Hak Pendidikan', date: '22 Juli 2026', loc: 'Zoom Online', type: 'Workshop', color: 'bg-blue-500' },
              { title: 'Chapter Jakarta: Pertemuan Perdana', date: '5 Agustus 2026', loc: 'Jakarta Selatan', type: 'Offline', color: 'bg-forest-600' },
              { title: 'Webinar: Transparansi Data untuk Semua', date: '12 Agustus 2026', loc: 'Zoom Online', type: 'Webinar', color: 'bg-amber-500' },
            ].map((evt) => (
              <div key={evt.title} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`${evt.color} h-1.5`} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${evt.color} text-white`}>{evt.type}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{evt.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                    <Calendar size={13} />
                    {evt.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <MapPin size={13} />
                    {evt.loc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
