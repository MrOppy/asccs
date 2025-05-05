import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../lib/supabase-provider';
import Layout from '../components/Layout';
import Button from '../components/Button';
import AccountCard from '../components/AccountCard';
import ReviewCard from '../components/ReviewCard';
import ParticleBackground from '../components/ParticleBackground';
import { Database } from '../types/supabase';
import { dummyAccounts, dummyReviews } from '../lib/dummy-data';
import { CheckCircle, ShieldCheck, Clock, Zap, Gamepad2 } from 'lucide-react';

type Account = Database['public']['Tables']['accounts']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

const Home: React.FC = () => {
  const { supabase } = useSupabase();
  const [featuredAccounts, setFeaturedAccounts] = useState<Account[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('featured', true)
          .limit(6);
          
        if (accountsError) throw accountsError;
        
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .limit(3);
          
        if (reviewsError) throw reviewsError;

        // Use data or fallback to dummy data if empty
        setFeaturedAccounts(accountsData?.length ? accountsData : dummyAccounts.filter(a => a.featured));
        setReviews(reviewsData?.length ? reviewsData : dummyReviews);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to dummy data
        setFeaturedAccounts(dummyAccounts.filter(a => a.featured));
        setReviews(dummyReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const benefits = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-primary" />,
      title: 'Reliable Service',
      description: 'Every account is verified for authenticity before listing'
    },
    {
      icon: <Zap className="w-12 h-12 text-accent" />,
      title: 'Fast Delivery',
      description: 'Get your account details immediately after purchase'
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-success" />,
      title: 'Trusted Sellers',
      description: 'All our sellers are vetted and have positive ratings'
    },
    {
      icon: <Clock className="w-12 h-12 text-secondary" />,
      title: '24/7 Support',
      description: 'Our team is always available to assist you with any issues'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-background">
        <ParticleBackground className="opacity-30" />
        
        <div className="container mx-auto px-4 py-16 pt-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 gradient-text">
                Free Fire Account Shop Bangladesh
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                Find the perfect account with rare skins, high levels, and exclusive items.
                Your gateway to premium Free Fire accounts in Bangladesh.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  href="/accounts" 
                  size="lg"
                  className="button-glow"
                >
                  Browse Accounts
                </Button>
                <Button 
                  href="/sell-account" 
                  variant="outline" 
                  size="lg"
                >
                  Sell Your Account
                </Button>
                <Button 
                  href="/contact" 
                  variant="outline" 
                  size="lg"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-8 h-8 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Gamepad2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why Choose <span className="gradient-text">Us</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the best Free Fire accounts with premium features at competitive prices. Our service is trusted by thousands of gamers across Bangladesh.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
      </section>
      
      {/* Featured Accounts Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Featured <span className="gradient-text">Accounts</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our top accounts with premium features, rare skins, and high levels
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredAccounts.slice(0, 3).map((account, index) => (
                  <AccountCard key={account.id} account={account} index={index} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button href="/accounts">
                  View All Accounts
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              What Our <span className="gradient-text">Customers Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Hear from some of our satisfied customers.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Get Your Dream Free Fire Account?
            </h2>
            <p className="text-muted-foreground mb-8">
              Browse our selection of premium accounts with rare skins, high levels, and exclusive items.
            </p>
            <Button 
              href="/accounts" 
              size="lg"
              className="button-glow"
            >
              Explore Accounts
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;