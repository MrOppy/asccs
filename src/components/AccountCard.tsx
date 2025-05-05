import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';
import { Database } from '../types/supabase';

type Account = Database['public']['Tables']['accounts']['Row'];

interface AccountCardProps {
  account: Account;
  index: number;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card-hover rounded-xl bg-card overflow-hidden relative"
    >
      <Link to={`/accounts/${account.id}`}>
        <div className="relative aspect-[16/9]">
          <img 
            src={account.images[0]} 
            alt={`Free Fire Account Level ${account.level}`}
            className="w-full h-full object-cover"
          />
          {account.featured && (
            <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          {account.sold && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
              <span className="text-white font-bold text-xl">SOLD</span>
            </div>
          )}
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="font-heading text-lg font-semibold">Level {account.level}</div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4 text-accent" />
              <span>{account.likes}k</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Diamonds:</span> {account.diamonds}
            </div>
            <div className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Platform:</span> {account.platform}
            </div>
            <div className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Outfit Count:</span> {account.outfit_count}
            </div>
            <div className="text-sm text-muted-foreground">
              {account.outfits?.join(', ')}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-heading font-bold text-accent">
              ৳{account.price.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AccountCard;