import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tweets API
export const tweetsAPI = {
  search: (query = '$fish', maxResults = 20) =>
    api.get('/tweets', { params: { query, maxResults } }),

  getRecommendations: (tweetText, limit = 5) =>
    api.post('/tweets/recommend', { tweetText, limit }),
};

// Memes API
export const memesAPI = {
  getAll: (params = {}) =>
    api.get('/memes', { params }),

  getById: (id) =>
    api.get(`/memes/${id}`),

  upload: (formData) =>
    api.post('/memes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  like: (id) =>
    api.post(`/memes/${id}/like`),

  delete: (id) =>
    api.delete(`/memes/${id}`),
};

// Users API
export const usersAPI = {
  signup: (email, subscribedToUpdates = true) =>
    api.post('/users/signup', { email, subscribedToUpdates }),

  getCount: () =>
    api.get('/users/count'),
};

export default api;
