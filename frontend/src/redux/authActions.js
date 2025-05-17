import { loginStart, loginSuccess, logout } from './authSlice';

export const loginUser = (credentials, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {

    const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    let data = null;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Invalid JSON response from server');
      return;
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
