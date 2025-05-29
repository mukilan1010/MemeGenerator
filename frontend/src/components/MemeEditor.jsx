import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

function MemeEditor({ image }) {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [topColor, setTopColor] = useState('#ffffff');
  const [bottomColor, setBottomColor] = useState('#ffffff');
  const [topFont, setTopFont] = useState('Arial');
  const [bottomFont, setBottomFont] = useState('Arial');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [drawSize, setDrawSize] = useState(5);
  const [currentTool, setCurrentTool] = useState('text'); 
  const [memePrompt, setMemePrompt] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [source, setSource] = useState('');
  const [imageData, setImageData] = useState(null);
  const [loginCheckComplete, setLoginCheckComplete] = useState(false);
  const [drawingData, setDrawingData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');

  // Initialize image data
  useEffect(() => {
    if (location.state && location.state.image) {
      localStorage.setItem('previewImage', location.state.image);
      setImageData(location.state.image);
      setSource(location.state.source || '');
    } else {
      const storedImage = localStorage.getItem('previewImage');
      if (storedImage) {
        setImageData(storedImage);
      } else {
        navigate('/create');
      }
    }
  }, [location.state, navigate]);

  // Check login status first
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Restore state after login check is complete
  useEffect(() => {
    if (loginCheckComplete) {
      restoreMemeState();
    }
  }, [loginCheckComplete]);

  // Save state whenever it changes (regardless of login status)
useEffect(() => {
  // Only save if we have some content and login check is complete
  if (loginCheckComplete && (topText || bottomText || uploadedImages.length > 0 || imageData || drawingData)) {
    const currentState = {
      topText,
      bottomText,
      topColor,
      bottomColor,
      topFont,
      bottomFont,
      uploadedImages,
      memePrompt,
      imageData,
      source,
      drawingData, // Add this line
      timestamp: Date.now()
    };
    localStorage.setItem('memeEditorState', JSON.stringify(currentState));
  }
}, [topText, bottomText, topColor, bottomColor, topFont, bottomFont, uploadedImages, memePrompt, imageData, source, drawingData, loginCheckComplete]);

  // Save state when user navigates away
useEffect(() => {
  const handleBeforeUnload = () => {
    // Save current drawing canvas state before unload
    if (drawingCanvasRef.current) {
      const currentDrawingData = drawingCanvasRef.current.toDataURL();
      setDrawingData(currentDrawingData);
    }
    saveCurrentState();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Save current drawing canvas state when page becomes hidden
      if (drawingCanvasRef.current) {
        const currentDrawingData = drawingCanvasRef.current.toDataURL();
        setDrawingData(currentDrawingData);
      }
      saveCurrentState();
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [topText, bottomText, topColor, bottomColor, topFont, bottomFont, uploadedImages, memePrompt, imageData, source]);

  // Handle page visibility changes to check login status
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLoginStatus();
      }
    };

    const handleFocus = () => {
      checkLoginStatus();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);


  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const fonts = [
    'Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS',
    'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT',
    'Lucida Console', 'Palatino Linotype', 'Segoe UI', 'Impact', 'Comic Sans MS',
    'Calibri', 'Cambria', 'Optima', 'Candara', 'Futura',
    'Franklin Gothic Medium', 'Gill Sans', 'Rockwell', 'Baskerville',
    'PT Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Raleway', 'Ubuntu',
    'Merriweather', 'Playfair Display', 'Dancing Script', 'Poppins', 'Nunito'
  ];

  // Save current state to localStorage
const saveCurrentState = () => {
  
  const canvas = drawingCanvasRef.current;
  let currentDrawingData = null;
  if (canvas) {
    currentDrawingData = canvas.toDataURL();
  }

  if (topText || bottomText || uploadedImages.length > 0 || imageData || currentDrawingData) {
    const currentState = {
      topText,
      bottomText,
      topColor,
      bottomColor,
      topFont,
      bottomFont,
      uploadedImages,
      memePrompt,
      imageData,
      source,
      drawingData: currentDrawingData, // Add this line
      timestamp: Date.now()
    };
    localStorage.setItem('memeEditorState', JSON.stringify(currentState));
    console.log('State saved to localStorage');
  }
};

  // Restore meme state from localStorage
  const restoreMemeState = () => {
  const savedState = localStorage.getItem('memeEditorState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      
      // Check if the saved state is recent (within 24 hours)
      const isRecent = state.timestamp && (Date.now() - state.timestamp) < 24 * 60 * 60 * 1000;
      
      if (isRecent) {
        console.log('Restoring meme state from localStorage');
        
        // Only restore if current state is empty/default
        if (!topText && !bottomText && uploadedImages.length === 0) {
          setTopText(state.topText || '');
          setBottomText(state.bottomText || '');
          setTopColor(state.topColor || '#ffffff');
          setBottomColor(state.bottomColor || '#ffffff');
          setTopFont(state.topFont || 'Arial');
          setBottomFont(state.bottomFont || 'Arial');
          setUploadedImages(state.uploadedImages || []);
          setMemePrompt(state.memePrompt || '');
          setSource(state.source || '');
          
          // Restore drawing data
          if (state.drawingData) {
            setDrawingData(state.drawingData);
          }
          
          // Restore image data if available and current imageData is empty
          if (state.imageData && !imageData) {
            setImageData(state.imageData);
            localStorage.setItem('previewImage', state.imageData);
          }
          
          console.log('Meme state restored successfully');
        }
      } else {
        // Clear old state
        localStorage.removeItem('memeEditorState');
        console.log('Old saved state cleared');
      }
    } catch (error) {
      console.error('Error restoring meme state:', error);
      localStorage.removeItem('memeEditorState');
    }
  }
};


  // Check login status
  const checkLoginStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setLoginCheckComplete(true);
        return;
      }

      // Set basic logged in state
      setIsLoggedIn(true);
      setUser({ token });
      
      // Optional: Verify token with backend
      try {
        const response = await fetch('https://memegenerator-btv3.onrender.com/api/login', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          // Token is invalid
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('authToken');
        }
      } catch (verifyError) {
        // If verification fails, but token exists, still allow login
        console.warn('Token verification failed, but proceeding with local token');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoginCheckComplete(true);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: e.target.result,
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            isDragging: false
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Drawing functions
  const startDrawing = useCallback((e) => {
    if (currentTool !== 'draw') return;
    
    setIsDrawing(true);
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, [currentTool]);

  const draw = useCallback((e) => {
    if (!isDrawing || currentTool !== 'draw') return;
    
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [isDrawing, currentTool, drawColor, drawSize]);

const stopDrawing = useCallback(() => {
  setIsDrawing(false);
  
  // Save drawing state after drawing stops
  if (drawingCanvasRef.current) {
    const drawingDataUrl = drawingCanvasRef.current.toDataURL();
    setDrawingData(drawingDataUrl);
  }
}, []);

  // Handle uploaded image positioning
  const handleImageDrag = (imageId, e) => {
    if (currentTool !== 'image') return;
    
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, x: x - img.width/2, y: y - img.height/2 }
          : img
      )
    );
  };

  // Clear drawing canvas
const clearDrawing = () => {
  const canvas = drawingCanvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setDrawingData(null); // Add this line to clear saved drawing data
};


  // Remove uploaded image
  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Save meme to database
  const saveMemeToDatabase = async (memeDataUrl) => {
    try {
      const token = localStorage.getItem('authToken');
      const memeData = {
        userId: user.userId || user.id || user._id,
        imageData: memeDataUrl,
        topText: topText,
        bottomText: bottomText,
        topColor: topColor,
        bottomColor: bottomColor,
        topFont: topFont,
        bottomFont: bottomFont,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('https://memegenerator-btv3.onrender.com/api/memes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memeData),
      });

      if (response.ok) {
        const savedMeme = await response.json();
        console.log('Meme saved successfully:', savedMeme);
        return savedMeme;
      } else {
        console.error('Failed to save meme to database');
        return null;
      }
    } catch (error) {
      console.error('Error saving meme:', error);
      return null;
    }
  };

  // Download meme
  const downloadMeme = async () => {
    // Check if user is logged in before allowing download
    if (!isLoggedIn) {
      // Save current state before redirecting to login
      saveCurrentState();
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      
      alert('Please log in to download memes!');
      navigate('/login');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    // Set canvas dimensions to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the base image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw uploaded images
    uploadedImages.forEach(uploadedImg => {
      const imgElement = new Image();
      imgElement.onload = () => {
        const scaleX = canvas.width / img.offsetWidth;
        const scaleY = canvas.height / img.offsetHeight;
        ctx.drawImage(
          imgElement,
          uploadedImg.x * scaleX,
          uploadedImg.y * scaleY,
          uploadedImg.width * scaleX,
          uploadedImg.height * scaleY
        );
      };
      imgElement.src = uploadedImg.src;
    });

    // Draw drawings from drawing canvas
    if (drawingCanvas.width > 0 && drawingCanvas.height > 0) {
      const scaleX = canvas.width / drawingCanvas.width;
      const scaleY = canvas.height / drawingCanvas.height;
      ctx.drawImage(drawingCanvas, 0, 0, canvas.width, canvas.height);
    }

    // Configure text styling
    const fontSize = Math.max(canvas.width / 15, 20);
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = fontSize / 10;

    // Draw top text
    if (topText) {
      ctx.font = `bold ${fontSize}px ${topFont}`;
      ctx.fillStyle = topColor;
      const topY = fontSize + 20;
      
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topY);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, topY);
    }

    // Draw bottom text
    if (bottomText) {
      ctx.font = `bold ${fontSize}px ${bottomFont}`;
      ctx.fillStyle = bottomColor;
      const bottomY = canvas.height - 20;
      
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
    }

    setTimeout(async () => {
      canvas.toBlob(async (blob) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result;
          
          // Save to database first
          const savedMeme = await saveMemeToDatabase(dataUrl);
          
          if (savedMeme) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `meme_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Meme saved and downloaded successfully!');
            
            localStorage.removeItem("previewImage");
            localStorage.removeItem('memeEditorState');
            navigate('/dashboard');
          } else {
            alert('Failed to save meme. Please try again.');
          }
        };
        reader.readAsDataURL(blob);
      }, 'image/png');
    }, 100);
  };

  const handleBackToCreate = () => {
    navigate('/create');

  };

const handleLoginRedirect = () => {
  // Save current drawing canvas state
  if (drawingCanvasRef.current) {
    const currentDrawingData = drawingCanvasRef.current.toDataURL();
    setDrawingData(currentDrawingData);
  }
  
  saveCurrentState();
  localStorage.setItem('redirectAfterLogin', '/memeedit');
  navigate('/login');
};


  useEffect(() => {
  if (drawingData && drawingCanvasRef.current) {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    
    img.src = drawingData;
  }
}, [drawingData]);


  const imageSrcToUse = localStorage.getItem('previewImage') || imageData || image;

return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 pt-24 pb-8 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Compact Header Section */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToCreate}
            className="group px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 font-semibold flex items-center space-x-2"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Meme ✨
            </h2>
            
            {source && (
              <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/30 shadow-md text-sm">
                <span className="text-gray-700 font-medium">
                  {source === 'upload' ? 'Source: 📤 Uploaded' : 'Source: 🎨 Template'}
                </span>
              </div>
            )}
          </div>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls - Left Column (Reduced Width) */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
            
            {/* Tool Selection */}
            <div className="flex bg-gray-50 rounded-xl p-1 space-x-1 mb-4">
              <button
                onClick={() => setCurrentTool('text')}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex-1 ${
                  currentTool === 'text' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                📝 Text
              </button>
              <button
                onClick={() => setCurrentTool('draw')}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex-1 ${
                  currentTool === 'draw' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                🎨 Draw
              </button>
              <button
                onClick={() => setCurrentTool('image')}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex-1 ${
                  currentTool === 'image' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                🖼️ Image
              </button>
            </div>
            
            {/* Text Controls */}
            {currentTool === 'text' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>📝</span>
                  <span>Text Controls</span>
                </h4>
                
                {/* Top Text */}
                <div className="space-y-3 p-3 bg-purple-50 rounded-xl">
                  <label className="text-sm font-bold text-gray-800">⬆️ Top Text</label>
                  <input
                    type="text"
                    placeholder="Enter top text..."
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Font</label>
                      <select
                        value={topFont}
                        onChange={(e) => setTopFont(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-gray-200 focus:border-purple-400"
                      >
                        {fonts.slice(0, 10).map((font) => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Color</label>
                      <input
                        type="color"
                        value={topColor}
                        onChange={(e) => setTopColor(e.target.value)}
                        className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Text */}
                <div className="space-y-3 p-3 bg-cyan-50 rounded-xl">
                  <label className="text-sm font-bold text-gray-800">⬇️ Bottom Text</label>
                  <input
                    type="text"
                    placeholder="Enter bottom text..."
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Font</label>
                      <select
                        value={bottomFont}
                        onChange={(e) => setBottomFont(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-gray-200 focus:border-cyan-400"
                      >
                        {fonts.slice(0, 10).map((font) => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Color</label>
                      <input
                        type="color"
                        value={bottomColor}
                        onChange={(e) => setBottomColor(e.target.value)}
                        className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Drawing Controls */}
            {currentTool === 'draw' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>🎨</span>
                  <span>Drawing</span>
                </h4>
                
                <div className="space-y-3 p-3 bg-orange-50 rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-gray-800 block mb-2">Brush Color</label>
                    <input
                      type="color"
                      value={drawColor}
                      onChange={(e) => setDrawColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-gray-800 flex justify-between mb-2">
                      <span>Brush Size</span>
                      <span className="text-xs bg-white px-2 py-1 rounded">{drawSize}px</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={drawSize}
                      onChange={(e) => setDrawSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    onClick={clearDrawing}
                    className="w-full px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🗑️ Clear Drawing
                  </button>
                </div>
              </div>
            )}

            {/* Image Upload Controls */}
            {currentTool === 'image' && (
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>🖼️</span>
                  <span>Images</span>
                </h4>
                
                <div className="space-y-2 p-3 bg-blue-50 rounded-xl">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full px-3 py-2 bg-blue-500 text-white font-semibold text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    📁 Upload Images
                  </button>
                  
                  {uploadedImages.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      <h5 className="font-semibold text-gray-800 text-xs">
                        📸 Uploaded ({uploadedImages.length})
                      </h5>
                      {uploadedImages.map((img) => (
                        <div key={img.id} className="flex items-center justify-between bg-white p-1.5 rounded-md border text-xs">
                          <img src={img.src} alt="Uploaded" className="w-6 h-6 object-cover rounded" />
<span className="text-gray-600 text-xs truncate flex-1 mx-2">Image {String(img.id).slice(-4)}</span>                          <button
                            onClick={() => removeImage(img.id)}
                            className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Login Warning */}
            {authToken==null && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">⚠️</span>
                  <div className="space-y-2">
                    <div className="font-bold text-yellow-800 text-sm">Login Required</div>
                    <p className="text-yellow-700 text-xs">Please log in to save and download your memes!</p>
                    <button 
                      onClick={() => {
                        const currentState = {
                          topText,
                          bottomText,
                          topColor,
                          bottomColor,
                          topFont,
                          bottomFont,
                          uploadedImages,
                          memePrompt,
                          imageData
                        };
                        localStorage.setItem('memeEditorState', JSON.stringify(currentState));
                        localStorage.setItem('redirectAfterLogin', '/memeedit');
                        navigate('/login');
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white font-semibold text-xs rounded hover:bg-yellow-600"
                    >
                      Login Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={downloadMeme}
              className={`w-full px-4 py-3 ${
                authToken!=null
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
              disabled={!isLoggedIn}
            >
              <span>💾</span>
              <span>{authToken!=null ? 'Download Meme' : 'Login to Download'}</span>
            </button>
          </div>
        </div>

        {/* Meme Preview - Right Column (Increased Size) */}
        <div className="lg:col-span-3 order-1 lg:order-2">
<div className="bg-white/60 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/30 max-w-xl mx-auto">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 shadow-inner">
                  <img 
                    ref={imgRef}
                    src={imageSrcToUse} 
                    alt="Meme" 
                      className="w-full max-h-[500px] object-contain rounded-lg shadow-md border-2 border-white"

                    crossOrigin="anonymous"
                    onLoad={() => {
                      const canvas = drawingCanvasRef.current;
                      const img = imgRef.current;
                      if (canvas && img) {
                        canvas.width = img.offsetWidth;
                        canvas.height = img.offsetHeight;
                      }
                    }}
                  />
                  
                  {/* Drawing Canvas Overlay */}
                  <canvas
                    ref={drawingCanvasRef}
                    className="absolute top-3 left-3 right-3 bottom-3 rounded-lg cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ 
                      pointerEvents: currentTool === 'draw' ? 'auto' : 'none',
                      zIndex: currentTool === 'draw' ? 10 : 1,
                      width: 'calc(100% - 1.5rem)',
                      height: 'calc(100% - 1.5rem)'
                    }}
                  />
                  
                  {/* Top Text */}
                  {topText && (
                    <h2
                      className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-black text-center px-2 leading-tight select-none"
                      style={{ 
                        color: topColor, 
                        fontFamily: topFont,
                        textShadow: `
                          2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
                          1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000
                        `,
                        textTransform: 'uppercase',
                        zIndex: 20,
                        WebkitTextStroke: '1px #000'
                      }}
                    >
                      {topText}
                    </h2>
                  )}
                  
                  {/* Bottom Text */}
                  {bottomText && (
                    <h2
                      className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-black text-center px-2 leading-tight select-none"
                      style={{ 
                        color: bottomColor, 
                        fontFamily: bottomFont,
                        textShadow: `
                          2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
                          1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000
                        `,
                        textTransform: 'uppercase',
                        zIndex: 20,
                        WebkitTextStroke: '1px #000'
                      }}
                    >
                      {bottomText}
                    </h2>
                  )}
                  
                  {/* Uploaded Images */}
                  {uploadedImages.map((uploadedImg) => (
                    <img
                      key={uploadedImg.id}
                      src={uploadedImg.src}
                      alt="Uploaded overlay"
                      className="absolute cursor-move border-2 border-dashed border-blue-400 rounded-md shadow-md hover:border-blue-500 transition-colors duration-300"
                      style={{
                        left: uploadedImg.x + 12,
                        top: uploadedImg.y + 12,
                        width: uploadedImg.width,
                        height: uploadedImg.height,
                        zIndex: 15,
                        pointerEvents: currentTool === 'image' ? 'auto' : 'none'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const handleMouseMove = (moveEvent) => {
                          handleImageDrag(uploadedImg.id, moveEvent);
                        };
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  ))}
                </div>
                
                {/* Tool Instructions */}
                {currentTool === 'draw' && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                    <p className="text-orange-700 font-medium">🎨 Click and drag to draw</p>
                  </div>
                )}
                {currentTool === 'image' && uploadedImages.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <p className="text-blue-700 font-medium">🖼️ Drag images to reposition</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for download functionality */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  </div>
);
}

export default MemeEditor;