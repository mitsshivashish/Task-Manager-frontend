import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [dashboardLoading, setDashboardLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ dashboardLoading, setDashboardLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext); 