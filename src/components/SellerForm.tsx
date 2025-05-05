import React, { useState } from 'react';
import { useSupabase } from '../lib/supabase-provider';
import { toast } from 'sonner';
import Button from './Button';
import { Database } from '../types/supabase';

type SellerFormData = Omit<Database['public']['Tables']['sellers']['Insert'], 'id' | 'created_at'>;

interface SellerFormProps {
  initialData?: Partial<SellerFormData>;
  onSuccess: () => void;
  isEdit?: boolean;
}

const SellerForm: React.FC<SellerFormProps> = ({ 
  initialData, 
  onSuccess,
  isEdit = false
}) => {
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SellerFormData>({
    name: initialData?.name || '',
    rating: initialData?.rating || 5.0,
    verified: initialData?.verified || false,
    account_count: initialData?.account_count || 0,
    image: initialData?.image || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isEdit && initialData?.id
        ? await supabase
            .from('sellers')
            .update(formData)
            .eq('id', initialData.id)
        : await supabase
            .from('sellers')
            .insert(formData);

      if (error) throw error;
      
      toast.success(isEdit ? 'Seller updated successfully' : 'Seller created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving seller:', error);
      toast.error('Failed to save seller. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Account Count</label>
          <input
            type="number"
            name="account_count"
            value={formData.account_count}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Profile Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        {formData.image && (
          <div className="md:col-span-2">
            <p className="text-sm mb-2">Preview:</p>
            <img 
              src={formData.image} 
              alt="Profile Preview" 
              className="w-24 h-24 object-cover rounded-md"
            />
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            name="verified"
            checked={formData.verified}
            onChange={handleChange}
            className="w-4 h-4 mr-2 accent-primary"
          />
          <label htmlFor="verified" className="text-sm">
            Verified Seller
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          loading={loading}
        >
          {isEdit ? 'Update Seller' : 'Create Seller'}
        </Button>
      </div>
    </form>
  );
};

export default SellerForm;