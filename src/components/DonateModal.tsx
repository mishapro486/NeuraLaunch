import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export const DonateModal: React.FC = () => {
  const { isDonateModalOpen, setDonateModalOpen, selectedCampaign, wallet, donateToCampaign } = useStore();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const presetAmounts = [1, 5, 10, 25];

  const handleDonate = async () => {
    if (!selectedCampaign || !amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);
    setTxStatus('pending');

    try {
      await donateToCampaign(selectedCampaign.id, parseFloat(amount));
      setTxStatus('success');
      setTimeout(() => {
        setDonateModalOpen(false);
        setTxStatus('idle');
        setAmount('');
      }, 2000);
    } catch (error) {
      setTxStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setDonateModalOpen(false);
      setTxStatus('idle');
      setAmount('');
    }
  };

  if (!selectedCampaign) return null;

  const progress = (selectedCampaign.raised / selectedCampaign.goal) * 100;

  return (
    <AnimatePresence>
      {isDonateModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg glass-dark rounded-2xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-bold text-white">Donate to Campaign</h2>
              <p className="text-gray-400 mt-1">{selectedCampaign.title}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {txStatus === 'idle' || txStatus === 'pending' ? (
                <>
                  {/* Campaign Info */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-6">
                    <img
                      src={selectedCampaign.imageUrl}
                      alt={selectedCampaign.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neura-blue font-semibold">
                          {selectedCampaign.raised.toFixed(2)} NEURA
                        </span>
                        <span className="text-gray-400">
                          of {selectedCampaign.goal} NEURA
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neura-orange to-neura-blue rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Donation Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        disabled={isProcessing}
                        className="w-full px-4 py-4 pr-20 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-semibold placeholder-gray-500 focus:outline-none focus:border-neura-orange/50 transition-colors disabled:opacity-50"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neura-blue font-semibold">
                        NEURA
                      </span>
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div className="flex gap-2 mb-6">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset.toString())}
                        disabled={isProcessing}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          amount === preset.toString()
                            ? 'bg-neura-orange text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        } disabled:opacity-50`}
                      >
                        {preset} NEURA
                      </button>
                    ))}
                  </div>

                  {/* Wallet Balance */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neura-orange to-neura-blue flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Your Balance</p>
                        <p className="text-lg font-semibold text-white">{wallet.balance} NEURA</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAmount(wallet.balance)}
                      disabled={isProcessing}
                      className="text-sm text-neura-blue hover:text-neura-blue-light transition-colors disabled:opacity-50"
                    >
                      Max
                    </button>
                  </div>

                  {/* Fee Info */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-neura-orange/10 border border-neura-orange/20 mb-6">
                    <AlertCircle className="w-5 h-5 text-neura-orange flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-neura-orange font-medium">Platform Fee: 2.5%</p>
                      <p className="text-gray-400">
                        A small fee supports the NeuraLaunch platform
                      </p>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <motion.button
                    onClick={handleDonate}
                    disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                    className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-neura-orange to-neura-orange-light text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Transaction...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Donate {amount || '0'} NEURA
                      </>
                    )}
                  </motion.button>
                </>
              ) : txStatus === 'success' ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Donation Successful!</h3>
                  <p className="text-gray-400">
                    Thank you for supporting {selectedCampaign.title}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Transaction Failed</h3>
                  <p className="text-gray-400 mb-6">
                    Something went wrong. Please try again.
                  </p>
                  <button
                    onClick={() => setTxStatus('idle')}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
