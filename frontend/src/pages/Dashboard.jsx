import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiImage,
  FiDownload,
  FiCalendar,
} from "react-icons/fi";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const [userRes, memesRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/me", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/api/memes/my-memes", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!userRes.ok || !memesRes.ok)
          throw new Error("Failed to fetch data");

        const userData = await userRes.json();
        const memesData = await memesRes.json();

        console.log("User:", userData);
        console.log("Memes Data:", memesData); // Check what structure you're getting

        setUser(userData);

        // Fix: Handle the response structure properly
        if (memesData && memesData.memes && Array.isArray(memesData.memes)) {
          setMemes(memesData.memes);
        } else if (Array.isArray(memesData)) {
          setMemes(memesData);
        } else {
          setMemes([]); // Fallback to empty array
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("previewImage");
    localStorage.removeItem('memeEditorState');
    navigate("/login");
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-pink-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
          <div className="mt-6 text-center text-white text-lg font-medium">
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-300 text-lg font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Add padding-top to account for fixed navbar */}
      <div className="relative z-10 px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-white">
                      {getInitials(user.username)}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    Welcome back, {user.username || "User"}!
                  </h1>
                  <p className="text-slate-300 text-lg">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="group relative bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-semibold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                <FiLogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Username</p>
                  <p className="text-white text-xl font-semibold">
                    {user.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <FiImage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Memes</p>
                  <p className="text-white text-xl font-semibold">
                    {Array.isArray(memes) ? memes.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Memes Gallery Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <FiImage className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Your Meme Collection
              </h2>
            </div>

            {!Array.isArray(memes) || memes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiImage className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-slate-300 text-xl mb-2">
                  No memes saved yet
                </p>
                <p className="text-slate-400">
                  Start creating and saving your favorite memes!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {memes.map((meme, index) => (
                  <div
                    key={meme._id}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={meme.imageData}
                        alt="Meme"
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-5">
                      <div className="space-y-3 mb-4">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-slate-300 text-sm font-medium mb-1">
                            Top Text
                          </p>
                          <p className="text-white font-semibold">
                            {meme.topText || "No top text"}
                          </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-slate-300 text-sm font-medium mb-1">
                            Bottom Text
                          </p>
                          <p className="text-white font-semibold">
                            {meme.bottomText || "No bottom text"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Saved on{" "}
                          {new Date(meme.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <a
                        href={meme.imageData}
                        download={`meme_${meme._id}.png`}
                        className="group/btn w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                      >
                        <FiDownload className="w-4 h-4 group-hover/btn:animate-bounce" />
                        Download Meme
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
