import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../styles/colors";
import { styles } from "../../../styles/styles";

const Welcome = ({ navigation }) => {
  const handleContinue = () => {
    navigation.navigate("Login");
  };
  return (
    <View style={pageStyles.container}>
      <Image
        source={require("../../../assets/logo.png")} // Replace with your logo path
        style={pageStyles.logo}
      />
      <View style={pageStyles.overlay}>
        <Text style={pageStyles.title}>Welcome to Fit Health AI</Text>
        <Text style={pageStyles.subtitle}>
          Track your nutritions and meals with ease
        </Text>
      </View>
      <View style={pageStyles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    color: colors.backgroundWhite,
    fontSize: 16,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 40,
  },
});

export default Welcome;
