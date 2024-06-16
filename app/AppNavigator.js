import React from 'react';
import AuthNavigator from './navigators/AuthNavigator';
import MainNavigator from './navigators/MainNavigator';
import { useAuth } from '../context/AuthContext';

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </>
  );
};

export default AppNavigator;
