import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [signupForm, setSignupForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const signupUser = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = signupForm;

    try {
      const response = await fetch('https://memegenerator-btv3.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong during signup');
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-800 relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-56 h-56 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-green-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-teal-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Logo Section - aligned horizontally */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            <a href="/" className="inline-block">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300 shadow-2xl shadow-blue-500/50">
                  <span className="text-4xl font-black text-white">MM</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
            </a>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                MemeGen
              </h1>
              <p className="text-gray-400 text-sm">Create & Share Amazing Memes</p>
            </div>
          </div>

          {/* Signup Form Container */}
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Join MemeGen! 🎉</h2>
              <p className="text-gray-400 text-sm">Create your account and start memeing</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={signupForm.username}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={signupForm.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupForm.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={signupForm.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input type="checkbox" className="mt-1 rounded bg-white/5 border-white/20 text-blue-500 focus:ring-blue-500/50" required />
                <p className="text-gray-400 text-sm">
                  I agree to the{' '}
                  <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Privacy Policy
                  </button>
                </p>
              </div>

              <button
                onClick={signupUser}
                className="w-full relative group py-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-xl text-white font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>🌟</span>
                  <span>Create Account</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>

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

export default SignupPage;
