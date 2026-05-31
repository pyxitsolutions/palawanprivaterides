import type { BookingFormData } from './bookingDraft';

export function getStep1Errors(data: BookingFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.fullName.trim()) errors.fullName = 'Please enter your full name.';
  if (!data.nationality) errors.nationality = 'Please select your nationality.';
  if (!data.phone || data.phone.length < 8) errors.phone = 'Please enter a valid phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address.';
  return errors;
}

export function getStep2Errors(data: BookingFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.tourDate) errors.tourDate = 'Please select a date.';
  if (!data.tourTime && !data.tourPeriod) errors.tourTime = 'Please select a time.';
  return errors;
}

export function getStep3Errors(
  data: BookingFormData,
  opts: { needsVehicle: boolean; isMultiVehicle: boolean },
): Record<string, string> {
  const errors: Record<string, string> = {};
  const pax = parseInt(data.pax);
  if (!data.pax || pax < 1) errors.pax = 'Please enter number of passengers.';
  if (opts.needsVehicle && !opts.isMultiVehicle && !data.vehicleType) {
    errors.vehicleType = 'Please select a vehicle type.';
  }
  return errors;
}

export function getStep4Errors(data: BookingFormData, tourName: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.pickupLocation.trim()) errors.pickupLocation = 'Please enter pick-up location.';
  if (!data.dropoffLocation.trim()) errors.dropoffLocation = 'Please enter drop-off location.';
  if (tourName.includes('PPC Beach') && !data.beachSelection) {
    errors.beachSelection = 'Please select a beach.';
  }
  return errors;
}
