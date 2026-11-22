import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Users, Wifi, WifiOff, ChevronDown, School as SchoolIcon, Filter, X } from 'lucide-react';
import { supabase, School } from '../lib/supabase';

const provinces = ['Semua Provinsi', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Papua', 'Papua Barat', 'Sulawesi Barat', 'Maluku', 'Kalimantan Utara', 'Sumatera Utara', 'Sumatera Selatan', 'Aceh'];
const levels = ['Semua Jenjang', 'SD', 'SMP', 'SMA', 'SMK', 'PKBM'];
const accreditations = ['Semua Akreditasi', 'A', 'B', 'C'];

const needsColors = ['', 'bg-forest-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
const needsLabels = ['', 'Sangat Rendah', 'Rendah', 'Sedang', 'Tinggi', 'Kritis'];

export default function SchoolDatabase() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('Semua Provinsi');
  const [level, setLevel] = useState('Semua Jenjang');
  const [accreditation, setAccreditation] = useState('Semua Akreditasi');
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<School | null>(null);

  useEffect(() => {
    fetchSchools();
  }, [province, level, accreditation]);

  async function fetchSchools() {
    setLoading(true);
    let q = supabase.from('schools').select('*', { count: 'exact' });

    if (province !== 'Semua Provinsi') q = q.eq('province', province);
    if (level !== 'Semua Jenjang') q = q.eq('level', level);
    if (accreditation !== 'Semua Akreditasi') q = q.eq('accreditation', accreditation);

    const { data, count, error } = await q.order('needs_rating', { ascending: false }).limit(50);
    if (!error && data) {
      setSchools(data);
      setTotal(count || 0);
    }
    setLoading(false);
  }

  const filtered = schools.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.npsn.includes(q);
  });

  const clearFilters = () => {
    setProvince('Semua Provinsi');
    setLevel('Semua Jenjang');
    setAccreditation('Semua Akreditasi');
    setSearch('');
  };

  const hasActiveFilters = province !== 'Semua Provinsi' || level !== 'Semua Jenjang' || accreditation !== 'Semua Akreditasi' || search;

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-forest-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">School Database</h1>
          <p className="text-forest-300">Database sekolah nasional dengan data fasilitas, kebutuhan, dan status penerima KIP</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter bar */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama sekolah, kota, atau NPSN..."
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                showFilters ? 'bg-forest-700 border-forest-700 text-white' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filter
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                <X size={14} /> Reset
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-neutral-100">
              {[
                { label: 'Provinsi', value: province, options: provinces, setter: setProvince },
                { label: 'Jenjang', value: level, options: levels, setter: setLevel },
                { label: 'Akreditasi', value: accreditation, options: accreditations, setter: setAccreditation },
              ].map(({ label, value, options, setter }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-neutral-500 mb-1 block">{label}</label>
                  <div className="relative">
                    <select
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full appearance-none border border-neutral-200 rounded-xl px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                    >
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-neutral-500 text-sm">
            {loading ? 'Memuat...' : `Menampilkan ${filtered.length} dari ${total} sekolah`}
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Kebutuhan Kritis</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-forest-500" /> Kebutuhan Rendah</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="w-10 h-10 border-3 border-forest-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: '3px' }} />
                <p className="text-neutral-500 text-sm">Memuat data sekolah...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <SchoolIcon size={36} className="text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Tidak ada sekolah yang sesuai filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => setSelected(school.id === selected?.id ? null : school)}
                    className={`w-full text-left bg-white rounded-xl border transition-all duration-200 p-4 hover:shadow-md ${
                      selected?.id === school.id ? 'border-forest-400 ring-1 ring-forest-200 shadow-md' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-forest-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-forest-700">{school.level}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-neutral-900 text-sm truncate">{school.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                            <MapPin size={11} />
                            <span>{school.city}, {school.province}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1" title={`Kebutuhan: ${needsLabels[school.needs_rating]}`}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div key={n} className={`w-1.5 h-3 rounded-sm ${n <= school.needs_rating ? needsColors[school.needs_rating] : 'bg-neutral-200'}`} />
                          ))}
                        </div>
                        {school.internet_access
                          ? <Wifi size={14} className="text-forest-500" title="Ada internet" />
                          : <WifiOff size={14} className="text-red-400" title="Tidak ada internet" />
                        }
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          school.accreditation === 'A' ? 'bg-forest-100 text-forest-700' :
                          school.accreditation === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>{school.accreditation}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-neutral-100">
                      <div>
                        <div className="text-xs text-neutral-400">Siswa</div>
                        <div className="text-sm font-bold text-neutral-800">{school.student_count.toLocaleString('id')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Penerima KIP</div>
                        <div className="text-sm font-bold text-forest-700">{school.kip_recipients.toLocaleString('id')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Rasio KIP</div>
                        <div className="text-sm font-bold text-neutral-800">
                          {school.student_count > 0 ? Math.round((school.kip_recipients / school.student_count) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div>
            {selected ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-20">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-forest-100 text-forest-700 text-xs font-semibold rounded mb-2">
                      <SchoolIcon size={11} /> {selected.level}
                    </div>
                    <h2 className="font-bold text-neutral-900 text-base leading-snug">{selected.name}</h2>
                    <p className="text-neutral-500 text-sm mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {selected.city}, {selected.province}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-neutral-300 hover:text-neutral-500 p-1">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'NPSN', value: selected.npsn },
                    { label: 'Akreditasi', value: selected.accreditation },
                    { label: 'Jumlah Siswa', value: selected.student_count.toLocaleString('id') },
                    { label: 'Penerima KIP', value: selected.kip_recipients.toLocaleString('id') },
                    { label: 'Rasio KIP', value: `${selected.student_count > 0 ? Math.round((selected.kip_recipients / selected.student_count) * 100) : 0}%` },
                    { label: 'Internet', value: selected.internet_access ? 'Tersedia' : 'Tidak Tersedia' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-xs text-neutral-500">{label}</span>
                      <span className="text-sm font-semibold text-neutral-800">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="text-xs text-neutral-500 mb-2">Tingkat Kebutuhan</div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className={`w-4 h-5 rounded-sm ${n <= selected.needs_rating ? needsColors[selected.needs_rating] : 'bg-neutral-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-neutral-700">{needsLabels[selected.needs_rating]}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <div className="text-center py-8">
                  <SchoolIcon size={32} className="text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">Pilih sekolah untuk melihat detail</p>
                </div>

                <div className="border-t border-neutral-100 pt-5 mt-4">
                  <h3 className="font-semibold text-neutral-800 text-sm mb-3">Statistik Database</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Total Sekolah', value: `${total}+` },
                      { label: 'Provinsi Tercakup', value: '20' },
                      { label: 'Sekolah Tanpa Internet', value: '8' },
                      { label: 'Sekolah Kebutuhan Kritis', value: '5' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">{label}</span>
                        <span className="text-sm font-bold text-forest-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
