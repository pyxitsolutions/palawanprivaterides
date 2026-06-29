export const OFFSEASON_DISCOUNT_PER_BOOKING = 500;

/** Outbound private rides from Puerto Princesa — offseason promo routes */
export const OFFSEASON_ROUTE_NAMES = [
  'PPS → El Nido',
  'PPS → Port Barton',
  'PPS → San Vicente',
] as const;

export function hasOffseasonDiscount(tourName: string): boolean {
  return (OFFSEASON_ROUTE_NAMES as readonly string[]).includes(tourName);
}

export function getOffseasonDiscountedPrice(regularPrice: number, tourName: string): number {
  if (!hasOffseasonDiscount(tourName)) return regularPrice;
  return Math.max(0, regularPrice - OFFSEASON_DISCOUNT_PER_BOOKING);
}

/** Apply ₱500 off once per private-ride booking (incl. multi-van fleet). */
export function applyOffseasonBookingDiscount(
  rideSubtotal: number,
  tourName: string,
  tourType: string,
): number {
  if (tourType !== 'Private Ride' || !hasOffseasonDiscount(tourName)) return rideSubtotal;
  return Math.max(0, rideSubtotal - OFFSEASON_DISCOUNT_PER_BOOKING);
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
