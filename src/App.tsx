import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectDashboard } from './components/ProjectDashboard';
import { Stats } from './components/Stats';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { DonateModal } from './components/DonateModal';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import { Notifications } from './components/Notifications';

function App() {
  return (
    <div className="min-h-screen bg-neura-dark">
      <Header />
      <main>
        <Hero />
        <ProjectDashboard />
        <Stats />
        <HowItWorks />
      </main>
      <Footer />
      
      {/* Modals */}
      <DonateModal />
      <CreateCampaignModal />
      
      {/* Notifications */}
      <Notifications />
    </div>
  );
}

export default App;
