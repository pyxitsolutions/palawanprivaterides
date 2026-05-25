import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CarCard } from './components/CarCard';
import { HeroCarousel } from './components/HeroCarousel';
import { Testimonials } from './components/Testimonials';
import { Car, Shield, Clock, Award, Phone, Mail, Facebook, MapPin, MessageCircle } from 'lucide-react';
import click125_1 from '../motors/click125-1.jpg';
import click125_2 from '../motors/click125-2.jpg';
import click125_3 from '../motors/click125-3.jpg';
import aerox155_1 from '../motors/aerox155-1.jpg';
import aerox155_2 from '../motors/aerox155-2.jpg';
import mirageAbout from '../hero/mirage-4.png';
import aboutImg from '../about/about-1.png';

export default function App() {
  const [priceRange, setPriceRange] = useState([300, 10000]);
  const [typeFilter, setTypeFilter] = useState('all');
  const cars = [
    {
      images: [
        'https://images.unsplash.com/photo-1596429916858-6f97b5b9cf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1749058983469-11eaef8d7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1749058983232-59b967855b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1749058983193-4fc66ce597ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1749058982938-8a028edd392f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      name: 'Toyota Vios',
      price: '1500',
      type: 'Sedan',
      transmission: 'Automatic',
      seats: 5,
      fuelType: 'Petrol',
      description: 'Reliable and fuel-efficient sedan, perfect for daily commutes and family trips around the city.',
    },
    {
      images: [
        'https://images.unsplash.com/photo-1708401265955-bef493b523e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1678002239411-d633292ecbc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1772903849126-694a1e819bd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1760101832548-1870e1c2ad6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1772903849037-57a8c10abf9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      name: 'Honda City',
      price: '1600',
      type: 'Sedan',
      transmission: 'Automatic',
      seats: 5,
      fuelType: 'Petrol',
      description: 'Stylish and spacious sedan with excellent fuel economy, ideal for comfortable city driving.',
    },
    {
      images: [
        'https://images.unsplash.com/photo-1642006247818-3334db5656c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1655300368482-9a4aad8450a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1628960410432-a6f72617a880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1597423506044-83f5f2ab580a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1695105451888-e488333b9bc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      name: 'Mitsubishi Mirage',
      price: '1200',
      type: 'Hatchback',
      transmission: 'Manual',
      seats: 5,
      fuelType: 'Petrol',
      description: 'Compact and economical hatchback, perfect for easy parking and navigating busy Metro Manila streets.',
    },
    {
      images: [
        'https://images.unsplash.com/photo-1664783856972-ac9922d7b2d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1670054953044-2605dbd0d747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1742697167580-af91e3ead35e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1661096478555-4d0ce10169b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1667971289521-4c8050b844a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      name: 'Toyota Fortuner',
      price: '3500',
      type: 'SUV',
      transmission: 'Automatic',
      seats: 7,
      fuelType: 'Diesel',
      description: 'Powerful and spacious 7-seater SUV, perfect for family road trips and provincial adventures.',
    },
    {
      images: [
        'https://images.unsplash.com/photo-1594978100646-ccd2ae32b711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1628684014602-88da45adfb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1611580568660-28050c1d5b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1611580568467-a8e2bb344bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1652509328308-7f0d7804e678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      name: 'Mitsubishi Montero Sport',
      price: '3200',
      type: 'SUV',
      transmission: 'Automatic',
      seats: 7,
      fuelType: 'Diesel',
      description: 'Premium 7-seater SUV with rugged capability and modern comfort for any journey.',
    },
    {
      images: [
        'https://images.unsplash.com/photo-1748215210939-ad8b6c8c086d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1748215210950-536c6621629a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1709620435392-c1ecacde8bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1627927141576-0256f4c21ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'https://images.unsplash.com/photo-1712649415937-63f60ec6742e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      ],
      name: 'Toyota Innova',
      price: '2500',
      type: 'Van',
      transmission: 'Manual',
      seats: 8,
      fuelType: 'Diesel',
      description: 'Spacious and versatile 8-seater MPV, ideal for large families and group outings.',
    },
    {
      images: [click125_1, click125_2, click125_3],
      name: 'Honda Click 125',
      price: '400',
      type: 'Motorcycle',
      transmission: 'Automatic',
      seats: 2,
      fuelType: 'Petrol',
      description: 'Fuel-efficient automatic scooter, perfect for daily commutes and navigating through Puerto Princesa traffic.',
    },
    {
      images: [aerox155_1, aerox155_2],
      name: 'Yamaha Aerox 155',
      price: '500',
      type: 'Motorcycle',
      transmission: 'Automatic',
      seats: 2,
      fuelType: 'Petrol',
      description: 'Sporty and powerful maxi-scooter with aggressive styling, perfect for both city riding and open road adventures.',
    },
  ];

  const services = [
    {
      icon: <Car size={40} />,
      title: 'Cars & Motorcycles',
      description: 'From spacious SUVs to fuel-efficient scooters — we have the right ride for every Palawan adventure.',
    },
    {
      icon: <Shield size={40} />,
      title: 'Safe & Maintained',
      description: 'All our vehicles are regularly checked and well-maintained so you can focus on enjoying Palawan.',
    },
    {
      icon: <Clock size={40} />,
      title: 'Flexible Rentals',
      description: 'Daily, weekly, or long-term — rent on your schedule and explore Palawan at your own pace.',
    },
    {
      icon: <Award size={40} />,
      title: 'Local Best Rates',
      description: 'Honest and affordable pricing with no hidden charges — because Palawan should be enjoyed, not stressful.',
    },
  ];

  const typeFilters = [
    { label: 'All Types', value: 'all' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Van', value: 'Van' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Motorcycle', value: 'Motorcycle' },
  ];

  const filteredCars = cars.filter((car) => {
    const price = parseInt(car.price);

    // Price filter - check if price is within range
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];

    // Type filter
    const typeMatch = typeFilter === 'all' || car.type === typeFilter;

    return priceMatch && typeMatch;
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = newValue;

    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && newValue > priceRange[1]) {
      newRange[1] = newValue;
    } else if (index === 1 && newValue < priceRange[0]) {
      newRange[0] = newValue;
    }

    setPriceRange(newRange);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-16">
        <HeroCarousel />
      </section>

      {/* Available Cars Section */}
      <section id="cars" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Available Cars</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our premium selection of luxury and performance vehicles
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Car Type Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Car size={20} className="text-primary" />
                    Car Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setTypeFilter(filter.value)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          typeFilter === filter.value
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:border-primary border border-transparent'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-primary">₱</span>
                      Price Range
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {/* Min Price Slider */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Minimum: ₱{priceRange[0].toLocaleString()}</label>
                      <input
                        type="range"
                        min="300"
                        max="10000"
                        step="50"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    {/* Max Price Slider */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Maximum: ₱{priceRange[1].toLocaleString()}</label>
                      <input
                        type="range"
                        min="300"
                        max="10000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters & Reset */}
              {((priceRange[0] !== 300 || priceRange[1] !== 10000) || typeFilter !== 'all') && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Active filters:</span>
                      {typeFilter !== 'all' && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {typeFilter}
                        </span>
                      )}
                      {(priceRange[0] !== 300 || priceRange[1] !== 10000) && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                          ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setPriceRange([300, 10000]);
                        setTypeFilter('all');
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <CarCard key={index} {...car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-2">No cars found matching your filters.</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filter selections.</p>
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setTypeFilter('all');
                }}
                className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">About PyX Rental</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Based in Puerto Princesa, PyX Rental is your trusted local partner for exploring everything Palawan has to offer — from the underground river to the white sand beaches of El Nido and Coron.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                We offer a well-maintained fleet of cars, SUVs, vans, and motorcycles suited for every type of traveler — whether you're a solo backpacker, a family on vacation, or a group of friends on a road trip.
              </p>
              <p className="text-lg text-muted-foreground">
                We keep things simple — fair prices, reliable rides, and friendly service. Because in Palawan, the journey is just as beautiful as the destination.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutImg}
                alt="Toyota Hilux in Puerto Princesa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive services to make your rental experience seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 text-center group hover:border-primary"
              >
                <div className="inline-block mb-4 text-primary group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <Testimonials />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contact us today to reserve your vehicle or ask any questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <a
              href="tel:+639166846547"
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 text-center group hover:border-primary"
            >
              <div className="inline-block mb-4 text-primary group-hover:scale-110 transition-transform">
                <Phone size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Phone</h3>
              <p className="text-muted-foreground">0916-684-6547</p>
              <p className="text-sm text-muted-foreground mt-2">Mon-Sun: 8AM - 10PM</p>
            </a>

            <a
              href="mailto:pyxitsolutions@gmail.com"
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 text-center group hover:border-primary"
            >
              <div className="inline-block mb-4 text-primary group-hover:scale-110 transition-transform">
                <Mail size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Email</h3>
              <p className="text-muted-foreground">pyxitsolutions@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-2">We reply within 24 hours</p>
            </a>

            <a
              href="https://m.me/pyxsolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 text-center group hover:border-primary"
            >
              <div className="inline-block mb-4 text-primary group-hover:scale-110 transition-transform">
                <Facebook size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Messenger</h3>
              <p className="text-muted-foreground">facebook.com/pyxsolutions</p>
              <p className="text-sm text-muted-foreground mt-2">Instant responses</p>
            </a>

            <a
              href="https://api.whatsapp.com/send?phone=639166846547&text=Hi!%20I%20want%20to%20rent%20a%20vehicle%20in%20Palawan."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 text-center group hover:border-primary"
            >
              <div className="inline-block mb-4 text-green-500 group-hover:scale-110 transition-transform">
                <MessageCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">WhatsApp</h3>
              <p className="text-muted-foreground">0916-684-6547</p>
              <p className="text-sm text-muted-foreground mt-2">Chat with us on WhatsApp</p>
            </a>
          </div>

          {/* Google Map */}
          <div className="mt-12 max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src="https://maps.google.com/maps?q=9.748963,118.747713&z=16&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PyX Rental Vehicle Rental Location"
            />
          </div>

          <div className="mt-6 bg-card p-8 rounded-xl border border-border max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="text-primary mt-1">
                <MapPin size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Visit Our Office</h3>
                <p className="text-muted-foreground">
                  National Highway, Barangay San Pedro<br />
                  Puerto Princesa City, Palawan<br />
                  Philippines
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Open: Monday - Sunday, 8:00 AM - 10:00 PM
                </p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=9.748963,118.747713"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PyX Rental</h3>
              <p className="text-primary-foreground/80">
                Your trusted partner for premium car rentals. Experience luxury, performance, and exceptional service.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Cars
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Reviews
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/pyxsolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground text-primary p-3 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="tel:+639166846547"
                  className="bg-primary-foreground text-primary p-3 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Phone size={20} />
                </a>
                <a
                  href="mailto:pyxitsolutions@gmail.com"
                  className="bg-primary-foreground text-primary p-3 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/80">
              &copy; 2026 PyX Rental Vehicle Rental. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}