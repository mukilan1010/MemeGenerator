import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiLinkedin, FiUsers, FiImage, FiDownload, FiStar } from 'react-icons/fi';

function About() {
  const features = [
    {
      icon: <FiImage className="w-6 h-6" />,
      title: "Popular Templates",
      description: "Choose from hundreds of trending meme templates or upload your own images"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "User-Friendly",
      description: "Simple and intuitive interface that anyone can use to create amazing memes"
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "High Quality Download",
      description: "Download your memes in high resolution for sharing on social media"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Save & Manage",
      description: "Create an account to save your favorite memes and access them anytime"
    }
  ];

  const teamMembers = [
    {
      name: "Mukilan N",
      role: "Lead Developer",
      email:" mukilan291024@gmail.com",
    }
   
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              About MemeGen
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The ultimate destination for creating, sharing, and enjoying the best memes on the internet. 
              Turn your ideas into viral content with our powerful and easy-to-use meme generator.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">What We Do</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              MemeGen is a cutting-edge web application built with React and modern technologies that empowers users 
              to create hilarious and engaging memes. Whether you're a social media enthusiast, content creator, 
              or just someone who loves to laugh, our platform provides all the tools you need to bring your 
              creative ideas to life.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">Our Mission</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                We believe that laughter is the universal language that brings people together. Our mission is to 
                democratize meme creation and make it accessible to everyone, regardless of their technical skills 
                or design experience.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                From trending templates to custom uploads, from simple text overlays to advanced editing features, 
                we're constantly evolving to provide the best meme-making experience on the web.
              </p>
            </div>
          </div>

          {/* Meet Our Team Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">{member.name}</h3>
                  <p className="text-purple-300 font-medium mb-3">{member.role}</p>
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-slate-400 hover:text-purple-300 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-4 h-4" />
                    {member.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Get In Touch</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Details */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                      <FiMail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <a href="mailto:hello@memegen.com" className="text-white text-lg font-semibold hover:text-purple-300 transition-colors duration-300">
                        mukilan291024@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                      <FiPhone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <a href="tel:+1234567890" className="text-white text-lg font-semibold hover:text-purple-300 transition-colors duration-300">
                        +91 8148345963
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                      <FiMapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Address</p>
                      <p className="text-white text-lg font-semibold">
                        123 Meme Street<br />
                        Chennai Tamilnadu India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Follow Us</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <a 
                    href="https://github.com/mukilan1010" 
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                      <FiGithub className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">GitHub</p>
                      <p className="text-slate-400 text-sm">Check out our open source projects</p>
                    </div>
                  </a>

                  <a 
                    href="https://www.linkedin.com/in/mukilan-n-90a8ab25a/" 
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                      <FiLinkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">LinkedIn</p>
                      <p className="text-slate-400 text-sm">Connect with our professional network</p>
                    </div>
                  </a>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
                  <h4 className="text-white font-semibold text-lg mb-3">Quick Support</h4>
                  <p className="text-slate-300 text-sm mb-4">
                    Need help or have questions? We're here to assist you!
                  </p>
                  <a 
                    href="mailto:mukilan291024@gmail.com"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    <FiMail className="w-4 h-4" />
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;