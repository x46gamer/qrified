
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-full">
        <div className="container mx-auto py-5">
          <Link to="/" className="text-xl font-bold block">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">seQRity</span>
          </Link>
        </div>
      </div>
      
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl transition-all animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription>
            Sign up for seQRity Authentication System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              This is a trial version. Please use the login page to access the system.
            </AlertDescription>
          </Alert>
          
          <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all shadow hover:shadow-blue-300/30" asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
          </p>
          <p className="text-sm text-center text-gray-500 mt-4">
            <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
