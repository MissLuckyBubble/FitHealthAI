import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { styles } from "../../../styles/styles";
import useFetch from "../../../hooks/useFetch";
import { useAuth } from "../../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { data, isLoading, error, fetchData, status } = useFetch();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required!");
      return;
    }

    const endpoint = "users/login";
    const params = {
      username: username,
      password: password,
    };

    await fetchData(endpoint, "POST", params, null);

    if (status === 200) {
      login(data);
      Alert.alert("Login Successful", "You have logged in successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Recipes");
          },
        },
      ]);
    } else if (status === 401) {
      Alert.alert("Login Failed", "Incorrect username or password.");
    } else {
      Alert.alert("Login Failed", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.inputWithButton}>
        <TextInput
          placeholder="Password"
          style={[{ flex: 1 }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={colors.primary}
            style={{ padding: 10 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10, alignItems: "center" }}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{ color: "#1E3A5F" }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
