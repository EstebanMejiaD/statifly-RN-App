import './src/api/interceptors';

import React, { useCallback } from 'react';

import { StatusBar } from 'expo-status-bar';

import * as SplashScreen from 'expo-splash-screen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';

import { useAuthBootstrap } from './src/hooks/useAuthBootstrap';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { loading } = useAuthBootstrap();

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar style="light" />

      <AppNavigator />
    </SafeAreaProvider>
  );
}