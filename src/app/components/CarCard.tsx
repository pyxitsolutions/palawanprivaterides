import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BedDouble,
  Calendar,
  Check,
  Clock,
  Compass,
  Crown,
  MapPin,
  Shield,
  Snowflake,
  Star,
  UserCircle,
  Users,
} from 'lucide-react';
import { CarDetailsModal } from './CarDetailsModal';
import { PromoBadge } from './PromoPrice';
import { slugify } from '../pages/ServicePage';
import { useCurrency } from '../context/CurrencyContext';
import {
  formatTourExtraFeesNote,
  getPromoOriginalPrice,
  hasPromoRate,
  PRIVATE_RIDE_PROMO_SAVINGS,
} from '../utils/pricing';

interface PricingTier {
  vehicle: string;
  price: string;
  capacity?: number;
}

interface TourCardProps {
  images: string[];
  name: string;
  price: string;
  type: string;
  duration?: string;
  pax: string;
  description: string;
  pricing?: PricingTier[];
  whatsIncluded?: string[];
}

type CardShellProps = TourCardProps & {
  credit?: string;
  tourData: TourCardProps & { credit?: string };
  displayPrice: number;
  perLabel: string;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (v: boolean) => void;
  booking: boolean;
  handleBook: () => void;
  onViewDetails: () => void;
  navigate: ReturnType<typeof useNavigate>;
};

function parseDurationBadge(duration?: string): string | null {
  if (!duration) return null;
  const match = duration.match(/\(([^)]+)\)/);
  if (match) return match[1];
  return duration.replace(/^(Travel|Tour) Duration\s*/i, '').trim() || null;
}

function tourEnvFeeNote(name: string, type: string): string | null {
  return formatTourExtraFeesNote(name, type);
}

function PremiumCardShell({
  images,
  name,
  type,
  duration,
  credit,
  tourData,
  displayPrice,
  perLabel,
  isDetailsOpen,
  setIsDetailsOpen,
  booking,
  handleBook,
  onViewDetails,
  badge,
  subtitle,
  features,
  durationLabel,
  pricePrefix,
  bookLabel,
  priceExtra,
  footer,
  children,
}: CardShellProps & {
  badge: React.ReactNode;
  subtitle: string;
  features: { icon: LucideIcon; label: string }[];
  durationLabel: string;
  pricePrefix?: string;
  bookLabel: string;
  priceExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { convertPrice } = useCurrency();
  const durationBadge = parseDurationBadge(duration);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer group min-h-[520px] flex flex-col"
      onClick={() => setIsDetailsOpen(true)}
    >
      <img
        src={images[0]}
        alt={`${name} - ${type} in Palawan | Palawan Private Rides`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      <div className="relative z-10 flex items-start justify-between gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">{badge}</div>
        <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-white/10">
          <Clock size={12} />
          Quick view
        </span>
      </div>

      <div className="relative z-10 mt-auto flex flex-col">
        <div className="px-4 sm:px-5 pb-3">
          <h3 className="font-black text-white text-2xl sm:text-3xl leading-tight tracking-tight">{name}</h3>
          <p className="flex items-center gap-1.5 text-white/75 text-xs sm:text-sm mt-1.5 font-medium">
            <MapPin size={14} className="text-[#e8a020] shrink-0" />
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 bg-black/45 backdrop-blur-sm border border-white/10 text-white/90 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              >
                <Icon size={12} className="text-[#e8a020] shrink-0" />
                {label}
              </span>
            ))}
          </div>

          {durationBadge && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-white/60 text-[11px] font-medium">{durationLabel}</span>
              <span className="bg-[#e8a020] text-white text-[11px] font-black px-3 py-1 rounded-full">
                {durationBadge}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 pb-4 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-3">
          <div className="flex-1 min-w-0">
            {pricePrefix && (
              <p className="text-white/60 text-[11px] font-semibold mb-0.5">{pricePrefix}</p>
            )}
            {children ?? (
              <p className="text-[#e8a020] text-4xl sm:text-[2.75rem] font-black leading-none tracking-tight">
                {convertPrice(displayPrice)}
              </p>
            )}
            <p className="text-white/55 text-xs mt-1">{perLabel}</p>
            {priceExtra}
          </div>

          <div className="flex flex-col gap-2 sm:items-end sm:min-w-[200px]">
            <button
              type="button"
              disabled={booking}
              onClick={(e) => {
                e.stopPropagation();
                handleBook();
              }}
              className="w-full sm:w-auto min-w-[200px] bg-[#e8a020] hover:bg-[#d49020] text-white font-black text-sm sm:text-base px-5 py-3.5 rounded-full shadow-lg transition-all disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <Calendar size={18} className="shrink-0" />
                  {bookLabel}
                  <span className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <ArrowRight size={16} />
                  </span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="w-full sm:w-auto min-w-[200px] border-2 border-white/50 hover:border-white hover:bg-white/10 text-white font-bold text-sm px-5 py-3 rounded-full transition-all flex items-center justify-center gap-2"
            >
              View Details
              <ArrowRight size={16} />
            </button>
            <p className="flex items-center justify-center sm:justify-end gap-1.5 text-[#e8a020]/90 text-[11px] font-semibold">
              <Check size={14} className="shrink-0" />
              Fast reply on WhatsApp
            </p>
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-md border-t border-white/10 px-4 sm:px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] text-white/80">
          <span className="inline-flex items-center gap-1 font-bold text-white">
            <Star size={12} className="text-[#e8a020] fill-[#e8a020]" />
            5.0 <span className="font-medium text-white/60">(9 Google reviews)</span>
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <Users size={12} className="text-[#e8a020]" />
            Trusted by 300+ travelers
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <Shield size={12} className="text-[#e8a020]" />
            Safe • Reliable • Comfortable
          </span>
        </div>

        {footer}

        {credit && (
          <div className="absolute bottom-14 right-2 text-white/30 text-[9px] px-2 pointer-events-none z-0">
            © {credit}
          </div>
        )}
      </div>

      <CarDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        tour={tourData}
        onBookNow={handleBook}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}

function PrivateRideCard(props: CardShellProps & { flatPrice: number; showPromo: boolean }) {
  const { convertPrice } = useCurrency();
  const { flatPrice, showPromo, displayPrice, type } = props;
  const original = showPromo ? getPromoOriginalPrice(flatPrice, type) : null;

  return (
    <PremiumCardShell
      {...props}
      badge={
        <>
          <span className="inline-flex items-center gap-1.5 bg-[#e8a020] text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
            <Crown size={13} className="shrink-0" />
            Private Ride
          </span>
          {showPromo && <PromoBadge className="!text-xs !px-3 !py-1.5" />}
        </>
      }
      subtitle="Private Transfer Service"
      features={[
        { icon: Snowflake, label: 'Airconditioned Van' },
        { icon: UserCircle, label: 'Professional Driver' },
        { icon: BedDouble, label: 'Hotel Pick-up' },
      ]}
      durationLabel="Travel Duration"
      bookLabel="Book Your Ride"
      footer={
        showPromo ? (
          <div className="bg-[#1a3728] border-t border-[#e8a020]/40 px-4 py-2 text-center text-[11px] sm:text-xs font-semibold text-white/90">
            Promotional rate — save{' '}
            <span className="font-black text-[#e8a020]">{convertPrice(PRIVATE_RIDE_PROMO_SAVINGS)} per booking</span>
            . Limited time.
          </div>
        ) : undefined
      }
    >
      {showPromo && original !== null ? (
        <>
          <p className="text-white/50 text-sm line-through mb-0.5">{convertPrice(original)}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <p className="text-[#e8a020] text-4xl sm:text-[2.75rem] font-black leading-none tracking-tight">
              {convertPrice(displayPrice)}
            </p>
            <span className="inline-flex bg-[#1a3728] border border-[#e8a020] text-[#e8a020] text-xs sm:text-sm font-black px-3 py-1.5 rounded-md shadow-md uppercase tracking-wide">
              Save {convertPrice(PRIVATE_RIDE_PROMO_SAVINGS)} / booking
            </span>
          </div>
        </>
      ) : (
        <p className="text-[#e8a020] text-4xl sm:text-[2.75rem] font-black leading-none">
          {convertPrice(displayPrice)}
        </p>
      )}
    </PremiumCardShell>
  );
}

function TourPackageCard(props: CardShellProps) {
  const { name, type, pricing, displayPrice } = props;
  const envNote = tourEnvFeeNote(name, type);

  return (
    <PremiumCardShell
      {...props}
      badge={
        <span className="inline-flex items-center gap-1.5 bg-[#1a3728] border border-[#e8a020] text-[#e8a020] text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
          <Compass size={13} className="shrink-0" />
          Tour Package
        </span>
      }
      subtitle="Private Guided Tour"
      features={[
        { icon: Users, label: 'Private Group Only' },
        { icon: BedDouble, label: 'Hotel Pick-up' },
        { icon: UserCircle, label: 'Licensed Guide' },
      ]}
      durationLabel="Tour Duration"
      pricePrefix={pricing ? 'Starting from' : undefined}
      bookLabel="Book This Tour"
      priceExtra={
        envNote ? (
          <p className="text-[#e8a020]/90 text-[11px] font-semibold mt-1.5">{envNote}</p>
        ) : undefined
      }
    />
  );
}

function TransferCard(props: CardShellProps) {
  return (
    <PremiumCardShell
      {...props}
      badge={
        <span className="inline-flex items-center gap-1.5 bg-[#e8a020] text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
          <MapPin size={13} className="shrink-0" />
          Transfer
        </span>
      }
      subtitle="Airport & Hotel Transfer"
      features={[
        { icon: Snowflake, label: 'Airconditioned Van' },
        { icon: UserCircle, label: 'Professional Driver' },
        { icon: BedDouble, label: 'Door-to-Door' },
      ]}
      durationLabel="Service Area"
      bookLabel="Book Transfer"
    />
  );
}

export function CarCard({
  images,
  name,
  price,
  type,
  duration,
  pax,
  description,
  pricing,
  whatsIncluded,
  credit,
}: TourCardProps & { credit?: string }) {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  const tourData = { images, name, price, type, duration, pax, description, pricing, whatsIncluded, credit };
  const flatPrice = parseInt(price);
  const showPromo = hasPromoRate(type);
  const startingPrice = pricing ? Math.min(...pricing.map((p) => parseInt(p.price))) : flatPrice;
  const displayPrice = showPromo ? flatPrice : startingPrice;
  const perLabel = type === 'Tour Package' || type === 'Transfer' ? 'per person' : 'per booking';

  const handleBook = () => {
    setBooking(true);
    setTimeout(() => navigate('/book', { state: { tourName: name, tourPrice: price, tourType: type, pricing } }), 500);
  };

  const handleViewDetails = () => {
    navigate(`/services/${slugify(name)}`);
  };

  const shared: CardShellProps = {
    images,
    name,
    price,
    type,
    duration,
    pax,
    description,
    pricing,
    whatsIncluded,
    credit,
    tourData,
    displayPrice,
    perLabel,
    isDetailsOpen,
    setIsDetailsOpen,
    booking,
    handleBook,
    onViewDetails: handleViewDetails,
    navigate,
  };

  if (type === 'Private Ride') {
    return <PrivateRideCard {...shared} flatPrice={flatPrice} showPromo={showPromo} />;
  }

  if (type === 'Tour Package') {
    return <TourPackageCard {...shared} />;
  }

  if (type === 'Transfer') {
    return <TransferCard {...shared} />;
  }

  return <TourPackageCard {...shared} />;
}
