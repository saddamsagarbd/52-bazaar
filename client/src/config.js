export const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://52-bazaar-api.vercel.app/api' 
    : 'http://localhost:5000/api';