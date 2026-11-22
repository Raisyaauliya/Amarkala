import { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Search, School, Megaphone, Video, Users, Handshake } from 'lucide-react';

type Page = 'home' | 'dashboard' | 'kip-tracker' | 'school-database' | 'report-blindspot' | 'webinar-hub' | 'community' | 'partnership';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: BarChart3 },
  { id: 'kip-tracker' as Page, label: 'KIP Tracker', icon: Search },
  { id: 'school-database' as Page, label: 'Schools', icon: School },
  { id: 'report-blindspot' as Page, label: 'Report', icon: Megaphone },
  { id: 'webinar-hub' as Page, label: 'Webinar', icon: Video },
  { id: 'community' as Page, label: 'Komunitas', icon: Users },
  { id: 'partnership' as Page, label: 'Partnership', icon: Handshake },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = currentPage === 'home';
  const navBg = isScrolled || !isHome
    ? 'bg-forest-950 shadow-lg shadow-black/20'
    : 'bg-transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex-shrink-0 group"
          >
            <div className="bg-white rounded-lg px-3 py-1 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={`${import.meta.env.BASE_URL}Logo_gabungan_amarkala_dan_noble_dan_pemuda_pemdunia.png`}
                alt="AMARKALA — Pemuda Mendunia & Global Youth Innovation Summit"
                className="h-7 w-auto object-contain"
              />
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isGold = item.id === 'community' || item.id === 'partnership';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? isGold
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                        : 'bg-forest-700 text-white'
                      : isGold
                        ? 'text-gold-300 hover:text-gold-200 hover:bg-gold-500/10'
                        : 'text-forest-200 hover:text-white hover:bg-forest-800/60'
                  }`}
                >
                  <Icon size={13} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden text-white p-2 rounded-lg hover:bg-forest-800/60 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden bg-forest-950 border-t border-forest-800/50">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isGold = item.id === 'community' || item.id === 'partnership';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isGold
                        ? 'bg-gold-500/20 text-gold-300'
                        : 'bg-forest-700 text-white'
                      : isGold
                        ? 'text-gold-300 hover:text-gold-200 hover:bg-gold-500/10'
                        : 'text-forest-200 hover:text-white hover:bg-forest-800/60'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
