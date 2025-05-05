import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../lib/supabase-provider';
import AdminLayout from './components/AdminLayout';
import { Database } from '../../types/supabase';
import { dummyAccounts, dummySellers } from '../../lib/dummy-data';
import { Users, ShoppingBag, PieChart, TrendingUp } from 'lucide-react';

type Account = Database['public']['Tables']['accounts']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

const AdminDashboard: React.FC = () => {
  const { supabase } = useSupabase();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*');
          
        if (accountsError) throw accountsError;
        
        // Fetch sellers
        const { data: sellersData, error: sellersError } = await supabase
          .from('sellers')
          .select('*');
          
        if (sellersError) throw sellersError;

        setAccounts(accountsData?.length ? accountsData : dummyAccounts);
        setSellers(sellersData?.length ? sellersData : dummySellers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setAccounts(dummyAccounts);
        setSellers(dummySellers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Calculate statistics
  const totalAccounts = accounts.length;
  const featuredAccounts = accounts.filter(a => a.featured).length;
  const totalSellers = sellers.length;
  const verifiedSellers = sellers.filter(s => s.verified).length;
  
  // Calculate total value (sum of all account prices)
  const totalValue = accounts.reduce((sum, account) => sum + account.price, 0);
  
  // Get recent accounts (last 5)
  const recentAccounts = [...accounts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const stats = [
    {
      name: 'Total Accounts',
      value: totalAccounts,
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      color: 'from-primary/20 to-primary/5'
    },
    {
      name: 'Featured Accounts',
      value: featuredAccounts,
      icon: <TrendingUp className="w-8 h-8 text-accent" />,
      color: 'from-accent/20 to-accent/5'
    },
    {
      name: 'Total Sellers',
      value: totalSellers,
      icon: <Users className="w-8 h-8 text-secondary" />,
      color: 'from-secondary/20 to-secondary/5'
    },
    {
      name: 'Total Value',
      value: `৳${totalValue.toLocaleString()}`,
      icon: <PieChart className="w-8 h-8 text-success" />,
      color: 'from-success/20 to-success/5'
    }
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold mb-6">
        Dashboard
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${stat.color} border border-border rounded-xl p-6`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground mb-1">{stat.name}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="p-2 bg-card rounded-lg">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Recent Accounts */}
          <div className="mb-8">
            <h2 className="text-xl font-heading font-semibold mb-4">Recent Accounts</h2>
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Level</th>
                      <th className="px-4 py-3 text-left">Platform</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Featured</th>
                      <th className="px-4 py-3 text-left">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAccounts.map((account, index) => (
                      <tr key={account.id} className={index % 2 === 0 ? 'bg-background' : ''}>
                        <td className="px-4 py-3 font-medium">Level {account.level}</td>
                        <td className="px-4 py-3">{account.platform}</td>
                        <td className="px-4 py-3">৳{account.price.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${account.featured ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                            {account.featured ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(account.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Seller Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">Seller Overview</h2>
              <div className="bg-card rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-muted-foreground text-sm mb-1">Total Sellers</p>
                    <p className="text-2xl font-bold">{totalSellers}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-muted-foreground text-sm mb-1">Verified Sellers</p>
                    <p className="text-2xl font-bold">{verifiedSellers}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm font-medium">Verification Rate</p>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" 
                      style={{ width: `${totalSellers ? (verifiedSellers / totalSellers) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-muted-foreground">
                    {totalSellers ? Math.round((verifiedSellers / totalSellers) * 100) : 0}% of sellers are verified
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">Top Sellers</h2>
              <div className="bg-card rounded-xl p-6">
                <div className="space-y-4">
                  {sellers
                    .sort((a, b) => b.account_count - a.account_count)
                    .slice(0, 5)
                    .map((seller) => (
                      <div key={seller.id} className="flex items-center">
                        <img 
                          src={seller.image || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                          alt={seller.name}
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="font-medium">{seller.name}</p>
                            {seller.verified && (
                              <span className="ml-2 text-success">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{seller.account_count} accounts</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
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
                          </div>
                          <p className="text-sm text-accent">{seller.rating.toFixed(1)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;