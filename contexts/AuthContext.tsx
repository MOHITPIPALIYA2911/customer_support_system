"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType, UserRole } from "@/types";
import { getCustomerByPhone, getAgentByUsername, verifyCustomerCredentials, verifyAgentCredentials } from "@/utils/mockData";
import { saveAuthUser, getAuthUser, clearAuthUser } from "@/utils/localStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = getAuthUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, role: UserRole): Promise<boolean> => {
    if (role === "customer") {
      const customer = getCustomerByPhone(phone);
      if (customer) {
        setUser(customer);
        saveAuthUser(customer);
        return true;
      }
    }
    return false;
  };

  const loginCustomer = async (username: string, password: string): Promise<boolean> => {
    const customer = verifyCustomerCredentials(username, password);
    if (customer) {
      setUser(customer);
      saveAuthUser(customer);
      return true;
    }
    return false;
  };

  const loginAgent = async (username: string, password: string): Promise<boolean> => {
    const agent = verifyAgentCredentials(username, password);
    if (agent) {
      setUser(agent);
      saveAuthUser(agent);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearAuthUser();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginCustomer,
        loginAgent,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
