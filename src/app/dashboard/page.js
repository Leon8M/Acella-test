"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Mock cart item count, replace with actual cart logic
  const cartItemCount = 3;

  // Fetch user data from the microservice
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');

        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found');

        const response = await fetch(`https://user-microservice1.onrender.com/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
 // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Head><title>Loading...</title></Head>
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Accela Ecommerce</title>
      </Head>

      {/* Navbar */}
      <header className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between py-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 rounded-md focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Accela</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9h14l-2-9M9 22a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-between py-3 gap-4">
            <h1 className="text-2xl font-bold shrink-0">Accela</h1>

            {/* Search bar - it will be hidden on mobile devices, I will improve later */}
            <div className="flex-1 mx-2 min-w-0">
              <div className="flex items-center bg-white rounded overflow-hidden w-full max-w-2xl border border-gray-300">
                <select className="hidden sm:block bg-gray-100 text-sm px-2 py-2 border-r border-gray-300 text-gray-700 focus:outline-none">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Books</option>
                  <option>Clothing</option>
                </select>
                <input
                  type="text"
                  placeholder="Search Accela"
                  className="flex-grow px-4 py-2 text-sm text-black focus:outline-none min-w-0 bg-white"
                />
                <button className="px-4 py-2 bg-yellow-400 h-full hover:bg-yellow-500 text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.5z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Hello Dropdown */}
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="flex items-center space-x-1 hover:underline"
                >
                  <span className="text-sm">Hello, {user?.firstName || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10 text-black">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart, should be updated soon */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9h14l-2-9M9 22a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-[#232F3E] py-3 px-4">
              <div className="mb-4">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-white"
                >
                  <span>Hello, {user?.firstName || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="mt-2 ml-4">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-1 text-white hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Search Accela"
                  className="w-full px-4 py-2 text-sm text-black rounded focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-orange-100 text-black py-6 md:py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">HOME SHOPPING SPREE</h1>
            <p className="text-base md:text-lg font-medium">FESTIVE EDITION <br /> <span className="text-lg md:text-xl">UP TO 70% OFF</span></p>
            <p className="text-xs md:text-sm mt-1">4<sup>th</sup> - 10<sup>th</sup> September</p>
            <div className="flex justify-center md:justify-start gap-3 md:gap-4 mt-2 text-xs md:text-sm font-semibold">
              <span>🔥 TOP BRANDS</span>
              <span>📦 WIDE SELECTION</span>
            </div>
          </div>
          <div className="w-48 h-24 md:w-64 md:h-32 bg-white rounded shadow-md flex items-center justify-center">
            <span className="text-gray-500 text-sm md:text-base">Hero Image</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Panel - moves to top on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-none">
            <div className="bg-white p-4 shadow rounded-lg sticky top-24">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-200" />
                <h2 className="text-lg font-semibold mt-2 text-gray-800">Hi, {user?.firstName || 'User'}</h2>
                <p className="text-sm text-gray-600">Customer since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2 text-gray-800">Top links for you</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-100 p-2 rounded text-center text-gray-700 hover:bg-gray-200 cursor-pointer">Your Orders</div>
                  <div className="bg-gray-100 p-2 rounded text-center text-gray-700 hover:bg-gray-200 cursor-pointer">Mobiles</div>
                  <div className="bg-gray-100 p-2 rounded text-center text-gray-700 hover:bg-gray-200 cursor-pointer">Watches</div>
                  <div className="bg-gray-100 p-2 rounded text-center text-gray-700 hover:bg-gray-200 cursor-pointer">Fashion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Sections */}
          <div className="lg:col-span-3 space-y-6">
            {/* Deals Section */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-bold mb-3 text-gray-800">Up to 70% off | Electronics clearance store</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600 hover:shadow-md transition">
                    Product {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Section */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-bold mb-3 text-gray-800">LAPTOPS FROM TOP BRANDS</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-100 rounded flex items-center justify-center text-xs sm:text-sm text-gray-600 hover:shadow-md transition">
                    Brand {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}