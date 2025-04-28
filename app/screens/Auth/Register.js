import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { styles } from "../../../styles/styles";
import useFetch from "../../../hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import Loader from "../../components/Loader";
import Toast from "react-native-toast-message";

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const { isLoading, fetchData } = useFetch();

  const handleRegister = async () => {
    let isValid = true;

    if (!username) {
      setUsernameError(true);
      isValid = false;
    } else {
      setUsernameError(false);
    }

    if (!password) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      isValid = false;
    } else {
      setConfirmPasswordError(false);
    }

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all required fields correctly!",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    const endpoint = "users";
    const body = {
      username: username,
      password: password,
    };

    const { data, status, error } = await fetchData(
      endpoint,
      "POST",
      null,
      body
    );

    if (status === 201) {
      Toast.show({
        type: "success",
        text1: "Account created successfully!",
        text2: "You can now log in.",
        position: "bottom",
        visibilityTime: 3000,
      });
      navigation.navigate("Login");
    } else if (status === 400) {
      Toast.show({
        type: "error",
        text1: "Username already exists",
        text2: "Please choose a different one.",
        position: "bottom",
        visibilityTime: 3000,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error || "An unexpected error occurred.",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {isLoading && <Loader />}
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Register</Text>

        {usernameError && (
          <Text style={styles.errorText}>* Username is required</Text>
        )}
        <TextInput
          placeholder="Username"
          style={[
            styles.input,
            usernameError ? { borderColor: colors.error } : {},
          ]}
          value={username}
          onChangeText={setUsername}
          editable={!isLoading}
        />

        {passwordError && (
          <Text style={styles.errorText}>* Password is required</Text>
        )}
        <View
          style={[
            styles.inputWithButton,
            passwordError ? { borderColor: colors.error } : {},
          ]}
        >
          <TextInput
            placeholder="Password"
            style={{ flex: 1 }}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={isLoading}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={colors.primary}
              style={{ padding: 10 }}
            />
          </TouchableOpacity>
        </View>

        {confirmPasswordError && (
          <Text style={styles.errorText}>* Passwords do not match</Text>
        )}
        <View
          style={[
            styles.inputWithButton,
            confirmPasswordError || passwordError
              ? { borderColor: colors.error }
              : {},
          ]}
        >
          <TextInput
            placeholder="Confirm Password"
            style={{ flex: 1 }}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
            disabled={isLoading}
          >
            <Ionicons
              name={isConfirmPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={colors.primary}
              style={{ padding: 10 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isLoading ? { backgroundColor: colors.disabled } : {},
          ]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;
