import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Award, ChevronDown, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
  id: string;
  meme_token_id: string;
  prize_pool: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  token_symbol: string;
  token_logo: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username: string;
  photo_url?: string;
}

export default function GroupOwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'commission' | 'campaigns' | 'bot'>('campaigns');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedCommunity] = useState('币圈猎狗群');
  const [isWalletBound, setIsWalletBound] = useState(false);
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[]>([]);
  const [pastCampaigns, setPastCampaigns] = useState<Campaign[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);
  const [, setIsBotAdded] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns();
    }
  }, [isAuthenticated]);

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*, meme_tokens(symbol, logo_url)');

    if (data) {
      const live = data.filter((c: any) => c.status === 'live').map((c: any) => ({
        ...c,
        token_symbol: c.meme_tokens?.symbol || '',
        token_logo: c.meme_tokens?.logo_url || ''
      }));
      const past = data.filter((c: any) => c.status === 'past').map((c: any) => ({
        ...c,
        token_symbol: c.meme_tokens?.symbol || '',
        token_logo: c.meme_tokens?.logo_url || ''
      }));
      setLiveCampaigns(live);
      setPastCampaigns(past);
    }
  };

  const handleTelegramLogin = async () => {
    setIsLoggingIn(true);
    
    // 模拟登录过程
    setTimeout(() => {
      // Mock Telegram用户数据
      const mockUser: TelegramUser = {
        id: 123456789,
        first_name: 'Shao',
        last_name: 'Rockey',
        username: 'shao_rockey',
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shao_rockey'
      };
      
      setTelegramUser(mockUser);
      setIsAuthenticated(true);
      setIsLoggingIn(false);
    }, 2000);
  };

  const handleBindWallet = () => {
    setIsWalletBound(true);
  };

  const handleBotAdded = () => {
    setIsBotAdded(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTelegramUser(null);
    setIsWalletBound(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-1.048 4.49-1.48 5.954-.184.621-.543.829-.891.85-.756.069-1.33-.5-2.063-.981-1.146-.754-1.793-1.222-2.905-1.957-1.286-.85-.453-1.318.28-2.081.192-.2 3.527-3.234 3.593-3.51.008-.034.016-.162-.061-.23-.077-.067-.19-.044-.272-.026-.116.026-1.968 1.25-5.554 3.67-.526.361-1.003.537-1.43.528-.471-.01-1.377-.266-2.051-.485-.825-.269-1.481-.411-1.424-.866.03-.237.354-.479.974-.726 3.818-1.664 6.364-2.764 7.636-3.302 3.638-1.516 4.395-1.78 4.891-1.788.108-.002.35.025.507.152.133.108.17.253.187.355.018.102.04.335.022.517z"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">SmartGroup</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            使用您的 Telegram 账户登录以访问和管理您的社区仪表板
          </p>
          
          <button
            onClick={handleTelegramLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                正在连接 Telegram...
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-1.048 4.49-1.48 5.954-.184.621-.543.829-.891.85-.756.069-1.33-.5-2.063-.981-1.146-.754-1.793-1.222-2.905-1.957-1.286-.85-.453-1.318.28-2.081.192-.2 3.527-3.234 3.593-3.51.008-.034.016-.162-.061-.23-.077-.067-.19-.044-.272-.026-.116.026-1.968 1.25-5.554 3.67-.526.361-1.003.537-1.43.528-.471-.01-1.377-.266-2.051-.485-.825-.269-1.481-.411-1.424-.866.03-.237.354-.479.974-.726 3.818-1.664 6.364-2.764 7.636-3.302 3.638-1.516 4.395-1.78 4.891-1.788.108-.002.35.025.507.152.133.108.17.253.187.355.018.102.04.335.022.517z"/>
                </svg>
                使用 Telegram 登录
              </>
            )}
          </button>
          
          <div className="mt-6 text-xs text-slate-500 leading-relaxed">
            点击"使用 Telegram 登录"即表示您同意我们的服务条款和隐私政策
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl mb-6">
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('commission')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'commission'
                  ? 'text-white border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Commission
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'campaigns'
                  ? 'text-white border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'bot'
                  ? 'text-white border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Add Bot Guide
            </button>
          </div>
        </div>

        {activeTab === 'commission' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white hover:bg-slate-800 transition-colors">
                  {selectedCommunity}
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                {telegramUser && (
                  <>
                    <img
                      src={telegramUser.photo_url}
                      alt={telegramUser.username}
                      className="w-10 h-10 rounded-full border-2 border-blue-500/30"
                    />
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {telegramUser.first_name} {telegramUser.last_name}
                      </div>
                      <div className="text-slate-400 text-sm">@{telegramUser.username}</div>
                    </div>
                  </>
                )}
                {isWalletBound ? (
                  <span className="text-slate-400 text-sm">0x1234...5678</span>
                ) : (
                  <button
                    onClick={handleBindWallet}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    绑定钱包
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-600/30"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Unclaimed Commission (USD)</h3>
                  <DollarSign className="text-emerald-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-4">$1,864.50</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={() => setShowWithdrawHistory(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    History
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Total Trading Volume</h3>
                  <TrendingUp className="text-blue-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">$75,920.00</div>
                <div className="text-sm text-slate-400">Traders: 15 / 1,000</div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-400 text-sm font-medium">Signal Win Rate</h3>
                    <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1">
                      <option>1h</option>
                      <option>6h</option>
                      <option>24h</option>
                      <option>7d</option>
                      <option>30d</option>
                    </select>
                  </div>
                  <Award className="text-purple-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">69.3%</div>
                <div className="text-sm text-slate-400">Based on 85 signals</div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Commission & Signal Trends</h3>
              <div className="h-[400px] flex items-center justify-center text-slate-500">
                <TrendingUp size={48} className="opacity-20" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white hover:bg-slate-800 transition-colors">
                  {selectedCommunity}
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                {telegramUser && (
                  <>
                    <img
                      src={telegramUser.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
                      alt={telegramUser.username}
                      className="w-10 h-10 rounded-full border border-blue-500/40"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{telegramUser.first_name} {telegramUser.last_name ?? ''}</span>
                      <span className="text-slate-400 text-sm">@{telegramUser.username}</span>
                    </div>
                  </>
                )}
                {isWalletBound ? (
                  <span className="text-slate-400 text-sm">0x1234...5678</span>
                ) : (
                  <button
                    onClick={handleBindWallet}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    绑定钱包
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors flex items-center gap-1"
                  title="退出登录"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Unclaimed Rewards (USD)</h3>
                  <Award className="text-purple-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-4">$1,864.50</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={() => setShowWithdrawHistory(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    History
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Total Trading Volume</h3>
                  <TrendingUp className="text-blue-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">$75,920.00</div>
                <div className="text-sm text-slate-400">Traders: 15 / 1,000</div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-400 text-sm font-medium">Signal Win Rate</h3>
                    <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1">
                      <option>1h</option>
                      <option>6h</option>
                      <option>24h</option>
                      <option>7d</option>
                      <option>30d</option>
                    </select>
                  </div>
                  <Award className="text-purple-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">69.3%</div>
                <div className="text-sm text-slate-400">Based on 85 signals</div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Commission & Signal Trends</h3>
              <div className="h-[400px] flex items-center justify-center text-slate-500">
                <TrendingUp size={48} className="opacity-20" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bot' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-12 text-center">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Users size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Unlock Your Community Dashboard</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                In just two steps, unlock powerful community analytics, commission statistics, and member trading insights to make your community management easier and smarter.
              </p>

              <div className="space-y-8 text-left">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="text-lg font-bold text-white">Add Bot to Your Group</h3>
                  </div>
                  <p className="text-slate-400 mb-4">
                    Please copy the Bot username below and add it as a member to your Telegram group.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg font-mono text-emerald-400">
                      @GroupDataAnalyticsBot
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText('@GroupDataAnalyticsBot')}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="text-lg font-bold text-white">Grant Admin Permissions</h3>
                  </div>
                  <p className="text-slate-400">
                    To allow the Bot to read and analyze data, please set it as an administrator with at least "read messages" permission.
                  </p>
                </div>
              </div>

              <button
                onClick={handleBotAdded}
                className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                I've completed the setup, refresh status
              </button>
            </div>
          </div>
        )}
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Withdraw Commission</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Available Amount</label>
                <div className="text-3xl font-bold text-white">$1,864.50</div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Withdrawal Address</label>
                <div className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono">
                  0x1234...5678
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Withdrawal History</h3>
            <div className="space-y-2 mb-6">
              <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm font-semibold text-slate-400 border-b border-slate-800">
                <span>Time</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Address</span>
              </div>
              <div className="grid grid-cols-3 gap-4 px-4 py-3 rounded-lg hover:bg-slate-800/30">
                <span className="text-sm text-slate-300">2023-10-26 15:30</span>
                <span className="text-sm text-slate-300 text-right">- $500.00</span>
                <span className="text-sm text-slate-400 text-right font-mono">0x1234...abcd</span>
              </div>
              <div className="grid grid-cols-3 gap-4 px-4 py-3 rounded-lg hover:bg-slate-800/30">
                <span className="text-sm text-slate-300">2023-10-20 10:15</span>
                <span className="text-sm text-slate-300 text-right">- $350.00</span>
                <span className="text-sm text-slate-400 text-right font-mono">0x1234...abcd</span>
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawHistory(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
