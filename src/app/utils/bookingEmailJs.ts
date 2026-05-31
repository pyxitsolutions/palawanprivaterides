import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_w5vk124';
const PUBLIC_KEY = 'RaznTonJuUEVxkdZp';

/** Admin — HTML: booking-admin-emailjs.html */
const ADMIN_TEMPLATE =
  (import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN as string | undefined) ?? 'template_pnxzs9s';

/** Client (guest) — HTML: booking-guest-emailjs.html | To Email: {{guest_email}} */
const CLIENT_TEMPLATE =
  (import.meta.env.VITE_EMAILJS_TEMPLATE_GUEST_CONFIRM as string | undefined) ?? 'template_vxsclk9';

export interface BookingEmailParams {
  from_name: string;
  phone: string;
  email: string;
  nationality: string;
  tour_type: string;
  tour_name: string;
  vehicle_type: string;
  tour_price: string;
  estimated_total: string;
  tour_date: string;
  tour_time: string;
  pax: string;
  pickup_location: string;
  dropoff_location: string;
  beach_selection: string;
  message: string;
}

/** Admin notification, then client confirmation email. */
export async function sendBookingEmails(params: BookingEmailParams): Promise<void> {
  await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE, params, PUBLIC_KEY);

  await emailjs.send(
    SERVICE_ID,
    CLIENT_TEMPLATE,
    {
      ...params,
      guest_email: params.email.trim(),
      to_name: params.from_name,
    },
    PUBLIC_KEY,
  );
}
