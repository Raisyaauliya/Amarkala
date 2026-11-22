import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Users, School, FileText, BarChart2, Download, RefreshCw, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

const regionData = [
  { region: 'DKI Jakarta', kipIndex: 0.18, color: '#15803d', label: 'Sangat Rendah' },
  { region: 'DI Yogyakarta', kipIndex: 0.22, color: '#16a34a', label: 'Sangat Rendah' },
  { region: 'Jawa Barat', kipIndex: 0.38, color: '#22c55e', label: 'Rendah' },
  { region: 'Jawa Tengah', kipIndex: 0.44, color: '#4ade80', label: 'Rendah' },
  { region: 'Jawa Timur', kipIndex: 0.48, color: '#86efac', label: 'Sedang' },
  { region: 'Sumatera Utara', kipIndex: 0.52, color: '#fbbf24', label: 'Sedang' },
  { region: 'Sulawesi Selatan', kipIndex: 0.55, color: '#f97316', label: 'Tinggi' },
  { region: 'Kalimantan Timur', kipIndex: 0.58, color: '#ef4444', label: 'Tinggi' },
  { region: 'Papua', kipIndex: 0.85, color: '#b91c1c', label: 'Sangat Tinggi' },
];

const monthlyData = [
  { month: 'Jan', value: 0.46 },
  { month: 'Feb', value: 0.48 },
  { month: 'Mar', value: 0.50 },
  { month: 'Apr', value: 0.53 },
  { month: 'Mei', value: 0.55 },
  { month: 'Jun', value: 0.57 },
];

const islandData = [
  { name: 'Papua', index: 0.85, color: '#b91c1c', schools: 420, kip: 8200 },
  { name: 'Maluku', index: 0.72, color: '#dc2626', schools: 380, kip: 5400 },
  { name: 'Sulawesi', index: 0.58, color: '#f97316', schools: 2100, kip: 28000 },
  { name: 'Kalimantan', index: 0.52, color: '#fbbf24', schools: 1800, kip: 19000 },
  { name: 'Sumatera', index: 0.44, color: '#22c55e', schools: 4200, kip: 42000 },
  { name: 'Jawa', index: 0.25, color: '#15803d', schools: 12000, kip: 85000 },
  { name: 'Bali & NT', index: 0.38, color: '#4ade80', schools: 1100, kip: 11000 },
];

function BarChart({ data, maxValue = 1 }: { data: { label: string; value: number; color: string }[]; maxValue?: number }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-32 text-xs text-neutral-600 text-right flex-shrink-0">{item.label}</div>
          <div className="flex-1 h-6 bg-neutral-100 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-700"
              style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
            />
          </div>
          <div className="w-10 text-xs font-semibold text-neutral-700">{item.value.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: { month: string; value: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 0.1;
  const w = 300;
  const h = 120;
  const padX = 20;
  const padY = 15;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (w - padX * 2),
    y: h - padY - ((d.value - minVal) / range) * (h - padY * 2),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - padY} L ${points[0].x} ${h - padY} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#16a34a" stroke="white" strokeWidth="1.5" />
        ))}
        {data.map((d, i) => (
          <text key={i} x={points[i].x} y={h - 2} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.month}</text>
        ))}
        {data.map((d, i) => (
          i % 2 === 0 ? <text key={`v${i}`} x={points[i].x} y={points[i].y - 7} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">{d.value.toFixed(2)}</text> : null
        ))}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDistributions: 12458,
    totalBeneficiaries: 78320,
    schoolsReached: 320,
    reportsSubmitted: 256,
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated] = useState('15 Jun 2026, 09:42 WIB');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [schoolsRes, reportsRes] = await Promise.all([
          supabase.from('schools').select('student_count, kip_recipients', { count: 'exact' }),
          supabase.from('blindspot_reports').select('id', { count: 'exact' }),
        ]);
        if (schoolsRes.data) {
          const totalBeneficiaries = schoolsRes.data.reduce((sum, s) => sum + (s.kip_recipients || 0), 0);
          setStats(prev => ({
            ...prev,
            schoolsReached: schoolsRes.count || prev.schoolsReached,
            totalBeneficiaries: totalBeneficiaries > 0 ? totalBeneficiaries : prev.totalBeneficiaries,
            reportsSubmitted: reportsRes.count || prev.reportsSubmitted,
          }));
        }
      } catch (e) {
        // use defaults
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Distribusi', value: stats.totalDistributions.toLocaleString('id'), icon: BarChart2, trend: '+8.2%', up: true },
    { label: 'Total Penerima', value: stats.totalBeneficiaries.toLocaleString('id'), icon: Users, trend: '+12.4%', up: true },
    { label: 'Sekolah Tercakup', value: stats.schoolsReached.toLocaleString('id'), icon: School, trend: '+5.1%', up: true },
    { label: 'Laporan Masuk', value: stats.reportsSubmitted.toLocaleString('id'), icon: FileText, trend: '+18.7%', up: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-forest-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Data Transparency Dashboard</h1>
              <p className="text-forest-300 text-sm">Peta Ketimpangan Wilayah — Regional Inequality Map (KIP Index)</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-forest-400 text-xs">Terakhir diperbarui</div>
                <div className="text-white text-sm font-medium">{lastUpdated}</div>
              </div>
              <button className={`p-2 rounded-lg bg-forest-700 hover:bg-forest-600 transition-colors ${loading ? 'animate-spin' : ''}`}>
                <RefreshCw size={16} className="text-forest-300" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-forest-600 hover:bg-forest-500 rounded-lg text-sm font-medium transition-colors">
                <Download size={15} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-100 flex items-center justify-center">
                    <Icon size={18} className="text-gold-600" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${card.up ? 'text-forest-600' : 'text-red-500'}`}>
                    {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {card.trend}
                  </div>
                </div>
                <div className="text-2xl font-bold text-neutral-900">{card.value}</div>
                <div className="text-neutral-500 text-xs mt-1">{card.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Indonesia Map Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-neutral-900">Peta Ketimpangan Indonesia</h2>
                <p className="text-neutral-500 text-sm">KIP Index per Kepulauan (0 = Merata, 1 = Sangat Timpang)</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400">
                <Info size={16} />
              </button>
            </div>

            {/* Simplified Indonesia Map */}
            <div className="relative bg-neutral-50 rounded-xl overflow-hidden p-4 mb-4">
              <svg viewBox="0 0 700 280" className="w-full" style={{ height: '220px' }}>
                {/* Sumatera */}
                <g>
                  <ellipse cx="130" cy="140" rx="95" ry="55" fill={islandData.find(d=>d.name==='Sumatera')?.color} opacity="0.85"/>
                  <text x="130" y="137" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Sumatera</text>
                  <text x="130" y="151" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">0.44</text>
                </g>
                {/* Jawa */}
                <g>
                  <ellipse cx="295" cy="190" rx="80" ry="28" fill={islandData.find(d=>d.name==='Jawa')?.color} opacity="0.85"/>
                  <text x="295" y="187" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Jawa</text>
                  <text x="295" y="200" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">0.25</text>
                </g>
                {/* Kalimantan */}
                <g>
                  <ellipse cx="355" cy="120" rx="85" ry="70" fill={islandData.find(d=>d.name==='Kalimantan')?.color} opacity="0.85"/>
                  <text x="355" y="117" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Kalimantan</text>
                  <text x="355" y="131" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">0.52</text>
                </g>
                {/* Sulawesi */}
                <g>
                  <ellipse cx="470" cy="130" rx="48" ry="70" fill={islandData.find(d=>d.name==='Sulawesi')?.color} opacity="0.85" transform="rotate(-20 470 130)"/>
                  <text x="470" y="127" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Sulawesi</text>
                  <text x="470" y="141" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">0.58</text>
                </g>
                {/* Maluku */}
                <g>
                  <ellipse cx="555" cy="150" rx="32" ry="42" fill={islandData.find(d=>d.name==='Maluku')?.color} opacity="0.85"/>
                  <text x="555" y="147" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">Maluku</text>
                  <text x="555" y="160" textAnchor="middle" fontSize="8" fill="white" opacity="0.9">0.72</text>
                </g>
                {/* Papua */}
                <g>
                  <ellipse cx="640" cy="130" rx="55" ry="65" fill={islandData.find(d=>d.name==='Papua')?.color} opacity="0.85"/>
                  <text x="640" y="127" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Papua</text>
                  <text x="640" y="142" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">0.85</text>
                </g>
                {/* Bali & NT */}
                <g>
                  <ellipse cx="395" cy="215" rx="30" ry="15" fill={islandData.find(d=>d.name==='Bali & NT')?.color} opacity="0.85"/>
                  <text x="395" y="213" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">Bali & NT</text>
                  <text x="395" y="224" textAnchor="middle" fontSize="7.5" fill="white" opacity="0.9">0.38</text>
                </g>
              </svg>

              {/* Legend */}
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <span className="text-xs text-neutral-500">KIP Index:</span>
                {[
                  { label: 'Sangat Rendah', color: '#15803d' },
                  { label: 'Rendah', color: '#22c55e' },
                  { label: 'Sedang', color: '#fbbf24' },
                  { label: 'Tinggi', color: '#f97316' },
                  { label: 'Sangat Tinggi', color: '#b91c1c' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-neutral-600">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Island detail stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {islandData.slice(0, 4).map((island) => (
                <div key={island.name} className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: island.color }} />
                    <span className="text-xs font-semibold text-neutral-700">{island.name}</span>
                  </div>
                  <div className="text-sm font-bold text-neutral-900">{island.kip.toLocaleString('id')}</div>
                  <div className="text-xs text-neutral-400">penerima KIP</div>
                </div>
              ))}
            </div>
          </div>

          {/* KIP Index by Region */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-bold text-neutral-900 mb-1">KIP Index per Provinsi</h2>
            <p className="text-neutral-500 text-xs mb-5">Semakin tinggi = semakin timpang</p>
            <BarChart
              data={regionData.map(r => ({ label: r.region, value: r.kipIndex, color: r.color }))}
              maxValue={1}
            />
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>0.00</span>
                <span>Merata ← → Timpang</span>
                <span>1.00</span>
              </div>
              <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-600" />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Time series */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-bold text-neutral-900 mb-1">KIP Index Nasional — Tren Waktu</h2>
            <p className="text-neutral-500 text-xs mb-4">Rata-rata ketimpangan nasional 2026</p>
            <LineChart data={monthlyData} />
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <TrendingUp size={12} className="text-amber-500" />
                Ketimpangan meningkat 0.11 poin dari Jan—Jun 2026
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-neutral-900">Distribusi per Provinsi Terbaru</h2>
                <p className="text-neutral-500 text-xs">Data KIP 2025</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { prov: 'Jawa Barat', items: 'Alat Tulis & Seragam', recipients: '1.250', date: '8 Jun 2025' },
                { prov: 'DKI Jakarta', items: 'Dana Tunai KIP', recipients: '980', date: '5 Jun 2025' },
                { prov: 'Papua', items: 'Infrastruktur Sekolah', recipients: '540', date: '4 Jun 2025' },
                { prov: 'Jawa Timur', items: 'Buku & Alat Belajar', recipients: '1.100', date: '3 Jun 2025' },
                { prov: 'Sulawesi Barat', items: 'Dana Tunai KIP', recipients: '780', date: '2 Jun 2025' },
              ].map((row) => (
                <div key={row.prov} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-xs font-bold text-forest-700">
                      {row.prov.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-800">{row.prov}</div>
                      <div className="text-xs text-neutral-400">{row.items}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-forest-700">{row.recipients}</div>
                    <div className="text-xs text-neutral-400">{row.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-sm">
            Data ditampilkan berdasarkan sistem AMARKALA dan sumber resmi Kemendikbud, BPS, dan laporan komunitas. KIP Index dihitung dari rasio anak tidak terlayani terhadap total populasi usia sekolah per wilayah.{' '}
            <span className="font-semibold">Source: Kemendikbud & BPS Indonesia, 2024.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
