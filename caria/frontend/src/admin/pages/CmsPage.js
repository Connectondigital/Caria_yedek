import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Layers, Rocket, Trash2, Copy, RefreshCw, History, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAdminStore } from '../state/adminStore';

import PageList from '../components/cms/PageList';
import PageEditor from '../components/cms/PageEditor';
import BlockEditor from '../components/cms/BlockEditor';
import PreviewPane from '../components/cms/PreviewPane';
import BlockLibraryModal from '../components/cms/BlockLibraryModal';
import SaveStatusIndicator from '../components/cms/SaveStatusIndicator';
import SnapshotPanel from '../components/cms/SnapshotPanel';
import BlockAddMenu from '../components/cms/BlockAddMenu';

import { INITIAL_PAGES, DEFAULT_BLOCKS } from '../components/cms/mockCmsData';
import { generateId } from '../components/cms/helpers';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import { cmsApi } from '../../services';

const STORAGE_KEY = 'connect_admin_caria_cms_pages_v1';
const SNAPSHOT_KEY = 'connect_admin_caria_cms_snapshots_v1';

const CmsPage = () => {
  console.log('[CMS DEBUG] CmsPage component rendering');
  const { addActivity } = useAdminStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homepageBlocks, setHomepageBlocks] = useState([]);
  const [globalStrings, setGlobalStrings] = useState({});
  const saveTimeoutRef = useRef(null);

  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PAGES;
  });

  const [snapshots, setSnapshots] = useState(() => {
    const saved = localStorage.getItem(SNAPSHOT_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);

  const currentPage = pages.find(p => p.id === selectedPageId);
  const selectedBlock = currentPage?.blocks.find(b => b.id === selectedBlockId);
  const isLocked = currentPage?.isLockedTemplate;

  useEffect(() => {
    console.log('[CMS DEBUG] useEffect triggered - about to call loadCmsData');
    async function loadCmsData() {
      console.log('[CMS DEBUG] loadCmsData executing');
      setLoading(true);
      setError(null);
      try {
        console.log('[CMS DEBUG] Calling cmsApi.getHomepageBlocks()');
        const [blocks, strings] = await Promise.all([
          cmsApi.getHomepageBlocks(),
          cmsApi.getGlobalStrings()
        ]);
        console.log('[CMS DEBUG] API calls completed', { blocks, strings });
        
        setHomepageBlocks(blocks);
        
        const stringsMap = {};
        strings.forEach(str => {
          stringsMap[str.contentKey] = { tr: str.valueTr, en: str.valueEn };
        });
        setGlobalStrings(stringsMap);
        
        addActivity({ 
          type: 'cms', 
          title: 'CMS Yüklendi', 
          description: `${blocks.length} blok ve ${strings.length} metin yüklendi.`, 
          entity: 'CMS' 
        });
      } catch (err) {
        console.error('[CMS] Failed to load data:', err);
        setError('CMS verileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    
    loadCmsData();
  }, [addActivity]);

  useEffect(() => {
    if (!loading && homepageBlocks.length > 0) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          for (const block of homepageBlocks) {
            await cmsApi.saveHomepageBlock(block);
          }
          console.log('[CMS] Homepage blocks autosaved');
        } catch (err) {
          console.error('[CMS] Autosave failed:', err);
        }
      }, 600);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [homepageBlocks, loading]);

  const handleUpdateGlobalString = useCallback(async (key, valueTr, valueEn) => {
    setGlobalStrings(prev => ({
      ...prev,
      [key]: { tr: valueTr, en: valueEn }
    }));
    
    try {
      await cmsApi.updateGlobalString(key, valueTr, valueEn);
      console.log('[CMS] Global string updated:', key);
    } catch (err) {
      console.error('[CMS] Failed to update global string:', err);
    }
  }, []);

  const { status: saveStatus, lastSaved } = useDebouncedSave(pages, 1000, STORAGE_KEY);

  // Sync activity on save (when status changes to saved from saving)
  // We'll simplify this by just letting the hook handle the save.

  const handleUpdatePage = useCallback((updatedPage) => {
    setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  }, []);

  const handleUpdateBlock = useCallback((updatedBlock) => {
    if (!currentPage) return;
    const newBlocks = currentPage.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b);
    handleUpdatePage({ ...currentPage, blocks: newBlocks });
  }, [currentPage, handleUpdatePage]);

  const handleAddBlock = useCallback((type) => {
    if (!currentPage || isLocked) return;
    const newBlock = {
      id: generateId(),
      type,
      fields: JSON.parse(JSON.stringify(DEFAULT_BLOCKS[type]?.fields || {}))
    };
    handleUpdatePage({ ...currentPage, blocks: [...currentPage.blocks, newBlock] });
    setSelectedBlockId(newBlock.id);
    setIsLibraryOpen(false);
    addActivity({ type: 'cms', title: 'Blok Eklendi', description: `${type} bloğu ${currentPage.title} sayfasına eklendi.`, entity: 'CMS' });
  }, [currentPage, isLocked, handleUpdatePage, addActivity]);

  const handleOnDragEnd = (result) => {
    if (!result.destination || isLocked || !currentPage) return;

    const newBlocks = Array.from(currentPage.blocks);
    const [reorderedItem] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, reorderedItem);

    handleUpdatePage({ ...currentPage, blocks: newBlocks });
    addActivity({ type: 'cms', title: 'Blok Sıralaması Değişti', description: `${currentPage.title} sayfasında bloklar yeniden sıralandı.`, entity: 'CMS' });
  };

  const handleDeleteBlock = useCallback((blockId) => {
    if (!currentPage || isLocked) return;
    handleUpdatePage({ ...currentPage, blocks: currentPage.blocks.filter(b => b.id !== blockId) });
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    addActivity({ type: 'cms', title: 'Blok Silindi', description: `Bir blok ${currentPage.title} sayfasından kaldırıldı.`, entity: 'CMS' });
  }, [currentPage, isLocked, selectedBlockId, handleUpdatePage, addActivity]);

  const handleDuplicateBlock = useCallback((block) => {
    if (!currentPage || isLocked) return;
    const newBlock = { ...JSON.parse(JSON.stringify(block)), id: generateId() };
    const index = currentPage.blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...currentPage.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    handleUpdatePage({ ...currentPage, blocks: newBlocks });
    setSelectedBlockId(newBlock.id);
    addActivity({ type: 'cms', title: 'Blok Kopyalandı', description: `${block.type} bloğu çoğaltıldı.`, entity: 'CMS' });
  }, [currentPage, isLocked, handleUpdatePage, addActivity]);

  // Snapshot Actions
  const handleCreateSnapshot = () => {
    const note = prompt('Snapshot notu girin:', '');
    const newSnap = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      note: note || 'Manuel Yedek',
      version: snapshots.length + 1,
      data: JSON.parse(JSON.stringify(pages))
    };
    const newSnaps = [newSnap, ...snapshots].slice(0, 20);
    setSnapshots(newSnaps);
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(newSnaps));
    addActivity({ type: 'cms', title: 'Snapshot Oluşturuldu', description: `Yeni bir CMS versiyonu (V${newSnap.version}) kaydedildi.`, entity: 'CMS' });
  };

  const handleRestoreSnapshot = (snapshot) => {
    if (window.confirm('Bu versiyonu geri yüklemek istediğinizden emin misiniz? Mevcut değişiklikler kaybolacaktır.')) {
      setPages(snapshot.data);
      setIsSnapshotOpen(false);
      addActivity({ type: 'cms', title: 'Versiyon Geri Yüklendi', description: `CMS V${snapshot.version} versiyonuna döndürüldü.`, entity: 'CMS' });
    }
  };

  const handleDeleteSnapshot = (id) => {
    const newSnaps = snapshots.filter(s => s.id !== id);
    setSnapshots(newSnaps);
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(newSnaps));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
        addActivity({ type: 'cms', title: 'Manuel Kayıt', description: 'CMS değişiklikleri elle kaydedildi.', entity: 'CMS' });
      }
      if (e.key === 'Escape') {
        setSelectedBlockId(null);
        setIsLibraryOpen(false);
        setIsSnapshotOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages, addActivity]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3BB2B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">CMS yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hata</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#3BB2B8] text-white rounded-xl text-sm font-bold hover:bg-[#2a9298] transition"
          >
            Yeniden Yükle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-white dark:bg-slate-950 font-sans overflow-hidden">
      {/* Left Sidebar: Settings & Meta */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-white dark:bg-slate-950 z-20">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#3BB2B8] rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Rocket size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">CMS OS</h2>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Editor V4</div>
            </div>
          </div>
          <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {isSnapshotOpen ? (
            <SnapshotPanel
              snapshots={snapshots}
              onCreate={handleCreateSnapshot}
              onRestore={handleRestoreSnapshot}
              onDelete={handleDeleteSnapshot}
            />
          ) : (
            <PageList
              pages={pages}
              selectedPageId={selectedPageId}
              onSelectPage={(p) => { setSelectedPageId(p.id); setSelectedBlockId(null); }}
              onAddPage={() => { }} // Logic to be added if needed
            />
          )}
        </div>

        <div className="p-6 border-t border-slate-50 dark:border-slate-800">
          <button
            onClick={() => setIsSnapshotOpen(!isSnapshotOpen)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isSnapshotOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'}`}
          >
            <History size={14} /> {isSnapshotOpen ? 'EDİTÖRE DÖN' : 'VERSİYON GEÇMİŞİ'}
          </button>
        </div>
      </div>

      {/* Main Editor Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[34%_33%_33%] min-w-0 overflow-hidden relative">
        {/* 1. Block List & Page Meta */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <PageEditor
            page={currentPage}
            onUpdatePage={handleUpdatePage}
            onAddBlock={() => setIsLibraryOpen(true)}
            onSelectBlock={(b) => setSelectedBlockId(b.id)}
            selectedBlockId={selectedBlockId}
            onDeleteBlock={handleDeleteBlock}
            isLocked={isLocked}
          />
        </DragDropContext>

        {/* 2. Inspector (Properties) */}
        <div className="border-r border-slate-100 dark:border-slate-800 h-full overflow-hidden bg-white dark:bg-slate-950 flex flex-col">
          <BlockEditor
            block={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onDuplicate={handleDuplicateBlock}
            onDelete={handleDeleteBlock}
            isLocked={isLocked}
          />
        </div>

        {/* 3. Preview (Sticky Panel) */}
        <PreviewPane blocks={currentPage?.blocks || []} />
      </div>

      {/* Modals */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-slate-950/20 backdrop-blur-md">
          <div className="w-[500px] h-[700px] bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <BlockAddMenu
              onSelect={handleAddBlock}
              onClose={() => setIsLibraryOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsPage;
