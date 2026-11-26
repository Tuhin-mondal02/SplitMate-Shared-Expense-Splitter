import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { supabase } from "../services/supabase";
import { saveProfile } from "../services/profileService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login session
  useEffect(() => {
    let active = true;

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error;

        if (active) {
          setUser(data.session?.user ?? null);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        if (active) setLoading(false);
      });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Automatically save user profile
  useEffect(() => {
    if (user) {
      saveProfile(user).catch((error) => {
        console.error("Profile save error:", error.message);
      });
    }
  }, [user]);

  // Register
  const register = (name, email, password) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
  };

  // Login
  const login = (email, password) => {
    return supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  // Logout
  const logout = () => {
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}