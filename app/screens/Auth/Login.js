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
import Loader from "../../components/Loader";
import Toast from "react-native-toast-message";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { data, isLoading, error, fetchData, status } = useFetch();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Username and password are required!",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }

    const endpoint = "auth/login";
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

    if (status === 200) {
      login(data);
    } else if (status === 401) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Incorrect username or password.",
        position: "bottom",
        visibilityTime: 2000,
      });
    } else if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: { error },
        position: "bottom",
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "An unexpected error occurred.",
        position: "bottom",
        visibilityTime: 2000,
      });
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
        editable={!isLoading}
      />
      <View style={styles.inputWithButton}>
        <TextInput
          placeholder="Password"
          style={[{ flex: 1 }]}
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10, alignItems: "center" }}
        onPress={() => navigation.navigate("Register")}
        disabled={isLoading}
      >
        <Text style={{ color: "#1E3A5F" }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
