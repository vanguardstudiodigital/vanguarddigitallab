import React, { useEffect } from 'react';
import { X, Play, Film } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { getEmbedVideoUrl } from '../utils/videoUtils.ts';

export const VideoModal: React.FC = () => {
  const { isVideoModalOpen, closeVideoModal, activeVideoUrl, settings, t } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideoModal();
    };
    if (isVideoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen, closeVideoModal]);

  if (!isVideoModalOpen) return null;

  const url = activeVideoUrl || settings.promoVideoUrl || '';
  const parsed = getEmbedVideoUrl(url);

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) closeVideoModal();
      }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              {t('video.modalTitle', 'Vanguard Studio · Tanıtım & Demo Videosu')}
            </h3>
          </div>

          <button
            type="button"
            onClick={closeVideoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700/80 rounded-xl transition-colors cursor-pointer border border-neutral-700/60"
            title={t('common.close', 'Kapat')}
          >
            <X className="w-4 h-4" />
            <span>{t('common.close', 'Kapat')}</span>
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {parsed.embedUrl ? (
            parsed.type === 'video' ? (
              <video
                src={parsed.embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                {t('video.notSupported', 'Tarayıcınız video etiketini desteklemiyor.')}
              </video>
            ) : (
              <iframe
                src={parsed.embedUrl}
                title="Vanguard Studio Video Player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <div className="p-8 text-center text-neutral-400 space-y-3">
              <Play className="w-12 h-12 mx-auto text-neutral-600" />
              <p className="text-sm">{t('video.notAvailable', 'Video linki henüz tanımlanmadı veya yüklenemedi.')}</p>
              <p className="text-xs text-neutral-500">
                {t('video.addFromAdmin', 'Yönetici panelinden geçerli bir YouTube veya Vimeo video bağlantısı ekleyebilirsiniz.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
