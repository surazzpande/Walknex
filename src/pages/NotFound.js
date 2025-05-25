import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typography, Button, Box } from '@mui/material';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            className="text-9xl font-bold text-primary-500"
          >
            404
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            className="mt-6 mb-4 font-bold"
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            className="max-w-md mx-auto mb-8 text-gray-600"
          >
            We couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
          </Typography>
          
          <Box className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              component={Link} 
              to="/" 
              variant="contained" 
              color="primary" 
              size="large"
              className="px-8"
            >
              Back to Home
            </Button>
            
            <Button 
              component={Link} 
              to="/shop" 
              variant="outlined" 
              color="primary" 
              size="large"
              className="px-8"
            >
              Browse Shop
            </Button>
          </Box>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;