import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabase } from '../lib/supabase-provider';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Database } from '../types/supabase';
import { dummyAccounts, dummySellers } from '../lib/dummy-data';
import { ShoppingCart, ThumbsUp, ChevronLeft, ChevronRight, Info, CheckCircle } from 'lucide-react';

type Account = Database['public']['Tables']['accounts']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

const AccountDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [account, setAccount] = useState<Account | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!id) return;

      try {
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (accountError) throw accountError;
        
        const fetchedAccount = accountData || dummyAccounts.find(a => a.id === id);
        
        if (!fetchedAccount) {
          navigate('/accounts');
          return;
        }
        
        setAccount(fetchedAccount);
        
        if (fetchedAccount.seller_id) {
          const { data: sellerData, error: sellerError } = await supabase
            .from('sellers')
            .select('*')
            .eq('id', fetchedAccount.seller_id)
            .maybeSingle();
            
          if (sellerError) throw sellerError;
          
          const fetchedSeller = sellerData || dummySellers.find(s => s.id === fetchedAccount.seller_id);
          setSeller(fetchedSeller || null);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
        
        const dummyAccount = dummyAccounts.find(a => a.id === id);
        
        if (!dummyAccount) {
          navigate('/accounts');
          return;
        }
        
        setAccount(dummyAccount);
        setSeller(dummySellers.find(s => s.id === dummyAccount.seller_id) || null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [id, supabase, navigate]);

  const nextImage = () => {
    if (!account?.images) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === account.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!account?.images) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? account.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!account) {
    return <Layout>
      <div className="container mx-auto px-4 py-16 pt-32 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Account Not Found</h1>
        <p className="mb-6">The account you're looking for doesn't exist or has been removed.</p>
        <Button href="/accounts">Browse Accounts</Button>
      </div>
    </Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-32">
        <Button 
          href="/accounts" 
          variant="ghost" 
          className="mb-6"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <ChevronLeft className="mr-1" /> Back to Accounts
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Slider */}
          <div className="relative bg-muted rounded-xl overflow-hidden">
            {account?.images && account.images.length > 0 ? (
              <>
                <div className="aspect-[16/9]">
                  <motion.img 
                    key={currentImageIndex}
                    src={account.images[currentImageIndex]} 
                    alt={`Free Fire Account Level ${account.level}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {account.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-2 rounded-full hover:bg-background/70 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-2 rounded-full hover:bg-background/70 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {account.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-primary' : 'bg-white/50'}`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="aspect-[16/9] flex items-center justify-center">
                <Info className="w-16 h-16 text-muted-foreground" />
                <p className="text-muted-foreground">No images available</p>
              </div>
            )}
          </div>
          
          {/* Account Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-block px-3 py-1 bg-muted rounded-full text-sm mb-2">
                  Platform: {account?.platform}
                </div>
                <h1 className="text-3xl font-heading font-bold">
                  Level {account?.level} Free Fire Account
                </h1>
              </div>
              
              <div className="flex items-center space-x-1 text-accent">
                <ThumbsUp className="w-5 h-5" />
                <span className="font-semibold">{account?.likes}k</span>
              </div>
            </div>
            
            <div className="text-3xl font-heading font-bold text-accent mb-6">
              ৳{account?.price.toLocaleString()}
            </div>
            
            {/* Seller info */}
            {seller && (
              <Link to={`/sellers/${seller.id}`} className="block mb-8">
                <div className="flex items-center p-4 bg-card rounded-lg hover:bg-card-hover transition-colors">
                  <img 
                    src={seller.image || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                    alt={seller.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{seller.name}</h3>
                      {seller.verified && (
                        <CheckCircle className="w-4 h-4 ml-1 text-success" />
                      )}
                    </div>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(seller.rating) ? 'text-accent' : 'text-muted'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm">{seller.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            
            {/* Account stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Level</div>
                <div className="text-xl font-semibold">{account?.level}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Likes</div>
                <div className="text-xl font-semibold">{account?.likes}k</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Diamonds</div>
                <div className="text-xl font-semibold">{account?.diamonds}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Outfits</div>
                <div className="text-xl font-semibold">{account?.outfit_count}</div>
              </div>
            </div>
            
            {/* Outfits */}
            {account?.outfits && account.outfits.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Outfits</h3>
                <div className="flex flex-wrap gap-2">
                  {account.outfits.map((outfit, index) => (
                    <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                      {outfit}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Details</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {account?.details}
              </p>
            </div>
            
            {/* Action button */}
            <Button 
              externalLink="https://m.me/mroppy69"
              className="w-full button-glow"
              size="lg"
            >
              <ShoppingCart className="mr-2" /> Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountDetails;