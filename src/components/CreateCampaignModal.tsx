import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CreateCampaignModal: React.FC = () => {
  const { isCreateModalOpen, setCreateModalOpen, addCampaign, campaigns, addNotification } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DeFi',
    goal: '',
    duration: '30',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const categories = ['DeFi', 'NFT', 'Security', 'Oracle', 'Governance', 'Infrastructure'];

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.goal) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newCampaign = {
      id: campaigns.length + 1,
      creator: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
      goal: parseFloat(formData.goal),
      raised: 0,
      deadline: Date.now() + parseInt(formData.duration) * 24 * 60 * 60 * 1000,
      status: 'Active' as const,
      category: formData.category,
      backers: 0,
    };

    addCampaign(newCampaign);
    addNotification('Campaign created successfully!', 'success');
    setIsSubmitting(false);
    setCreateModalOpen(false);
    setFormData({
      title: '',
      description: '',
      category: 'DeFi',
      goal: '',
      duration: '30',
      imageUrl: '',
    });
    setStep(1);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCreateModalOpen(false);
      setStep(1);
    }
  };

  return (
    <AnimatePresence>
      {isCreateModalOpen && (
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
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl glass-dark rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass-dark p-6 border-b border-white/10">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-bold text-white">Create Campaign</h2>
              <p className="text-gray-400 mt-1">Launch your AI project on NeuraLaunch</p>

              {/* Progress Steps */}
              <div className="flex items-center gap-4 mt-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        step >= s
                          ? 'bg-neura-orange text-white'
                          : 'bg-white/10 text-gray-500'
                      }`}
                    >
                      {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-12 h-0.5 transition-colors ${
                          step > s ? 'bg-neura-orange' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., AI Trading Assistant"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neura-orange/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your AI project and what makes it unique..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neura-orange/50 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.category === cat
                              ? 'bg-neura-orange text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Funding Goal (NEURA) *
                    </label>
                    <input
                      type="number"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      placeholder="e.g., 100"
                      min="1"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neura-orange/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Campaign Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neura-orange/50 transition-colors"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-neura-blue/10 border border-neura-blue/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-neura-blue flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-neura-blue font-medium">Funding Model</p>
                        <p className="text-gray-400 mt-1">
                          If your campaign doesn't reach its goal, all funds will be automatically refunded to backers.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neura-orange/50 transition-colors"
                    />
                  </div>

                  {formData.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center">
                      <Image className="w-12 h-12 text-gray-500 mb-3" />
                      <p className="text-gray-500 text-sm">Enter an image URL above</p>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-white/5 space-y-3">
                    <h4 className="font-semibold text-white">Campaign Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Title</p>
                        <p className="text-white font-medium">{formData.title || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Category</p>
                        <p className="text-white font-medium">{formData.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Goal</p>
                        <p className="text-neura-blue font-medium">{formData.goal || '0'} NEURA</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-medium">{formData.duration} days</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 glass-dark p-6 border-t border-white/10 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neura-orange to-neura-orange-light text-white font-semibold"
                >
                  Continue
                </button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neura-orange to-neura-orange-light text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Launch Campaign'
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
