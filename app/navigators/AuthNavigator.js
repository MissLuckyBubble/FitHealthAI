import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
