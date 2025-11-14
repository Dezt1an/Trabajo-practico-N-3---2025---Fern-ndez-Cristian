import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token_flota');
    if (!token) {
      setCargando(false);
      return;
    }

    setAuth({ token });
    setCargando(false);
  }, []);

  const guardarAuth = (auth) => {
    localStorage.setItem('token_flota', auth.token);
    setAuth(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        guardarAuth,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;