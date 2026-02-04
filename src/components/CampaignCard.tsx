import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Target, ArrowUpRight } from 'lucide-react';
import { Campaign, useStore } from '../store/useStore';

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, index }) => {
  const { setSelectedCampaign, setDonateModalOpen, wallet, connectWallet } = useStore();

  const progress = (campaign.raised / campaign.goal) * 100;
  const daysLeft = Math.max(0, Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleDonate = () => {
    if (wallet.isConnected) {
      setSelectedCampaign(campaign);
      setDonateModalOpen(true);
    } else {
      connectWallet();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Funded':
        return 'bg-neura-blue/20 text-neura-blue border-neura-blue/30';
      case 'Expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      DeFi: 'text-neura-orange',
      NFT: 'text-purple-400',
      Security: 'text-red-400',
      Oracle: 'text-neura-blue',
      Governance: 'text-green-400',
      Infrastructure: 'text-yellow-400',
    };
    return colors[category] || 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neura-orange/20 to-neura-blue/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative glass-dark rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neura-darker via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
          </div>

          {/* Category */}
          <div className="absolute top-4 right-4">
            <span className={`text-xs font-medium ${getCategoryColor(campaign.category)}`}>
              {campaign.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neura-orange transition-colors">
            {campaign.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neura-blue font-semibold">{campaign.raised.toFixed(2)} NEURA</span>
              <span className="text-gray-400">of {campaign.goal} NEURA</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neura-orange to-neura-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">{progress.toFixed(1)}% funded</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{campaign.backers} backers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{daysLeft} days left</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>{campaign.goal} NEURA</span>
            </div>
          </div>

          {/* Donate Button */}
          <motion.button
            onClick={handleDonate}
            disabled={campaign.status !== 'Active'}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              campaign.status === 'Active'
                ? 'bg-gradient-to-r from-neura-orange to-neura-orange-light text-white hover:shadow-lg hover:shadow-neura-orange/25'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={campaign.status === 'Active' ? { scale: 1.02 } : {}}
            whileTap={campaign.status === 'Active' ? { scale: 0.98 } : {}}
          >
            {campaign.status === 'Active' ? (
              <>
                Donate Now
                <ArrowUpRight className="w-4 h-4" />
              </>
            ) : campaign.status === 'Funded' ? (
              'Fully Funded'
            ) : (
              'Campaign Ended'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
