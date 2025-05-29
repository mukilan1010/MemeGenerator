import TemplateSelector from "../components/TemplateSelector";
import UploadImage from "../components/UploadImage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Create() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeOption, setActiveOption] = useState(""); 
  const navigate = useNavigate();

  
  useEffect(() => {
    if (selectedImage) {
    localStorage.setItem('previewImage',selectedImage);
      navigate('/memeedit', { 
        state: { 
          image: selectedImage,
          source: activeOption 
        } 
      });
    }
  }, [selectedImage, navigate, activeOption]);

  return (
    <div className="pt-24 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
            Create Meme ✨
          </h2>
          <p className="text-xl text-gray-600">
            Choose your starting point and let the creativity flow!
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <button
            className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden ${
              activeOption === "upload"
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/20 shadow-lg hover:shadow-xl"
            }`}
            onClick={() => {
              setActiveOption("upload");
              setSelectedImage(null);
            }}
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span className="text-2xl">📤</span>
              <span>Upload Image</span>
            </span>
            {activeOption === "upload" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>

          <button
            className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden ${
              activeOption === "template"
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/20 shadow-lg hover:shadow-xl"
            }`}
            onClick={() => {
              setActiveOption("template");
              setSelectedImage(null);
            }}
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span className="text-2xl">🎨</span>
              <span>Choose Template</span>
            </span>
            {activeOption === "template" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {!activeOption && (
            <div className="text-center py-16">
              <div className="text-8xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Ready to Create?</h3>
              <p className="text-gray-500">Select an option above to get started with your meme masterpiece!</p>
            </div>
          )}

          {/* Upload Section */}
          {activeOption === "upload" && (
            <div className="animate-fadeIn">
              
              <UploadImage setSelectedImage={setSelectedImage} />
            </div>
          )}

          {/* Template Section */}
          {activeOption === "template" && (
            <div className="animate-fadeIn">
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <span className="text-3xl">🎨</span>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Choose a Template
                  </h3>
                </div>
              </div>
              <TemplateSelector setSelectedImage={setSelectedImage} />
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {activeOption && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                activeOption ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm font-medium text-gray-600">Step 1: Choose Source</span>
              
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-600">Step 2: Edit Meme</span>
              
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-600">Step 3: Download & Share</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;