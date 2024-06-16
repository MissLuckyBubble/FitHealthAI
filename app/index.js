import "react-native-gesture-handler";
import React from "react";
import { registerRootComponent } from "expo";
import { AuthProvider } from "../context/AuthContext";
import AppNavigator from "./AppNavigator";

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;

registerRootComponent(App);
