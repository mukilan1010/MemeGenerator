import React, { useRef, useState } from 'react';

function UploadImage({ setSelectedImage }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const localImageUrl = URL.createObjectURL(file);
      setSelectedImage(localImageUrl);
      setUploadedFileName(file.name);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center space-x-2">
        <span className="text-3xl">📤</span>
        <span>Upload Your Own Image</span>
      </h3>
      
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-purple-400 bg-purple-50/80 scale-105' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <div className={`p-6 rounded-full transition-all duration-300 ${
              isDragOver ? 'bg-purple-200' : 'bg-gray-100'
            }`}>
              <svg 
                className={`w-12 h-12 transition-colors duration-300 ${
                  isDragOver ? 'text-purple-600' : 'text-gray-400'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
          </div>
          
          {/* Upload Text */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700">
              {isDragOver ? 'Drop your image here!' : 'Drag & drop your image here'}
            </p>
            <p className="text-sm text-gray-500">or click to browse files</p>
          </div>
          
          {/* Upload Button */}
          <button
            type="button"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Choose File</span>
          </button>
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {/* File Info */}
      {uploadedFileName && (
        <div className="mt-4 p-4 bg-green-50/80 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">File uploaded successfully!</p>
              <p className="text-xs text-green-600 truncate">{uploadedFileName}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Supported Formats */}
      <div className="mt-6 p-4 bg-blue-50/80 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Supported Formats:</p>
            <div className="flex flex-wrap gap-2">
              {['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].map((format) => (
                <span 
                  key={format}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {format}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Maximum file size: 10MB • Recommended: 1920x1080 or higher resolution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;