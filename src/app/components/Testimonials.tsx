import { Star } from 'lucide-react';
import image1 from '../../imports/image-1.png';
import image4 from '../../imports/image-4.png';
import image5 from '../../imports/image-5.png';
import image6 from '../../imports/image-6.png';

export function Testimonials() {
  const testimonials = [
    {
      image: image1,
      name: 'Maria Santos',
      review: 'Excellent service! The car was in perfect condition and the rental process was smooth. Highly recommended!',
      rating: 5,
      carRented: 'Toyota Wigo',
    },
    {
      image: image4,
      name: 'Juan Reyes',
      review: 'Amazing experience! Professional staff and well-maintained vehicles. Will definitely rent again.',
      rating: 5,
      carRented: 'Mitsubishi Montero',
    },
    {
      image: image5,
      name: 'Anna Cruz',
      review: 'Great value for money! The booking was easy and the car exceeded my expectations. Thank you!',
      rating: 5,
      carRented: 'Mitsubishi Mirage',
    },
    {
      image: image6,
      name: 'Pedro Gomez',
      review: 'Very satisfied with the service. Clean car, fair prices, and friendly customer support!',
      rating: 5,
      carRented: 'Mitsubishi Mirage G4',
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Happy Customers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our satisfied customers have to say about their rental experience
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
                  Rented: {testimonial.carRented}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-card px-8 py-4 rounded-full border border-border shadow-md">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold border-2 border-background">
                500+
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">500+</span> satisfied customers and counting
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
