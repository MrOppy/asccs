import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Database } from '../types/supabase';

type Seller = Database['public']['Tables']['sellers']['Row'];

interface SellerCardProps {
  seller: Seller;
  index: number;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card-hover rounded-xl bg-card overflow-hidden"
    >
      <Link to={`/sellers/${seller.id}`}>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img 
              src={seller.image || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
              alt={seller.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />
            {seller.verified && (
              <CheckCircle className="absolute bottom-0 right-0 w-6 h-6 text-success bg-background rounded-full p-1" />
            )}
          </div>
          
          <h3 className="font-heading text-lg font-semibold flex items-center justify-center space-x-1">
            <span>{seller.name}</span>
            {seller.verified && (
              <span className="inline-block ml-1">
                <CheckCircle className="w-4 h-4 text-success" />
              </span>
            )}
          </h3>
          
          <div className="mt-2 flex items-center justify-center">
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
          
          <div className="mt-4 px-4 py-2 bg-muted rounded-full text-sm">
            {seller.account_count} Accounts
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SellerCard;