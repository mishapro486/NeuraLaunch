import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Coins, Rocket } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Stats: React.FC = () => {
  const { campaigns } = useStore();

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalBackers = campaigns.reduce((sum, c) => sum + c.backers, 0);
  const fundedProjects = campaigns.filter((c) => c.status === 'Funded').length;

  const stats = [
    {
      icon: Coins,
      value: totalRaised.toFixed(1),
      label: 'NEURA Raised',
      color: 'neura-orange',
    },
    {
      icon: Rocket,
      value: campaigns.length.toString(),
      label: 'Active Projects',
      color: 'neura-blue',
    },
    {
      icon: Users,
      value: totalBackers.toLocaleString(),
      label: 'Total Backers',
      color: 'neura-purple',
    },
    {
      icon: TrendingUp,
      value: fundedProjects.toString(),
      label: 'Funded Projects',
      color: 'green-400',
    },
  ];

  return (
    <section id="stats" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neura-orange/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Platform <span className="text-gradient">Statistics</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time metrics from the NeuraLaunch ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neura-orange/20 to-neura-blue/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-dark rounded-2xl p-6 border border-white/5 text-center">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}`} />
                </div>
                <motion.p
                  className="text-3xl sm:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
