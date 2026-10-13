import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { CurrencyTicker } from './components/CurrencyTicker.tsx';
import { Hero } from './components/Hero.tsx';
import { TurnkeyGrid } from './components/TurnkeyGrid.tsx';
import { ComparisonSection } from './components/ComparisonSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ReferencesSection } from './components/ReferencesSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ScrollToTop } from './components/ScrollToTop.tsx';
import { CookieConsentBanner } from './components/common/CookieConsentBanner.tsx';

// Administrative & Client Modals
import { AdminPanel } from './components/admin/AdminPanel.tsx';
import { CustomerPanel } from './components/admin/CustomerPanel.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { LiveDemoModal } from './components/LiveDemoModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { VideoModal } from './components/VideoModal.tsx';
import { ViewAllModal } from './components/ViewAllModal.tsx';
import { PageViewModal } from './components/PageViewModal.tsx';
import { DeployPackageModal } from './components/turnkey/DeployPackageModal.tsx';
import { StandaloneSiteView } from './components/turnkey/StandaloneSiteView.tsx';

const AppContent: React.FC = () => {
  const {
    activeStandaloneSite,
    closeStandaloneSite,
    currentLang,
    setLanguage,
    openCustomerPanel,
    openPaymentModal,
    openContactModal,
    isDeployModalOpen,
    deployModalProduct,
    closeDeployModal,
  } = useApp();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0c10] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-amber-400 selection:text-neutral-950">
      <CurrencyTicker />
      <Header />
      
      <main className="flex-1">
        <Hero />
        <TurnkeyGrid />
        <ComparisonSection />
        <ServicesSection />
        <ReferencesSection />
        <FaqSection />
      </main>

      <Footer />
      <ScrollToTop />
      <CookieConsentBanner />

      {/* Global Modals & Administrative Terminal Layers */}
      <AdminPanel />
      <CustomerPanel />
      <ProductDetailModal />
      <LiveDemoModal />
      <PaymentModal />
      <ContactModal />
      <VideoModal />
      <ViewAllModal />
      <PageViewModal />

      {/* Deploy Turnkey Site Modal */}
      {isDeployModalOpen && deployModalProduct && (
        <DeployPackageModal
          product={deployModalProduct}
          isOpen={isDeployModalOpen}
          onClose={closeDeployModal}
          currentLang={currentLang}
        />
      )}

      {/* Standalone Live Site Overlay View */}
      {activeStandaloneSite && (
        <StandaloneSiteView
          product={activeStandaloneSite}
          currentLang={currentLang}
          setLanguage={setLanguage}
          onClose={closeStandaloneSite}
          onOpenCustomerPanel={openCustomerPanel}
          onOpenPaymentModal={(product, pkg) => openPaymentModal(product, pkg)}
          onOpenContactModal={(product, pkg) => openContactModal(product, pkg)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
