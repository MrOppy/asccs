import React, { useEffect, useState } from 'react';
import { useSupabase } from '../lib/supabase-provider';
import Layout from '../components/Layout';
import AccountCard from '../components/AccountCard';
import { Database } from '../types/supabase';
import { dummyAccounts } from '../lib/dummy-data';
import { Search, Filter, ChevronDown } from 'lucide-react';

type Account = Database['public']['Tables']['accounts']['Row'];

const Accounts: React.FC = () => {
  const { supabase } = useSupabase();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [levelRange, setLevelRange] = useState<[number, number]>([0, 150]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let query = supabase.from('accounts').select('*');
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setAccounts(data?.length ? data : dummyAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAccounts(dummyAccounts);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [supabase]);

  const filteredAccounts = accounts
    .filter(account => {
      if (searchTerm && !account.details.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !(`level ${account.level}`).includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      if (account.price < priceRange[0] || account.price > priceRange[1]) {
        return false;
      }
      
      if (account.level < levelRange[0] || account.level > levelRange[1]) {
        return false;
      }
      
      if (platformFilter !== 'all' && account.platform !== platformFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'level-high':
          return b.level - a.level;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-32">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          Browse <span className="gradient-text">Free Fire Accounts</span>
        </h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="level-high">Highest Level</option>
              </select>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 rounded-lg bg-muted border border-border hover:bg-card transition-colors"
              >
                <Filter className="mr-2 w-4 h-4" />
                Filters
                <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {isFilterOpen && (
            <div className="p-4 rounded-lg bg-card border border-border mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range (BDT)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-1.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full px-3 py-1.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Level Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={levelRange[0]}
                      onChange={(e) => setLevelRange([parseInt(e.target.value), levelRange[1]])}
                      className="w-full px-3 py-1.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={levelRange[1]}
                      onChange={(e) => setLevelRange([levelRange[0], parseInt(e.target.value)])}
                      className="w-full px-3 py-1.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Platforms</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Gmail">Gmail</option>
                    <option value="VK">VK</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6 text-muted-foreground">
          Showing {filteredAccounts.length} accounts
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAccounts.map((account, index) => (
              <AccountCard key={account.id} account={account} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No accounts match your filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Accounts;