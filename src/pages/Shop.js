import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Drawer,
  IconButton,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
  CircularProgress,
} from '@mui/material';
import { FilterList as FilterIcon, Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { getMockProducts } from '../services/api';

const GENDERS = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
];

const SUBCATEGORIES = [
  { label: 'Casual', value: 'casual' },
  { label: 'Running', value: 'running' },
  { label: 'Boots', value: 'boots' },
  { label: 'Sneakers', value: 'sneakers' },
];

const PRICE_RANGE = [0, 300];

// Extract query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Shop = () => {
  const { gender, subcategory } = useParams();
  const location = useLocation();
  const query = useQuery();
  const searchQuery = query.get('search');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState(PRICE_RANGE);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState(gender ? [gender] : []);
  const [selectedSubcategories, setSelectedSubcategories] = useState(subcategory ? [subcategory] : []);

  const productsPerPage = 12;

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(getMockProducts());
      setLoading(false);
    }, 400);
  }, []);

  // Filter products when gender/subcategory changes
  useEffect(() => {
    let data = [...products];
    if (gender) data = data.filter(p => p.gender === gender);
    if (subcategory) data = data.filter(p => p.category === subcategory);
    setFilteredProducts(data);
    setPage(1); // Reset to first page when gender/subcategory changes
  }, [products, gender, subcategory, location.key]);

  // Filtering logic
  useEffect(() => {
    let result = [...products];

    // Gender filter (from URL or filter)
    if (selectedGenders.length > 0) {
      result = result.filter(product => selectedGenders.includes(product.gender));
    }

    // Subcategory filter (from URL or filter)
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => selectedSubcategories.includes(product.category));
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.reverse();
        break;
      default:
        // featured: do nothing
        break;
    }

    setFilteredProducts(result);
    setPage(1); // Reset to first page on filter change
  }, [products, selectedGenders, selectedSubcategories, searchQuery, sortBy, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  // Handlers
  const handleSortChange = (event) => setSortBy(event.target.value);
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePriceChange = (event, newValue) => setPriceRange(newValue);

  const handleGenderChange = (event) => {
    const value = event.target.name;
    setSelectedGenders((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const handleSubcategoryChange = (event) => {
    const value = event.target.name;
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const toggleFilterDrawer = () => setFilterDrawerOpen((open) => !open);

  const resetFilters = () => {
    setPriceRange(PRICE_RANGE);
    setSelectedGenders([]);
    setSelectedSubcategories([]);
    setSortBy('featured');
  };

  // Breadcrumbs
  const breadcrumbs = [
    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/" key="home">
      Home
    </MuiLink>,
    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/shop" key="shop">
      Shop
    </MuiLink>,
  ];
  if (selectedGenders.length === 1) {
    breadcrumbs.push(
      <Typography color="text.primary" key="gender">
        {GENDERS.find(g => g.value === selectedGenders[0])?.label}
      </Typography>
    );
  }
  if (selectedSubcategories.length === 1) {
    breadcrumbs.push(
      <Typography color="text.primary" key="subcategory">
        {SUBCATEGORIES.find(c => c.value === selectedSubcategories[0])?.label}
      </Typography>
    );
  }
  if (searchQuery) {
    breadcrumbs.push(
      <Typography color="text.primary" key="search">
        Search
      </Typography>
    );
  }

  // Page title
  let pageTitle = 'All Products';
  if (selectedGenders.length === 1 && selectedSubcategories.length === 0) {
    pageTitle = GENDERS.find(g => g.value === selectedGenders[0])?.label || pageTitle;
  } else if (selectedSubcategories.length === 1 && selectedGenders.length === 0) {
    pageTitle = SUBCATEGORIES.find(c => c.value === selectedSubcategories[0])?.label || pageTitle;
  } else if (selectedGenders.length === 1 && selectedSubcategories.length === 1) {
    pageTitle = `${GENDERS.find(g => g.value === selectedGenders[0])?.label} - ${SUBCATEGORIES.find(c => c.value === selectedSubcategories[0])?.label}`;
  } else if (searchQuery) {
    pageTitle = `Search Results: "${searchQuery}"`;
  }

  // Filter sidebar (desktop)
  const filterSidebar = (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 3, position: 'sticky', top: 100 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Filters
        </Typography>
        <Button variant="text" size="small" onClick={resetFilters}>
          Reset
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Price Range */}
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `£${value}`}
          min={PRICE_RANGE[0]}
          max={PRICE_RANGE[1]}
          sx={{ mt: 3, mb: 1 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">£{priceRange[0]}</Typography>
          <Typography variant="body2">£{priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Gender */}
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Gender
        </Typography>
        <FormGroup>
          {GENDERS.map((g) => (
            <FormControlLabel
              key={g.value}
              control={
                <Checkbox
                  checked={selectedGenders.includes(g.value)}
                  onChange={handleGenderChange}
                  name={g.value}
                  color="primary"
                />
              }
              label={g.label}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Subcategories */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Categories
        </Typography>
        <FormGroup>
          {SUBCATEGORIES.map((c) => (
            <FormControlLabel
              key={c.value}
              control={
                <Checkbox
                  checked={selectedSubcategories.includes(c.value)}
                  onChange={handleSubcategoryChange}
                  name={c.value}
                  color="primary"
                />
              }
              label={c.label}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );

  // Filter drawer (mobile)
  const filterDrawer = (
    <Box sx={{ width: 320, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Filters
        </Typography>
        <Box>
          <Button variant="text" size="small" onClick={resetFilters}>
            Reset
          </Button>
          <IconButton onClick={toggleFilterDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Price Range */}
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `£${value}`}
          min={PRICE_RANGE[0]}
          max={PRICE_RANGE[1]}
          sx={{ mt: 3, mb: 1 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">£{priceRange[0]}</Typography>
          <Typography variant="body2">£{priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Gender */}
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Gender
        </Typography>
        <FormGroup>
          {GENDERS.map((g) => (
            <FormControlLabel
              key={g.value}
              control={
                <Checkbox
                  checked={selectedGenders.includes(g.value)}
                  onChange={handleGenderChange}
                  name={g.value}
                  color="primary"
                />
              }
              label={g.label}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Subcategories */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Categories
        </Typography>
        <FormGroup>
          {SUBCATEGORIES.map((c) => (
            <FormControlLabel
              key={c.value}
              control={
                <Checkbox
                  checked={selectedSubcategories.includes(c.value)}
                  onChange={handleSubcategoryChange}
                  name={c.value}
                  color="primary"
                />
              }
              label={c.label}
            />
          ))}
        </FormGroup>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4 }}
        onClick={toggleFilterDrawer}
      >
        Apply Filters
      </Button>
    </Box>
  );

  // Active filters chips
  const activeFilters = [
    ...selectedGenders.map(g => ({
      label: GENDERS.find(opt => opt.value === g)?.label,
      onDelete: () => setSelectedGenders(selectedGenders.filter(val => val !== g)),
    })),
    ...selectedSubcategories.map(c => ({
      label: SUBCATEGORIES.find(opt => opt.value === c)?.label,
      onDelete: () => setSelectedSubcategories(selectedSubcategories.filter(val => val !== c)),
    })),
    ...(priceRange[0] !== PRICE_RANGE[0] || priceRange[1] !== PRICE_RANGE[1]
      ? [{
          label: `£${priceRange[0]} - £${priceRange[1]}`,
          onDelete: () => setPriceRange(PRICE_RANGE),
        }]
      : []),
  ];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      <Box className="container mx-auto" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
          {breadcrumbs}
        </Breadcrumbs>

        {/* Page Title & Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 4,
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight={800}>
            {pageTitle}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeFilters.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {activeFilters.map((filter, idx) => (
                  <Chip
                    key={idx}
                    label={filter.label}
                    onDelete={filter.onDelete}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={toggleFilterDrawer}
              sx={{ display: { md: 'none' } }}
            >
              Filters
            </Button>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Top Rated</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Filters - Desktop */}
          <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            {filterSidebar}
          </Grid>
          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2 }}>Loading products...</Typography>
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>No products found</Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Try adjusting your filters or search criteria.
                </Typography>
                <Button variant="contained" color="primary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </Box>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Grid container spacing={3}>
                    {displayedProducts.map(product => (
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <ProductCard
                          product={{
                            ...product,
                            image: product.image || <ImageIcon sx={{ fontSize: 60, color: '#e0e0e0' }} />
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
        }}
      >
        {filterDrawer}
      </Drawer>
    </Box>
  );
};

export default Shop;