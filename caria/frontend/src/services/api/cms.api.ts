/**
 * CMS API - Phase 1 (READ + AUTOSAVE for homepage blocks & global strings)
 */

import httpClient from '../http';
import { cmsAdapter } from '../adapters/cms.adapter';
import {
  CMSHomepageBlock,
  CMSGlobalString,
  HorizonHomepageBlock,
  HorizonGlobalString,
} from '../domain/types/CMS';

// ============================================================
// HOMEPAGE BLOCKS
// ============================================================

/**
 * Get all homepage blocks
 */
export async function getHomepageBlocks(): Promise<CMSHomepageBlock[]> {
  console.log('[CMS API DEBUG] getHomepageBlocks() called');
  try {
    console.log('[CMS API DEBUG] About to call httpClient.get for /api/cms/home');
    const horizonBlocks = await httpClient.get<HorizonHomepageBlock[]>('/api/cms/home');
    console.log('[CMS API DEBUG] Response received:', horizonBlocks);
    return cmsAdapter.homepageBlocksToUI(horizonBlocks);
  } catch (error: any) {
    console.error('[CMS API] Failed to fetch homepage blocks:', error);
    return [];
  }
}

/**
 * Get homepage blocks grouped by type
 */
export async function getHomepageBlocksByType(): Promise<{
  hero: CMSHomepageBlock[];
  features: CMSHomepageBlock[];
  testimonials: CMSHomepageBlock[];
  cta: CMSHomepageBlock[];
}> {
  try {
    const blocks = await getHomepageBlocks();
    return {
      hero: blocks.filter(b => b.blockType === 'hero'),
      features: blocks.filter(b => b.blockType === 'feature'),
      testimonials: blocks.filter(b => b.blockType === 'testimonial'),
      cta: blocks.filter(b => b.blockType === 'cta'),
    };
  } catch (error: any) {
    console.error('[CMS API] Failed to group homepage blocks:', error);
    return { hero: [], features: [], testimonials: [], cta: [] };
  }
}

/**
 * Save homepage block (create or update) - AUTOSAVE
 */
export async function saveHomepageBlock(block: Partial<CMSHomepageBlock>): Promise<boolean> {
  try {
    const apiData = cmsAdapter.homepageBlockToAPI(block);
    await httpClient.put('/api/cms/home', apiData);
    return true;
  } catch (error: any) {
    console.error('[CMS API] Failed to save homepage block:', error);
    return false;
  }
}

// ============================================================
// GLOBAL STRINGS
// ============================================================

/**
 * Get all global strings
 */
export async function getGlobalStrings(): Promise<CMSGlobalString[]> {
  console.log('[CMS API DEBUG] getGlobalStrings() called');
  try {
    console.log('[CMS API DEBUG] About to call httpClient.get for /api/cms/strings');
    const horizonStrings = await httpClient.get<HorizonGlobalString[]>('/api/cms/strings');
    console.log('[CMS API DEBUG] Response received:', horizonStrings);
    return cmsAdapter.globalStringsToUI(horizonStrings);
  } catch (error: any) {
    console.error('[CMS API] Failed to fetch global strings:', error);
    return [];
  }
}

/**
 * Get global strings as key-value map for easy lookup
 */
export async function getGlobalStringsMap(): Promise<Record<string, { tr: string; en: string }>> {
  try {
    const strings = await getGlobalStrings();
    const map: Record<string, { tr: string; en: string }> = {};
    
    strings.forEach(str => {
      map[str.contentKey] = {
        tr: str.valueTr,
        en: str.valueEn,
      };
    });
    
    return map;
  } catch (error: any) {
    console.error('[CMS API] Failed to create global strings map:', error);
    return {};
  }
}

/**
 * Update single global string - AUTOSAVE
 */
export async function updateGlobalString(
  contentKey: string,
  valueTr: string,
  valueEn: string,
  section: string = 'general'
): Promise<boolean> {
  try {
    const apiData = cmsAdapter.globalStringToAPI({
      contentKey,
      valueTr,
      valueEn,
      section,
    });
    await httpClient.put('/api/cms/strings', [apiData]);
    return true;
  } catch (error: any) {
    console.error('[CMS API] Failed to update global string:', error);
    return false;
  }
}

/**
 * Update multiple global strings (batch) - AUTOSAVE
 */
export async function updateGlobalStrings(strings: Partial<CMSGlobalString>[]): Promise<boolean> {
  try {
    const apiData = strings.map(cmsAdapter.globalStringToAPI);
    await httpClient.put('/api/cms/strings', apiData);
    return true;
  } catch (error: any) {
    console.error('[CMS API] Failed to update global strings:', error);
    return false;
  }
}

// ============================================================
// PHASE 2+ STUBS (NOT IMPLEMENTED IN PHASE 1)
// ============================================================

/**
 * Delete homepage block - NOT IMPLEMENTED IN PHASE 1
 */
export async function deleteHomepageBlock(id: number): Promise<boolean> {
  console.warn('[CMS API] deleteHomepageBlock() is not implemented in Phase 1');
  throw new Error('Homepage block deletion is not available in Phase 1');
}

export const cmsApi = {
  getHomepageBlocks,
  getHomepageBlocksByType,
  saveHomepageBlock,
  getGlobalStrings,
  getGlobalStringsMap,
  updateGlobalString,
  updateGlobalStrings,
  deleteHomepageBlock,
};
