import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      console.log(data); 
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      console.log('User ID stored:', data.userId); 
      alert('Login successful');
      navigate('/admin'); 
    } catch (error) {
      console.error(error);
      alert('Error during login: ' + error.response.data.error); 
    }
  };
  
 return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block w-100">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
