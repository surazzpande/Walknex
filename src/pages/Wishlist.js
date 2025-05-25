import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Button, 
  Grid, 
  IconButton 
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <Typography variant="h5" gutterBottom>
            Please log in to view your wishlist
          </Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary"
            className="mt-4"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Button 
            component={Link} 
            to="/shop" 
            variant="contained" 
            color="primary"
            className="mt-4"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Typography variant="h4" component="h1" className="font-bold mb-8">
          My Wishlist ({wishlistItems.length} items)
        </Typography>

        <Grid container spacing={4}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/product/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${item.id}`}>
                      <Typography variant="h6" className="font-medium mb-2">
                        {item.name}
                      </Typography>
                    </Link>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      {item.category}
                    </Typography>
                    <div className="flex justify-between items-center">
                      <Typography variant="h6" color="primary">
                        £{item.price.toFixed(2)}
                      </Typography>
                      <IconButton 
                        onClick={() => removeFromWishlist(item.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Wishlist;