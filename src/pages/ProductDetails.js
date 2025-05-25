import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Grid, 
  Typography, 
  Button, 
  Breadcrumbs, 
  Link as MuiLink, 
  Rating, 
  IconButton, 
  Tabs, 
  Tab, 
  Box, 
  Divider, 
  Card, 
  CardContent, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  FavoriteBorder, 
  Favorite, 
  Share as ShareIcon, 
  AddShoppingCart, 
  Remove, 
  Add,
  LocalShipping,
  Autorenew,
  CreditCard
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls } from '@react-three/drei';
import { getMockProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Fallback 3D model for the product
const ProductModel = () => {
  return (
    <mesh>
      <boxGeometry args={[2, 0.5, 4]} />
      <meshStandardMaterial color="#2563eb" />
    </mesh>
  );
};

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Fetch product
  useEffect(() => {
    // For demo purposes, we'll use mock products
    const mockProducts = getMockProducts();
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
      // Set first size as default
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      
      // Get related products (same category)
      const related = mockProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      // Product not found, redirect to shop
      navigate('/shop');
    }
    
    setLoading(false);
  }, [id, navigate]);
  
  // Check if product is in wishlist
  const isWishlisted = product ? isInWishlist(product.id) : false;
  
  // Handlers
  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };
  
  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setSnackbarMessage('Removed from wishlist');
    } else {
      addToWishlist(product);
      setSnackbarMessage('Added to wishlist');
    }
    setSnackbarOpen(true);
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSnackbarMessage('Please select a size');
      setSnackbarOpen(true);
      return;
    }
    
    addToCart(product, quantity, selectedSize);
    setSnackbarMessage('Added to cart');
    setSnackbarOpen(true);
  };
  
  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Link copied to clipboard');
      setSnackbarOpen(true);
    }
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const toggleModelView = () => {
    setShowModel(!showModel);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button 
          component={Link} 
          to="/shop" 
          variant="contained" 
          color="primary"
          className="mt-4"
        >
          Back to Shop
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" className="mb-6">
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/shop" color="inherit">
            Shop
          </MuiLink>
          <MuiLink 
            component={Link} 
            to={`/shop/${product.category}`} 
            color="inherit"
          >
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </MuiLink>
          <Typography color="textPrimary">
            {product.name}
          </Typography>
        </Breadcrumbs>
        
        <Grid container spacing={6}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full rounded-lg shadow-md object-cover"
                  style={{ aspectRatio: '1/1' }}
                />
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <IconButton 
                    className="bg-white hover:bg-gray-100 shadow-sm"
                    onClick={handleToggleWishlist}
                  >
                    {isWishlisted ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <IconButton 
                    className="bg-white hover:bg-gray-100 shadow-sm"
                    onClick={handleShareProduct}
                  >
                    <ShareIcon />
                  </IconButton>
                </div>
                
                {!product.inStock && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded font-medium">
                    Out of Stock
                  </div>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  className="absolute bottom-4 left-4"
                  onClick={toggleModelView}
                >
                  {showModel ? 'Hide 3D View' : 'View in 3D'}
                </Button>
              </div>
              
              {showModel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 rounded-lg overflow-hidden h-80 bg-gray-100"
                >
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <Suspense fallback={null}>
                      <PresentationControls
                        global
                        rotation={[0, 0, 0]}
                        polar={[-Math.PI / 4, Math.PI / 4]}
                        azimuth={[-Math.PI / 4, Math.PI / 4]}
                      >
                        <ProductModel />
                      </PresentationControls>
                    </Suspense>
                    <OrbitControls />
                  </Canvas>
                </motion.div>
              )}
            </motion.div>
          </Grid>
          
          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h4" component="h1" className="font-bold mb-2">
                {product.name}
              </Typography>
              
              <div className="flex items-center mb-4">
                <Rating value={product.rating} readOnly precision={0.5} />
                <Typography variant="body2" className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </Typography>
              </div>
              
              <Typography variant="h5" className="font-bold text-2xl mb-4">
                £{product.price.toFixed(2)}
              </Typography>
              
              <Typography variant="body1" className="text-gray-700 mb-6">
                {product.description}
              </Typography>
              
              <Divider className="my-6" />
              
              {/* Size Selection */}
              <FormControl component="fieldset" className="mb-6">
                <FormLabel component="legend" className="font-semibold mb-2">
                  Select Size
                </FormLabel>
                <RadioGroup 
                  row 
                  aria-label="size" 
                  name="size" 
                  value={selectedSize} 
                  onChange={handleSizeChange}
                >
                  {product.sizes.map(size => (
                    <FormControlLabel
                      key={size}
                      value={size}
                      control={<Radio color="primary" />}
                      label={`UK ${size}`}
                      className="mr-2 mb-2"
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              {/* Quantity */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Quantity
                </Typography>
                <div className="flex items-center">
                  <IconButton 
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="border rounded-l-md"
                  >
                    <Remove />
                  </IconButton>
                  <Paper className="px-4 py-2 flex-grow-0 min-w-[60px] text-center">
                    {quantity}
                  </Paper>
                  <IconButton 
                    onClick={handleQuantityIncrease}
                    className="border rounded-r-md"
                  >
                    <Add />
                  </IconButton>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="py-3 mb-4"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              {/* Product Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card variant="outlined" className="border-gray-200">
                  <CardContent className="flex flex-col items-center text-center p-4">
                    <LocalShipping className="text-primary-500 mb-2" />
                    <Typography variant="subtitle2" className="font-semibold">
                      Free Shipping
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      On orders over £50
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" className="border-gray-200">
                  <CardContent className="flex flex-col items-center text-center p-4">
                    <Autorenew className="text-primary-500 mb-2" />
                    <Typography variant="subtitle2" className="font-semibold">
                      Easy Returns
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      30-day return policy
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" className="border-gray-200">
                  <CardContent className="flex flex-col items-center text-center p-4">
                    <CreditCard className="text-primary-500 mb-2" />
                    <Typography variant="subtitle2" className="font-semibold">
                      Secure Payment
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Protected checkout
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="product details tabs"
              centered
            >
              <Tab label="Description" id="product-tab-0" aria-controls="product-tabpanel-0" />
              <Tab label="Specifications" id="product-tab-1" aria-controls="product-tabpanel-1" />
              <Tab label="Reviews" id="product-tab-2" aria-controls="product-tabpanel-2" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1">
              {product.description}
              <br /><br />
              Experience ultimate comfort with our advanced cushioning system, designed to absorb impact and provide energy return with every step. The breathable mesh upper ensures your feet stay cool and dry, while the durable rubber outsole delivers excellent traction on all surfaces.
              <br /><br />
              Whether you're hitting the track, exploring the streets, or simply seeking all-day comfort, the {product.name} delivers performance and style that sets you apart.
            </Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Material
                </Typography>
                <Typography variant="body2" className="mb-4">
                  Upper: Engineered Mesh with Synthetic Overlays
                  <br />
                  Midsole: Responsive Cushioning
                  <br />
                  Outsole: Durable Rubber
                </Typography>
                
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Dimensions
                </Typography>
                <Typography variant="body2" className="mb-4">
                  Weight: Approximately 283g (10oz)
                  <br />
                  Heel Drop: 10mm
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Features
                </Typography>
                <Typography variant="body2" className="mb-4">
                  - Responsive cushioning technology
                  <br />
                  - Breathable mesh upper
                  <br />
                  - Durable rubber outsole
                  <br />
                  - Reflective details for visibility
                  <br />
                  - Padded collar and tongue
                </Typography>
                
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Care Instructions
                </Typography>
                <Typography variant="body2">
                  Spot clean with mild detergent and warm water. Air dry away from direct heat. Do not machine wash or tumble dry.
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="subtitle1" className="font-semibold mb-4">
              Customer Reviews ({product.reviews})
            </Typography>
            
            <div className="space-y-6">
              {/* Mock review 1 */}
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <Typography variant="subtitle2">James Thompson</Typography>
                    <Rating value={5} size="small" readOnly />
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    2 weeks ago
                  </Typography>
                </div>
                <Typography variant="body2">
                  Absolutely love these shoes! They're incredibly comfortable right out of the box and the cushioning is perfect for my daily runs. The fit is true to size and the design looks even better in person.
                </Typography>
              </div>
              
              {/* Mock review 2 */}
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <Typography variant="subtitle2">Emma Wilson</Typography>
                    <Rating value={4} size="small" readOnly />
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    1 month ago
                  </Typography>
                </div>
                <Typography variant="body2">
                  Great shoes for the price. They're lightweight and look stylish with jeans or athletic wear. I removed one star because they took a few days to break in, but after that, they've been very comfortable.
                </Typography>
              </div>
              
              {/* Mock review 3 */}
              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <Typography variant="subtitle2">Robert Chen</Typography>
                    <Rating value={5} size="small" readOnly />
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    2 months ago
                  </Typography>
                </div>
                <Typography variant="body2">
                  I've tried many brands over the years, but these are now my go-to shoes. The durability is impressive - I've had them for months of regular use and they still look brand new. The price is reasonable for the quality you get.
                </Typography>
              </div>
            </div>
          </TabPanel>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <Typography variant="h5" component="h2" className="font-bold mb-6">
            You May Also Like
          </Typography>
          
          <Grid container spacing={4}>
            {relatedProducts.map(product => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <Typography variant="subtitle1" className="font-medium">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      £{product.price.toFixed(2)}
                    </Typography>
                  </Link>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      
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
    </div>
  );
};

export default ProductDetails;