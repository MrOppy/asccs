import React, { useEffect, useState } from 'react';
import { useSupabase } from '../lib/supabase-provider';
import Layout from '../components/Layout';
import SellerCard from '../components/SellerCard';
import Button from '../components/Button';
import { Database } from '../types/supabase';
import { dummySellers } from '../lib/dummy-data';
import { Search, Users } from 'lucide-react';

type Seller = Database['public']['Tables']['sellers']['Row'];

const Sellers: React.FC = () => {
  const { supabase } = useSupabase();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('sellers')
          .select('*')
          .order('rating', { ascending: false });
          
        if (error) throw error;
        
        setSellers(data?.length ? data : dummySellers);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        setSellers(dummySellers);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [supabase]);

  // Filter sellers based on search term
  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Our <span className="gradient-text">Trusted Sellers</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Meet our verified sellers who provide high-quality Free Fire accounts with excellent customer service
          </p>
          <Button 
            href="/sell-account"
            size="lg"
            className="button-glow"
          >
            Become a Seller
          </Button>
        </div>
        
        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* Seller count */}
        <div className="mb-6 text-center text-muted-foreground flex items-center justify-center">
          <Users className="w-4 h-4 mr-2" />
          {filteredSellers.length} sellers available
        </div>
        
        {/* Sellers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredSellers.map((seller, index) => (
              <SellerCard key={seller.id} seller={seller} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No sellers match your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sellers;