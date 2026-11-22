import { BarChart3, Search, School, Megaphone, Video, Mail, Globe, Instagram, Users, Handshake } from 'lucide-react';

type Page = 'home' | 'dashboard' | 'kip-tracker' | 'school-database' | 'report-blindspot' | 'webinar-hub' | 'community' | 'partnership';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => handleNav('home')} className="mb-5 flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-forest-950" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-base tracking-wide">AMARKALA</div>
                <div className="text-gold-500 text-[9px] font-semibold tracking-widest">EDUCATION TRANSPARENCY</div>
              </div>
            </button>
            <p className="text-forest-300 text-sm leading-relaxed mb-5">
              Education Inclusion Ecosystem and Data Transparency. Memastikan setiap anak Indonesia terlihat, terhitung, dan terlindungi.
            </p>
            <p className="text-gold-400 text-xs italic font-medium">
              "The Light of Truth and Eternal Life Piercing Through Time"
            </p>
            <div className="mt-4 text-forest-500 text-xs">
              AMARTA (eternal life) + KALA (time & light)
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-forest-300 text-xs font-semibold uppercase tracking-widest mb-4">Platform</h3>
            <ul className="space-y-3">
              {[
                { page: 'dashboard' as Page, icon: BarChart3, label: 'Data Transparency Dashboard' },
                { page: 'kip-tracker' as Page, icon: Search, label: 'KIP Tracker' },
                { page: 'school-database' as Page, icon: School, label: 'School Database' },
                { page: 'report-blindspot' as Page, icon: Megaphone, label: 'Report Blindspot' },
                { page: 'webinar-hub' as Page, icon: Video, label: 'Webinar Hub' },
              ].map(({ page, icon: Icon, label }) => (
                <li key={page}>
                  <button
                    onClick={() => handleNav(page)}
                    className="flex items-center gap-2 text-forest-300 hover:text-white text-sm transition-colors group"
                  >
                    <Icon size={14} className="text-forest-500 group-hover:text-forest-300 transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Partnership */}
          <div>
            <h3 className="text-forest-300 text-xs font-semibold uppercase tracking-widest mb-4">Ekosistem</h3>
            <ul className="space-y-3 mb-6">
              {[
                { page: 'community' as Page, icon: Users, label: 'Komunitas AMARKALA', gold: true },
                { page: 'partnership' as Page, icon: Handshake, label: 'Open Partnership', gold: true },
              ].map(({ page, icon: Icon, label, gold }) => (
                <li key={page}>
                  <button
                    onClick={() => handleNav(page)}
                    className={`flex items-center gap-2 text-sm transition-colors group ${
                      gold ? 'text-gold-400 hover:text-gold-300' : 'text-forest-300 hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={gold ? 'text-gold-500 group-hover:text-gold-400' : 'text-forest-500 group-hover:text-forest-300'} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-forest-300 text-xs font-semibold uppercase tracking-widest mb-3">SDG Targets</h3>
            <div className="flex gap-2 flex-wrap">
              {['SDG 4', 'SDG 10', 'SDG 17'].map((sdg) => (
                <span key={sdg} className="px-2 py-1 bg-forest-800 text-gold-400 text-xs rounded font-semibold border border-forest-700">
                  {sdg}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-forest-300 text-xs font-semibold uppercase tracking-widest mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-forest-300">
                <Mail size={14} className="text-forest-500 flex-shrink-0" />
                <span>hello@amarkala.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-forest-300">
                <Globe size={14} className="text-forest-500 flex-shrink-0" />
                <span>www.amarkala.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-forest-300">
                <Instagram size={14} className="text-forest-500 flex-shrink-0" />
                <span>@amarkala.id</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-forest-800">
              <p className="text-forest-500 text-xs mb-1">Developed by</p>
              <p className="text-white text-sm font-semibold">Team The Noble Catalyst</p>
              <p className="text-gold-500 text-xs mt-1 font-medium">Pemuda Mendunia</p>
              <p className="text-forest-500 text-xs">Global Youth Innovation Summit 2026</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-forest-500 text-xs">
            &copy; 2026 AMARKALA. Seluruh data bersifat publik untuk kepentingan pendidikan Indonesia.
          </p>
          <div className="flex items-center gap-4 text-forest-500 text-xs">
            <span>UU PDP Compliant</span>
            <span className="w-1 h-1 rounded-full bg-forest-700" />
            <span>AES-256 Encrypted</span>
            <span className="w-1 h-1 rounded-full bg-forest-700" />
            <span>Open Data API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
