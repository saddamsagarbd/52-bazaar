import { loginStart, loginSuccess } from './authSlice';

const loginUser = (credentials, navigate, apiUrl) => async (dispatch) => {
  dispatch(loginStart());
  try {

    const response = await fetch(`${apiUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(credentials),
    });

    const contentType = response.headers.get("content-type");

    let data = {};

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error('Unexpected response format from server');
    }
    
    if (response.ok) {
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');

      navigate('/admin/dashboard');
    } else {
      console.error('Login failed:', data?.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
};

export default loginUser;
