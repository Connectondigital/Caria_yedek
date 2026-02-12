/**
 * CMS adapter - transforms Horizon API responses to EstatesOS domain models
 */

import {
  CMSHomepageBlock,
  CMSGlobalString,
  HorizonHomepageBlock,
  HorizonGlobalString,
  BlockType,
} from '../domain/types/CMS';

/**
 * Map block type string to BlockType
 */
function mapBlockType(blockType: string): BlockType {
  const validTypes: BlockType[] = ['hero', 'feature', 'testimonial', 'cta'];
  return validTypes.includes(blockType as BlockType) 
    ? (blockType as BlockType) 
    : 'feature';
}

/**
 * Transform Horizon homepage block to EstatesOS CMSHomepageBlock
 */
export function homepageBlockToUI(horizonBlock: HorizonHomepageBlock): CMSHomepageBlock {
  return {
    id: horizonBlock.id,
    blockType: mapBlockType(horizonBlock.block_type),
    title: horizonBlock.title || '',
    subtitle: horizonBlock.subtitle || null,
    content: horizonBlock.content || null,
    imageUrl: horizonBlock.image_url || null,
    videoUrl: horizonBlock.video_url || null,
    displayOrder: horizonBlock.display_order || 0,
    active: Boolean(horizonBlock.active),
  };
}

/**
 * Transform EstatesOS CMSHomepageBlock to Horizon format (for PUT)
 */
export function homepageBlockToAPI(block: Partial<CMSHomepageBlock>): Partial<HorizonHomepageBlock> {
  return {
    id: block.id,
    block_type: block.blockType || 'feature',
    title: block.title || '',
    subtitle: block.subtitle || null,
    content: block.content || null,
    image_url: block.imageUrl || null,
    video_url: block.videoUrl || null,
    display_order: block.displayOrder || 0,
    active: block.active ? 1 : 0,
  };
}

/**
 * Transform Horizon global string to EstatesOS CMSGlobalString
 */
export function globalStringToUI(horizonString: HorizonGlobalString): CMSGlobalString {
  return {
    id: horizonString.id,
    contentKey: horizonString.content_key,
    valueTr: horizonString.value_tr || '',
    valueEn: horizonString.value_en || '',
    section: horizonString.section || 'general',
  };
}

/**
 * Transform EstatesOS CMSGlobalString to Horizon format (for PUT)
 */
export function globalStringToAPI(str: Partial<CMSGlobalString>): Partial<HorizonGlobalString> {
  return {
    id: str.id,
    content_key: str.contentKey || '',
    value_tr: str.valueTr || '',
    value_en: str.valueEn || '',
    section: str.section || 'general',
  };
}

/**
 * Transform multiple blocks
 */
export function homepageBlocksToUI(horizonBlocks: HorizonHomepageBlock[]): CMSHomepageBlock[] {
  return horizonBlocks.map(homepageBlockToUI);
}

/**
 * Transform multiple global strings
 */
export function globalStringsToUI(horizonStrings: HorizonGlobalString[]): CMSGlobalString[] {
  return horizonStrings.map(globalStringToUI);
}

export const cmsAdapter = {
  homepageBlockToUI,
  homepageBlockToAPI,
  globalStringToUI,
  globalStringToAPI,
  homepageBlocksToUI,
  globalStringsToUI,
};
