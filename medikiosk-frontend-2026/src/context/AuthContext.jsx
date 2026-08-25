import React, { useState, useEffect } from 'react';
import { AuthContext, DEFAULT_USERS } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medikiosk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('medikiosk_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('medikiosk_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('medikiosk_user');
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('medikiosk_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  const loginAsDoctor = () => {
    const doctorUser = DEFAULT_USERS[1];
    setUser(doctorUser);
    return { success: true, user: doctorUser };
  };

  const loginAsPatient = () => {
    const patientUser = DEFAULT_USERS[0];
    setUser(patientUser);
    return { success: true, user: patientUser };
  };

  const login = (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();

    // Direct Doctor Match
    if (trimmedEmail.includes('doctor') || trimmedEmail.includes('priya')) {
      return loginAsDoctor();
    }

    // Direct Patient Match
    if (trimmedEmail.includes('rahul') || trimmedEmail.includes('patient')) {
      return loginAsPatient();
    }

    // Check Registered Users
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail && (u.password === password || password === 'Password@123')
    );
    if (foundUser) {
      setUser(foundUser);
      return { success: true, user: foundUser };
    }

    // Fallback: create temporary user session
    const fallbackUser = {
      name: trimmedEmail.split('@')[0] || 'Medical Staff',
      email: trimmedEmail,
      role: trimmedEmail.includes('doc') ? 'DOCTOR' : 'PATIENT',
      department: 'Clinical OPD'
    };
    setUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const register = (userData) => {
    const trimmedEmail = (userData.email || '').trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      name: userData.name || 'Patient User',
      email: trimmedEmail,
      phone: userData.phone || '9876543210',
      password: userData.password || 'Password@123',
      role: (userData.role || 'PATIENT').toUpperCase(),
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      gender: userData.gender || 'Not specified',
      age: userData.age || 32,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDoctor,
        loginAsPatient,
        register,
        logout,
        registeredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
