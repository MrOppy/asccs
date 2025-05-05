import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Button from '../components/Button';
import ParticleBackground from '../components/ParticleBackground';
import { MessageCircle, ShieldCheck, DollarSign, Clock } from 'lucide-react';

const SellAccount: React.FC = () => {
  const benefits = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-primary" />,
      title: 'Secure Process',
      description: 'Our team ensures a safe and secure transaction process'
    },
    {
      icon: <DollarSign className="w-12 h-12 text-accent" />,
      title: 'Best Prices',
      description: 'Get the best value for your Free Fire account'
    },
    {
      icon: <Clock className="w-12 h-12 text-success" />,
      title: 'Quick Process',
      description: 'Fast verification and listing of your account'
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-secondary" />,
      title: '24/7 Support',
      description: 'Our team is always here to assist you'
    }
  ];

  return (
    <Layout>
      <div className="relative min-h-screen">
        <ParticleBackground className="opacity-30" />
        
        <div className="container mx-auto px-4 py-16 pt-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Want to <span className="gradient-text">Sell Your Account</span>?
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Turn your Free Fire account into cash! We make selling your account safe, 
                easy, and profitable. Our team will help you get the best value for your account.
              </p>
              
              <Button 
                href="/contact"
                size="lg"
                className="button-glow"
              >
                Contact Admin
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl text-center"
              >
                <div className="mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="max-w-2xl mx-auto bg-card rounded-xl p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6 text-center">
              How It Works
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Contact Our Admin</h3>
                  <p className="text-muted-foreground">
                    Reach out to our admin team with details about your account, including level, 
                    skins, and other valuable items.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Account Verification</h3>
                  <p className="text-muted-foreground">
                    Our team will verify your account details and assess its value based on 
                    current market rates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Get Paid</h3>
                  <p className="text-muted-foreground">
                    Once verified, we'll make you an offer. After acceptance, receive instant 
                    payment through your preferred method.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellAccount;