import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { CarCard } from '../components/CarCard';
import { privateRides } from '../data/tours';

export default function RidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <section className="pt-28 pb-12 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Private Land Transport</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Private Rides</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Door-to-door transfers across Palawan — just your group, your driver, and the open road.
          </p>
        </div>
      </section>

      {/* Rides Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privateRides.map((tour, index) => (
              <CarCard key={index} {...tour} />
            ))}
          </div>

          {/* Note */}
          <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't see your destination? <strong className="text-gray-800">We go anywhere in Palawan.</strong>{' '}
              <a
                href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20need%20a%20custom%20transfer%20in%20Palawan."
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold underline hover:opacity-80"
              >
                Message us for a custom quote →
              </a>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
