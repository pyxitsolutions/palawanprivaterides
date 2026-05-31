export interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  nationality: string;
  tourDate: string;
  tourTime: string;
  tourPeriod: string;
  pax: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType: string;
  beachSelection: string;
  message: string;
}

export interface BookingDraft {
  tourName: string;
  tourType: string;
  step: number;
  formData: BookingFormData;
}

const STORAGE_KEY = 'ppr-booking-draft';

export const emptyBookingFormData = (): BookingFormData => ({
  fullName: '',
  phone: '',
  email: '',
  nationality: '',
  tourDate: '',
  tourTime: '',
  tourPeriod: '',
  pax: '',
  pickupLocation: '',
  dropoffLocation: '',
  vehicleType: '',
  beachSelection: '',
  message: '',
});

export function loadBookingDraft(tourName: string): BookingDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingDraft;
    if (parsed.tourName !== tourName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveBookingDraft(draft: BookingDraft): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* ignore quota */
  }
}

export function clearBookingDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
