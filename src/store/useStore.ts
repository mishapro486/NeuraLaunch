import { create } from 'zustand';

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  imageUrl: string;
  goal: number;
  raised: number;
  deadline: number;
  status: 'Active' | 'Funded' | 'Expired' | 'Claimed';
  category: string;
  backers: number;
}

interface WalletState {
  address: string | null;
  balance: string;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
}

interface AppState {
  wallet: WalletState;
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isCreateModalOpen: boolean;
  isDonateModalOpen: boolean;
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  
  // Actions
  setWallet: (wallet: Partial<WalletState>) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: number, updates: Partial<Campaign>) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  setDonateModalOpen: (open: boolean) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  donateToCampaign: (campaignId: number, amount: number) => Promise<void>;
}

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE21',
    title: 'DeFi Trading Bot',
    description: 'An autonomous AI-powered trading bot that analyzes market patterns and executes trades on decentralized exchanges with advanced risk management.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60',
    goal: 50,
    raised: 32.5,
    deadline: Date.now() + 15 * 24 * 60 * 60 * 1000,
    status: 'Active',
    category: 'DeFi',
    backers: 127,
  },
  {
    id: 2,
    creator: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    title: 'Generative Art AI',
    description: 'Create unique NFT artwork using advanced neural networks trained on millions of artistic styles. Mint directly to blockchain.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=800&auto=format&fit=crop&q=60',
    goal: 30,
    raised: 30,
    deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
    status: 'Funded',
    category: 'NFT',
    backers: 89,
  },
  {
    id: 3,
    creator: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    title: 'AI Code Auditor',
    description: 'Automated smart contract security analysis using machine learning to detect vulnerabilities before deployment.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    goal: 75,
    raised: 45.8,
    deadline: Date.now() + 22 * 24 * 60 * 60 * 1000,
    status: 'Active',
    category: 'Security',
    backers: 203,
  },
  {
    id: 4,
    creator: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    title: 'Predictive Analytics Engine',
    description: 'On-chain AI oracle providing real-time market predictions and sentiment analysis for DeFi protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    goal: 100,
    raised: 67.2,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    status: 'Active',
    category: 'Oracle',
    backers: 312,
  },
  {
    id: 5,
    creator: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    title: 'Neural DAO Governance',
    description: 'AI-assisted governance system that analyzes proposals and provides intelligent voting recommendations.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
    goal: 40,
    raised: 12.3,
    deadline: Date.now() + 45 * 24 * 60 * 60 * 1000,
    status: 'Active',
    category: 'Governance',
    backers: 56,
  },
  {
    id: 6,
    creator: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    title: 'Autonomous Agent Network',
    description: 'Decentralized network of AI agents that collaborate to solve complex computational tasks with token incentives.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    goal: 150,
    raised: 89.5,
    deadline: Date.now() + 18 * 24 * 60 * 60 * 1000,
    status: 'Active',
    category: 'Infrastructure',
    backers: 445,
  },
];

// Generate a random mock wallet address
const generateMockAddress = (): string => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

// Generate a random balance
const generateMockBalance = (): string => {
  return (Math.random() * 100 + 10).toFixed(4);
};

export const useStore = create<AppState>((set, get) => ({
  wallet: {
    address: null,
    balance: '0',
    chainId: null,
    isConnecting: false,
    isConnected: false,
  },
  campaigns: mockCampaigns,
  selectedCampaign: null,
  isCreateModalOpen: false,
  isDonateModalOpen: false,
  notifications: [],

  setWallet: (wallet) =>
    set((state) => ({
      wallet: { ...state.wallet, ...wallet },
    })),

  connectWallet: async () => {
    const { addNotification } = get();
    
    // Set connecting state
    set((state) => ({
      wallet: { ...state.wallet, isConnecting: true },
    }));

    try {
      // Simulate network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock wallet data (no MetaMask or real Web3 provider needed)
      const mockAddress = generateMockAddress();
      const mockBalance = generateMockBalance();

      // Update wallet state with mock data
      set({
        wallet: {
          address: mockAddress,
          balance: mockBalance,
          chainId: 1, // Mock Neura Network chain ID
          isConnecting: false,
          isConnected: true,
        },
      });

      addNotification('Wallet connected successfully!', 'success');
    } catch (error) {
      // Handle any unexpected errors
      set((state) => ({
        wallet: { ...state.wallet, isConnecting: false },
      }));
      addNotification('Failed to connect wallet. Please try again.', 'error');
    }
  },

  disconnectWallet: () => {
    set({
      wallet: {
        address: null,
        balance: '0',
        chainId: null,
        isConnecting: false,
        isConnected: false,
      },
    });
    get().addNotification('Wallet disconnected', 'info');
  },

  setCampaigns: (campaigns) => set({ campaigns }),

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
    })),

  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),

  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  setDonateModalOpen: (open) => set({ isDonateModalOpen: open }),

  addNotification: (message, type) => {
    const id = Math.random().toString(36).substring(2, 11);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    // Auto-remove notification after 5 seconds
    setTimeout(() => get().removeNotification(id), 5000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  donateToCampaign: async (campaignId, amount) => {
    const { wallet, campaigns, updateCampaign, addNotification, setDonateModalOpen, setWallet } = get();
    
    if (!wallet.isConnected) {
      addNotification('Please connect your wallet first', 'error');
      return;
    }

    // Check if user has enough balance
    const currentBalance = parseFloat(wallet.balance);
    if (amount > currentBalance) {
      addNotification('Insufficient balance', 'error');
      return;
    }

    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      const newRaised = campaign.raised + amount;
      const newStatus = newRaised >= campaign.goal ? 'Funded' : campaign.status;
      
      // Update campaign
      updateCampaign(campaignId, {
        raised: newRaised,
        status: newStatus as Campaign['status'],
        backers: campaign.backers + 1,
      });

      // Update wallet balance
      const newBalance = (currentBalance - amount).toFixed(4);
      setWallet({ balance: newBalance });

      addNotification(`Successfully donated ${amount} NEURA to ${campaign.title}!`, 'success');
      setDonateModalOpen(false);
    }
  },
}));
