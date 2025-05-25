import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  AccountCircle,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getMockProducts } from '../services/api';

const NAV_CATEGORIES = [
  { name: 'Men', path: '/shop/men' },
  { name: 'Women', path: '/shop/women' },
  { name: 'Kids', path: '/shop/kids' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState([]);

  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setProducts(getMockProducts());
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, products]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleAccountMenuOpen = (event) => setAccountMenuAnchor(event.currentTarget);
  const handleAccountMenuClose = () => setAccountMenuAnchor(null);

  const handleLogout = async () => {
    try {
      await logout();
      handleAccountMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
        <Button component={Link} to="/" sx={{ fontSize: 24, fontWeight: 800, color: '#2563eb', textTransform: 'none' }}>
          Walknex
        </Button>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {NAV_CATEGORIES.map((cat) => (
          <ListItem
            key={cat.name}
            component={Link}
            to={cat.path}
            onClick={handleDrawerToggle}
            button
            sx={{
              fontWeight: 700,
              color: location.pathname.startsWith(cat.path) ? '#2563eb' : '#1e293b',
              bgcolor: location.pathname.startsWith(cat.path) ? 'rgba(37,99,235,0.07)' : 'transparent',
              borderRadius: 2,
              mb: 0.5,
            }}
          >
            <ListItemText primary={cat.name} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem component={Link} to="/wishlist" onClick={handleDrawerToggle} button>
          <ListItemText primary="Wishlist" />
        </ListItem>
        {currentUser ? (
          <>
            <ListItem component={Link} to="/profile" onClick={handleDrawerToggle} button>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={Link} to="/login" onClick={handleDrawerToggle} button>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem component={Link} to="/signup" onClick={handleDrawerToggle} button>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  // Search overlay
  const searchOverlay = (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            background: '#fff',
            zIndex: 30,
            boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
          }}
        >
          <Box sx={{ maxWidth: 700, mx: 'auto', px: 2, py: 2 }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                id="search-input"
                fullWidth
                variant="outlined"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="off"
                sx={{
                  bgcolor: '#f1f5f9',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': { border: 'none' },
                }}
              />
              <IconButton onClick={handleSearchToggle} sx={{ ml: 1 }}>
                <CloseIcon />
              </IconButton>
            </form>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 12, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(30,58,138,0.08)', padding: 8 }}
              >
                {searchResults.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: '#f1f5f9' },
                    }}
                    onClick={() => handleSearchResultClick(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography fontWeight={600}>{product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        £{product.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </motion.div>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.97)' : 'transparent',
          transition: 'background-color 0.3s',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{
          maxWidth: 1400,
          mx: 'auto',
          width: '100%',
          minHeight: { xs: 64, md: 80 },
          px: { xs: 1, md: 3 },
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: '#1e3a8a', mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Button
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              fontSize: 28,
              color: '#2563eb',
              textTransform: 'none',
              letterSpacing: 1,
              px: 0,
              minWidth: 0,
              mr: 2,
            }}
          >
            Walknex
          </Button>

          {/* Centered Navigation */}
          <Box sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            gap: 3,
          }}>
            {NAV_CATEGORIES.map((cat) => (
              <Button
                key={cat.name}
                component={Link}
                to={cat.path}
                sx={{
                  color: location.pathname.startsWith(cat.path) ? '#2563eb' : '#1e3a8a',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  textTransform: 'none',
                  px: 2,
                  borderRadius: 2,
                  bgcolor: location.pathname.startsWith(cat.path) ? 'rgba(37,99,235,0.07)' : 'transparent',
                  '&:hover': {
                    color: '#2563eb',
                    bgcolor: 'rgba(37,99,235,0.07)',
                  },
                }}
              >
                {cat.name}
              </Button>
            ))}
          </Box>

          {/* Right Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={handleSearchToggle}
              sx={{ color: '#1e3a8a' }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="wishlist"
              component={Link}
              to="/wishlist"
              sx={{ color: '#be185d' }}
            >
              <FavoriteIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="cart"
              component={Link}
              to="/cart"
              sx={{ color: '#2563eb' }}
            >
              <Badge badgeContent={totalItems} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
            {currentUser ? (
              <IconButton
                edge="end"
                aria-label="account"
                aria-haspopup="true"
                onClick={handleAccountMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {currentUser.photoURL ? (
                  <Avatar
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle sx={{ fontSize: 32 }} />
                )}
              </IconButton>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="primary"
                variant="outlined"
                sx={{
                  ml: 2,
                  fontWeight: 700,
                  borderRadius: 2,
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': {
                    bgcolor: '#2563eb',
                    color: '#fff',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
        {searchOverlay}
      </AppBar>

      {/* Account Menu */}
      <Menu
        anchorEl={accountMenuAnchor}
        open={Boolean(accountMenuAnchor)}
        onClose={handleAccountMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 150 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleAccountMenuClose}>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/wishlist" onClick={handleAccountMenuClose}>
          Wishlist
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Toolbar spacer */}
      <Box sx={{ height: { xs: 64, md: 80 } }} />
    </>
  );
};

export default Navbar;