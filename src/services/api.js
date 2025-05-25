import axios from 'axios';

// Axios instance for real API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Real API functions ---

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const getProductsByCategory = async (category, params = {}) => {
  try {
    const response = await api.get(`/products/?category=${category}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/create/', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders/');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews/create/`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/reviews/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist/');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await api.post('/wishlist/', { product_id: productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/wishlist/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// --- Mock API for development/fallback ---

/** Simulate network latency for mock responses */
const simulateLatency = (data, delay = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

/** Mock product data for Shop and chatbot */
export const getMockProducts = () => [
  {
    id: 1,
    name: "Air Cloud Runner",
    price: 129.99,
    category: "running",
    gender: "men",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    description: "The Air Cloud Runner features responsive cushioning and a breathable mesh upper for maximum comfort during your run.",
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    colors: ["Black/White", "Blue/Gray", "Red/Black"],
    rating: 4.5,
    reviews: 128,
    inStock: true
  },
  {
    id: 2,
    name: "Street Force One",
    price: 149.99,
    category: "casual",
    gender: "men",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    description: "Classic street style with modern comfort.",
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    colors: ["White", "Black", "Gray"],
    rating: 4.8,
    reviews: 256,
    inStock: true
  },
  {
    id: 3,
    name: "Kids Sport Runner",
    price: 79.99,
    category: "running",
    gender: "kids",
    image: "https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg",
    description: "Comfortable and durable running shoes for active kids.",
    sizes: [3, 4, 5, 6],
    colors: ["Blue/Orange", "Pink/White", "Green/Yellow"],
    rating: 4.6,
    reviews: 89,
    inStock: true
  },
  {
    id: 4,
    name: "Women's Flex Trainer",
    price: 119.99,
    category: "running",
    gender: "women",
    image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
    description: "Versatile training shoe with responsive cushioning.",
    sizes: [5, 6, 7, 8, 9],
    colors: ["Pink/Gray", "Black/White", "Purple/Blue"],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: 5,
    name: "Classic Canvas",
    price: 69.99,
    category: "casual",
    gender: "women",
    image: "https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg",
    description: "Timeless canvas design with enhanced comfort.",
    sizes: [5, 6, 7, 8, 9],
    colors: ["White", "Black", "Navy", "Red"],
    rating: 4.4,
    reviews: 187,
    inStock: true
  },
  {
    id: 6,
    name: "Winter Trek Boot",
    price: 199.99,
    category: "boots",
    gender: "men",
    image: "https://images.pexels.com/photos/267242/pexels-photo-267242.jpeg",
    description: "Waterproof leather and insulated lining for cold weather protection.",
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["Brown", "Black", "Tan"],
    rating: 4.7,
    reviews: 76,
    inStock: true
  }
];

/** Filter mock products by category, gender, or search term */
export const filterMockProducts = ({ category, gender, search } = {}) => {
  let products = getMockProducts();
  if (category) products = products.filter(p => p.category === category);
  if (gender) products = products.filter(p => p.gender === gender);
  if (search)
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );
  return products;
};

/** Enhanced mock chatbot response with keyword-based recommendations */
const mockChatbotResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good (morning|afternoon|evening))$/)) {
    return {
      message: "Hello! Welcome to Walknex. What kind of shoes are you looking for today?",
      recommendations: []
    };
  }

  // Goodbyes
  if (lowerMessage.match(/^(bye|goodbye|thanks|thank you)$/)) {
    return {
      message: "Thank you for chatting with me! Have a great day.",
      recommendations: []
    };
  }

  // Keyword-based recommendations
  const keywords = [
    { key: "running", category: "running" },
    { key: "casual", category: "casual" },
    { key: "boot", category: "boots" },
    { key: "kids", gender: "kids" },
    { key: "women", gender: "women" },
    { key: "men", gender: "men" }
  ];

  for (const { key, category, gender } of keywords) {
    if (lowerMessage.includes(key)) {
      const recs = filterMockProducts({ category, gender }).slice(0, 2);
      if (recs.length) {
        return {
          message: `Here are some ${key} shoes you might like:`,
          recommendations: recs
        };
      }
    }
  }

  // Default response
  return simulateLatency({
    message: "I understand you're interested in finding the right shoes. Could you tell me more about what you're looking for?",
    recommendations: getMockProducts().slice(0, 2)
  });
};

// --- Chatbot API with fallback to mock ---
export const getChatbotResponse = async (message, sessionId) => {
  try {
    const response = await api.post('/chatbot/', {
      message,
      session_id: sessionId
    });

    if (response.data && response.data.message) {
      return {
        message: response.data.message,
        recommendations: response.data.recommendations || []
      };
    }
    return mockChatbotResponse(message);

  } catch (error) {
    console.error('Chatbot API error:', error);
    if (process.env.NODE_ENV === 'development' || error.code === 'ECONNABORTED') {
      return mockChatbotResponse(message);
    }
    throw error;
  }
};

export default api;