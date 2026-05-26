import { Star } from 'lucide-react';
import reviews1 from '../../reviews/reviews-1.jpg';
import reviews4 from '../../reviews/reviews-4.jpg';
import reviews5 from '../../reviews/reviews-5.jpg';
import reviews6 from '../../reviews/reviews-6.jpg';

export function Testimonials() {
  const testimonials = [
    {
      image: reviews1,
      name: 'Maria Santos',
      review: 'Amazing private ride to El Nido! The van was super comfortable and our driver was very friendly and knowledgeable. Highly recommend!',
      rating: 5,
      tourBooked: 'Puerto to El Nido Private Van',
    },
    {
      image: reviews4,
      name: 'Juan Reyes',
      review: 'Booked the Underground River tour and it was absolutely worth it. Everything was arranged for us — stress-free and enjoyable!',
      rating: 5,
      tourBooked: 'Underground River Day Tour',
    },
    {
      image: reviews5,
      name: 'Anna Cruz',
      review: 'Great service and fair pricing! The city tour covered all the best spots in Puerto Princesa. Will definitely book again.',
      rating: 5,
      tourBooked: 'Puerto Princesa City Tour',
    },
    {
      image: reviews6,
      name: 'Pedro Gomez',
      review: 'Airport pick-up was on time and the vehicle was clean and comfortable. Simple, reliable, and professional. Thank you!',
      rating: 5,
      tourBooked: 'Airport Transfer',
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Happy Customers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our satisfied travelers have to say about their Palawan experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border group"
            >
              <div className="relative overflow-hidden h-80">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <h3 className="font-semibold text-card-foreground mb-2">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {testimonial.review}
                </p>
                <p className="text-xs text-primary font-medium">
                  Booked: {testimonial.tourBooked}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-card px-8 py-4 rounded-full border border-border shadow-md">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold border-2 border-background">
              500+
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">500+</span> satisfied travelers and counting
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
