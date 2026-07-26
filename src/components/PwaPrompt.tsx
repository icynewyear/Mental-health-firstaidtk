import React, { useState, useEffect } from 'react';
import { Leaf, X, Download, Share2, Plus, Monitor, Smartphone, CheckCircle, Info } from 'lucide-react';

interface PwaPromptProps {
  isDarkMode: boolean;
}

export const PwaPrompt: React.FC<PwaPromptProps> = ({ isDarkMode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Detect platform
  const [platformInfo, setPlatformInfo] = useState<{
    isIOS: boolean;
    isMobile: boolean;
    browserName: string;
  }>({ isIOS: false, isMobile: false, browserName: '' });

  useEffect(() => {
    // Check if already in standalone mode
    const standaloneCheck = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    setIsStandalone(standaloneCheck);

    // Platform and browser detection
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(ua) && !(window as any).MSStream;
    const isMobile = /mobile|android|iphone|ipad|phone/.test(ua);
    let browserName = 'unknown';

    if (ua.includes('chrome') || ua.includes('crios')) {
      browserName = 'chrome';
    } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('crios')) {
      browserName = 'safari';
    } else if (ua.includes('firefox')) {
      browserName = 'firefox';
    } else if (ua.includes('edg')) {
      browserName = 'edge';
    }

    setPlatformInfo({ isIOS, isMobile, browserName });

    // Listen for the PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Only show banner if the app isn't already standalone and they haven't dismissed it in this session
      const dismissed = sessionStorage.getItem('safespace_pwa_banner_dismissed') === 'true';
      if (!standaloneCheck && !dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setIsStandalone(true);
      setDeferredPrompt(null);
      sessionStorage.setItem('safespace_pwa_banner_dismissed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for external launch requests from the export settings PWA tab
    const handleExternalRequest = () => {
      setShowGuideModal(true);
    };
    window.addEventListener('safespace-pwa-install-request', handleExternalRequest);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('safespace-pwa-install-request', handleExternalRequest);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native PWA install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show custom guided instructions if no native prompt is available (e.g. iOS Safari)
      setShowGuideModal(true);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('safespace_pwa_banner_dismissed', 'true');
  };

  // If already running in standalone mode or PWA is fully installed, we don't need a banner
  if (isStandalone && !showGuideModal) {
    return null;
  }

  return (
    <>
      {/* 1. FLOATING PROACTIVE PWA BANNER */}
      {showBanner && (
        <div 
          id="pwa-install-banner"
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-in"
        >
          <div className={`rounded-3xl p-5 shadow-2xl border flex flex-col md:flex-row items-start md:items-center gap-4 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#151c17] border-emerald-900/60 text-slate-100' 
              : 'bg-white border-[#E1E8E3] text-slate-800'
          }`}>
            
            {/* App Icon Container */}
            <div className={`p-3 rounded-2xl shrink-0 flex items-center justify-center ${
              isDarkMode ? 'bg-[#38563a] text-emerald-400' : 'bg-[#e8f2e9] text-[#4A6741]'
            }`}>
              <Leaf size={24} className="stroke-[2.5]" />
            </div>

            {/* Banner Text Details */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black tracking-tight">Install Offline Companion</h4>
                <button 
                  type="button"
                  onClick={dismissBanner}
                  className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                    isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                  aria-label="Dismiss banner"
                >
                  <X size={14} />
                </button>
              </div>
              <p className={`text-[11px] mt-1 leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Add SafeSpace Toolkit to your home screen for high-speed offline launches, private client-side logs, and a full standalone app experience.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-4 py-2 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold text-[10.5px] tracking-wide transition cursor-pointer flex items-center space-x-1.5 border-0 shadow-xs"
                >
                  <Download size={12} />
                  <span>Install App</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className={`px-3 py-2 rounded-xl font-bold text-[10.5px] transition cursor-pointer border ${
                    isDarkMode 
                      ? 'border-slate-800 bg-[#1e2721] hover:bg-[#253229] text-slate-300' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  How to Install?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPREHENSIVE PWA GUIDE MODAL (FOR IOS AND OTHER BROWSERS) */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`max-w-md w-full rounded-3xl p-6 shadow-2xl border text-left flex flex-col transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#121814] border-slate-800 text-slate-100' 
              : 'bg-white border-[#E1E8E3] text-slate-800'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl ${
                  isDarkMode ? 'bg-[#38563a] text-emerald-400' : 'bg-[#e8f2e9] text-[#4A6741]'
                }`}>
                  <Leaf size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-none">Installation Guide</h3>
                  <span className={`text-[9px] uppercase font-bold tracking-widest mt-1 block ${
                    isDarkMode ? 'text-emerald-400' : 'text-[#4A6741]'
                  }`}>PWA STANDALONE SUITE</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowGuideModal(false)}
                className={`p-1.5 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Dynamic Content based on User Device */}
            <div className="py-5 space-y-4 text-xs">
              
              {/* Device Status indicators */}
              <div className={`p-3 rounded-2xl flex items-center space-x-3 border ${
                isDarkMode ? 'bg-[#151c17] border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                {platformInfo.isIOS ? <Smartphone className="text-sky-500" size={16} /> : <Monitor className="text-emerald-500" size={16} />}
                <div className="flex-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Your Environment</span>
                  <p className="font-extrabold text-slate-700 dark:text-slate-200">
                    {platformInfo.isIOS ? 'iOS Device (iPhone/iPad)' : 'Desktop/Android Environment'}
                  </p>
                </div>
              </div>

              {/* Step-by-Step guides */}
              {platformInfo.isIOS ? (
                // iOS SAFARI STEP-BY-STEP
                <div className="space-y-3.5">
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    Apple iOS devices require adding the app to the home screen manually using the Safari browser:
                  </p>
                  
                  <div className="space-y-3 font-sans">
                    {/* Step 1 */}
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-[#E1E8E3] dark:bg-[#1e2721] text-[#4A6741] dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-[#4A6741] dark:text-emerald-400">Open in Safari Browser</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                          Make sure you are browsing this tool directly in Safari, rather than in-app browsers like Chrome or Gmail.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-[#E1E8E3] dark:bg-[#1e2721] text-[#4A6741] dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-[#4A6741] dark:text-emerald-400 flex items-center">
                          Tap the Share Icon <Share2 size={13} className="ml-1.5 inline text-sky-500" />
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                          Tap the <strong>Share</strong> button in Safari's bottom toolbar or top right iPad menu.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-[#E1E8E3] dark:bg-[#1e2721] text-[#4A6741] dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-[#4A6741] dark:text-emerald-400 flex items-center">
                          Select "Add to Home Screen" <Plus size={13} className="ml-1.5 inline text-emerald-500" />
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                          Scroll down the share sheet options and tap <strong>Add to Home Screen</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // CHROME/EDGE/ANDROID STEP-BY-STEP
                <div className="space-y-3.5">
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    Enjoy full standalone speeds, hardware acceleration, and seamless offline client-side support:
                  </p>

                  <div className="space-y-3 font-sans">
                    {/* Native Install Option */}
                    {deferredPrompt ? (
                      <div className="p-3.5 rounded-2xl bg-[#E1E8E3]/40 border border-[#A8C69F]/40 space-y-2">
                        <p className="font-black text-xs text-[#4A6741] dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle size={14} /> Native Install Ready
                        </p>
                        <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          Your browser fully supports instant background installation! Click the button below to trigger the prompt.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            handleInstallClick();
                            setShowGuideModal(false);
                          }}
                          className="w-full mt-1.5 py-2 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold text-[10.5px] tracking-wide transition cursor-pointer flex items-center justify-center space-x-1.5 border-0 shadow-xs"
                        >
                          <Download size={12} />
                          <span>Trigger Installation Now</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Step 1 */}
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full bg-[#E1E8E3] dark:bg-[#1e2721] text-[#4A6741] dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="font-extrabold text-[#4A6741] dark:text-emerald-400">Address Bar Install Icon</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                              In Chrome or Edge, click the <strong>Install / Desktop Icon</strong> (looks like a monitor with a downward arrow) in the browser URL address bar.
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full bg-[#E1E8E3] dark:bg-[#1e2721] text-[#4A6741] dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                            2
                          </div>
                          <div className="flex-1">
                            <p className="font-extrabold text-[#4A6741] dark:text-emerald-400">Browser Settings Menu</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                              Or, click the three dots/settings icon in the top-right of your browser and select <strong>"Install Mental Health Toolkit..."</strong>.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Security & Offline-First Note */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[10px] text-slate-400">
                <Info size={13} className="shrink-0 text-[#4A6741] dark:text-emerald-400 mt-0.5" />
                <p className="leading-snug">
                  SafeSpace PWAs run completely client-side in sandboxed security partitions. No external credentials, tracking telemetry, or diagnostic profiles are compiled.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-[10.5px] transition cursor-pointer text-center border-0"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
};
