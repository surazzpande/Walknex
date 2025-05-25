import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Rating,
  Tooltip,
  Box,
  Chip
} from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 3,
          boxShadow: 3,
          transition: 'box-shadow 0.3s',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#fff',
        }}
        elevation={3}
      >
        <Box component={Link} to={`/product/${product.id}`} sx={{ position: 'relative', display: 'block' }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              width: '100%',
              height: { xs: 180, sm: 220 },
              objectFit: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              transition: 'transform 0.4s',
              '&:hover': { transform: 'scale(1.04)' },
              background: '#f3f4f6'
            }}
          />
          <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
            <IconButton
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleToggleWishlist}
              sx={{
                position: 'absolute',
                top: 14,
                right: 14,
                bgcolor: 'rgba(255,255,255,0.92)',
                '&:hover': { bgcolor: 'grey.100' },
                zIndex: 2,
              }}
              size="medium"
            >
              {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          {!product.inStock && (
            <Chip
              label="Out of Stock"
              color="error"
              sx={{
                position: 'absolute',
                top: 18,
                left: 18,
                fontWeight: 700,
                zIndex: 2,
              }}
              size="small"
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography
            variant="subtitle1"
            component={Link}
            to={`/product/${product.id}`}
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '1.1rem'
            }}
          >
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} readOnly precision={0.5} size="small" />
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              ({product.reviews})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)} &bull; {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1 }}>
            £{product.price.toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={!product.inStock}
            sx={{ fontWeight: 600, borderRadius: 2, py: 1.2, flex: 1 }}
            aria-label="Add to cart"
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ProductCard;