import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Grid, Divider, Box, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { getMockProducts } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  
  useEffect(() => {
    const products = getMockProducts();
    setFeaturedProducts(products.slice(0, 4));
    setNewArrivals(products.slice(4, 8));
  }, []);
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      }
    ]
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      } 
    }
  };

  return (
    <div>
      <Hero />
      
      <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 6 }}>
        <Typography variant="h3" component="h2" fontWeight={800} textAlign="center" mb={4}>
          Shop by Category
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              label: 'Men',
              value: 'men',
              image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
              description: "Explore the latest in men's footwear.",
            },
            {
              label: 'Women',
              value: 'women',
              image: 'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg',
              description: "Discover stylish shoes for women.",
            },
            {
              label: 'Kids',
              value: 'kids',
              image: 'https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg',
              description: "Fun and durable shoes for kids.",
            },
          ].map((cat) => (
            <Grid item xs={12} sm={4} key={cat.value}>
              <Card
                component={Link}
                to={`/shop/${cat.value}`}
                sx={{
                  textDecoration: 'none',
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: 6,
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  <CardMedia
                    component="img"
                    image={cat.image}
                    alt={cat.label}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pb: 2 }}>
                    <Typography variant="h5" fontWeight={700} mb={1}>
                      {cat.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cat.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <motion.section
        className="py-16 bg-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Typography variant="h2" component="h2" className="text-3xl font-bold mb-4 md:mb-0">
              Featured Products
            </Typography>
            <Button 
              component={Link} 
              to="/shop" 
              variant="outlined" 
              color="primary"
              className="px-6"
            >
              View All
            </Button>
          </div>
          
          <Box className="featured-products-slider">
            <Slider {...sliderSettings}>
              {featuredProducts.map(product => (
                <Box key={product.id} className="px-2">
                  <ProductCard product={product} />
                </Box>
              ))}
            </Slider>
          </Box>
        </div>
      </motion.section>
      
      <motion.section
        className="py-20 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography variant="h2" component="h2" className="text-3xl font-bold mb-4">
                  Crafted for Comfort, Designed for Style
                </Typography>
                <Typography variant="body1" className="mb-6 text-gray-600">
                  At Walknex, we believe that premium footwear should blend comfort, durability, and style. 
                  Our shoes are crafted with the finest materials and innovative technology to ensure you 
                  look and feel your best with every step.
                </Typography>
                <Typography variant="body1" className="mb-6 text-gray-600">
                  With our AI-powered recommendation system, finding the perfect pair has never been easier. 
                  Whether you need running shoes for your next marathon or boots for the winter season, 
                  our personal shopping assistant helps you make the right choice.
                </Typography>
                <Button 
                  component={Link}
                  to="/about"
                  variant="contained"
                  color="primary"
                  size="large"
                  className="mt-2"
                >
                  Our Story
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <LazyLoadImage 
                  src="https://images.pexels.com/photos/4252950/pexels-photo-4252950.jpeg" 
                  alt="Shoe craftsmanship" 
                  effect="blur"
                  className="w-full h-full rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-4 rounded shadow-lg hidden md:block">
                  <Typography variant="body1" className="font-semibold">
                    30+ Years of Excellence
                  </Typography>
                </div>
              </motion.div>
            </Grid>
          </Grid>
        </div>
      </motion.section>
      
      <motion.section
        className="py-16 bg-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Typography variant="h2" component="h2" className="text-3xl font-bold mb-4 md:mb-0">
              New Arrivals
            </Typography>
            <Button 
              component={Link} 
              to="/shop/new-arrivals" 
              variant="outlined" 
              color="primary"
              className="px-6"
            >
              View All
            </Button>
          </div>
          
          <Grid container spacing={4}>
            {newArrivals.map(product => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </div>
      </motion.section>
      
      <motion.section
        className="py-16 bg-secondary-900 text-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h2" component="h2" className="text-3xl font-bold mb-12">
            What Our Customers Say
          </Typography>
          
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-secondary-800 p-6 rounded-lg h-full"
              >
                <div className="mb-4 text-accent-500 text-2xl">
                  ★★★★★
                </div>
                <Typography variant="body1" className="italic mb-4">
                  "I've been searching for comfortable running shoes for years, and Walknex finally delivered. 
                  The AI assistant recommended the perfect pair for my pronation. I'm never shopping anywhere else!"
                </Typography>
                <Divider sx={{ backgroundColor: '#4B5563', margin: '16px 0' }} />
                <Typography variant="subtitle1" className="font-semibold">
                  Sarah T.
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Marathon Runner
                </Typography>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-secondary-800 p-6 rounded-lg h-full"
              >
                <div className="mb-4 text-accent-500 text-2xl">
                  ★★★★★
                </div>
                <Typography variant="body1" className="italic mb-4">
                  "The 3D preview feature is a game-changer! I could see exactly how the shoes would look 
                  before purchasing. The quality exceeded my expectations, and delivery was lightning-fast."
                </Typography>
                <Divider sx={{ backgroundColor: '#4B5563', margin: '16px 0' }} />
                <Typography variant="subtitle1" className="font-semibold">
                  Michael J.
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Fashion Enthusiast
                </Typography>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-secondary-800 p-6 rounded-lg h-full"
              >
                <div className="mb-4 text-accent-500 text-2xl">
                  ★★★★★
                </div>
                <Typography variant="body1" className="italic mb-4">
                  "My kids are obsessed with their new Walknex shoes! The durability is impressive—they've survived 
                  playground battles, puddle jumping, and everything in between. Worth every penny."
                </Typography>
                <Divider sx={{ backgroundColor: '#4B5563', margin: '16px 0' }} />
                <Typography variant="subtitle1" className="font-semibold">
                  Emma L.
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Parent of Two
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </div>
      </motion.section>
      
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h2" component="h2" className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Fit Today
          </Typography>
          <Typography variant="body1" className="max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who've discovered the perfect footwear with Walknex. 
            Our AI-powered recommendations and exclusive designs are just a click away.
          </Typography>
          <Button 
            component={Link}
            to="/shop"
            variant="contained" 
            color="secondary"
            size="large"
            className="bg-white text-primary-700 hover:bg-gray-100"
          >
            Shop Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;