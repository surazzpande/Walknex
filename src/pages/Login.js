import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  IconButton, 
  InputAdornment, 
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Google as GoogleIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate(from);
    } catch (err) {
      console.error('Google login error:', err);
      setError('An error occurred during Google login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper elevation={3} className="p-8 rounded-xl">
                <Typography variant="h4" component="h1" className="font-bold text-center mb-6">
                  Welcome Back
                </Typography>
                
                {error && (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                {location.state?.from && (
                  <Alert severity="info" className="mb-4">
                    Please log in to continue
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                    required
                  />
                  
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={toggleShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Typography 
                    variant="body2" 
                    className="text-right mt-1 mb-4 text-primary-600 hover:text-primary-800 cursor-pointer"
                  >
                    Forgot password?
                  </Typography>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    className="py-3"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                  </Button>
                </form>
                
                <Divider className="my-4">
                  <Typography variant="body2" color="textSecondary">
                    OR
                  </Typography>
                </Divider>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="py-3"
                >
                  Continue with Google
                </Button>
                
                <Typography className="text-center mt-4">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary-600 hover:text-primary-800 font-medium">
                    Sign up
                  </Link>
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Login;