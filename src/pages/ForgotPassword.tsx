
import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-full">
        <div className="container mx-auto py-5">
          <Link to="/" className="text-xl font-bold block">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">seQRity</span>
          </Link>
        </div>
      </div>
      
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
