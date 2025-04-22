// components/Loader.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

const Loader = ({ size = "small", color = colors.backgroundWhite }) => {
  return <ActivityIndicator size={size} color={color} />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundWhite,
  },
});

export default Loader;
