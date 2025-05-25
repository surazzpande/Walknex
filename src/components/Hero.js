import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// Simple 3D shoe model component
const ShoeModel = () => (
  <mesh rotation={[0, Math.PI / 4, 0]}>
    <boxGeometry args={[2, 0.5, 4]} />
    <meshStandardMaterial color="#fff" roughness={0.4} metalness={0.6} />
  </mesh>
);

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        minHeight: { xs: '70vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'transparent',
        background: 'linear-gradient(120deg, #1e3a8a 0%, #2563eb 100%)', // Deep blue gradient
        color: '#fff',
        overflow: 'hidden',
        borderRadius: 0,
      }}
    >
      {/* Animated Background Circles */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.18)', // blue-500 with opacity
            zIndex: 0,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.13)', // emerald-500 with opacity
            zIndex: 0,
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
          sx={{ px: { xs: 2, md: 6 }, py: { xs: 8, md: 0 }, maxWidth: 1400, mx: 'auto' }}
        >
          {/* Left: Text & CTA */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  mb: 2,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#fff',
                  textShadow: '0 2px 16px rgba(30,58,138,0.18)',
                }}
              >
                Step into Style with <Box component="span" sx={{ color: 'secondary.main' }}>Walknex</Box>
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 4,
                  fontWeight: 400,
                  maxWidth: 500,
                  textShadow: '0 1px 8px rgba(30,58,138,0.10)',
                }}
              >
                Discover your perfect pair with our AI-powered recommendations tailored just for you.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  to="/shop/new-arrivals"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    borderColor: '#fff',
                    color: '#fff',
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'secondary.main',
                      borderColor: '#fff',
                    },
                  }}
                >
                  New Arrivals
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right: 3D Model */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ height: 500, width: '100%' }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 500,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  boxShadow: '0 8px 32px rgba(30,58,138,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[10, 10, 5]} intensity={1.2} />
                  <Suspense fallback={null}>
                    <motion.group
                      animate={{
                        rotateY: [0, Math.PI * 2],
                        rotateX: [0, 0.1, 0, -0.1, 0],
                      }}
                      transition={{
                        rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
                        rotateX: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                      }}
                    >
                      <ShoeModel />
                    </motion.group>
                    <ContactShadows position={[0, -1, 0]} opacity={0.5} blur={1} />
                    <Environment preset="city" />
                  </Suspense>
                  <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                </Canvas>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Hero;