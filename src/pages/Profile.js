import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Avatar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Divider,
  Stack,
  useTheme,
  Container,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { currentUser, updateUser } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  // Mock order data
  const orders = [
    {
      id: 'ORD123456',
      date: '2025-05-15',
      total: 249.98,
      status: 'Delivered',
      items: [
        { name: 'Air Cloud Runner', quantity: 1, price: 129.99 },
        { name: 'Street Force One', quantity: 1, price: 119.99 }
      ]
    },
    {
      id: 'ORD123457',
      date: '2025-05-01',
      total: 199.99,
      status: 'Processing',
      items: [
        { name: 'Winter Trek Boot', quantity: 1, price: 199.99 }
      ]
    }
  ];

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
        address: ''
      });
    }
    if (location.state?.orderSuccess) {
      setSuccess(`Order ${location.state.orderId} placed successfully!`);
    }
  }, [currentUser, location]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setProfileData({
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
      phone: '',
      address: ''
    });
  };

  const handleSave = async () => {
    try {
      await updateUser({
        displayName: profileData.displayName
      });
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper elevation={3} sx={{ borderRadius: 4, p: { xs: 2, md: 5 } }}>
            {/* Profile Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" mb={4}>
              <Avatar
                src={currentUser?.photoURL}
                alt={currentUser?.displayName}
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: theme.palette.primary.main,
                  fontSize: 40
                }}
              >
                {currentUser?.displayName?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {currentUser?.displayName || 'User Profile'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {currentUser?.email}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                mb: 4,
                '& .MuiTab-root': { fontWeight: 600, fontSize: 16 }
              }}
            >
              <Tab label="Profile" />
              <Tab label="Orders" />
              <Tab label="Settings" />
            </Tabs>

            {/* Profile Tab */}
            {activeTab === 0 && (
              <Box>
                <Stack direction="row" justifyContent="flex-end" mb={2}>
                  {editing ? (
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={handleSave} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error">
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  ) : (
                    <IconButton onClick={handleEdit} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                </Stack>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleChange}
                      disabled={!editing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      disabled={!editing}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Orders Tab */}
            {activeTab === 1 && (
              <Box>
                <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                              {order.items.map(item => (
                                <li key={item.name}>
                                  {item.name} <Chip label={`x${item.quantity}`} size="small" sx={{ ml: 1 }} />
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>£{order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={order.status === 'Delivered' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" size="small">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Settings Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  (Notification settings UI coming soon)
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  (Privacy settings UI coming soon)
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Profile;