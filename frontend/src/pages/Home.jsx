import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiZap, FiShare2, FiTrendingUp, FiUsers, FiAward, FiPlay, FiArrowRight } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiImage className="w-8 h-8" />,
      emoji: "🎨",
      title: "Custom Templates",
      description: "Choose from hundreds of popular meme templates or upload your own images to create unique content.",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      emoji: "⚡",
      title: "Quick Creation",
      description: "Add text, customize fonts, colors, and create professional memes in seconds with our intuitive editor.",
      color: "from-cyan-400 to-blue-400"
    },
    {
      icon: <FiShare2 className="w-8 h-8" />,
      emoji: "🚀",
      title: "Share Instantly",
      description: "Download your memes in high quality or share them directly to all your favorite social media platforms.",
      color: "from-green-400 to-emerald-400"
    }
  ];

  const stats = [
    { icon: <FiTrendingUp className="w-6 h-6" />, number: "10K+", label: "Memes Created" },
    { icon: <FiUsers className="w-6 h-6" />, number: "2.5K+", label: "Happy Users" },
    { icon: <FiAward className="w-6 h-6" />, number: "500+", label: "Templates" },
  ];

  const handleGetStarted = () => {
    navigate('/create');
  };

  const handleWatchDemo = () => {
    // You can implement a demo modal or navigate to a demo page
    console.log('Watch demo clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-24 p-6 text-center">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-6 py-2 mb-8 shadow-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-700 font-medium">✨ Now with AI-powered suggestions!</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Welcome to MemeGen 🎉
            </h1>
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your ideas into viral content! Create professional memes using our extensive template library 
              or upload your own images for unlimited creativity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Start Creating Memes ✨
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button 
                onClick={handleWatchDemo}
                className="group px-8 py-4 bg-white/60 backdrop-blur-sm border border-white/40 text-gray-700 font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 flex items-center gap-2"
              >
                <FiPlay className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-6 py-3 shadow-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose MemeGen?</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Powerful features designed to make meme creation fun, fast, and professional
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/40 hover:scale-105 hover:bg-white/80"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="text-4xl absolute -top-2 -right-2 group-hover:animate-bounce">
                      {feature.emoji}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 mb-12">Create amazing memes in just 3 simple steps</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Choose Template", desc: "Browse our collection or upload your image", icon: "🖼️" },
                { step: "02", title: "Add Your Text", desc: "Customize fonts, colors, and positioning", icon: "✏️" },
                { step: "03", title: "Download & Share", desc: "Save in high quality and share anywhere", icon: "📤" }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <div className="text-sm font-bold text-purple-600 mb-2">STEP {item.step}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Go Viral?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already making amazing memes with MemeGen. 
              Your next viral hit is just a click away!
            </p>
            <button 
              onClick={handleGetStarted}
              className="group px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              Create Your First Meme
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <FiArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;