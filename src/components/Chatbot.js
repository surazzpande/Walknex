import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconButton,
  TextField,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Tooltip,
  useTheme,
  useMediaQuery,
  Box,
  Slide,
  Avatar,
  Badge,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  InfoOutlined,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
  RestartAlt,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getChatbotResponse } from '../services/api';

const BOT_AVATAR = '/bot-avatar.png'; // Place a bot avatar image in your public folder or use a URL
const USER_AVATAR = '/user-avatar.png'; // Place a user avatar image in your public folder or use a URL

const WELCOME_MESSAGE = {
  text: `👋 Welcome to Walknex! I'm your AI shopping assistant.
  
I can help you:
• Find the perfect shoes for your needs
• Get personalized recommendations
• Track your order or answer FAQs

How can I assist you today?`,
  sender: 'bot',
  timestamp: new Date().toISOString(),
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [gdprDialogOpen, setGdprDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [feedback, setFeedback] = useState({});
  const messageEndRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Generate session ID on component mount
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  // Load chat history from session storage
  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    const storedGdprAccepted = localStorage.getItem('gdprAccepted');

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([WELCOME_MESSAGE]);
    }

    if (storedGdprAccepted === 'true') {
      setGdprAccepted(true);
    }
  }, []);

  // Save messages to session storage when they change
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    if (!isOpen && !gdprAccepted) {
      setGdprDialogOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleGdprAccept = () => {
    setGdprAccepted(true);
    localStorage.setItem('gdprAccepted', 'true');
    setGdprDialogOpen(false);
    setIsOpen(true);
  };

  const handleGdprDecline = () => {
    setGdprDialogOpen(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input, sessionId);

      const botMessage = {
        text: response.message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        products: response.recommendations,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);

      const errorMessage = {
        text: "Sorry, I'm having trouble connecting right now. Please try again later or contact our support team.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (index, value) => {
    setFeedback((prev) => ({ ...prev, [index]: value }));
  };

  const handleRestart = () => {
    setMessages([WELCOME_MESSAGE]);
    setFeedback({});
    sessionStorage.removeItem('chatMessages');
  };

  // Animation for chatbot panel
  const chatbotPanelVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <>
      <Box className="chatbot-container" sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={chatbotPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: isMobile ? '95vw' : 420,
                maxWidth: 420,
                minHeight: 440,
                maxHeight: isMobile ? '80vh' : 620,
                boxShadow: theme.shadows[10],
                borderRadius: 18,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 80%, ${theme.palette.primary.light} 100%)`,
                display: 'flex',
                flexDirection: 'column',
                border: `2px solid ${theme.palette.primary.main}`,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Walknex Assistant"
            >
              <Box
                className="chatbot-header"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
                  color: theme.palette.primary.contrastText,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar src={BOT_AVATAR} alt="Bot" sx={{ width: 36, height: 36, bgcolor: 'primary.light' }}>
                    <ChatIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Walknex Assistant
                  </Typography>
                  <Tooltip title="Restart Conversation">
                    <IconButton
                      size="small"
                      onClick={handleRestart}
                      sx={{ color: 'white', ml: 1 }}
                      aria-label="Restart chat"
                    >
                      <RestartAlt />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Tooltip title="Close">
                  <IconButton
                    size="small"
                    onClick={toggleChat}
                    sx={{ color: 'white' }}
                    aria-label="Close chatbot"
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box
                className="chatbot-messages"
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 2,
                  background: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f7fafd',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                {messages.map((message, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                      {message.sender === 'bot' && (
                        <Avatar src={BOT_AVATAR} alt="Bot" sx={{ width: 32, height: 32, bgcolor: 'primary.light', mr: 1 }}>
                          <ChatIcon fontSize="small" />
                        </Avatar>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: message.sender === 'user' ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          marginBottom: 2,
                          alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                          background: message.sender === 'user'
                            ? theme.palette.secondary.light
                            : theme.palette.grey[100],
                          color: theme.palette.text.primary,
                          borderRadius: 14,
                          padding: '10px 18px',
                          maxWidth: '80%',
                          wordBreak: 'break-word',
                          boxShadow: message.sender === 'user' ? theme.shadows[1] : 'none',
                          border: message.isError ? `1.5px solid ${theme.palette.error.main}` : undefined,
                          fontSize: 15,
                          position: 'relative',
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={message.isError ? "error" : "inherit"}
                          sx={{ whiteSpace: 'pre-line', fontWeight: message.sender === 'bot' ? 500 : 400 }}
                        >
                          {message.text}
                        </Typography>
                        {message.sender === 'bot' && !message.isError && (
                          <Tooltip title="AI generated response">
                            <InfoOutlined sx={{ fontSize: 16, color: 'primary.main', position: 'absolute', bottom: 6, right: 8 }} />
                          </Tooltip>
                        )}
                      </motion.div>
                      {message.sender === 'user' && (
                        <Avatar src={USER_AVATAR} alt="You" sx={{ width: 32, height: 32, bgcolor: 'secondary.light', ml: 1 }}>
                          U
                        </Avatar>
                      )}
                    </Stack>
                    {/* Feedback for bot messages */}
                    {message.sender === 'bot' && !message.isError && index !== 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, mb: 1 }}>
                        <Chip
                          icon={<ThumbUpAltOutlined />}
                          label="Helpful"
                          color={feedback[index] === 'like' ? 'success' : 'default'}
                          variant={feedback[index] === 'like' ? 'filled' : 'outlined'}
                          size="small"
                          onClick={() => handleFeedback(index, 'like')}
                          sx={{ cursor: 'pointer' }}
                        />
                        <Chip
                          icon={<ThumbDownAltOutlined />}
                          label="Not helpful"
                          color={feedback[index] === 'dislike' ? 'error' : 'default'}
                          variant={feedback[index] === 'dislike' ? 'filled' : 'outlined'}
                          size="small"
                          onClick={() => handleFeedback(index, 'dislike')}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Stack>
                    )}
                    {/* Product recommendations */}
                    {message.products && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-2 mb-4"
                      >
                        <Divider sx={{ mb: 1, mt: 1 }}>Recommended for you</Divider>
                        <Stack direction="column" spacing={1}>
                          {message.products.map(product => (
                            <Card
                              key={product.id}
                              sx={{
                                maxWidth: '100%',
                                borderRadius: 2,
                                boxShadow: 2,
                                bgcolor: 'background.paper',
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: 6 },
                              }}
                            >
                              <CardActionArea component={Link} to={`/product/${product.id}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CardMedia
                                    component="img"
                                    sx={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 1, m: 1 }}
                                    image={product.image}
                                    alt={product.name}
                                  />
                                  <CardContent sx={{ py: 1, px: 2 }}>
                                    <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600 }}>
                                      {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      £{product.price.toFixed(2)}
                                    </Typography>
                                  </CardContent>
                                </Box>
                              </CardActionArea>
                            </Card>
                          ))}
                        </Stack>
                      </motion.div>
                    )}
                  </Box>
                ))}

                {isLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                <div ref={messageEndRef} />
              </Box>

              <Box
                component="form"
                onSubmit={handleSubmit}
                className="chatbot-input"
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Type your message…"
                  value={input}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  disabled={isLoading}
                  autoFocus={isOpen && !isLoading}
                  inputProps={{
                    'aria-label': 'Type your message',
                    maxLength: 500,
                  }}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                  }}
                />
                <Tooltip title="Send">
                  <span>
                    <IconButton
                      type="submit"
                      color="primary"
                      disabled={isLoading || input.trim() === ''}
                      aria-label="Send message"
                      sx={{
                        bgcolor: 'primary.main',
                        color: '#fff',
                        '&:hover': { bgcolor: 'primary.dark' },
                        borderRadius: 2,
                        boxShadow: 2,
                        ml: 1,
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip title={isOpen ? "Close chat" : "Chat with us"}>
          <Badge
            color="error"
            variant={isOpen ? "dot" : undefined}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Fab
              color="primary"
              aria-label="chat"
              onClick={toggleChat}
              className="chatbot-toggle"
              sx={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 1400,
                boxShadow: theme.shadows[6],
                width: 64,
                height: 64,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
                color: '#fff',
                border: `2px solid ${theme.palette.primary.light}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 60%, ${theme.palette.secondary.dark} 100%)`,
                },
              }}
            >
              {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>
          </Badge>
        </Tooltip>
      </Box>

      <Dialog
        open={gdprDialogOpen}
        onClose={() => setGdprDialogOpen(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        aria-labelledby="gdpr-dialog-title"
        aria-describedby="gdpr-dialog-description"
      >
        <DialogTitle id="gdpr-dialog-title">Data Usage Consent</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Our AI assistant uses conversation data to provide personalized shoe recommendations.
            We collect and process your chat messages to improve our service.
          </Typography>
          <Typography variant="body2" id="gdpr-dialog-description">
            By clicking "Accept", you consent to our data collection practices in accordance with
            our Privacy Policy. You can revoke this consent at any time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGdprDecline} color="secondary">
            Decline
          </Button>
          <Button onClick={handleGdprAccept} color="primary" variant="contained" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;