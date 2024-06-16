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
import { Ionicons } from "@expo/vector-icons"; // Install expo icons if not already done: expo install @expo/vector-icons
import { colors } from "../../../styles/colors";
import MultipleChoicePicker from "../MultipleChoicePicker";
import SingleChoicePicker from "../SingleChoicePicker";
import { dietaryOptions, healthOptions, genderOptions } from "./options";

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weightKG, setWeightKG] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [heightCM, setHeightCM] = useState("");
  const [gender, setGender] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [healthConditions, setHealthConditions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState("");

  const { data, isLoading, error, refetch } = useFetch("users", "POST", {
    username,
    password,
    birthDate,
    weightKG: parseFloat(weightKG),
    goalWeight: parseFloat(goalWeight),
    heightCM: parseFloat(heightCM),
    gender,
    dietaryPreferences,
    healthConditions,
  });

  const handleSelect = (item) => {
    if (currentSelection === "gender") {
      setGender(item.value);
      setModalVisible(false);
    } else {
      const selection =
        currentSelection === "dietary" ? dietaryPreferences : healthConditions;
      const setter =
        currentSelection === "dietary"
          ? setDietaryPreferences
          : setHealthConditions;

      if (selection.includes(item.value)) {
        setter(selection.filter((value) => value !== item.value));
      } else {
        setter([...selection, item.value]);
      }
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required!");
      return;
    }

    try {
      await refetch();
      if (data.message === "User created successfully") {
        Alert.alert(
          "Registration Successful",
          "You have registered successfully!"
        );
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Registration Failed",
          "Please check your input and try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Register</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChangeText={confirmPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Birth Date (YYYY-MM-DD)"
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          placeholder="Weight (KG)"
          style={styles.input}
          value={weightKG}
          onChangeText={setWeightKG}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Goal Weight (KG)"
          style={styles.input}
          value={goalWeight}
          onChangeText={setGoalWeight}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Height (CM)"
          style={styles.input}
          value={heightCM}
          onChangeText={setHeightCM}
          keyboardType="numeric"
        />
        <View style={styles.inputWithButton}>
          <TextInput
            placeholder="Gender"
            style={[{ flex: 1 }]}
            value={genderOptions.find((opt) => opt.value === gender)?.label}
            editable={false}
          />
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => {
              setCurrentSelection("gender");
              setModalVisible(true);
            }}
          >
            <Ionicons
              name="chevron-down"
              size={24}
              color="#fff"
              style={{ paddingTop: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWithButton}>
          <TextInput
            placeholder="Dietary Preferences"
            style={[{ flex: 1 }]}
            value={dietaryPreferences.join(", ")}
            editable={false}
          />
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => {
              setCurrentSelection("dietary");
              setModalVisible(true);
            }}
          >
            <Ionicons
              name="chevron-down"
              size={24}
              color="#fff"
              style={{ paddingTop: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWithButton}>
          <TextInput
            placeholder="Health Conditions"
            style={[{ flex: 1 }]}
            value={healthConditions.join(", ")}
            editable={false}
          />
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => {
              setCurrentSelection("health");
              setModalVisible(true);
            }}
          >
            <Ionicons
              style={{ paddingTop: 5 }}
              name="chevron-down"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      {currentSelection === "gender" ? (
        <SingleChoicePicker
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          options={genderOptions}
          handleSelect={handleSelect}
          selectedValue={gender}
        />
      ) : (
        <MultipleChoicePicker
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          options={
            currentSelection === "dietary" ? dietaryOptions : healthOptions
          }
          handleSelect={handleSelect}
          selectedValues={
            currentSelection === "dietary"
              ? dietaryPreferences
              : healthConditions
          }
        />
      )}
    </ScrollView>
  );
};

export default Register;
