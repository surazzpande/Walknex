import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create Wishlist Context
const WishlistContext = createContext();

// Custom hook to use wishlist context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { currentUser } = useAuth();

  // Load wishlist from localStorage on initial render or user change
  useEffect(() => {
    const loadWishlist = () => {
      if (currentUser) {
        // If user is logged in, load their wishlist
        const userId = currentUser.uid;
        const storedWishlist = localStorage.getItem(`wishlist-${userId}`);
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        } else {
          setWishlistItems([]);
        }
      } else {
        // If no user is logged in, clear wishlist
        setWishlistItems([]);
      }
    };

    loadWishlist();
  }, [currentUser]);

  // Update localStorage when wishlist changes
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      localStorage.setItem(`wishlist-${userId}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, currentUser]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      // Check if product already exists in wishlist
      const exists = prevItems.some(item => item.id === product.id);
      
      if (!exists) {
        return [...prevItems, product];
      }
      
      return prevItems;
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Context value
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};