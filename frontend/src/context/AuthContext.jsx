import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Starting to load user...');
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('AuthContext: No token found'); 
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log('AuthContext: Token found, verifying...'); 
        
        const response = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('AuthContext: User loaded successfully:', data.user); 
          setUser(data.user);
        } else {
          console.log('AuthContext: Token invalid, removing...'); 
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Failed to load user:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        console.log('AuthContext: Loading complete'); 
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    console.log('AuthContext: Logging out...'); 
    localStorage.removeItem('authToken');
    setUser(null);
  };

  console.log('AuthContext render:', { user, loading }); 

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