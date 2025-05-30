"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_BASE_URL = "https://user-microservice1.onrender.com";
const AUTH_ENDPOINTS = {
  register: "/auth/register",
  checkEmail: "/auth/check-email" // Assuming this endpoint exists
};
export const dynamic = 'force-dynamic';
export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "user",
    phone: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const makeApiCall = async (endpoint, data) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API call to: ${url}`, { data });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log(`API call to ${url} completed with status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API error response:`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(`API success response:`, responseData);
      return responseData;
    } catch (error) {
      console.error('API call failed:', {
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };

//  const checkEmailExists = async (email) => {
  //  if (!email) return;
    
  //  try {
   //   console.log(`Checking if email exists: ${email}`);
      // Once we have a dedicated check-email endpoint:
      // const response = await makeApiCall(AUTH_ENDPOINTS.checkEmail, { email });
      // setErrors(prev => ({...prev, email: response.exists ? "Email already in use." : ""}));
      
      // This could be a temporary implementation until check-email endpoint is available
   //   const response = await makeApiCall("/users", { email });
  //    const emailExists = response.some(user => user.email === email);
   //   setErrors(prev => ({...prev, email: emailExists ? "Email already in use." : ""}));
   // } catch (error) {
    //  console.error("Email check failed:", error);
   // }
  //};

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasMinLength && hasLetter && hasNumber;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ""}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({...prev, password: "Passwords do not match."}));
      setIsLoading(false);
      return;
    }

    if (!passwordValid) {
      setErrors(prev => ({...prev, password: "Password does not meet requirements."}));
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with data:", {
        ...formData,
        password: "******" // Never log actual passwords
      });

      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        phone: formData.phone
      };

      const response = await makeApiCall(AUTH_ENDPOINTS.register, registrationData);
      
      console.log("Registration successful, response:", response);
      setRegistrationSuccess(true);
      
      // Redirect to login after short delay to show success message
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration failed:", {
        error: error.message,
        formData: {
          ...formData,
          password: "******"
        },
        timestamp: new Date().toISOString()
      });
      
      setErrors(prev => ({
        ...prev,
        password: error.message || "Registration failed. Please try again."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.email) {
      const timer = setTimeout(() => {
        checkEmailExists(formData.email);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email]);

  useEffect(() => {
    setPasswordValid(validatePassword(formData.password));
  }, [formData.password]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 sm:p-6 lg:p-8">
      <Head>
        <title>Register</title>
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 bg-gray-300 rounded-full mb-4"></div>
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Create your account
          </h2>
        </div>

        <button 
          type="button"
          className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign up with Google
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
          {registrationSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Registration successful! Redirecting to login...
            </div>
          )}

          <h3 className="text-center text-sm font-medium text-gray-700">Sign up with your email</h3>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 pr-10 text-black"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
            <p className={`text-xs mt-1 ${passwordValid ? "text-green-600" : "text-gray-500"}`}>
              Password must be at least 8 characters, include letters and numbers.
            </p>
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (should include country code)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={errors.email || !passwordValid || isLoading}
            className={`w-full text-sm font-medium py-2 rounded-full transition ${
              errors.email || !passwordValid || isLoading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isLoading ? "Registering..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-gray-700 underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
