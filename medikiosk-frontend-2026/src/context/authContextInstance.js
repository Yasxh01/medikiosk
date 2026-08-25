import { createContext } from 'react';

export const AuthContext = createContext();

export const DEFAULT_USERS = [
  {
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '9876543210',
    password: 'Password@123',
    role: 'PATIENT',
    abhaId: '91-8472-1029-4412',
    gender: 'Male',
    age: 34,
  },
  {
    name: 'Dr. Priya Nair, MD',
    email: 'doctor@medikit.com',
    phone: '9812345678',
    password: 'Password@123',
    role: 'DOCTOR',
    department: 'Internal Medicine & Cardiology',
  }
];
