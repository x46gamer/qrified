import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BarChart3, MapPin, AlertTriangle, LineChart } from 'lucide-react';

const SmartDashboardSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Analytics",
      description: "Monitor scan volumes, geographic distribution, and customer engagement metrics in real-time.",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Global Scan Maps",
      description: "Visualize where your products are being verified worldwide with detailed heatmaps.",
      color: "from-secondary-500 to-secondary-600"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Fraud Alerts",
      description: "Receive instant notifications of suspicious scanning patterns or potential counterfeits.",
      color: "from-error-500 to-red-600"
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Trend Analysis",
      description: "Identify patterns in product authentication to optimize distribution and marketing.",
      color: "from-accent-500 to-accent-600"
    }
  ];

  // Generate random data points for chart visualization
  const generateDataPoints = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  const chartData = {
    scanVolume: generateDataPoints(12, 50, 100),
    engagement: generateDataPoints(12, 30, 80),
    alerts: generateDataPoints(12, 0, 15)
  };

  return (
    <section
      id="dashboard"
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>
      
      {/* Network visualization background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(30)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = Math.random() * 100;
          const y2 = Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute bg-primary-400"
              style={{
                left: `${x1}%`,
                top: `${y1}%`,
                width: '1px',
                height: `${Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))}px`,
                transformOrigin: 'top left',
                transform: `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`,
                opacity: 1.1 + (Math.random() * 0.3)
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 3 + (Math.random() * 5),
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2
              }}
            />
          );
        })}
        
        {[...Array(20)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = 2 + (Math.random() * 4);
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary-500"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2 + (Math.random() * 3),
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2
              }}
            />
          );
        })}
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 md:px-6 relative z-10"
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/50 text-primary-400 text-sm font-mono mb-4">
            <span>Command Your Verification Network</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Smart <span className="text-primary-400">Dashboard</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400">
            Gain unprecedented visibility into your authentication ecosystem with our
            powerful analytics dashboard, providing actionable insights in real-time.
          </p>
        </motion.div>
        
        {/* Dashboard visualization */}
        <motion.div
          className="mb-16 relative"
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 md:p-8 overflow-hidden">
            <div className="relative h-64 md:h-80">
              {/* Chart visualization */}
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {chartData.scanVolume.map((value, index) => (
                  <motion.div
                    key={index}
                    className="w-1/12 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t mx-[5px]"
                    style={{ height: '0%'}}
                    animate={{ height: `${value}%` }}
                    transition={{
                      duration: 1,
                      delay: 0.1 * index,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Trend line */}
              
              
              {/* Alert indicators */}
              <div className="absolute inset-0">
                {chartData.alerts.map((value, index) => {
                  if (value > 10) {
                    return (
                      <motion.div
                        key={index}
                        className="absolute w-3 h-3 bg-error-500 rounded-full"
                        style={{ 
                          left: `${(index + 1) * (100 / chartData.alerts.length)}%`, 
                          top: `${100 - value}%` 
                        }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 1.5 + (0.1 * index),
                          type: "spring"
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none"></div>
              
              {/* Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-neutral-500 px-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                  <div key={index} className={index % 2 === 0 ? 'block' : 'hidden md:block'}>
                    {month}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dashboard legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-2"></div>
                <span className="text-sm text-neutral-400">Scan Volume</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                <span className="text-sm text-neutral-400">Engagement</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
                <span className="text-sm text-neutral-400">Alerts</span>
              </div>
            </div>
          </div>
          
          {/* Dashboard controls - decorative */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-neutral-800/50 rounded-md text-xs text-neutral-400 font-mono">
              Time: Last 12 Months
            </div>
            <div className="px-4 py-2 bg-neutral-800/50 rounded-md text-xs text-neutral-400 font-mono">
              Region: Global
            </div>
            <div className="px-4 py-2 bg-neutral-800/50 rounded-md text-xs text-neutral-400 font-mono">
              Product Line: All
            </div>
          </div>
        </motion.div>

        {/* Dashboard features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 md:p-8"
              whileHover={{ 
                y: -5, 
                boxShadow: '0 0 15px 0 rgba(0, 73, 255, 0.2)'
              }}
            >
              <div className={`rounded-full bg-gradient-to-br ${feature.color} p-3 w-12 h-12 flex items-center justify-center mb-4 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SmartDashboardSection;