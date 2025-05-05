import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Gamepad2 } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Gamepad2 className="w-24 h-24 text-primary mx-auto mb-6" />
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4">
            <span className="gradient-text">404</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">
            Page Not Found
          </h2>
          
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button href="/" size="lg">
              Go Home
            </Button>
            <Button href="/accounts" variant="outline" size="lg">
              Browse Accounts
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;