import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase } from '../lib/supabase-provider';
import Layout from '../components/Layout';
import Button from '../components/Button';
import AccountCard from '../components/AccountCard';
import { Database } from '../types/supabase';
import { dummyAccounts, dummySellers } from '../lib/dummy-data';
import { ChevronLeft, CheckCircle, ShieldCheck } from 'lucide-react';

type Account = Database['public']['Tables']['accounts']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

const SellerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!id) return;

      try {
        // Fetch seller details using maybeSingle() instead of single()
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (sellerError) throw sellerError;
        
        // If no seller found in database, try dummy data
        const fetchedSeller = sellerData || dummySellers.find(s => s.id === id);
        
        if (!fetchedSeller) {
          navigate('/sellers');
          return;
        }
        
        setSeller(fetchedSeller);
        
        // Fetch seller's accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('seller_id', id);
          
        if (accountsError) throw accountsError;
        
        setAccounts(accountsData?.length ? accountsData : dummyAccounts.filter(a => a.seller_id === id));
      } catch (error) {
        console.error('Error fetching seller data:', error);
        
        // Fallback to dummy data
        const dummySeller = dummySellers.find(s => s.id === id);
        
        if (!dummySeller) {
          navigate('/sellers');
          return;
        }
        
        setSeller(dummySeller);
        setAccounts(dummyAccounts.filter(a => a.seller_id === id));
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id, supabase, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!seller) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 pt-32 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Seller Not Found</h1>
          <p className="mb-6">The seller you're looking for doesn't exist or has been removed.</p>
          <Button href="/sellers">View All Sellers</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-32">
        <Button 
          href="/sellers" 
          variant="ghost" 
          className="mb-6"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <ChevronLeft className="mr-1" /> Back to Sellers
        </Button>
        
        {/* Seller Profile Header */}
        <div className="bg-card rounded-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 pt-12">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div className="relative mb-4">
                <img 
                  src={seller.image || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                  alt={seller.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
                {seller.verified && (
                  <div className="absolute bottom-0 right-0 bg-background rounded-full p-1">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-heading font-semibold flex items-center">
                {seller.name}
                {seller.verified && (
                  <span className="inline-block ml-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </h1>
              
              <div className="flex items-center mt-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(seller.rating) ? 'text-accent' : 'text-muted'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-lg">{seller.rating.toFixed(1)}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                <div className="bg-background rounded-lg p-3 text-center">
                  <div className="text-2xl font-semibold">{seller.account_count}</div>
                  <div className="text-sm text-muted-foreground">Accounts</div>
                </div>
                
                <div className="bg-background rounded-lg p-3 text-center">
                  <div className="text-2xl font-semibold">{accounts.filter(a => a.featured).length}</div>
                  <div className="text-sm text-muted-foreground">Featured</div>
                </div>
                
                <div className="bg-background rounded-lg p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <ShieldCheck className={`w-6 h-6 ${seller.verified ? 'text-success' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {seller.verified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seller's Accounts */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">
            Accounts by {seller.name}
          </h2>
          
          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {accounts.map((account, index) => (
                <AccountCard key={account.id} account={account} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-muted p-8 rounded-xl text-center">
              <p className="text-muted-foreground mb-4">This seller currently has no accounts listed.</p>
              <Button href="/accounts">Browse All Accounts</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SellerProfile;