import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Community {
  id: string;
  name: string;
  avatar_url: string;
  owner_telegram_username: string;
  owner_avatar_url: string; 
  win_rate_1h: number;
  mindshare: number;
  mindshare_change: number;
}

interface Discussion {
  id: string;
  community_name: string;
  community_avatar: string;
  ai_summary: string;
  engagement_score: number;
  discussion_time: string;
}

export default function CampaignDetail() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: communityData } = await supabase
      .from('communities')
      .select('*')
      .order('win_rate_24h', { ascending: false })
      .limit(25);

    if (communityData) {
      const enriched = communityData.map((c: any, i: number) => ({
        ...c,
        mindshare: (100 - i * 2) / 100,
        mindshare_change: (Math.random() - 0.5) * 0.1
      }));
      setCommunities(enriched);
    }

    setDiscussions([
      {
        id: '1',
        community_name: '币圈猎狗群',
        community_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto1',
        ai_summary: 'Community members are expressing strong bullish sentiment on PEPE token. Multiple whale addresses have been spotted accumulating, with on-chain data showing significant buy pressure. Discussion focuses on potential 3-5x gains in the next 48 hours based on social metrics and volume increase.',
        engagement_score: 245,
        discussion_time: '2 hours ago'
      },
      {
        id: '2',
        community_name: 'DeFi先锋DAO',
        community_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi',
        ai_summary: 'Technical analysis indicates strong support levels holding. Community leader shared detailed chart analysis pointing to bullish divergence on 4H timeframe. Members discussing optimal entry points and risk management strategies.',
        engagement_score: 198,
        discussion_time: '4 hours ago'
      },
      {
        id: '3',
        community_name: 'APE冲浪队',
        community_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ape',
        ai_summary: 'Group discussing partnership announcement rumors. Several members confirmed seeing increased marketing activity and social media presence. Community sentiment shifted to cautiously optimistic with focus on short-term trading opportunities.',
        engagement_score: 176,
        discussion_time: '6 hours ago'
      }
    ]);
  };

  const getMindshareColor = (mindshare: number) => {
    if (mindshare > 0.8) return 'bg-emerald-500';
    if (mindshare > 0.6) return 'bg-blue-500';
    if (mindshare > 0.4) return 'bg-purple-500';
    if (mindshare > 0.2) return 'bg-orange-500';
    return 'bg-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://api.dicebear.com/7.x/identicon/svg?seed=pepe"
                  alt="PEPE"
                  className="w-16 h-16 rounded-xl"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">PEPE</h1>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/50">
                    LIVE CAMPAIGN
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The most famous frog meme token on Base chain. Join the community campaign and earn rewards by driving engagement and mindshare.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Community Activity Trend</h3>
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                <TrendingUp size={48} className="opacity-20" />
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                Hourly community participation over the last 7 days
              </p>
            </div>

            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              Trade Now
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Top 25 Communities by Mindshare</h2>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {communities.slice(0, 25).map((community, index) => {
                  const size = Math.max(60, community.mindshare * 120);
                  return (
                    <div
                      key={community.id}
                      className="relative group cursor-pointer"
                      style={{
                        width: size,
                        height: size,
                        gridColumn: `span ${index < 3 ? 2 : 1}`
                      }}
                    >
                      <div className={`w-full h-full rounded-xl ${getMindshareColor(community.mindshare)} opacity-80 hover:opacity-100 transition-opacity`}>
                        <img
                          src={community.avatar_url}
                          alt={community.name}
                          className="w-full h-full object-cover rounded-xl mix-blend-overlay"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {(community.mindshare * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white">Community Rankings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Rank</th>
                      <th className="text-left px-4 py-4 text-sm font-semibold text-slate-300">Community</th>
                      <th className="text-left px-4 py-4 text-sm font-semibold text-slate-300">Leader</th>
                      <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">Mindshare</th>
                      <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">1h Change</th>
                      <th className="text-right px-4 py-4 text-sm font-semibold text-slate-300">1h Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communities.map((community, index) => (
                      <tr
                        key={community.id}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={community.avatar_url}
                              alt={community.name}
                              className="w-10 h-10 rounded-lg"
                            />
                            <span className="font-medium text-white">{community.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={community.owner_avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner' + index}
                              alt="Owner"
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-slate-300">@{community.owner_telegram_username || 'owner' + index}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-purple-400 font-medium">{(community.mindshare * 100).toFixed(2)}%</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`font-medium ${community.mindshare_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {community.mindshare_change >= 0 ? '+' : ''}{(community.mindshare_change * 100).toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-emerald-400 font-medium">{community.win_rate_1h.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Community Discussion Feed</h2>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={discussion.community_avatar}
                      alt={discussion.community_name}
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{discussion.community_name}</h3>
                        <span className="text-sm text-slate-400">{discussion.discussion_time}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mb-3">
                        {discussion.ai_summary}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <TrendingUp size={16} className="text-emerald-400" />
                          <span>Engagement: {discussion.engagement_score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
