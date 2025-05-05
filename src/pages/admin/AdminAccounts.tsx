import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../lib/supabase-provider';
import { toast } from 'sonner';
import AdminLayout from './components/AdminLayout';
import Button from '../../components/Button';
import AccountForm from '../../components/AccountForm';
import { Database } from '../../types/supabase';
import { dummyAccounts, dummySellers } from '../../lib/dummy-data';
import { Plus, Edit2, Trash2, Search, Filter, ChevronDown } from 'lucide-react';

type Account = Database['public']['Tables']['accounts']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

const AdminAccounts: React.FC = () => {
  const { supabase } = useSupabase();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBySeller, setFilterBySeller] = useState<string>('all');
  const [filterByFeatured, setFilterByFeatured] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (accountsError) throw accountsError;
        
        // Fetch sellers
        const { data: sellersData, error: sellersError } = await supabase
          .from('sellers')
          .select('*');
          
        if (sellersError) throw sellersError;

        setAccounts(accountsData?.length ? accountsData : dummyAccounts);
        setSellers(sellersData?.length ? sellersData : dummySellers);
      } catch (error) {
        console.error('Error fetching accounts and sellers:', error);
        setAccounts(dummyAccounts);
        setSellers(dummySellers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const { error } = await supabase
          .from('accounts')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setAccounts(accounts.filter(account => account.id !== id));
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAccount(null);
    
    // Refresh accounts list
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    
    fetchAccounts();
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    // Search term filter
    if (searchTerm && !`level ${account.level}`.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !account.details.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Seller filter
    if (filterBySeller !== 'all' && account.seller_id !== filterBySeller) {
      return false;
    }
    
    // Featured filter
    if (filterByFeatured === 'featured' && !account.featured) {
      return false;
    } else if (filterByFeatured === 'not-featured' && account.featured) {
      return false;
    }
    
    return true;
  });

  const getSellerName = (sellerId: string) => {
    const seller = sellers.find(s => s.id === sellerId);
    return seller ? seller.name : 'Unknown';
  };

  return (
    <AdminLayout>
      {showForm ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold">
              {editingAccount ? 'Edit Account' : 'Add New Account'}
            </h1>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
          
          <AccountForm
            initialData={editingAccount || undefined}
            sellers={sellers}
            onSuccess={handleFormSuccess}
            isEdit={!!editingAccount}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold">
              Manage Accounts
            </h1>
            <Button onClick={handleAddAccount}>
              <Plus className="w-4 h-4 mr-2" /> Add Account
            </Button>
          </div>
          
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
              >
                <Filter className="mr-2 w-4 h-4" />
                Filters
                <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {isFilterOpen && (
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Filter by Seller</label>
                    <select
                      value={filterBySeller}
                      onChange={(e) => setFilterBySeller(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">All Sellers</option>
                      {sellers.map(seller => (
                        <option key={seller.id} value={seller.id}>{seller.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Status</label>
                    <select
                      value={filterByFeatured}
                      onChange={(e) => setFilterByFeatured(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">All Accounts</option>
                      <option value="featured">Featured Only</option>
                      <option value="not-featured">Not Featured</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Accounts Table */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredAccounts.length > 0 ? (
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Level</th>
                      <th className="px-4 py-3 text-left">Platform</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Seller</th>
                      <th className="px-4 py-3 text-left">Featured</th>
                      <th className="px-4 py-3 text-left">Date Added</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account, index) => (
                      <tr key={account.id} className={index % 2 === 0 ? 'bg-background' : ''}>
                        <td className="px-4 py-3 font-medium">Level {account.level}</td>
                        <td className="px-4 py-3">{account.platform}</td>
                        <td className="px-4 py-3">৳{account.price.toLocaleString()}</td>
                        <td className="px-4 py-3">{getSellerName(account.seller_id)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${account.featured ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                            {account.featured ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(account.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleEditAccount(account)}
                              className="p-1 text-muted-foreground hover:text-primary"
                              aria-label="Edit account"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAccount(account.id)}
                              className="p-1 text-muted-foreground hover:text-error"
                              aria-label="Delete account"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-4">No accounts match your filters.</p>
              <Button onClick={handleAddAccount}>
                <Plus className="w-4 h-4 mr-2" /> Add Account
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminAccounts;