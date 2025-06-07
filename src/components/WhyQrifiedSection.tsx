import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Fingerprint, Zap, Share2 } from 'lucide-react';

const WhyQrifiedSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Tamper-Proof Authentication",
      description: "Cryptographically secure QR codes that cannot be duplicated or falsified, ensuring absolute product authenticity."
    },
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "Unique Digital Identity",
      description: "Every product gets its own secure digital passport, tracking its journey from creation to consumer."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Verification",
      description: "Real-time authentication in milliseconds, allowing customers to verify legitimacy with a simple scan."
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Seamless Integration",
      description: "Effortlessly connects with your existing systems, requiring minimal changes to your production process."
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
    <section id="why" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>
      
      {/* Data flow lines - animated */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            style={{ 
              top: `${15 + i * 20}%`, 
              left: 0, 
              right: 0,
              opacity: 1.6 - (i * 0.1)
            }}
            animate={{ 
              x: ['-100%', '100%'],
              scaleY: [1, 3, 1],
            }}
            transition={{ 
              duration: 8 + i * 2, 
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5
            }}
          />
        ))}
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
            <span>Trust in a Single Tap</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Why Choose <span className="text-primary-400">Qrified</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400">
            Our cutting-edge technology creates an unbreakable bond between physical products
            and their digital identities, revolutionizing how brands protect their authenticity.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
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
              <div className="rounded-full bg-primary-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4 text-primary-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="#security"
            className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium"
            whileHover={{ x: 5 }}
          >
            Learn about our security architecture
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-4 w-4"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyQrifiedSection;