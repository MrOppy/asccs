import { Database } from '../types/supabase';

type Account = Database['public']['Tables']['accounts']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

export const dummySellers: Seller[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Elite Gaming Store',
    rating: 4.9,
    verified: true,
    account_count: 156,
    created_at: new Date().toISOString(),
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Pro Gamer Shop',
    rating: 4.7,
    verified: true,
    account_count: 89,
    created_at: new Date().toISOString(),
    image: 'https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const dummyAccounts: Account[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    created_at: new Date().toISOString(),
    level: 75,
    likes: 2,
    platform: 'Android',
    price: 15000,
    details: 'Level 75 account with rare skins and high-tier weapons.\n\n• Multiple legendary skins\n• Rare character collections\n• High K/D ratio\n• Tournament ready account',
    seller_id: '123e4567-e89b-12d3-a456-426614174000',
    outfits: ['Dragon Warrior', 'Cyber Hunter', 'Shadow Assassin'],
    diamonds: 5000,
    featured: true,
    images: [
      'https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ]
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date().toISOString(),
    level: 65,
    likes: 1,
    platform: 'iOS',
    price: 12000,
    details: 'Level 65 account with exclusive items.\n\n• Rare weapon skins\n• Limited edition characters\n• Competitive stats\n• Perfect for serious players',
    seller_id: '123e4567-e89b-12d3-a456-426614174001',
    outfits: ['Neon Striker', 'Arctic Warrior'],
    diamonds: 3000,
    featured: false,
    images: [
      'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  }
];

export const dummyReviews: Review[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    created_at: new Date().toISOString(),
    name: 'John Doe',
    rating: 5,
    comment: 'Excellent service and smooth transaction!',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    created_at: new Date().toISOString(),
    name: 'Jane Smith',
    rating: 4,
    comment: 'Great account, exactly as described.',
    avatar: 'https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];