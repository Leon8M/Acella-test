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

  // Simulate cart item count
  const cartItemCount = 3;

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
      <header className="bg-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Accela</h1>

          {/* Search bar */}
          <div className="flex-1 mx-4">
            <div className="flex items-center bg-white rounded overflow-hidden w-full max-w-2xl border border-gray-300">
              <select className="bg-gray-100 text-sm px-2 py-2 border-r border-gray-300 text-gray-700 focus:outline-none">
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Food</option>
              </select>
            <input
              type="text"
              placeholder="Search Accela"
              className="flex-grow px-4 py-2 text-sm text-black focus:outline-none"
            />
            <button className="px-4 py-2 bg-yellow-400 h-full hover:bg-yellow-500 text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.5z" />
              </svg>
            </button>
          </div>
         </div>

          {/* Right section: Hello & Cart */}
          <div className="flex items-center space-x-6">
            {/* Hello Dropdown */}
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-1">
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

            {/* Cart */}
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
      </header>

      {/* Hero Banner */}
      <div className="bg-orange-100 text-black py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold">HOME SHOPPING SPREE</h1>
            <p className="text-lg font-medium">FESTIVE EDITION <br /> <span className="text-xl">UP TO 70% OFF</span></p>
            <p className="text-sm mt-1">4<sup>th</sup> - 10<sup>th</sup> September</p>
            <div className="flex gap-4 mt-2 text-sm font-semibold">
              <span>🔥 TOP BRANDS</span>
              <span>📦 WIDE SELECTION</span>
            </div>
          </div>
          <div className="w-64 h-32 bg-white rounded shadow-md flex items-center justify-center">
            <span className="text-gray-500">Hero Image</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: User Panel */}
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-200" />
            <h2 className="text-lg font-semibold mt-2 text-gray-800">Hi, {user?.firstName || 'User'}</h2>
            <p className="text-sm text-gray-600">Customer since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-gray-800">Top links for you</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-100 p-2 rounded text-center text-gray-700">Your Orders</div>
              <div className="bg-gray-100 p-2 rounded text-center text-gray-700">Mobiles & Accessories</div>
              <div className="bg-gray-100 p-2 rounded text-center text-gray-700">Watches for Men</div>
              <div className="bg-gray-100 p-2 rounded text-center text-gray-700">Fashion</div>
            </div>
          </div>
        </div>

        {/* Center: Product Sections */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Up to 70% off | Electronics clearance store</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600">
                  Product Image {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-bold mb-3 text-gray-800">LAPTOPS FROM TOP BRANDS</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600">
                  Brand {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
