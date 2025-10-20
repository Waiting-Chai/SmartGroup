import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Home } from 'lucide-react';
import CommunityLeaderboard from './pages/CommunityLeaderboard';
import MemeTokenDetail from './pages/MemeTokenDetail';
import GroupOwnerDashboard from './pages/GroupOwnerDashboard';
import CampaignDetail from './pages/CampaignDetail';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Page = 'home' | 'leaderboard' | 'token' | 'campaign' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('leaderboard');

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">MemeHub</span>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage('leaderboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'leaderboard'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 size={18} />
                  Leaderboard
                </button>
                <button
                  onClick={() => setCurrentPage('token')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'token'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <TrendingUp size={18} />
                  Token Detail
                </button>
                <button
                  onClick={() => setCurrentPage('campaign')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'campaign'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Home size={18} />
                  Campaign
                </button>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'dashboard'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Users size={18} />
                  Group Owner
                </button>
              </div>
            </div>

            {/* Replace plain button with RainbowKit ConnectButton */}
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'leaderboard' && <CommunityLeaderboard />}
        {currentPage === 'token' && <MemeTokenDetail />}
        {currentPage === 'campaign' && <CampaignDetail />}
        {currentPage === 'dashboard' && <GroupOwnerDashboard />}
      </main>
    </div>
  );
}

export default App;
