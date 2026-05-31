export const PRIVATE_RIDE_PROMO_SAVINGS = 100;

export function hasPromoRate(type: string): boolean {
  return type === 'Private Ride';
}

/** Pre-promo flat rate: current flat/promo price + ₱100 savings */
export function getPromoOriginalPrice(flatPromoPrice: number, type: string): number | null {
  if (!hasPromoRate(type)) return null;
  return flatPromoPrice + PRIVATE_RIDE_PROMO_SAVINGS;
}

export interface TourExtraFees {
  environmental: number;
  entrance: number;
}

export function getTourExtraFees(tourName: string, tourType: string): TourExtraFees | null {
  if (tourType !== 'Tour Package') return null;
  if (tourName.includes('City Tour') || tourName.includes('PPC Beach')) return null;

  if (tourName.includes('El Nido Island Tour A')) {
    return { environmental: 400, entrance: 200 };
  }
  if (tourName.includes('El Nido Island Tour B')) {
    return { environmental: 400, entrance: 0 };
  }
  if (tourName.includes('El Nido Island Tour C')) {
    return { environmental: 400, entrance: 200 };
  }
  if (tourName.includes('El Nido Island Tour D')) {
    return { environmental: 400, entrance: 200 };
  }

  if (
    tourName.includes('Underground River') ||
    tourName.includes('Honda Bay') ||
    tourName.includes('Firefly')
  ) {
    return { environmental: 150, entrance: 0 };
  }

  return null;
}

export function formatTourExtraFeesNote(tourName: string, tourType: string): string | null {
  const fees = getTourExtraFees(tourName, tourType);
  if (!fees) return null;
  const parts: string[] = [];
  if (fees.environmental > 0) parts.push(`🌿 +₱${fees.environmental} env`);
  if (fees.entrance > 0) parts.push(`🎫 +₱${fees.entrance} entrance`);
  return parts.length > 0 ? `${parts.join(' · ')} / person` : null;
}
