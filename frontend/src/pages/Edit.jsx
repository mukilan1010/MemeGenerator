// import MemeEditor from "../components/MemeEditor";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function Edit() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [imageData, setImageData] = useState(null);
//   const [source, setSource] = useState('');

//   useEffect(() => {
//     if (location.state && location.state.image) {
//       localStorage.setItem('previewImage', location.state.image);
//       setImageData(location.state.image);
//       setSource(location.state.source || '');
   
//     } else {
//       navigate('/create');
//     }
//   }, [location.state, navigate]);

//   const handleBackToCreate = () => {
//     navigate('/create');
//   };
//   const storedPreviewImage = localStorage.getItem('previewImage');

//   if (!imageData) {
//     return (
//       <div className="pt-24 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">⏳</div>
//           <h3 className="text-xl font-bold text-gray-600">Loading...</h3>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-24 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
//       <div className="max-w-7xl mx-auto">

//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
            
//             <h2 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
//               Edit Your Meme ✨
//             </h2>
//           </div>
//           <p className="text-xl text-gray-600">
//             Add text, customize styling, and make it perfect!
//           </p>
//           {source && (
//             <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/20">
//               <span className="text-sm text-gray-600">
//                 Source: {source === 'upload' ? '📤 Uploaded Image' : '🎨 Template'}
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-center">
//     <div className="w-full max-w-6xl">
//       <MemeEditor image={storedPreviewImage || imageData} />
//     </div>
//   </div>

//         <div className="mt-12 flex justify-center">
//           <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
//             <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
//             <span className="text-sm font-medium text-gray-600">Step 1: Choose Source</span>
            
//             <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
//             <span className="text-sm font-medium text-gray-600">Step 2: Edit Meme</span>
            
//             <div className="w-3 h-3 rounded-full bg-gray-300"></div>
//             <span className="text-sm font-medium text-gray-600">Step 3: Download & Share</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Edit;