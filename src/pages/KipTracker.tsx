import { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Shield, Info, ChevronRight, RefreshCw } from 'lucide-react';
import { supabase, KipRecord } from '../lib/supabase';

type SearchType = 'nik' | 'nisn';

const statusConfig = {
  verified: {
    label: 'Terverifikasi',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    desc: 'Penerima KIP terdaftar dan bantuan telah/akan disalurkan.',
  },
  pending: {
    label: 'Sedang Diproses',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Clock,
    iconColor: 'text-amber-500',
    desc: 'Data penerima ditemukan, namun pencairan bantuan sedang dalam proses verifikasi.',
  },
  not_found: {
    label: 'Tidak Ditemukan',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
    iconColor: 'text-red-500',
    desc: 'Data tidak ditemukan dalam sistem KIP. Jika Anda berhak menerima, gunakan fitur Report Blindspot.',
  },
  rejected: {
    label: 'Ditolak',
    color: 'text-neutral-700',
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    icon: AlertCircle,
    iconColor: 'text-neutral-500',
    desc: 'Pengajuan KIP ditolak berdasarkan verifikasi data. Hubungi Dinas Pendidikan setempat untuk informasi lebih lanjut.',
  },
};

const demoNIK = '3171234567890001';
const demoNISN = '0087654321';

export default function KipTracker() {
  const [searchType, setSearchType] = useState<SearchType>('nik');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KipRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setSearched(false);

    try {
      const column = searchType === 'nik' ? 'nik' : 'nisn';
      const { data, error: dbError } = await supabase
        .from('kip_records')
        .select('*')
        .eq(column, query.trim())
        .maybeSingle();

      if (dbError) throw dbError;

      setResult(data);
      setSearched(true);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setSearched(false);
    setError('');
  };

  const fillDemo = () => {
    setQuery(searchType === 'nik' ? demoNIK : demoNISN);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-forest-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">KIP Tracker</h1>
          <p className="text-forest-300">Verifikasi status bantuan Kartu Indonesia Pintar secara real-time menggunakan NIK atau NISN</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center">
                  <Search size={20} className="text-forest-600" />
                </div>
                <div>
                  <h2 className="font-bold text-neutral-900">Cek Status KIP</h2>
                  <p className="text-neutral-500 text-xs">Data dienkripsi dan dilindungi UU PDP</p>
                </div>
              </div>

              {/* Tab switch */}
              <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-6">
                <button
                  onClick={() => { setSearchType('nik'); setQuery(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    searchType === 'nik' ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  NIK (16 digit)
                </button>
                <button
                  onClick={() => { setSearchType('nisn'); setQuery(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    searchType === 'nisn' ? 'bg-white text-forest-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  NISN (10 digit)
                </button>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    {searchType === 'nik' ? 'Nomor Induk Kependudukan (NIK)' : 'Nomor Induk Siswa Nasional (NISN)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value.replace(/\D/g, ''))}
                      placeholder={searchType === 'nik' ? 'Contoh: 3171234567890001' : 'Contoh: 0087654321'}
                      maxLength={searchType === 'nik' ? 16 : 10}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent font-mono text-lg tracking-widest"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-neutral-400 text-xs">
                      {query.length}/{searchType === 'nik' ? 16 : 10} digit
                    </p>
                    <button
                      type="button"
                      onClick={fillDemo}
                      className="text-forest-600 text-xs hover:text-forest-700 font-medium underline underline-offset-2"
                    >
                      Gunakan data demo
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || query.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-forest-700 hover:bg-forest-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200"
                >
                  {loading ? (
                    <><RefreshCw size={18} className="animate-spin" /> Mencari data...</>
                  ) : (
                    <><Search size={18} /> Cek Status KIP</>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Result */}
              {searched && !loading && (
                <div className="mt-6">
                  {result ? (
                    <div className={`rounded-xl border p-5 ${statusConfig[result.status].bg} ${statusConfig[result.status].border}`}>
                      <div className="flex items-start gap-3 mb-4">
                        {(() => {
                          const Ic = statusConfig[result.status].icon;
                          return <Ic size={24} className={`${statusConfig[result.status].iconColor} flex-shrink-0 mt-0.5`} />;
                        })()}
                        <div>
                          <div className={`font-bold text-lg ${statusConfig[result.status].color}`}>
                            {statusConfig[result.status].label}
                          </div>
                          <p className="text-neutral-600 text-sm mt-0.5">{statusConfig[result.status].desc}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {[
                          { label: 'Nama', value: result.name },
                          { label: 'Provinsi', value: result.province },
                          { label: 'Kota/Kab', value: result.city },
                          { label: 'Jenjang', value: result.level },
                          { label: 'Tahun', value: String(result.year) },
                          { label: 'Nominal', value: result.amount > 0 ? `Rp ${result.amount.toLocaleString('id')}` : '—' },
                          { label: 'Tanggal Cair', value: result.disbursement_date ? new Date(result.disbursement_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum dicairkan' },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white/60 rounded-lg p-3">
                            <div className="text-neutral-500 text-xs mb-0.5">{label}</div>
                            <div className="font-semibold text-neutral-900 text-sm">{value}</div>
                          </div>
                        ))}
                      </div>

                      {result.status === 'not_found' || result.status === 'pending' ? (
                        <div className="mt-4 pt-4 border-t border-current/10">
                          <p className="text-sm text-neutral-600">
                            Jika Anda yakin berhak menerima KIP namun data tidak ditemukan atau tertunda,{' '}
                            <span className="text-forest-700 font-semibold">gunakan fitur Report Blindspot</span> untuk melaporkan ke tim kami.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className={`rounded-xl border p-5 ${statusConfig.not_found.bg} ${statusConfig.not_found.border}`}>
                      <div className="flex items-start gap-3">
                        <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-lg text-red-700">Data Tidak Ditemukan</div>
                          <p className="text-neutral-600 text-sm mt-1">{statusConfig.not_found.desc}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    className="mt-4 text-sm text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
                  >
                    <RefreshCw size={14} /> Cari lagi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-forest-600" />
                <h3 className="font-bold text-neutral-900 text-sm">Keamanan & Privasi</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                {[
                  'Data dienkripsi AES-256',
                  'Tidak menyimpan riwayat pencarian',
                  'Sesuai UU PDP Indonesia',
                  'NIK/NISN tidak dibagikan ke pihak ketiga',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-forest-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-forest-50 rounded-2xl border border-forest-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-forest-600" />
                <h3 className="font-bold text-forest-900 text-sm">Panduan Penggunaan</h3>
              </div>
              <ol className="space-y-2 text-sm text-forest-700">
                <li className="flex gap-2">
                  <span className="font-bold text-forest-500">1.</span>
                  Pilih jenis pencarian (NIK atau NISN)
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-forest-500">2.</span>
                  Masukkan nomor dengan benar (hanya angka)
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-forest-500">3.</span>
                  Klik tombol "Cek Status KIP"
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-forest-500">4.</span>
                  Jika tidak ditemukan, laporkan via Report Blindspot
                </li>
              </ol>
            </div>

            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="font-bold text-amber-900 text-sm mb-3">Status KIP</h3>
              <div className="space-y-2">
                {Object.entries(statusConfig).map(([key, val]) => {
                  const Ic = val.icon;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Ic size={14} className={val.iconColor} />
                      <span className={`text-xs font-medium ${val.color}`}>{val.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent lookups (static demo) */}
        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h3 className="font-bold text-neutral-900 mb-4">Statistik Verifikasi Terbaru</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Terverifikasi', value: '6.842', color: 'text-green-700', bg: 'bg-green-50' },
              { label: 'Sedang Diproses', value: '1.204', color: 'text-amber-700', bg: 'bg-amber-50' },
              { label: 'Tidak Ditemukan', value: '892', color: 'text-red-700', bg: 'bg-red-50' },
              { label: 'Total Pencarian', value: '12.458', color: 'text-neutral-700', bg: 'bg-neutral-50' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-neutral-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
