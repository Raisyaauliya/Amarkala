import { useState } from 'react';
import { Megaphone, Shield, CheckCircle, AlertCircle, Clock, ChevronDown, Upload, Lock, Eye, EyeOff, Send, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ReportType = 'kip_not_received' | 'wrong_recipient' | 'school_needs' | 'data_error' | 'other';
type Status = 'idle' | 'loading' | 'success' | 'error';

const reportTypes: { value: ReportType; label: string; desc: string; icon: string }[] = [
  { value: 'kip_not_received', label: 'KIP Tidak Diterima', desc: 'Terdaftar sebagai penerima namun bantuan belum diterima', icon: '💸' },
  { value: 'wrong_recipient', label: 'Penerima Salah Sasaran', desc: 'Bantuan diterima oleh pihak yang tidak berhak', icon: '🎯' },
  { value: 'school_needs', label: 'Kebutuhan Sekolah', desc: 'Sekolah memiliki kebutuhan mendesak yang belum terpenuhi', icon: '🏫' },
  { value: 'data_error', label: 'Kesalahan Data', desc: 'Data di sistem tidak sesuai dengan kondisi sebenarnya', icon: '📊' },
  { value: 'other', label: 'Lainnya', desc: 'Laporan terkait pendidikan yang tidak masuk kategori di atas', icon: '📝' },
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

const recentReports = [
  { id: 'RPT-2026-0042', type: 'KIP Tidak Diterima', province: 'Papua', status: 'under_review', date: '12 Jun 2026' },
  { id: 'RPT-2026-0039', type: 'Penerima Salah Sasaran', province: 'Jawa Barat', status: 'submitted', date: '10 Jun 2026' },
  { id: 'RPT-2026-0035', type: 'Kebutuhan Sekolah', province: 'Sulawesi Barat', status: 'submitted', date: '8 Jun 2026' },
  { id: 'RPT-2026-0031', type: 'Kesalahan Data', province: 'Papua Barat', status: 'resolved', date: '1 Jun 2026' },
  { id: 'RPT-2026-0028', type: 'KIP Tidak Diterima', province: 'Maluku', status: 'under_review', date: '28 Mei 2026' },
];

const statusBadge: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  submitted: { label: 'Diterima', color: 'text-blue-700', bg: 'bg-blue-50', icon: Clock },
  under_review: { label: 'Ditinjau', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  resolved: { label: 'Selesai', color: 'text-forest-700', bg: 'bg-forest-50', icon: CheckCircle },
  closed: { label: 'Ditutup', color: 'text-neutral-600', bg: 'bg-neutral-50', icon: AlertCircle },
};

export default function ReportBlindspot() {
  const [reportType, setReportType] = useState<ReportType>('kip_not_received');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [reportId, setReportId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!province || !city || !description.trim()) return;

    setStatus('loading');

    try {
      const { data, error } = await supabase
        .from('blindspot_reports')
        .insert({
          report_type: reportType,
          province,
          city: city.trim(),
          description: description.trim(),
          contact_info: showContact && contactInfo.trim() ? contactInfo.trim() : null,
          status: 'submitted',
        })
        .select('id')
        .single();

      if (error) throw error;
      setReportId(`RPT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setReportType('kip_not_received');
    setProvince('');
    setCity('');
    setDescription('');
    setContactInfo('');
    setShowContact(false);
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-forest-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Laporan Diterima</h2>
          <p className="text-neutral-600 mb-5">
            Terima kasih telah melaporkan. Laporan Anda akan ditinjau oleh tim AMARKALA dalam 2–5 hari kerja.
          </p>
          <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mb-6">
            <div className="text-xs text-forest-600 mb-1">ID Laporan Anda</div>
            <div className="text-lg font-mono font-bold text-forest-800">{reportId}</div>
            <div className="text-xs text-forest-500 mt-1">Simpan ID ini untuk memantau status laporan</div>
          </div>
          <div className="space-y-3 text-sm text-neutral-600 mb-6">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-forest-500" />
              Identitas Anda terlindungi sepenuhnya
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              Estimasi respons: 2–5 hari kerja
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-forest-700 hover:bg-forest-600 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Buat Laporan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-forest-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Report Blindspot</h1>
          <p className="text-forest-300">Laporkan ketidaksesuaian data KIP atau kebutuhan pendidikan secara anonim. Suara Anda membuat perubahan.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Megaphone size={20} className="text-red-500" />
                </div>
                <div>
                  <h2 className="font-bold text-neutral-900">Form Pelaporan</h2>
                  <p className="text-neutral-500 text-xs flex items-center gap-1">
                    <Lock size={10} /> 100% Anonim — identitas Anda tidak disimpan
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Jenis Laporan <span className="text-red-500">*</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {reportTypes.map((rt) => (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => setReportType(rt.value)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          reportType === rt.value
                            ? 'border-forest-500 bg-forest-50'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-lg leading-none">{rt.icon}</span>
                          <span className={`text-sm font-semibold ${reportType === rt.value ? 'text-forest-800' : 'text-neutral-800'}`}>
                            {rt.label}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 pl-7">{rt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                        className="w-full appearance-none border border-neutral-300 rounded-xl px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((p) => <option key={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Kota/Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Contoh: Kota Jayapura"
                      required
                      className="w-full border border-neutral-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Deskripsi Laporan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan situasi yang ingin Anda laporkan secara detail. Semakin detail, semakin mudah kami menindaklanjutinya..."
                    rows={5}
                    required
                    minLength={50}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${description.length < 50 ? 'text-red-400' : 'text-neutral-400'}`}>
                      {description.length}/50 karakter minimum
                    </p>
                    {description.length >= 50 && (
                      <p className="text-xs text-forest-600 flex items-center gap-1">
                        <CheckCircle size={11} /> Cukup
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional contact */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setShowContact(!showContact)}
                    className="flex items-center justify-between w-full text-sm font-medium text-neutral-700"
                  >
                    <span className="flex items-center gap-2">
                      {showContact ? <Eye size={15} /> : <EyeOff size={15} />}
                      {showContact ? 'Sembunyikan' : 'Tambahkan'} Kontak Opsional
                    </span>
                    <span className="text-xs text-neutral-400 font-normal">(Opsional — untuk tindak lanjut)</span>
                  </button>
                  {showContact && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Email atau nomor WhatsApp (tidak wajib diisi)"
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      />
                      <p className="text-xs text-neutral-400 mt-1.5">
                        Jika diisi, tim kami dapat menghubungi untuk klarifikasi. Tetap dijaga kerahasiaannya.
                      </p>
                    </div>
                  )}
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">Terjadi kesalahan. Silakan coba lagi.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || !province || !city || description.length < 50}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-forest-700 hover:bg-forest-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200"
                >
                  {status === 'loading' ? (
                    <><RefreshCw size={18} className="animate-spin" /> Mengirim laporan...</>
                  ) : (
                    <><Send size={18} /> Kirim Laporan</>
                  )}
                </button>

                <p className="text-xs text-neutral-400 text-center">
                  Dengan mengirimkan laporan ini, Anda menyetujui data digunakan untuk tujuan perbaikan sistem pendidikan Indonesia.
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-forest-600" />
                <h3 className="font-bold text-neutral-900 text-sm">Jaminan Anonimitas</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Tidak ada login yang diperlukan',
                  'IP address tidak dicatat',
                  'Laporan dienkripsi end-to-end',
                  'Kontak hanya digunakan untuk tindak lanjut',
                  'Data sesuai UU PDP Indonesia',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle size={14} className="text-forest-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <h3 className="font-bold text-neutral-900 text-sm mb-3">Statistik Laporan</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Laporan', value: '256' },
                  { label: 'Sedang Ditinjau', value: '48' },
                  { label: 'Terselesaikan', value: '187' },
                  { label: 'Rata-rata Respons', value: '3 hari' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{label}</span>
                    <span className="text-sm font-bold text-forest-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <h3 className="font-bold text-neutral-900 text-sm mb-3">Laporan Terbaru</h3>
              <div className="space-y-3">
                {recentReports.map((report) => {
                  const s = statusBadge[report.status];
                  const Icon = s.icon;
                  return (
                    <div key={report.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={13} className={s.color} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-mono text-neutral-400">{report.id}</div>
                        <div className="text-xs font-semibold text-neutral-700 truncate">{report.type}</div>
                        <div className="text-xs text-neutral-400">{report.province} · {report.date}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${s.bg} ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
