import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, Sparkles, Brain, Network } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Hero: React.FC = () => {
  const { setCreateModalOpen, wallet, connectWallet } = useStore();

  const handleStartCampaign = () => {
    if (wallet.isConnected) {
      setCreateModalOpen(true);
    } else {
      connectWallet();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-neura-dark">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30" />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neura-orange/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neura-blue/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neura-orange/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,200 Q200,100 400,200 T800,200"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.path
            d="M0,400 Q300,300 600,400 T1200,400"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-neura-orange" />
            <span className="text-sm text-gray-300">Powered by Neura Network</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Fund the Next Generation</span>
            <br />
            <span className="text-gradient">of Autonomous AI</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            The first decentralized launchpad built on{' '}
            <span className="text-neura-blue">Neura Network</span>. 
            Back revolutionary AI projects with transparent, trustless funding.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              onClick={handleStartCampaign}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neura-orange to-neura-orange-light" />
              <div className="absolute inset-0 bg-gradient-to-r from-neura-orange to-neura-orange-light opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
              <span className="relative flex items-center gap-2 text-white">
                <Rocket className="w-5 h-5" />
                Start a Campaign
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.a
              href="#projects"
              className="px-8 py-4 rounded-xl font-semibold text-lg glass neon-border-blue hover:border-neura-blue/50 transition-all text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Projects
            </motion.a>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { icon: Brain, label: 'AI-Focused', color: 'neura-orange' },
              { icon: Network, label: 'Decentralized', color: 'neura-blue' },
              { icon: Sparkles, label: 'Transparent', color: 'neura-purple' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-xl glass flex items-center justify-center`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <span className="text-sm text-gray-400">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-neura-orange rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
