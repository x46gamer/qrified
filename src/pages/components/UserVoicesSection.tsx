import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const UserVoicesSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const testimonials = [
    {
      quote: "Qrified has completely transformed how we handle product authentication. We've seen counterfeit attempts drop by 87% in just three months.",
      author: "Alexandra Chen",
      position: "VP of Product Security, LuxBrands Inc.",
      logo: "LuxBrands"
    },
    {
      quote: "The analytics dashboard gives us insights we never thought possible. We now know exactly where and when our products are being verified globally.",
      author: "Marcus Rodriguez",
      position: "CTO, PharmaTrust",
      logo: "PharmaTrust"
    },
    {
      quote: "Implementation was seamless. Our customers love the added security, and our brand value has increased significantly as a result.",
      author: "Jessica Watkins",
      position: "Brand Director, Elite Electronics",
      logo: "EliteElec"
    },
    {
      quote: "The ROI is extraordinary. We've not only eliminated counterfeits but also gained valuable customer data that's driving our product development.",
      author: "Thomas Zhang",
      position: "CEO, Nouveau Apparel",
      logo: "Nouveau"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="testimonials" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>
      
      {/* Quote symbols background */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(8)].map((_, i) => {
          const x = 10 + (Math.random() * 80);
          const y = 10 + (Math.random() * 80);
          const size = 40 + (Math.random() * 60);
          const rotation = Math.random() * 30 - 15;
          
          return (
            <motion.div
              key={i}
              className="absolute text-primary-500"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                fontSize: `${size}px`,
                transform: `rotate(${rotation}deg)`
              }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.1, 1],
                rotate: [`${rotation}deg`, `${rotation + 5}deg`, `${rotation}deg`]
              }}
              transition={{ 
                duration: 8 + (Math.random() * 7),
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Quote />
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/50 text-primary-400 text-sm font-mono mb-4">
            <span>Trusted by Innovators</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Our Clients <span className="text-primary-400">Speak</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400">
            From luxury fashion to pharmaceuticals, leading brands worldwide trust
            Qrified to secure their products and enhance customer trust.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 md:p-8 hover:shadow-glow transition-all duration-300"
              whileHover={{ 
                y: -5, 
                borderColor: 'rgba(0, 73, 255, 0.3)',
                boxShadow: '0 0 15px 0 rgba(0, 73, 255, 0.2)'
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <Quote className="h-8 w-8 text-primary-400" />
                <div className="px-3 py-1 rounded-full bg-neutral-800 text-xs text-neutral-400 font-mono">
                  {testimonial.logo}
                </div>
              </div>
              <p className="text-neutral-300 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-white">{testimonial.author}</p>
                <p className="text-sm text-neutral-500">{testimonial.position}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 flex-wrap justify-center">
            {['Fortune 500', 'Enterprise', 'D2C Brands', 'Luxury', 'Pharmaceuticals'].map((category, index) => (
              <div 
                key={index} 
                className="px-4 py-2 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-full text-sm text-neutral-400"
              >
                {category}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UserVoicesSection;