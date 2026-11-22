import { ArrowRight, BarChart3, Search, School, Megaphone, Video, CheckCircle, AlertTriangle, TrendingDown, Shield, Globe, Users, BookOpen, Target, Handshake } from 'lucide-react';

type Page = 'home' | 'dashboard' | 'kip-tracker' | 'school-database' | 'report-blindspot' | 'webinar-hub' | 'community' | 'partnership';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    id: 'dashboard' as Page,
    icon: BarChart3,
    title: 'Data Transparency Dashboard',
    subtitle: 'Peta Ketimpangan Wilayah',
    description: 'Visualisasi real-time ketimpangan pendidikan antar provinsi. Peta KIP Index interaktif dengan grafik distribusi bantuan per wilayah.',
    color: 'bg-forest-600',
    stats: '34 Provinsi',
  },
  {
    id: 'kip-tracker' as Page,
    icon: Search,
    title: 'KIP Tracker',
    subtitle: 'Verifikasi Status Bantuan',
    description: 'Verifikasi status penerima KIP secara real-time menggunakan NIK atau NISN. Cek apakah bantuan sudah tersalurkan atau masih tertunda.',
    color: 'bg-blue-600',
    stats: '10K+ Records',
  },
  {
    id: 'school-database' as Page,
    icon: School,
    title: 'School Database',
    subtitle: 'Database Sekolah Nasional',
    description: 'Database lengkap sekolah se-Indonesia dengan data fasilitas, rating kebutuhan, jumlah siswa eligible, dan status akreditasi.',
    color: 'bg-amber-600',
    stats: '500+ Sekolah',
  },
  {
    id: 'report-blindspot' as Page,
    icon: Megaphone,
    title: 'Report Blindspot',
    subtitle: 'Pelaporan Anonim',
    description: 'Form pelaporan anonim untuk masyarakat melaporkan ketidaksesuaian data KIP, penerima salah sasaran, atau kebutuhan sekolah yang terabaikan.',
    color: 'bg-red-600',
    stats: '100% Anonim',
  },
  {
    id: 'webinar-hub' as Page,
    icon: Video,
    title: 'Webinar Hub',
    subtitle: 'Edukasi & Advokasi',
    description: 'Jadwal, materi, dan rekaman webinar rutin tentang hak pendidikan, transparansi data, dan kebijakan KIP bersama para pakar.',
    color: 'bg-forest-500',
    stats: '6 Webinar/Kuartal',
  },
];

const crisisStats = [
  { value: '61 Juta', label: 'anak di dunia tidak bersekolah', source: 'UNESCO, 2024' },
  { value: '23%', label: 'bantuan KIP salah sasaran atau tidak sampai', source: 'BPS Indonesia, 2024' },
  { value: '15,2%', label: 'angka putus sekolah Papua vs 2,1% Jakarta', source: 'Kemendikbud, 2024' },
  { value: '40%', label: 'sekolah daerah terpencil tanpa internet', source: 'Kemendikbud, 2024' },
];

const missionItems = [
  { icon: TrendingDown, title: 'REDUCE', desc: 'Kurangi ketimpangan akses pendidikan melalui identifikasi berbasis data' },
  { icon: Shield, title: 'REGULATE', desc: 'Awasi distribusi bantuan dengan transparansi dan akuntabilitas penuh' },
  { icon: Users, title: 'RESPONSIBILISE', desc: 'Berdayakan semua pemangku kepentingan melalui akses informasi terbuka' },
];

const roadmapItems = [
  { date: 'Juni 2026', label: 'Pilot selesai', desc: '3 sekolah · 62+ peserta', done: true },
  { date: 'Jan 2027', label: 'Soft Launch', desc: '5 provinsi · 500 sekolah', done: false },
  { date: 'Mar 2027', label: 'Ekspansi Fase 1', desc: '15 provinsi · 2.000 sekolah', done: false },
  { date: 'Jul 2027', label: 'Integrasi API', desc: 'Full Kemendikbud Dapodik', done: false },
  { date: 'Jan 2028', label: 'Peluncuran Nasional', desc: '34 provinsi · 1 juta data siswa', done: false },
];

export default function Home({ onNavigate }: HomeProps) {
  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/28593054/pexels-photo-28593054.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="African children in classroom learning together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/88 via-forest-950/78 to-forest-950/92" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-300 text-xs font-medium mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              First Mover in ASEAN — Platform Transparansi Pendidikan Indonesia
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
              Setiap anak berhak{' '}
              <span className="text-gold-400">terlihat</span>.
            </h1>

            <p className="text-forest-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              AMARKALA adalah ekosistem transparansi data pendidikan Indonesia. Kami memverifikasi bantuan KIP, memetakan ketimpangan wilayah, dan memberdayakan komunitas untuk melaporkan blindspot pendidikan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleNav('dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold-900/30 hover:-translate-y-0.5"
              >
                <BarChart3 size={18} />
                Lihat Dashboard
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleNav('kip-tracker')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <Search size={18} />
                Cek Status KIP
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => handleNav('community')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800/60 hover:bg-forest-700/70 border border-forest-700/50 text-forest-200 text-sm font-medium rounded-xl transition-all backdrop-blur-sm"
              >
                <Users size={15} />
                Bergabung ke Komunitas
              </button>
              <button
                onClick={() => handleNav('partnership')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800/60 hover:bg-forest-700/70 border border-forest-700/50 text-forest-200 text-sm font-medium rounded-xl transition-all backdrop-blur-sm"
              >
                <Handshake size={15} />
                Open Partnership
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-forest-400">
          <div className="w-5 h-8 rounded-full border-2 border-forest-600 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-gold-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Crisis Stats */}
      <section className="bg-white border-b border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {crisisStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-forest-700 mb-1">{stat.value}</div>
                <div className="text-neutral-600 text-sm leading-snug mb-1">{stat.label}</div>
                <div className="text-neutral-400 text-xs italic">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold mb-4">
                <AlertTriangle size={16} />
                Masalah yang Belum Terpecahkan
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6 leading-tight">
                Blindspot dalam Sistem Kartu Indonesia Pintar
              </h2>
              <div className="space-y-5">
                {[
                  { title: 'Data Tidak Transparan', desc: 'Tidak ada database publik tentang siapa yang menerima bantuan KIP. Masyarakat tidak bisa memverifikasi.' },
                  { title: 'Bantuan Salah Sasaran', desc: '23% bantuan KIP tidak sampai ke penerima yang berhak — disalurkan ke pihak yang tidak membutuhkan.' },
                  { title: 'Tidak Ada Mekanisme Pelaporan', desc: 'Zero community reporting mechanism untuk mengidentifikasi dan memperbaiki blindspot yang ada.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs text-neutral-400 italic">
                Source: BPK Audit & Ombudsman RI, 2024
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/35250417/pexels-photo-35250417.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="African school children gathering outdoors"
                className="rounded-2xl w-full h-80 object-cover shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-forest-800 text-white rounded-xl px-5 py-4 shadow-lg max-w-xs border-l-4 border-gold-500">
                <p className="text-sm font-medium leading-snug">
                  "Jutaan anak Indonesia seharusnya menerima bantuan pendidikan... tapi uangnya tidak pernah sampai."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-forest-600 text-sm font-semibold mb-3">
              <BookOpen size={16} />
              Lima Fitur Inti Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Satu ekosistem, lima solusi
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              AMARKALA mengintegrasikan transparansi data, verifikasi bantuan, database sekolah, pelaporan komunitas, dan edukasi dalam satu platform terpadu.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleNav(feature.id)}
                  className="group text-left p-6 rounded-2xl border border-neutral-200 hover:border-forest-300 hover:shadow-lg hover:shadow-forest-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-neutral-900 text-lg leading-tight">{feature.title}</h3>
                    <span className="text-xs text-neutral-400 font-medium whitespace-nowrap mt-0.5">{feature.stats}</span>
                  </div>
                  <p className="text-forest-600 text-sm font-medium mb-2">{feature.subtitle}</p>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center gap-1 text-forest-600 text-sm font-semibold group-hover:gap-2 transition-all">
                    Buka Fitur <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community & Partnership teaser */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Community */}
            <button
              onClick={() => handleNav('community')}
              className="group relative overflow-hidden bg-forest-950 rounded-2xl p-8 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="relative">
                <div className="w-12 h-12 bg-gold-500/20 border border-gold-500/30 rounded-xl flex items-center justify-center mb-5">
                  <Users size={22} className="text-gold-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Komunitas AMARKALA</h3>
                <p className="text-forest-300 text-sm leading-relaxed mb-5">
                  Bergabunglah dengan ribuan aktivis pendidikan, orang tua, guru, jurnalis, dan peneliti yang peduli transparansi pendidikan Indonesia.
                </p>
                <div className="flex items-center gap-2 text-gold-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  Bergabung Sekarang <ArrowRight size={15} />
                </div>
              </div>
            </button>

            {/* Partnership */}
            <button
              onClick={() => handleNav('partnership')}
              className="group relative overflow-hidden bg-white border-2 border-neutral-200 hover:border-gold-400 rounded-2xl p-8 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-forest-50 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="relative">
                <div className="w-12 h-12 bg-forest-50 border border-forest-200 rounded-xl flex items-center justify-center mb-5">
                  <Handshake size={22} className="text-forest-600" />
                </div>
                <h3 className="text-neutral-900 font-bold text-xl mb-2">Open Partnership</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-5">
                  Kami membuka kolaborasi dengan pemerintah, NGO, lembaga akademik, sektor swasta, dan media untuk memperluas dampak AMARKALA.
                </p>
                <div className="flex items-center gap-2 text-forest-700 text-sm font-semibold group-hover:gap-3 transition-all">
                  Ajukan Partnership <ArrowRight size={15} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-forest-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-400 transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-400 transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tujuan, Visi & Misi</h2>
            <p className="text-forest-300 max-w-xl mx-auto">
              Transparansi data untuk inklusi pendidikan maksimum di seluruh Indonesia
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center mb-4">
                <Target size={20} className="text-gold-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Tujuan</h3>
              <p className="text-forest-200 text-sm leading-relaxed">
                Transparansi data untuk inklusi pendidikan maksimum di seluruh Indonesia
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center mb-4">
                <Globe size={20} className="text-gold-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Visi</h3>
              <p className="text-forest-200 text-sm leading-relaxed">
                Ekosistem inklusi pendidikan yang berkelanjutan dan transparan, di mana setiap anak memiliki akses yang setara
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sm:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                {missionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-gold-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gold-300">{item.title}</h4>
                        <p className="text-forest-300 text-xs leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Proof of Execution */}
          <div className="border-t border-white/10 pt-12">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2">Proof of Execution: Sudah di Lapangan</h3>
              <p className="text-forest-300 text-sm">Juni 2026 — 3 sekolah, 62+ peserta, USD 5.000 invested</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { loc: 'PKBM Riadhul Mahirin, Cimahi', date: '15 Juni 2026', type: 'Komunitas pendidikan non-formal' },
                { loc: 'Sekolah Anak Grogol, Jakarta', date: '17 Juni 2026', type: '12 anak putus sekolah' },
                { loc: 'SDN 17 Tebet Timur, Jakarta', date: '17 Juni 2026', type: 'Siswa SD & guru' },
              ].map((school) => (
                <div key={school.loc} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gold-300 text-xs font-semibold">Executed</span>
                  </div>
                  <p className="font-medium text-sm mb-1">{school.loc}</p>
                  <p className="text-forest-300 text-xs">{school.date}</p>
                  <p className="text-forest-400 text-xs mt-1">{school.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Menuju Transparansi Nasional
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Dari pilot 3 sekolah menuju 1 juta data siswa transparan se-Indonesia pada 2028
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
              <div className="absolute left-0 top-0 h-full bg-gold-500" style={{ width: '10%' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {roadmapItems.map((item, i) => (
                <div key={i} className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-2 lg:text-center">
                  <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    item.done
                      ? 'bg-gold-500 border-gold-500 text-forest-950'
                      : 'bg-white border-neutral-300 text-neutral-400'
                  }`}>
                    {item.done ? <CheckCircle size={18} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold mb-1 ${item.done ? 'text-gold-600' : 'text-neutral-400'}`}>
                      {item.date}
                    </div>
                    <div className="font-semibold text-neutral-900 text-sm">{item.label}</div>
                    <div className="text-neutral-500 text-xs mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Tidak ada anak yang seharusnya tidak terlihat.
          </h2>
          <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            AMARKALA ada agar setiap anak di Papua, Mamasa, dan seluruh penjuru Indonesia tercatat dengan jujur — dan masa depannya bergantung pada kejujuran data itu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNav('community')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-800 hover:bg-forest-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Users size={18} />
              Bergabung ke Komunitas
            </button>
            <button
              onClick={() => handleNav('partnership')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold-500 text-gold-600 hover:bg-gold-50 font-semibold rounded-xl transition-all duration-200"
            >
              <Handshake size={18} />
              Open Partnership
            </button>
            <button
              onClick={() => handleNav('report-blindspot')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-semibold rounded-xl transition-all duration-200"
            >
              <Megaphone size={18} />
              Laporkan Blindspot
            </button>
          </div>
          <p className="text-gold-600 text-sm font-medium italic mt-8">
            "The Light of Truth and Eternal Life Piercing Through Time"
          </p>
        </div>
      </section>
    </div>
  );
}
