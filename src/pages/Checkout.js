import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const steps = ['Shipping', 'Payment', 'Review'];
  const shippingCost = totalPrice > 50 ? 0 : 4.99;
  const finalTotal = totalPrice + shippingCost;
  
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (Object.values(shippingInfo).some(value => !value)) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setActiveStep(1);
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setActiveStep(2);
  };
  
  const handleOrderSubmit = async () => {
    try {
      // Here you would typically make an API call to process the order
      clearCart();
      navigate('/profile', { 
        state: { 
          orderSuccess: true,
          orderId: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
      });
    } catch (err) {
      setError('Failed to process order. Please try again.');
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleShippingSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Postcode"
                  value={shippingInfo.postcode}
                  onChange={(e) => setShippingInfo({...shippingInfo, postcode: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="mt-6"
            >
              Continue to Payment
            </Button>
          </form>
        );
      
      case 1:
        return (
          <form onSubmit={handlePaymentSubmit}>
            <FormControl component="fieldset" className="mb-6">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel 
                  value="card" 
                  control={<Radio />} 
                  label="Credit/Debit Card"
                />
                <FormControlLabel 
                  value="paypal" 
                  control={<Radio />} 
                  label="PayPal"
                />
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'card' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="CVV"
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="mt-6"
            >
              Continue to Review
            </Button>
          </form>
        );
      
      case 2:
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Paper className="p-4 mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body2">
                {shippingInfo.firstName} {shippingInfo.lastName}
                <br />
                {shippingInfo.address}
                <br />
                {shippingInfo.city}, {shippingInfo.postcode}
                <br />
                {shippingInfo.phone}
                <br />
                {shippingInfo.email}
              </Typography>
            </Paper>
            
            <Paper className="p-4 mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Payment Method
              </Typography>
              <Typography variant="body2">
                {paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}
              </Typography>
            </Paper>
            
            <Paper className="p-4 mb-6">
              <Typography variant="subtitle1" gutterBottom>
                Items
              </Typography>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between mb-2">
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    £{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </div>
              ))}
              <Divider className="my-2" />
              <div className="flex justify-between mb-2">
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">
                  {shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}
                </Typography>
              </div>
              <div className="flex justify-between font-bold">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">
                  £{finalTotal.toFixed(2)}
                </Typography>
              </div>
            </Paper>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleOrderSubmit}
            >
              Place Order
            </Button>
          </div>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
            Checkout
          </Typography>
          
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Paper className="p-6 rounded-lg">
                <Stepper activeStep={activeStep} className="mb-8">
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                {getStepContent(activeStep)}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper className="p-6 rounded-lg sticky top-24">
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <Typography variant="body2">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      £{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </div>
                ))}
                
                <Divider className="my-4" />
                
                <div className="flex justify-between mb-2">
                  <Typography>Subtotal</Typography>
                  <Typography>£{totalPrice.toFixed(2)}</Typography>
                </div>
                
                <div className="flex justify-between mb-2">
                  <Typography>Shipping</Typography>
                  <Typography>
                    {shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}
                  </Typography>
                </div>
                
                <Divider className="my-4" />
                
                <div className="flex justify-between font-bold">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    £{finalTotal.toFixed(2)}
                  </Typography>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;