import React, { useEffect,useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";



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

useEffect(() => {
  checkLoginStatus();
  restoreMemeState(); // Restore meme state if returning from login
}, []);

useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Page became visible, check login status
      checkLoginStatus();
    }
  };

  // Also check when window gets focus
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
  };

  // Remove uploaded image
  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };


  const restoreMemeState = () => {
  const savedState = localStorage.getItem('memeEditorState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      setTopText(state.topText || '');
      setBottomText(state.bottomText || '');
      setTopColor(state.topColor || '#ffffff');
      setBottomColor(state.bottomColor || '#ffffff');
      setTopFont(state.topFont || 'Arial');
      setBottomFont(state.bottomFont || 'Arial');
      setUploadedImages(state.uploadedImages || []);
      setMemePrompt(state.memePrompt || '');
      
      // Clear the saved state after restoring
      localStorage.removeItem('memeEditorState');
      
      // Show a message that the state was restored
      setTimeout(() => {
        alert('Welcome back! Your meme has been restored. You can now download it.');
      }, 1000);
      
    } catch (error) {
      console.error('Error restoring meme state:', error);
      localStorage.removeItem('memeEditorState'); // Clear corrupted state
    }
  }
};



const checkLoginStatus = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    // For now, if token exists, assume user is logged in
    // You can add API verification later if needed
    setIsLoggedIn(true);
    setUser({ token }); // Set basic user data
    
    // Optional: Verify token with backend
    try {
      const response = await fetch('http://localhost:5000/api/login', {
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
      // This handles cases where backend might be down
      console.warn('Token verification failed, but proceeding with local token');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    setIsLoggedIn(false);
    setUser(null);
  }
};


const saveMemeToDatabase = async (memeDataUrl) => {
  try {
    const token = localStorage.getItem('authToken');
    const memeData = {
      userId: user.userId || user.id || user._id, // Adjust based on your user object structure
      imageData: memeDataUrl,
      topText: topText,
      bottomText: bottomText,
      topColor: topColor,
      bottomColor: bottomColor,
      topFont: topFont,
      bottomFont: bottomFont,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch('http://localhost:5000/api/memes', {
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


 const downloadMeme = async () => {
  // Check if user is logged in before allowing download
  if (!isLoggedIn) {
    // Store current page URL and meme state before redirecting to login
    const currentState = {
      topText,
      bottomText,
      topColor,
      bottomColor,
      topFont,
      bottomFont,
      uploadedImages,
      memePrompt,
      image
    };
    localStorage.setItem('memeEditorState', JSON.stringify(currentState));
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

  // Convert canvas to data URL and save to database
  setTimeout(async () => {
    canvas.toBlob(async (blob) => {
      // Convert blob to data URL for database storage
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
        } else {
          alert('Failed to save meme. Please try again.');
        }
      };
      reader.readAsDataURL(blob);
    }, 'image/png');
  }, 100);
}


const navigate = useNavigate();

   const handleBackToCreate = () => {
    navigate('/create');
  };




  return (
    <div className="mt-8">
      <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
        Enhanced Meme Editor ✨
      </h3>
      <button
              onClick={handleBackToCreate}
              className="mr-4 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-700 font-medium"
            >
              ← Back to Create
            </button>
      
      {/* Tool Selection */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setCurrentTool('text')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            currentTool === 'text' 
              ? 'bg-purple-500 text-white shadow-lg' 
              : 'bg-white/70 text-gray-700 hover:bg-purple-100'
          }`}
        >
          📝 Text
        </button>
        <button
          onClick={() => setCurrentTool('draw')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            currentTool === 'draw' 
              ? 'bg-purple-500 text-white shadow-lg' 
              : 'bg-white/70 text-gray-700 hover:bg-purple-100'
          }`}
        >
          🎨 Draw
        </button>
        <button
          onClick={() => setCurrentTool('image')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            currentTool === 'image' 
              ? 'bg-purple-500 text-white shadow-lg' 
              : 'bg-white/70 text-gray-700 hover:bg-purple-100'
          }`}
        >
          🖼️ Images
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls Column */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 space-y-6">
          
          {/* Text Controls */}
          {currentTool === 'text' && (
            <>
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>📝</span>
                <span>Text Controls</span>
              </h4>
              
              {/* Top Text Controls */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <span>⬆️</span>
                  <span>Top Text</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter top text..."
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                />
        

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Font</label>
                    <select
                      value={topFont}
                      onChange={(e) => setTopFont(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:border-purple-400 transition-colors duration-200"
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Color</label>
                    <input
                      type="color"
                      value={topColor}
                      onChange={(e) => setTopColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Text Controls */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <span>⬇️</span>
                  <span>Bottom Text</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter bottom text..."
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Font</label>
                    <select
                      value={bottomFont}
                      onChange={(e) => setBottomFont(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:border-purple-400 transition-colors duration-200"
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Color</label>
                    <input
                      type="color"
                      value={bottomColor}
                      onChange={(e) => setBottomColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Drawing Controls */}
          {currentTool === 'draw' && (
            <>
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>🎨</span>
                <span>Drawing Controls</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Brush Color</label>
                  <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Brush Size: {drawSize}px
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
                  className="w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  🗑️ Clear Drawing
                </button>
              </div>
            </>
          )}

          {/* Image Upload Controls */}
          {currentTool === 'image' && (
            <>
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>🖼️</span>
                <span>Image Controls</span>
              </h4>
              
              <div className="space-y-4">
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
                  className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>📁</span>
                  <span>Upload Images</span>
                </button>
                
                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700">Uploaded Images:</h5>
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                        <img src={img.src} alt="Uploaded" className="w-12 h-12 object-cover rounded" />
                        <button
                          onClick={() => removeImage(img.id)}
                          className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Download Button */}
        <button
  onClick={downloadMeme}
  className={`w-full mt-6 px-6 py-4 ${
    isLoggedIn 
      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:shadow-xl transform hover:scale-105' 
      : 'bg-gray-400 cursor-not-allowed'
  } text-white font-bold text-lg rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-3`}
  disabled={!isLoggedIn}
>
  <span className="text-2xl">💾</span>
  <span>{isLoggedIn ? 'Download Meme' : 'Login to Download'}</span>
</button>

{!isLoggedIn && (
  <div className="flex justify-center mb-4">
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg max-w-md">
      <div className="flex items-center">
        <span className="mr-2">⚠️</span>
        <div className="flex-1">
          <span className="block">Please log in to save and download your memes!</span>
          <span className="text-sm">Don't worry - your current meme will be saved and restored after login.</span>
        </div>
        <button 
          onClick={() => {
            // Save state before redirecting
            const currentState = {
              topText,
              bottomText,
              topColor,
              bottomColor,
              topFont,
              bottomFont,
              uploadedImages,
              memePrompt,
              image
            };
            localStorage.setItem('memeEditorState', JSON.stringify(currentState));
            localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            navigate('/login');
          }}
          className="ml-4 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors whitespace-nowrap"
        >
          Login
        </button>
      </div>
    </div>
  </div>
)}
        </div>

        {/* Meme Preview Column */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <span>👀</span>
            <span>Preview</span>
          </h4>
          
          <div className="relative w-full max-w-md mx-auto">
            <img 
              ref={imgRef}
              src={image} 
              alt="Meme" 
              className="w-full rounded-lg shadow-lg"
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
              className="absolute top-0 left-0 w-full h-full rounded-lg cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ 
                pointerEvents: currentTool === 'draw' ? 'auto' : 'none',
                zIndex: currentTool === 'draw' ? 10 : 1
              }}
            />
            
            {/* Top Text */}
            {topText && (
              <h2
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-center px-2 leading-tight"
                style={{ 
                  color: topColor, 
                  fontFamily: topFont,
                  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                  textTransform: 'uppercase',
                  zIndex: 20
                }}
              >
                {topText}
              </h2>
            )}
            
            {/* Bottom Text */}
            {bottomText && (
              <h2
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-center px-2 leading-tight"
                style={{ 
                  color: bottomColor, 
                  fontFamily: bottomFont,
                  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                  textTransform: 'uppercase',
                  zIndex: 20
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
                className="absolute cursor-move border-2 border-dashed border-blue-400 rounded"
                style={{
                  left: uploadedImg.x,
                  top: uploadedImg.y,
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
        </div>
      </div>

      {/* Hidden canvas for download functionality */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default MemeEditor;