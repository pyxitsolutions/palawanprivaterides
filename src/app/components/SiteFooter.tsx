import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Phone, Mail, MessageCircle } from 'lucide-react';
import { PolicyModal, type PolicyType } from './PolicyModal';

export function SiteFooter() {
  const [openPolicy, setOpenPolicy] = useState<PolicyType>(null);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <>
      <footer className="bg-primary text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-3">Palawan Private Rides</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Your trusted local partner for private rides and tours throughout Palawan.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { href: 'https://www.facebook.com/profile.php?id=61564208219838', icon: <Facebook size={18} /> },
                  { href: 'tel:+639217792016', icon: <Phone size={18} /> },
                  { href: 'mailto:palawanprivaterides@gmail.com', icon: <Mail size={18} /> },
                  { href: 'https://api.whatsapp.com/send?phone=639217792016', icon: <MessageCircle size={18} /> },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold mb-4 text-white/90">Explore</h4>
              <ul className="space-y-2">
                <li><Link to="/rides" className="text-white/60 hover:text-white text-sm transition-colors">Private Rides</Link></li>
                <li><Link to="/tours" className="text-white/60 hover:text-white text-sm transition-colors">City Tours</Link></li>
                <li><button onClick={() => scrollTo('destinations')} className="text-white/60 hover:text-white text-sm transition-colors">Destinations</button></li>
                <li><button onClick={() => scrollTo('services')} className="text-white/60 hover:text-white text-sm transition-colors">Services</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-white/90">Contact</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>+63 921-779-2016</li>
                <li>palawanprivaterides@gmail.com</li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-bold mb-4 text-white/90">Policies</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Booking Policy', key: 'booking' },
                  { label: 'Cancellation Policy', key: 'cancellation' },
                  { label: 'Privacy Policy', key: 'privacy' },
                  { label: 'Terms & Conditions', key: 'terms' },
                ].map((p) => (
                  <li key={p.key}>
                    <button
                      onClick={() => setOpenPolicy(p.key as PolicyType)}
                      className="text-white/60 hover:text-white text-sm transition-colors text-left"
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/50 text-sm">&copy; 2026 Palawan Private Rides. All rights reserved.</p>
            <p className="text-white/30 text-xs">Puerto Princesa, Palawan, Philippines</p>
          </div>
        </div>
      </footer>

      <PolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </>
  );
}
