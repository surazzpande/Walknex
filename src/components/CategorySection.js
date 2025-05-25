import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Popover,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-lazy-load-image-component/src/effects/blur.css';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: "Step up your game with our men's collection",
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    color: '#2563eb',
    subcategories: [
      { id: 'casual', name: 'Casual' },
      { id: 'running', name: 'Running' },
      { id: 'boots', name: 'Boots' },
      { id: 'sneakers', name: 'Sneakers' }
    ]
  },
  {
    id: 'women',
    name: 'Women',
    description: "Elevate your style with our women's shoes",
    image: 'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg',
    color: '#a21caf',
    subcategories: [
      { id: 'casual', name: 'Casual' },
      { id: 'running', name: 'Running' },
      { id: 'boots', name: 'Boots' },
      { id: 'sneakers', name: 'Sneakers' }
    ]
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Fun, comfortable shoes for little feet',
    image: 'https://images.pexels.com/photos/1619652/pexels-photo-1619652.jpeg',
    color: '#059669',
    subcategories: [
      { id: 'casual', name: 'Casual' },
      { id: 'running', name: 'Running' },
      { id: 'boots', name: 'Boots' },
      { id: 'sneakers', name: 'Sneakers' }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const CategorySection = () => {
  const [anchorEls, setAnchorEls] = useState({});

  const handlePopoverOpen = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handlePopoverClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }));
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Typography variant="h2" component="h2" align="center" fontWeight={800} sx={{ mb: 6 }}>
          Shop by Category
        </Typography>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={4} justifyContent="center">
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 3,
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <Link to={`/shop/${category.id}`}>
                        <LazyLoadImage
                          src={category.image}
                          alt={category.name}
                          effect="blur"
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                            transition: 'transform 0.5s',
                          }}
                        />
                      </Link>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: category.color,
                          color: '#fff',
                          px: 3,
                          py: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="h6" component="h3" fontWeight={700}>
                          {category.name}
                        </Typography>
                        <IconButton
                          aria-label={`Show ${category.name} subcategories`}
                          onClick={e => {
                            e.preventDefault();
                            handlePopoverOpen(e, category.id);
                          }}
                          onMouseEnter={e => handlePopoverOpen(e, category.id)}
                          onMouseLeave={() => handlePopoverClose(category.id)}
                          size="small"
                          sx={{ color: 'white', ml: 1 }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </CardContent>
                    {/* Subcategories Popover */}
                    <Popover
                      id={`popover-${category.id}`}
                      open={Boolean(anchorEls[category.id])}
                      anchorEl={anchorEls[category.id]}
                      onClose={() => handlePopoverClose(category.id)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      PaperProps={{
                        onMouseEnter: () => handlePopoverOpen({ currentTarget: anchorEls[category.id] }, category.id),
                        onMouseLeave: () => handlePopoverClose(category.id),
                        sx: { minWidth: 180, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper', mt: 1 }
                      }}
                      disableRestoreFocus
                    >
                      <List>
                        <ListItem
                          button
                          component={Link}
                          to={`/shop/${category.id}`}
                          onClick={() => handlePopoverClose(category.id)}
                        >
                          <ListItemText primary={`View All ${category.name}`} />
                        </ListItem>
                        {category.subcategories.map((sub) => (
                          <ListItem
                            key={sub.id}
                            button
                            component={Link}
                            to={`/shop/${category.id}/${sub.id}`}
                            onClick={() => handlePopoverClose(category.id)}
                          >
                            <ListItemText primary={sub.name} />
                          </ListItem>
                        ))}
                      </List>
                    </Popover>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
};

export default CategorySection;