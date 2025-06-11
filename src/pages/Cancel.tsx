import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { toast } from 'sonner';

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show a toast message
    toast.error('Checkout was cancelled');

    // Redirect to lifetime page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/lifetime');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="mb-6 flex justify-center"
        >
          <XCircle className="h-16 w-16 text-red-500" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Checkout Cancelled
        </h1>

        <p className="text-blue-100 mb-6">
          You've cancelled the checkout process. Don't worry, you can try again whenever you're ready.
        </p>

        <p className="text-sm text-blue-200">
          Redirecting you back to the lifetime deal page...
        </p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/lifetime')}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-blue-600 text-white font-medium hover:from-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Return to Lifetime Deal
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Cancel; 