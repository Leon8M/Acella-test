"use client";

import { useState } from 'react';
import Head from 'next/head';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://user-microservice1.onrender.com';
export const dynamic = 'force-dynamic';
export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const storeAuthData = (token, userId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      sessionStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    // Basic validation, could be improved later, I would appreciate advice
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      // Extract token and user data from response, should be done better to safety I think
      const authToken = data.accessToken;
      const user = data.user;
  
      if (!authToken) {
        throw new Error('No authentication token received');
      }
  
      if (!user?.id) {
        throw new Error('No user ID received');
      }
  
      // Store both token and user ID in local storage
      storeAuthData(authToken, user.id);
  
      // Redirect to dashboard, a simple one
      router.push('/dashboard');
  
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 sm:p-6 lg:p-8">
      <Head>
        <title>Login</title>
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 bg-gray-300 rounded-full mb-4"></div>
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <button 
          type="button"
          className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-400">OR</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 pr-10 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-sm font-medium py-2 rounded-full transition ${
              isLoading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          You do not have an account?{" "}
          <a href="/register" className="text-gray-700 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
