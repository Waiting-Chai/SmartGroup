import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// WalletConnect 项目 ID（用于 RainbowKit 默认连接器）。
// 未设置时将降级为仅支持浏览器注入钱包（如 MetaMask）。
const projectId = import.meta.env.VITE_WC_PROJECT_ID as string | undefined;

export const wagmiConfig = projectId
  ? getDefaultConfig({
      appName: 'MemeHub',
      projectId,
      chains: [base],
      ssr: false,
    })
  : createConfig({
      chains: [base],
      connectors: [injected()],
      transports: {
        [base.id]: http(),
      },
    });