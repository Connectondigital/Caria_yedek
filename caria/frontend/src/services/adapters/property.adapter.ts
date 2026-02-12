/**
 * Property adapter - transforms Horizon API responses to EstatesOS domain models
 */

import { Property, HorizonProperty, PropertyImage } from '../domain/types/Property';

/**
 * Safely parse JSON string with fallback
 */
function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.warn('Failed to parse JSON:', jsonString, e);
    return fallback;
  }
}

/**
 * Map Turkish status to English status
 */
function mapStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Satılık Emlak': 'available',
    'Satıldı': 'sold',
    'Rezerve': 'reserved',
    'Kiralık': 'rent',
  };
  return statusMap[status] || status.toLowerCase();
}

/**
 * Transform Horizon property to EstatesOS Property
 */
export function toUI(horizonProperty: HorizonProperty): Property {
  // Parse JSON-encoded fields
  const featuresInterior = safeJsonParse<string[]>(horizonProperty.ozellikler_ic, []);
  const featuresExterior = safeJsonParse<string[]>(horizonProperty.ozellikler_dis, []);
  const featuresLocation = safeJsonParse<string[]>(horizonProperty.ozellikler_konum, []);
  const gallery = safeJsonParse<PropertyImage[]>(horizonProperty.gallery, []);

  return {
    id: horizonProperty.id,
    slug: horizonProperty.slug || '',
    title: horizonProperty.title || 'Untitled Property',
    titleEn: horizonProperty.title_en || horizonProperty.title || '',
    location: horizonProperty.location || 'N/A',
    region: horizonProperty.region || 'N/A',
    price: parseFloat(horizonProperty.price) || 0,
    bedsRoomCount: horizonProperty.beds_room_count || horizonProperty.beds || 0,
    bathsCount: horizonProperty.baths_count || horizonProperty.baths || 0,
    area: horizonProperty.area || 0,
    plotSize: horizonProperty.plotSize || 0,
    plotArea: horizonProperty.plot_area || horizonProperty.plotSize || 0,
    closedArea: horizonProperty.closed_area || horizonProperty.area || 0,
    reference: horizonProperty.reference || 'N/A',
    image: horizonProperty.image || '',
    featuredImage: horizonProperty.featured_image || horizonProperty.image || '',
    gallery: gallery,
    tag: horizonProperty.tag || '',
    propertyType: horizonProperty.property_type || horizonProperty.kocan_tipi || 'apartment',
    status: mapStatus(horizonProperty.status || ''),
    description: horizonProperty.description || '',
    descriptionEn: horizonProperty.description_en || horizonProperty.description || '',
    isFeatured: Boolean(horizonProperty.is_featured),
    isFeaturedSlider: Boolean(horizonProperty.is_featured_slider),
    isFurnished: Boolean(horizonProperty.is_furnished),
    floorLevel: horizonProperty.floor_level || '',
    siteWithin: horizonProperty.site_within || '',
    buildingAge: horizonProperty.building_age || '',
    balcony: horizonProperty.balcony || '',
    distanceSea: horizonProperty.distance_sea || '',
    distanceCenter: horizonProperty.distance_center || '',
    distanceAirport: horizonProperty.distance_airport || '',
    distanceHospital: horizonProperty.distance_hospital || '',
    distanceSchool: horizonProperty.distance_school || '',
    fullAddress: horizonProperty.full_address || '',
    neighborhood: horizonProperty.neighborhood || '',
    city: horizonProperty.city || '',
    countryName: horizonProperty.country_name || '',
    latitude: horizonProperty.latitude,
    longitude: horizonProperty.longitude,
    featuresInterior,
    featuresExterior,
    featuresLocation,
    advisorId: horizonProperty.advisor_id,
    pdfBrochure: horizonProperty.pdf_brosur,
  };
}

/**
 * Transform multiple properties
 */
export function toUIList(horizonProperties: HorizonProperty[]): Property[] {
  return horizonProperties.map(toUI);
}

export const propertyAdapter = {
  toUI,
  toUIList,
};
