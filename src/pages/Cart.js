import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Typography,
  Button,
  IconButton,
  Divider,
  Paper,
  Grid,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  ArrowBack,
  LocalShipping,
  Discount,
  Lock,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [clearCartDialog, setClearCartDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const shippingCost = totalPrice > 50 ? 0 : 4.99;
  const discountAmount = couponApplied ? totalPrice * (couponDiscount / 100) : 0;
  const finalTotal = totalPrice + shippingCost - discountAmount;

  const handleQuantityChange = (productId, newQuantity, size) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity, size);
  };

  const handleRemoveItem = (productId, size) => {
    removeFromCart(productId, size);
    setSnackbarMessage('Item removed from cart');
    setSnackbarOpen(true);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setCouponApplied(true);
      setCouponDiscount(10);
      setCouponError('');
      setSnackbarMessage('Coupon applied: 10% discount');
      setSnackbarOpen(true);
    } else if (couponCode.toUpperCase() === 'SUMMER20') {
      setCouponApplied(true);
      setCouponDiscount(20);
      setCouponError('');
      setSnackbarMessage('Coupon applied: 20% discount');
      setSnackbarOpen(true);
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setClearCartDialog(false);
    setSnackbarMessage('Cart cleared');
    setSnackbarOpen(true);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <Box className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CartIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 6, py: 1.5, fontWeight: 600 }}
          >
            Start Shopping
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box className="bg-gray-50 py-12">
      <Box className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
            Your Shopping Cart <Typography variant="subtitle1" component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>({totalItems} {totalItems === 1 ? 'item' : 'items'})</Typography>
          </Typography>

          <Grid container spacing={6}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                {/* Cart Header - Desktop */}
                <Box className="hidden md:grid md:grid-cols-12 text-gray-500 mb-4 font-medium">
                  <Box className="col-span-6"><Typography variant="subtitle2">Product</Typography></Box>
                  <Box className="col-span-2 text-center"><Typography variant="subtitle2">Price</Typography></Box>
                  <Box className="col-span-2 text-center"><Typography variant="subtitle2">Quantity</Typography></Box>
                  <Box className="col-span-2 text-right"><Typography variant="subtitle2">Subtotal</Typography></Box>
                </Box>
                <Divider className="hidden md:block mb-4" />

                {/* Cart Items */}
                {cartItems.map((item, index) => (
                  <Box key={`${item.id}-${item.size || 'default'}`}>
                    {/* Mobile View */}
                    <Box className="md:hidden mb-6">
                      <Card elevation={1} sx={{ display: 'flex', mb: 2, borderRadius: 2 }}>
                        <CardMedia
                          component={LazyLoadImage}
                          image={item.image}
                          alt={item.name}
                          effect="blur"
                          sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2, m: 1 }}
                        />
                        <CardContent sx={{ flex: 1, py: 1, px: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          {item.size && (
                            <Typography variant="body2" color="textSecondary">
                              Size: UK {item.size}
                            </Typography>
                          )}
                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            £{item.price.toFixed(2)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Tooltip title="Decrease quantity">
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size)}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Typography sx={{ px: 1 }}>{item.quantity}</Typography>
                            <Tooltip title="Increase quantity">
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size)}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove item">
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveItem(item.id, item.size)}
                                sx={{ ml: 1 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                      <Box className="flex justify-between mt-2">
                        <Typography variant="body2" color="textSecondary">
                          Subtotal:
                        </Typography>
                        <Typography variant="subtitle2">
                          £{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                      {index < cartItems.length - 1 && <Divider className="my-4" />}
                    </Box>

                    {/* Desktop View */}
                    <Box className="hidden md:grid md:grid-cols-12 md:items-center py-4">
                      <Box className="col-span-6 flex items-center">
                        <CardMedia
                          component={LazyLoadImage}
                          image={item.image}
                          alt={item.name}
                          effect="blur"
                          sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          {item.size && (
                            <Typography variant="body2" color="textSecondary">
                              Size: UK {item.size}
                            </Typography>
                          )}
                          <Button
                            startIcon={<DeleteIcon />}
                            color="error"
                            size="small"
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            sx={{ mt: 1, textTransform: 'none' }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                      <Box className="col-span-2 text-center">
                        <Typography>£{item.price.toFixed(2)}</Typography>
                      </Box>
                      <Box className="col-span-2 flex justify-center">
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                          <Tooltip title="Decrease quantity">
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size)}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Typography sx={{ px: 2 }}>{item.quantity}</Typography>
                          <Tooltip title="Increase quantity">
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size)}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box className="col-span-2 text-right">
                        <Typography variant="subtitle2">
                          £{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    {index < cartItems.length - 1 && <Divider className="hidden md:block" />}
                  </Box>
                ))}

                <Divider sx={{ my: 4 }} />

                {/* Cart Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Button
                    component={Link}
                    to="/shop"
                    startIcon={<ArrowBack />}
                    color="primary"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => setClearCartDialog(true)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Clear Cart
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Order Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">£{totalPrice.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Shipping</Typography>
                    <Typography variant="body1">
                      {shippingCost === 0 ? (
                        <span>
                          Free <LocalShipping fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5 }} />
                        </span>
                      ) : (
                        `£${shippingCost.toFixed(2)}`
                      )}
                    </Typography>
                  </Box>
                  {couponApplied && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main', mb: 1 }}>
                      <Typography variant="body1">
                        Discount <Discount fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5 }} /> ({couponDiscount}%)
                      </Typography>
                      <Typography variant="body1">-£{discountAmount.toFixed(2)}</Typography>
                    </Box>
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    £{finalTotal.toFixed(2)}
                  </Typography>
                </Box>
                {/* Coupon Code */}
                <form onSubmit={handleCouponSubmit} style={{ marginBottom: 24 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Apply Coupon Code
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      variant="outlined"
                      placeholder="Enter code"
                      size="small"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      error={!!couponError}
                      helperText={couponError}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!couponCode}
                      sx={{ fontWeight: 600 }}
                    >
                      Apply
                    </Button>
                  </Box>
                </form>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                  sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 2 }}
                >
                  Proceed to Checkout
                </Button>
                <Box sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                  <Lock fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  <Typography variant="body2" display="inline">
                    Secure Checkout
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        {/* Clear Cart Dialog */}
        <Dialog
          open={clearCartDialog}
          onClose={() => setClearCartDialog(false)}
        >
          <DialogTitle>Clear Shopping Cart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove all items from your shopping cart? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearCartDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClearCart} color="error" variant="contained">
              Clear Cart
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Cart;