import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Google as GoogleIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };
  
  const validateForm = () => {
    if (!name) {
      setError('Please enter your name');
      return false;
    }
    
    if (!email) {
      setError('Please enter your email');
      return false;
    }
    
    if (!password) {
      setError('Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please use a different email or log in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google signup error:', err);
      setError('An error occurred during Google signup. Please try again.');
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
                  Create an Account
                </Typography>
                
                {error && (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={name}
                    onChange={handleNameChange}
                    disabled={loading}
                    required
                  />
                  
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
                  
                  <TextField
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={loading}
                    required
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptTerms}
                        onChange={handleTermsChange}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link to="/terms-of-service" className="text-primary-600 hover:text-primary-800">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-800">
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    className="mt-2 mb-4"
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    className="py-3"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign Up'}
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
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="py-3"
                >
                  Continue with Google
                </Button>
                
                <Typography className="text-center mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                    Log in
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

export default Signup;