import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, FileText, Coins, Rocket, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Link your Web3 wallet to access the Neura Network and start participating.',
    },
    {
      icon: FileText,
      title: 'Create or Browse',
      description: 'Launch your own AI project campaign or explore existing ones to support.',
    },
    {
      icon: Coins,
      title: 'Fund Projects',
      description: 'Donate NEURA tokens to campaigns you believe in. All transactions are on-chain.',
    },
    {
      icon: Rocket,
      title: 'Watch AI Launch',
      description: 'Funded projects receive their capital and begin building the future of AI.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neura-blue/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started with NeuraLaunch in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-neura-orange/50 to-transparent" />
              )}

              <div className="glass-dark rounded-2xl p-6 border border-white/5 hover:border-neura-orange/30 transition-all h-full">
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neura-orange to-neura-blue flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-white/10">0{index + 1}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
