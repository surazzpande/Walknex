import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from 'react-icons/fa';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email) {
      setSnackbarMessage('Please enter your email address');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Mock successful subscription
    setSnackbarMessage('Thanks for subscribing! Check your inbox for updates.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setEmail('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-secondary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <Grid container spacing={6}>
          {/* Logo and About */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="text-2xl font-bold mb-4">
              Walknex
            </Typography>
            <Typography variant="body2" className="text-gray-300 mb-6">
              Elevate your style with premium footwear from around the world. Our curated collection combines comfort, durability, and cutting-edge design.
            </Typography>
            <div className="flex space-x-4">
              <IconButton color="inherit" aria-label="Facebook" size="small">
                <FaFacebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" size="small">
                <FaTwitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" size="small">
                <FaInstagram />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube" size="small">
                <FaYoutube />
              </IconButton>
              <IconButton color="inherit" aria-label="Pinterest" size="small">
                <FaPinterest />
              </IconButton>
            </div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className="text-lg font-semibold mb-4">
              Shop
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/men" className="text-gray-300 hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop/women" className="text-gray-300 hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop/kids" className="text-gray-300 hover:text-white transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/shop/new-arrivals" className="text-gray-300 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop/sale" className="text-gray-300 hover:text-white transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className="text-lg font-semibold mb-4">
              Support
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-300 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="text-lg font-semibold mb-4">
              Stay Updated
            </Typography>
            <Typography variant="body2" className="text-gray-300 mb-4">
              Subscribe to our newsletter for exclusive offers, new arrivals, and insider-only discounts.
            </Typography>
            <form onSubmit={handleSubscribe} className="flex">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Your email address"
                value={email}
                onChange={handleEmailChange}
                className="flex-grow"
                InputProps={{
                  className: "bg-white rounded-l-md rounded-r-none text-black",
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                className="rounded-l-none"
              >
                Subscribe
              </Button>
            </form>
          </Grid>
        </Grid>

        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Typography variant="body2" className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Walknex. All rights reserved.
          </Typography>
          <div className="flex space-x-4 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <IconButton
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 md:bottom-10 md:right-10 bg-primary-500 text-white hover:bg-primary-600 shadow-lg"
        aria-label="Back to top"
      >
        <KeyboardArrowUpIcon />
      </IconButton>
      
      {/* Snackbar for newsletter */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </footer>
  );
};

export default Footer;