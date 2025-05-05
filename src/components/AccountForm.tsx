import React, { useState } from 'react';
import { useSupabase } from '../lib/supabase-provider';
import { toast } from 'sonner';
import { Plus, Trash2, Upload } from 'lucide-react';
import Button from './Button';
import { Database } from '../types/supabase';

type Seller = Database['public']['Tables']['sellers']['Row'];
type AccountFormData = Omit<Database['public']['Tables']['accounts']['Insert'], 'id' | 'created_at'>;

interface AccountFormProps {
  initialData?: Partial<AccountFormData>;
  sellers: Seller[];
  onSuccess: () => void;
  isEdit?: boolean;
}

const AccountForm: React.FC<AccountFormProps> = ({ 
  initialData, 
  sellers, 
  onSuccess,
  isEdit = false
}) => {
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AccountFormData>({
    level: initialData?.level || 0,
    likes: initialData?.likes || 0,
    platform: initialData?.platform || 'Facebook',
    price: initialData?.price || 0,
    details: initialData?.details || '',
    seller_id: initialData?.seller_id || (sellers[0]?.id || ''),
    outfits: initialData?.outfits || [],
    outfit_count: initialData?.outfit_count || 0,
    diamonds: initialData?.diamonds || 0,
    featured: initialData?.featured || false,
    images: initialData?.images || [],
    sold: initialData?.sold || false
  });
  const [outfit, setOutfit] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val;
    
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      val = name === 'likes' ? parseInt(value, 10) : parseFloat(value);
    } else {
      val = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleAddOutfit = () => {
    if (outfit.trim()) {
      setFormData(prev => ({
        ...prev,
        outfits: [...(prev.outfits || []), outfit.trim()]
      }));
      setOutfit('');
    }
  };

  const handleRemoveOutfit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outfits: prev.outfits?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isEdit && initialData?.id
        ? await supabase
            .from('accounts')
            .update(formData)
            .eq('id', initialData.id)
        : await supabase
            .from('accounts')
            .insert({
              ...formData,
              seller_id: formData.seller_id
            });

      if (error) throw error;

      // Update seller's account count
      if (!isEdit) {
        const { data: seller } = await supabase
          .from('sellers')
          .select('account_count')
          .eq('id', formData.seller_id)
          .single();

        if (seller) {
          await supabase
            .from('sellers')
            .update({ account_count: (seller.account_count || 0) + 1 })
            .eq('id', formData.seller_id);
        }
      }
      
      toast.success(isEdit ? 'Account updated successfully' : 'Account created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving account:', error);
      toast.error('Failed to save account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <input
            type="number"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Likes (in thousands)</label>
          <input
            type="number"
            name="likes"
            value={formData.likes}
            onChange={handleChange}
            step="1"
            min="0"
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="Facebook">Facebook</option>
            <option value="Gmail">Gmail</option>
            <option value="VK">VK</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price (BDT)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Diamonds</label>
          <input
            type="number"
            name="diamonds"
            value={formData.diamonds}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Seller</label>
          <select
            name="seller_id"
            value={formData.seller_id}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Outfit Count</label>
          <input
            type="number"
            name="outfit_count"
            value={formData.outfit_count}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Outfit Tags</label>
            <span className="text-xs text-muted-foreground">
              {formData.outfits?.length || 0} tags added
            </span>
          </div>
          
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={outfit}
              onChange={e => setOutfit(e.target.value)}
              placeholder="Add outfit tag"
              className="flex-1 px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              type="button" 
              onClick={handleAddOutfit}
              variant="secondary"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Tag
            </Button>
          </div>
          
          {formData.outfits && formData.outfits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.outfits.map((item, index) => (
                <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
                  <span className="text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOutfit(index)}
                    className="ml-2 text-muted-foreground hover:text-error"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Images</label>
            <span className="text-xs text-muted-foreground">
              {formData.images?.length || 0} images added
            </span>
          </div>
          
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              type="button" 
              onClick={handleAddImage}
              variant="secondary"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group aspect-[16/9]">
                  <img 
                    src={url} 
                    alt={`Account image ${index + 1}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-background/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 mr-2 accent-primary"
          />
          <label htmlFor="featured" className="text-sm">
            Mark as featured account
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="sold"
            name="sold"
            checked={formData.sold}
            onChange={handleChange}
            className="w-4 h-4 mr-2 accent-primary"
          />
          <label htmlFor="sold" className="text-sm">
            Mark as sold
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
          {isEdit ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;