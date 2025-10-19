import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Signal, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Community {
  id: string;
  name: string;
  avatar_url: string;
  member_count: number;
  win_rate_10m: number;
  win_rate_1h: number;
  win_rate_24h: number;
  signal_count_24h: number;
  trading_volume: number;
  top_tokens: Array<{ symbol: string; logo: string }>;
}

export default function CommunityLeaderboard() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'win_rate' | 'volume' | 'signals' | 'members'>('win_rate');

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('win_rate_24h', { ascending: false });

    if (data && !error) {
      setCommunities(data);
    }
  };

  const sortedCommunities = [...communities].sort((a, b) => {
    switch (sortBy) {
      case 'win_rate':
        return b.win_rate_24h - a.win_rate_24h;
      case 'volume':
        return b.trading_volume - a.trading_volume;
      case 'signals':
        return b.signal_count_24h - a.signal_count_24h;
      case 'members':
        return b.member_count - a.member_count;
      default:
        return 0;
    }
  });

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const calculateAvatarSize = (signals: number, winRate: number) => {
    const score = signals * (winRate / 100);
    const minSize = 60;
    const maxSize = 140;
    const normalizedScore = Math.min(score / 5000, 1);
    return minSize + (maxSize - minSize) * normalizedScore;
  };

  const topCommunities = sortedCommunities.slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Meme Community Leaderboard</h1>
          <p className="text-slate-400">Discover high-performing meme communities and trading signals</p>
        </header>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Top Communities
            </h2>
            <button className="text-sm text-slate-400 hover:text-white transition-colors">
              View all
            </button>
          </div>

          <div className="relative">
            <div className="flex flex-wrap gap-4 justify-center">
              {topCommunities.map((community, index) => {
                const size = calculateAvatarSize(community.signal_count_24h, community.win_rate_1h);
                return (
                  <div
                    key={community.id}
                    className="group relative cursor-pointer"
                    style={{ width: size, height: size }}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-emerald-500 transition-all duration-300 hover:scale-105">
                      <img
                        src={community.avatar_url}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl min-w-[280px]">
                        <div className="font-bold text-white mb-2">{community.name}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-slate-300">
                            <span>1h Win Rate:</span>
                            <span className="text-emerald-400 font-medium">{community.win_rate_1h.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>24h Signals:</span>
                            <span className="text-blue-400 font-medium">{community.signal_count_24h.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Volume:</span>
                            <span className="text-purple-400 font-medium">${(community.trading_volume / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                          {community.top_tokens.slice(0, 3).map((token, i) => (
                            <img
                              key={i}
                              src={token.logo}
                              alt={token.symbol}
                              className="w-6 h-6 rounded-full border border-slate-600"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Community Rankings
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('win_rate')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'win_rate'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Win Rate
              </button>
              <button
                onClick={() => setSortBy('volume')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'volume'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setSortBy('signals')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'signals'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Signals
              </button>
              <button
                onClick={() => setSortBy('members')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'members'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Members
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Community</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">10m Win</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">1h Win</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">24h Win</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">Signals</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">Volume</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">Members</th>
                    <th className="text-center px-4 py-4 text-sm font-semibold text-slate-300">Top Tokens</th>
                    <th className="text-center px-4 py-4 text-sm font-semibold text-slate-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCommunities.map((community) => (
                    <tr
                      key={community.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={community.avatar_url}
                            alt={community.name}
                            className="w-10 h-10 rounded-lg border border-slate-700"
                          />
                          <span className="font-medium text-white">{community.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-emerald-400 font-medium">{community.win_rate_10m.toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-emerald-400 font-medium">{community.win_rate_1h.toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-emerald-400 font-medium">{community.win_rate_24h.toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-blue-400 font-medium">{community.signal_count_24h.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-purple-400 font-medium">${(community.trading_volume / 1000000).toFixed(1)}M</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-slate-300">{community.member_count}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-1">
                          {community.top_tokens.slice(0, 3).map((token, i) => (
                            <img
                              key={i}
                              src={token.logo}
                              alt={token.symbol}
                              className="w-6 h-6 rounded-full border border-slate-600"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleRow(community.id)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {expandedRows.has(community.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
