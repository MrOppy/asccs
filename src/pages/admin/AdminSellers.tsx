import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../lib/supabase-provider';
import { toast } from 'sonner';
import AdminLayout from './components/AdminLayout';
import Button from '../../components/Button';
import SellerForm from '../../components/SellerForm';
import { Database } from '../../types/supabase';
import { dummySellers } from '../../lib/dummy-data';
import { Plus, Edit2, Trash2, Search, CheckCircle } from 'lucide-react';

type Seller = Database['public']['Tables']['sellers']['Row'];

const AdminSellers: React.FC = () => {
  const { supabase } = useSupabase();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByVerified, setFilterByVerified] = useState<string>('all');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('sellers')
          .select('*')
          .order('created_at', { ascending: false });
          
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

  const handleAddSeller = () => {
    setEditingSeller(null);
    setShowForm(true);
  };

  const handleEditSeller = (seller: Seller) => {
    setEditingSeller(seller);
    setShowForm(true);
  };

  const handleDeleteSeller = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this seller? All associated accounts will be affected.')) {
      try {
        const { error } = await supabase
          .from('sellers')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setSellers(sellers.filter(seller => seller.id !== id));
        toast.success('Seller deleted successfully');
      } catch (error) {
        console.error('Error deleting seller:', error);
        toast.error('Failed to delete seller');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSeller(null);
    
    // Refresh sellers list
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('sellers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setSellers(data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };
    
    fetchSellers();
  };

  // Filter sellers
  const filteredSellers = sellers.filter(seller => {
    // Search term filter
    if (searchTerm && !seller.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Verified filter
    if (filterByVerified === 'verified' && !seller.verified) {
      return false;
    } else if (filterByVerified === 'unverified' && seller.verified) {
      return false;
    }
    
    return true;
  });

  return (
    <AdminLayout>
      {showForm ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold">
              {editingSeller ? 'Edit Seller' : 'Add New Seller'}
            </h1>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
          
          <SellerForm
            initialData={editingSeller || undefined}
            onSuccess={handleFormSuccess}
            isEdit={!!editingSeller}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold">
              Manage Sellers
            </h1>
            <Button onClick={handleAddSeller}>
              <Plus className="w-4 h-4 mr-2" /> Add Seller
            </Button>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={filterByVerified}
              onChange={(e) => setFilterByVerified(e.target.value)}
              className="px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Sellers</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
          
          {/* Sellers Table */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredSellers.length > 0 ? (
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Seller</th>
                      <th className="px-4 py-3 text-left">Rating</th>
                      <th className="px-4 py-3 text-left">Accounts</th>
                      <th className="px-4 py-3 text-left">Verified</th>
                      <th className="px-4 py-3 text-left">Date Added</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSellers.map((seller, index) => (
                      <tr key={seller.id} className={index % 2 === 0 ? 'bg-background' : ''}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img 
                              src={seller.image || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                              alt={seller.name}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                            <span className="font-medium">{seller.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <svg 
                              className="w-4 h-4 text-accent mr-1"
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{seller.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{seller.account_count}</td>
                        <td className="px-4 py-3">
                          {seller.verified ? (
                            <div className="flex items-center text-success">
                              <CheckCircle className="w-5 h-5 mr-1" />
                              <span>Yes</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(seller.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleEditSeller(seller)}
                              className="p-1 text-muted-foreground hover:text-primary"
                              aria-label="Edit seller"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSeller(seller.id)}
                              className="p-1 text-muted-foreground hover:text-error"
                              aria-label="Delete seller"
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
              <p className="text-muted-foreground mb-4">No sellers match your filters.</p>
              <Button onClick={handleAddSeller}>
                <Plus className="w-4 h-4 mr-2" /> Add Seller
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminSellers;