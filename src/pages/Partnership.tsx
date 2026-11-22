import { useState } from 'react';
import { Handshake, Building, GraduationCap, Heart, Laptop, CheckCircle, Send, RefreshCw, ChevronDown, ArrowRight, Globe, Users, BarChart3, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

type OrgType = 'government' | 'ngo' | 'academic' | 'private' | 'community' | 'media' | 'other';
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const partnerTypes: { value: OrgType; label: string; icon: typeof Building; desc: string; color: string }[] = [
  {
    value: 'government',
    label: 'Pemerintah & Kebijakan',
    icon: Building,
    desc: 'Kemendikbud, Dinas Pendidikan, BPS, Ombudsman, dan lembaga pemerintah lainnya',
    color: 'bg-blue-600',
  },
  {
    value: 'ngo',
    label: 'NGO & Masyarakat Sipil',
    icon: Heart,
    desc: 'Indonesia Mengajar, Teach for Indonesia, UNICEF Indonesia, dan organisasi nirlaba lainnya',
    color: 'bg-red-500',
  },
  {
    value: 'academic',
    label: 'Akademik & Riset',
    icon: GraduationCap,
    desc: 'Universitas, lembaga penelitian, dan institusi akademik yang ingin mengakses data pendidikan',
    color: 'bg-amber-600',
  },
  {
    value: 'private',
    label: 'Sektor Swasta & Teknologi',
    icon: Laptop,
    desc: 'Perusahaan teknologi, CSR korporat, dan bisnis yang ingin berkontribusi pada pendidikan',
    color: 'bg-forest-600',
  },
  {
    value: 'media',
    label: 'Media & Jurnalisme',
    icon: FileText,
    desc: 'Media massa, jurnalis investigasi, dan outlet media yang meliput isu pendidikan',
    color: 'bg-neutral-600',
  },
  {
    value: 'community',
    label: 'Komunitas & Gerakan',
    icon: Users,
    desc: 'Komunitas lokal, gerakan warga, dan organisasi berbasis komunitas di seluruh Indonesia',
    color: 'bg-orange-500',
  },
];

const benefitsByType: Record<OrgType, string[]> = {
  government: [
    'Akses API data terintegrasi Dapodik',
    'Dashboard khusus untuk monitoring distribusi KIP',
    'Co-branding pada materi sosialisasi resmi',
    'Laporan ketimpangan wilayah untuk kebijakan',
  ],
  ngo: [
    'Akses data sekolah dan penerima KIP untuk advokasi',
    'Platform laporan blindspot terintegrasi',
    'Kolaborasi webinar dan workshop bersama',
    'Publikasi dampak bersama AMARKALA',
  ],
  academic: [
    'Akses dataset pendidikan terstruktur untuk riset',
    'Open API untuk analisis independen',
    'Co-authorship laporan tahunan AMARKALA',
    'Kesempatan presentasi temuan di webinar AMARKALA',
  ],
  private: [
    'Branding sebagai mitra transparansi pendidikan',
    'CSR terukur dengan laporan dampak',
    'Akses komunitas 34 provinsi untuk program CSR',
    'Integrasi teknologi untuk solusi pendidikan',
  ],
  media: [
    'Akses eksklusif data untuk liputan investigatif',
    'Press briefing reguler dari tim AMARKALA',
    'Co-produksi konten edukasi dan infografis',
    'Akses narasumber ahli untuk wawancara',
  ],
  community: [
    'Dukungan pembentukan Chapter Regional',
    'Materi dan kurikulum pelatihan',
    'Akses platform laporan untuk komunitas',
    'Mentoring dari tim AMARKALA',
  ],
  other: [
    'Diskusi kebutuhan kemitraan yang fleksibel',
    'Akses platform sesuai kebutuhan',
    'Kolaborasi yang disesuaikan',
    'Dukungan penuh dari tim AMARKALA',
  ],
};

const currentPartners = [
  { name: 'Kemendikbud RI', type: 'Pemerintah', status: 'In Discussion', logo: '🏛️' },
  { name: 'UNICEF Indonesia', type: 'NGO', status: 'In Discussion', logo: '🌐' },
  { name: 'Universitas Indonesia', type: 'Akademik', status: 'In Discussion', logo: '🎓' },
  { name: 'Indonesia Mengajar', type: 'NGO', status: 'In Discussion', logo: '📚' },
  { name: 'Google Cloud Indonesia', type: 'Teknologi', status: 'In Discussion', logo: '☁️' },
  { name: 'Ombudsman RI', type: 'Pemerintah', status: 'In Discussion', logo: '⚖️' },
  { name: 'Pemuda Mendunia', type: 'Komunitas', status: 'MoU Confirmed', logo: '🌟' },
  { name: 'Noble Catalyst', type: 'NGO', status: 'MoU Confirmed', logo: '✨' },
];

const provinces = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'DKI Jakarta',
  'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali',
  'Kalimantan Timur', 'Sulawesi Selatan', 'Maluku', 'Papua', 'Papua Barat',
  'Lainnya',
];

const interests = [
  'Integrasi data & API',
  'Co-branding & visibilitas',
  'Program CSR pendidikan',
  'Riset & akses data',
  'Advokasi kebijakan',
  'Kolaborasi konten & media',
  'Pembentukan Chapter Regional',
  'Sponsorship webinar',
  'Lainnya',
];

export default function Partnership() {
  const [selectedType, setSelectedType] = useState<OrgType>('ngo');
  const [form, setForm] = useState({
    org_name: '',
    org_type: 'ngo' as OrgType,
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    province: '',
    interest: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleTypeSelect = (type: OrgType) => {
    setSelectedType(type);
    setForm({ ...form, org_type: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.org_name || !form.contact_name || !form.email || !form.interest) return;
    setStatus('loading');

    try {
      const { error } = await supabase.from('partnership_applications').insert({
        org_name: form.org_name.trim(),
        org_type: form.org_type,
        contact_name: form.contact_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        province: form.province || null,
        interest: form.interest,
        message: form.message.trim() || null,
        status: 'pending',
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-gold-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Proposal Terkirim!</h2>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            Terima kasih atas minat Anda untuk bermitra dengan AMARKALA. Tim kami akan menghubungi Anda dalam 3–7 hari kerja untuk mendiskusikan langkah selanjutnya.
          </p>
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
            <p className="text-gold-700 text-sm font-medium">
              Sementara itu, jelajahi platform AMARKALA dan bergabunglah dengan komunitas kami untuk memulai.
            </p>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="w-full py-2.5 bg-forest-800 hover:bg-forest-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Ajukan Partnership Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="relative bg-forest-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-400 transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-400 transform -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-300 text-xs font-semibold mb-6">
              <Handshake size={13} />
              Open Partnership
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
              Kolaborasi untuk{' '}
              <span className="text-gold-400">Perubahan Sistemik</span>
            </h1>
            <p className="text-forest-200 text-lg leading-relaxed mb-8 max-w-2xl">
              AMARKALA membuka kemitraan dengan pemerintah, NGO, lembaga akademik, sektor swasta, dan media untuk memperluas dampak transparansi pendidikan di seluruh Indonesia.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: '3', label: 'MoU Confirmed' },
                { value: '8', label: 'In Discussion' },
                { value: '5', label: 'Proposal Submitted' },
                { value: '50+', label: 'Target 2028' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl px-4 py-3 text-center border border-white/15">
                  <div className="text-xl font-bold text-gold-400">{stat.value}</div>
                  <div className="text-forest-200 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Tipe Kemitraan</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">Kami terbuka untuk berbagai bentuk kerjasama, disesuaikan dengan kapasitas dan kebutuhan masing-masing mitra.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {partnerTypes.map((pt) => {
              const Icon = pt.icon;
              const isSelected = selectedType === pt.value;
              return (
                <button
                  key={pt.value}
                  onClick={() => handleTypeSelect(pt.value)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-forest-600 bg-forest-50 shadow-md'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 ${pt.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className={`font-bold mb-1 ${isSelected ? 'text-forest-800' : 'text-neutral-900'}`}>{pt.label}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{pt.desc}</p>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-forest-200">
                      <p className="text-forest-600 text-xs font-semibold mb-1.5">Yang Anda dapatkan:</p>
                      <ul className="space-y-1">
                        {benefitsByType[pt.value].map((b) => (
                          <li key={b} className="flex items-start gap-1.5 text-xs text-forest-700">
                            <CheckCircle size={11} className="text-forest-500 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Mitra & Calon Mitra</h2>
            <p className="text-neutral-500 text-sm">Bergabunglah dengan institusi-institusi terkemuka ini dalam ekosistem AMARKALA</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentPartners.map((partner) => (
              <div key={partner.name} className="bg-white rounded-xl border border-neutral-200 p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{partner.logo}</div>
                <div className="font-semibold text-neutral-800 text-sm">{partner.name}</div>
                <div className="text-neutral-400 text-xs mt-0.5">{partner.type}</div>
                <div className={`mt-2 text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${
                  partner.status === 'MoU Confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {partner.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: Process */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Proses Kemitraan</h2>
              <p className="text-neutral-600 text-sm mb-8">Proses yang sederhana, transparan, dan berorientasi dampak.</p>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Kirim Proposal', desc: 'Isi formulir di bawah dengan informasi organisasi dan minat kemitraan Anda.' },
                  { step: '02', title: 'Review Tim AMARKALA', desc: 'Tim kami akan meninjau proposal dalam 3–7 hari kerja.' },
                  { step: '03', title: 'Diskusi & Alignment', desc: 'Meeting virtual untuk mendiskusikan bentuk kerjasama yang saling menguntungkan.' },
                  { step: '04', title: 'Penandatanganan MoU', desc: 'Formalisasi kemitraan dengan perjanjian kerja sama yang jelas.' },
                  { step: '05', title: 'Implementasi & Monitoring', desc: 'Jalankan program bersama dengan laporan dampak berkala.' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-forest-800 text-gold-400 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-sm">{s.title}</h3>
                      <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-gold-50 border border-gold-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-gold-600" />
                  <h4 className="font-bold text-gold-900 text-sm">First Mover in ASEAN</h4>
                </div>
                <p className="text-gold-700 text-xs leading-relaxed">
                  AMARKALA adalah platform pertama di Asia Tenggara yang menyediakan transparansi data KIP individual secara publik. Menjadi mitra kami berarti menjadi bagian dari sejarah.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-bold text-neutral-900 text-xl mb-6">Ajukan Kemitraan</h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Org type selector */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Tipe Organisasi <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {partnerTypes.map((pt) => {
                        const Icon = pt.icon;
                        return (
                          <button
                            key={pt.value}
                            type="button"
                            onClick={() => handleTypeSelect(pt.value)}
                            className={`p-2 rounded-xl border text-center transition-all ${
                              form.org_type === pt.value
                                ? 'border-forest-600 bg-forest-50 text-forest-700'
                                : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                            }`}
                          >
                            <Icon size={16} className="mx-auto mb-0.5" />
                            <div className="text-xs font-medium leading-tight">{pt.label.split(' ')[0]}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        Nama Organisasi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.org_name}
                        onChange={(e) => setForm({ ...form, org_name: e.target.value })}
                        placeholder="Nama institusi/organisasi"
                        required
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        Website <span className="text-neutral-400 font-normal">(opsional)</span>
                      </label>
                      <input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        placeholder="https://www.contoh.org"
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        Nama Kontak <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.contact_name}
                        onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                        placeholder="Nama Anda"
                        required
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
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
                        placeholder="kontak@organisasi.id"
                        required
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        No. WhatsApp <span className="text-neutral-400 font-normal">(opsional)</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+62 812 xxxx xxxx"
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      />
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
                          <option value="">Pilih Provinsi</option>
                          {provinces.map((p) => <option key={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Minat Kemitraan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => setForm({ ...form, interest })}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            form.interest === interest
                              ? 'border-forest-600 bg-forest-50 text-forest-800'
                              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">
                      Pesan / Konteks Tambahan <span className="text-neutral-400 font-normal">(opsional)</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Ceritakan lebih lanjut tentang organisasi Anda dan bagaimana Anda ingin berkolaborasi dengan AMARKALA..."
                      rows={4}
                      className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">Gagal mengirim. Silakan coba lagi.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !form.org_name || !form.contact_name || !form.email || !form.interest}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-forest-800 hover:bg-forest-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                  >
                    {status === 'loading' ? (
                      <><RefreshCw size={16} className="animate-spin" /> Mengirim proposal...</>
                    ) : (
                      <><Send size={16} /> Ajukan Partnership</>
                    )}
                  </button>
                  <p className="text-xs text-neutral-400 text-center">
                    Dengan mengajukan, Anda setuju bahwa informasi organisasi akan digunakan untuk tujuan evaluasi kemitraan AMARKALA.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="py-16 bg-forest-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Mengapa Bermitra dengan AMARKALA?</h2>
          <p className="text-forest-300 text-sm mb-10">Target dampak bersama menuju 2028</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, value: '1 Juta', label: 'Data siswa transparan' },
              { icon: Globe, value: '34', label: 'Provinsi tercakup' },
              { icon: Users, value: '50+', label: 'Mitra aktif' },
              { icon: CheckCircle, value: '−30%', label: 'Pengurangan KIP blindspots' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-gold-500/15 border border-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-gold-400" />
                </div>
                <div className="text-3xl font-bold text-gold-400 mb-1">{value}</div>
                <div className="text-forest-300 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
