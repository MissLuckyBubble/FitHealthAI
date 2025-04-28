import "react-native-gesture-handler";
import React from "react";
import { registerRootComponent } from "expo";
import { AuthProvider } from "../context/AuthContext";
import AppNavigator from "./AppNavigator";
import Toast from "react-native-toast-message";

const App = () => {
  return (
    <AuthProvider>
      <>
        <AppNavigator />
      </>

      <Toast />
    </AuthProvider>
  );
};

export default App;

registerRootComponent(App);
