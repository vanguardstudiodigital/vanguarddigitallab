import { useState, useEffect, useCallback, useRef } from 'react';

export interface CmsDraftData {
  id?: string;
  slug?: string;
  titleTR: string;
  summaryTR: string;
  contentTR: string;
  titleEN: string;
  summaryEN: string;
  contentEN: string;
  selectedLocations?: string[];
  isPublished?: boolean;
  updatedAt: string;
}

const DRAFT_STORAGE_KEY = 'vanguard_cms_active_draft_v1';

/**
 * Custom Hook for Fault-Tolerant CMS Editing with TR/EN Dual Language,
 * Real-time Local Mirroring, 30s Autosave, Network Matrix, and Handshake Verification.
 */
export function useCmsDraftManager(initialData?: Partial<CmsDraftData>) {
  // Network connection state
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Autosave / Sync Status
  const [lastAutosavedAt, setLastAutosavedAt] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);

  // Form Fields (TR and EN)
  const [slug, setSlug] = useState<string>(initialData?.slug || '');
  const [titleTR, setTitleTR] = useState<string>(initialData?.titleTR || '');
  const [summaryTR, setSummaryTR] = useState<string>(initialData?.summaryTR || '');
  const [contentTR, setContentTR] = useState<string>(initialData?.contentTR || '');

  const [titleEN, setTitleEN] = useState<string>(initialData?.titleEN || '');
  const [summaryEN, setSummaryEN] = useState<string>(initialData?.summaryEN || '');
  const [contentEN, setContentEN] = useState<string>(initialData?.contentEN || '');

  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialData?.selectedLocations || ['legal']
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    initialData?.isPublished ?? true
  );

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Monitor Network Online / Offline Events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Network connected (ONLINE). Syncing local CMS mirror...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.warn('⚠️ Network disconnected (OFFLINE). CMS locked in local draft storage.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const deepClone = <T>(obj: T): T => {
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(obj);
      } catch {
        // fallback
      }
    }
    return JSON.parse(JSON.stringify(obj));
  };

  // 2. Real-time Local Mirroring Layer (Every Keystroke)
  const mirrorToLocalStorage = useCallback(
    (customFields?: Partial<CmsDraftData>) => {
      try {
        const rawPayload: CmsDraftData = {
          id: initialData?.id,
          slug,
          titleTR,
          summaryTR,
          contentTR,
          titleEN,
          summaryEN,
          contentEN,
          selectedLocations,
          isPublished,
          updatedAt: new Date().toISOString(),
          ...customFields,
        };

        const draftPayload = deepClone(rawPayload);
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
        setHasUnsavedChanges(true);
      } catch (err) {
        console.error('Failed to mirror draft to localStorage:', err);
      }
    },
    [
      initialData?.id,
      slug,
      titleTR,
      summaryTR,
      contentTR,
      titleEN,
      summaryEN,
      contentEN,
      selectedLocations,
      isPublished,
    ]
  );

  // Trigger mirror on field changes
  useEffect(() => {
    mirrorToLocalStorage();
  }, [slug, titleTR, summaryTR, contentTR, titleEN, summaryEN, contentEN, selectedLocations, isPublished, mirrorToLocalStorage]);

  // 3. Background Autosave (Every 30 Seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        mirrorToLocalStorage();
        const timeString = new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastAutosavedAt(timeString);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, mirrorToLocalStorage]);

  // 4. Restore Draft from Local Storage (If tab closed unexpectedly)
  const checkForRestorableDraft = useCallback((): CmsDraftData | null => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: CmsDraftData = JSON.parse(saved);
        if (parsed.titleTR || parsed.contentTR || parsed.titleEN) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const restoreLocalDraft = useCallback((draft: CmsDraftData) => {
    if (draft.slug) setSlug(draft.slug);
    if (draft.titleTR) setTitleTR(draft.titleTR);
    if (draft.summaryTR) setSummaryTR(draft.summaryTR);
    if (draft.contentTR) setContentTR(draft.contentTR);
    if (draft.titleEN) setTitleEN(draft.titleEN);
    if (draft.summaryEN) setSummaryEN(draft.summaryEN);
    if (draft.contentEN) setContentEN(draft.contentEN);
    if (draft.selectedLocations) setSelectedLocations(draft.selectedLocations);
    if (draft.isPublished !== undefined) setIsPublished(draft.isPublished);

    setHasRestoredDraft(true);
    setTimeout(() => setHasRestoredDraft(false), 5000);
  }, []);

  // 5. Handshake Protocol Execution (Execute Save & Confirm HTTP / State 200 OK)
  const executeSaveWithHandshake = async (
    saveFn: (data: CmsDraftData) => void | Promise<void>
  ): Promise<{ success: boolean; error?: string }> => {
    const payload: CmsDraftData = {
      id: initialData?.id,
      slug,
      titleTR,
      summaryTR,
      contentTR,
      titleEN,
      summaryEN,
      contentEN,
      selectedLocations,
      isPublished,
      updatedAt: new Date().toISOString(),
    };

    try {
      // Execute primary save
      await saveFn(payload);

      // Handshake Verification: Clear local mirror ONLY when server/context confirms success
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasUnsavedChanges(false);
      setLastAutosavedAt(null);

      return { success: true };
    } catch (err: any) {
      console.error('Handshake Save Failure:', err);
      // Retain local mirror safely
      mirrorToLocalStorage(payload);
      return {
        success: false,
        error:
          err?.message ||
          'Veri sunucuya yazdırılamadı, yerel kopyanız koruma altına alındı.',
      };
    }
  };

  const clearLocalDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setHasUnsavedChanges(false);
  };

  return {
    isOnline,
    lastAutosavedAt,
    hasUnsavedChanges,
    hasRestoredDraft,
    slug,
    setSlug,
    titleTR,
    setTitleTR,
    summaryTR,
    setSummaryTR,
    contentTR,
    setContentTR,
    titleEN,
    setTitleEN,
    summaryEN,
    setSummaryEN,
    contentEN,
    setContentEN,
    selectedLocations,
    setSelectedLocations,
    isPublished,
    setIsPublished,
    restoreLocalDraft,
    checkForRestorableDraft,
    executeSaveWithHandshake,
    clearLocalDraft,
  };
}
