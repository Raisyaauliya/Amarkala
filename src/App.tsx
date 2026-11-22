import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import KipTracker from './pages/KipTracker';
import SchoolDatabase from './pages/SchoolDatabase';
import ReportBlindspot from './pages/ReportBlindspot';
import WebinarHub from './pages/WebinarHub';
import Community from './pages/Community';
import Partnership from './pages/Partnership';

type Page = 'home' | 'dashboard' | 'kip-tracker' | 'school-database' | 'report-blindspot' | 'webinar-hub' | 'community' | 'partnership';

const validPages: Page[] = ['home', 'dashboard', 'kip-tracker', 'school-database', 'report-blindspot', 'webinar-hub', 'community', 'partnership'];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '') as Page;
  return validPages.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page) => {
    window.location.hash = page === 'home' ? '' : page;
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'dashboard': return <Dashboard />;
      case 'kip-tracker': return <KipTracker />;
      case 'school-database': return <SchoolDatabase />;
      case 'report-blindspot': return <ReportBlindspot />;
      case 'webinar-hub': return <WebinarHub />;
      case 'community': return <Community />;
      case 'partnership': return <Partnership />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
