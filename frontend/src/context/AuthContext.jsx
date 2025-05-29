import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect triggered');
    loadUser();
  }, []);

  const loadUser = async () => {
    console.log('🔄 AuthContext: Starting to load user...');
    
    const token = localStorage.getItem('authToken');
    console.log('🔑 AuthContext: Token found:', !!token);
    
    if (!token) {
      console.log('❌ AuthContext: No token found'); 
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('📡 AuthContext: Making API call to verify token...'); 
      
      const response = await fetch('https://memegenerator-btv3.onrender.com/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 AuthContext: API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ AuthContext: Full API response:', data);
        
        // Handle both possible response structures
        const userData = data.user || data;
        
        console.log('✅ AuthContext: Final user data to set:', userData);
        
        // Ensure we have a valid user object with required properties
        if (userData && (userData._id || userData.id || userData.email)) {
          setUser(userData);
          console.log('✅ AuthContext: User set successfully');
        } else {
          console.log('❌ AuthContext: Invalid user data received');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } else {
        console.log('❌ AuthContext: Token invalid, removing...'); 
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 AuthContext: Failed to load user:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      console.log('🏁 AuthContext: Loading complete, setting loading to false');
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logging out...'); 
    localStorage.removeItem('authToken');
    setUser(null);
  };

  console.log('🔄 AuthContext render:', { 
    user: user ? `${user.username || user.email} (${user._id || user.id})` : null, 
    loading 
  }); 

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}