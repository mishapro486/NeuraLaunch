import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ChevronDown, 
  LogOut, 
  Copy, 
  ExternalLink,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neura-orange to-neura-blue flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-neura-orange to-neura-blue rounded-xl blur opacity-30" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Neura</span>
              <span className="text-gradient">Launch</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#projects" className="text-gray-300 hover:text-white transition-colors">
              Projects
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#stats" className="text-gray-300 hover:text-white transition-colors">
              Stats
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:block">
            {wallet.isConnected ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass neon-border hover:border-neura-orange/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neura-orange to-neura-blue flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {formatAddress(wallet.address!)}
                    </p>
                    <p className="text-xs text-neura-blue">
                      {wallet.balance} NEURA
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 rounded-xl glass-dark border border-white/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
                        <p className="text-sm font-mono text-white break-all">
                          {wallet.address}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={copyAddress}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">Copy Address</span>
                        </button>
                        <a
                          href="#"
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">View on Explorer</span>
                        </a>
                        <button
                          onClick={() => {
                            disconnectWallet();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">Disconnect</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={connectWallet}
                disabled={wallet.isConnecting}
                className="relative group px-6 py-3 rounded-xl font-semibold overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neura-orange to-neura-blue" />
                <div className="absolute inset-0 bg-gradient-to-r from-neura-orange to-neura-blue opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <span className="relative flex items-center gap-2 text-white">
                  {wallet.isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#projects" className="block text-gray-300 hover:text-white transition-colors">
                Projects
              </a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#stats" className="block text-gray-300 hover:text-white transition-colors">
                Stats
              </a>
              <div className="pt-4 border-t border-white/10">
                {wallet.isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neura-orange to-neura-blue flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {formatAddress(wallet.address!)}
                        </p>
                        <p className="text-xs text-neura-blue">
                          {wallet.balance} NEURA
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={wallet.isConnecting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-neura-orange to-neura-blue text-white font-semibold"
                  >
                    {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
