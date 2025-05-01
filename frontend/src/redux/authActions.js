import { loginStart, loginSuccess, logout } from './authSlice';

export const loginUser = (credentials, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {

    console.log(process.env.REACT_APP_API_URL);
    // return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate('/admin/dashboard');
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
};
