import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { setUser } = useAuth(); // get setUser from context
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

const loginUser = async (event) => {
  event.preventDefault();

  const { email, password } = loginForm;
  
  // Check if we're coming from meme editor page
  const isFromMemeEditor = window.location.pathname === '/memeedit' || 
                          document.referrer.includes('/memeedit');
  
  const savedState = localStorage.getItem('memeEditorState');

  try {
    const response = await fetch('https://memegenerator-btv3.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

   if (response.ok) {
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  setUser({ email: data.email });
  const pimage = localStorage.getItem('previewImage');
  const redirectUrl = localStorage.getItem('redirectAfterLogin');
  
  // Check if user has saved work or was redirected from meme editor
  if (savedState || (pimage && pimage.trim() !== "")) {
    navigate('/memeedit'); // Go back to editor with saved state
  } else if (redirectUrl) {
    navigate(redirectUrl); // Go to the page they were trying to access
    localStorage.removeItem('redirectAfterLogin');
  } else {
    // Default: go to dashboard/home instead of create page
    navigate('/dashboard'); // or navigate('/') for home page
  }
} else {
      const errorData = await response.json();
      alert('Login failed: ' + errorData.message);
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-56 h-56 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/15 to-purple-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content Container */}
<div className="flex flex-col items-center justify-center min-h-screen p-6 pt-30">
        <div className="w-full max-w-md">
          {/* Logo and Title Section */}
          <div className="flex items-center mb-10 space-x-4 justify-center">
            <a href="/" className="inline-block">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300 shadow-2xl shadow-purple-500/50">
                  <span className="text-4xl font-black text-white">MM</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
            </a>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                MemeGen
              </h1>
              <p className="text-gray-400 text-sm">Create & Share Amazing Memes</p>
            </div>
          </div>

          {/* Login Form Container */}
          <form
            onSubmit={loginUser}
            className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back! ✨</h2>
              <p className="text-gray-400 text-sm">Sign in to continue creating memes</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={loginForm.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 rounded bg-white/5 border-white/20 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full relative group py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl text-white font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Sign In</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <a
                    href="/signup"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Create one here
                  </a>
                </p>
              </div>
            </div>
          </form>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              
            </div>

            
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <span>←</span>
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
