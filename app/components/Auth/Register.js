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
import MultipleChoicePicker from "../MultipleChoicePicker";
import SingleChoicePicker from "../SingleChoicePicker";
import { dietaryOptions, healthOptions, genderOptions } from "./options";
import { colors } from "../../../styles/colors";

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weightKG, setWeightKG] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [heightCM, setHeightCM] = useState("");
  const [gender, setGender] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [healthConditions, setHealthConditions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setconfirmPasswordError] = useState(false);
  const [birthDateError, setBirthDateError] = useState(false);
  const [weightKGError, setWeightKGError] = useState(false);
  const [goalWeightError, setGoalWeightError] = useState(false);
  const [heightCMError, setHeightCMError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const { data, isLoading, error, fetchData, status } = useFetch();

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
      setconfirmPasswordError(true);
      isValid = false;
    } else {
      setconfirmPasswordError(false);
    }

    if (!birthDate) {
      setBirthDateError(true);
      isValid = false;
    } else {
      setBirthDateError(false);
    }

    if (!weightKG) {
      setWeightKGError(true);
      isValid = false;
    } else {
      setWeightKGError(false);
    }

    if (!goalWeight) {
      setGoalWeightError(true);
      isValid = false;
    } else {
      setGoalWeightError(false);
    }

    if (!heightCM) {
      setHeightCMError(true);
      isValid = false;
    } else {
      setHeightCMError(false);
    }

    if (!gender) {
      setGenderError(true);
      isValid = false;
    } else {
      setGenderError(false);
    }

    if (!isValid) {
      Alert.alert("Error", "Please fill all the required fields correctly!");
      return;
    }

    const endpoint = "users";
    const body = {
      username: username,
      password: password,
      birthDate: birthDate,
      weightKG: weightKG,
      goalWeight: goalWeight,
      heightCM: heightCM,
      gender: gender,
      dietaryPreferences: dietaryPreferences,
      healthConditions: healthConditions,
    };

    await fetchData(endpoint, "POST", null, body);
    if (status === 200) {
      Alert.alert(
        "Successful Register",
        "You created your account successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        ]
      );
    } else if (status === 500 && error === "User already exists!") {
      Alert.alert("Register Failed", "This username already exists");
    } else {
      Alert.alert("Register Failed", "An unexpected error occurred.");
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
            style={[{ flex: 1 }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            <Ionicons
              name={isConfirmPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={colors.primary}
              style={{ padding: 10 }}
            />
          </TouchableOpacity>
        </View>
        {birthDateError && (
          <Text style={styles.errorText}>* Birth Date is required</Text>
        )}
        <TextInput
          placeholder="Birth Date (YYYY-MM-DD)"
          style={[
            styles.input,
            birthDateError ? { borderColor: colors.error } : {},
          ]}
          value={birthDate}
          onChangeText={setBirthDate}
        />
        {weightKGError && (
          <Text style={styles.errorText}>* Weight is required</Text>
        )}
        <TextInput
          placeholder="Weight (KG)"
          style={[
            styles.input,
            weightKGError ? { borderColor: colors.error } : {},
          ]}
          value={weightKG}
          onChangeText={setWeightKG}
          keyboardType="numeric"
        />
        {goalWeightError && (
          <Text style={styles.errorText}>* Goal Weight is required</Text>
        )}
        <TextInput
          placeholder="Goal Weight (KG)"
          style={[
            styles.input,
            goalWeightError ? { borderColor: colors.error } : {},
          ]}
          value={goalWeight}
          onChangeText={setGoalWeight}
          keyboardType="numeric"
        />
        {heightCMError && (
          <Text style={styles.errorText}>* Height is required</Text>
        )}
        <TextInput
          placeholder="Height (CM)"
          style={[
            styles.input,
            heightCMError ? { borderColor: colors.error } : {},
          ]}
          value={heightCM}
          onChangeText={setHeightCM}
          keyboardType="numeric"
        />
        {genderError && (
          <Text style={styles.errorText}>* Gender is required</Text>
        )}
        <View
          style={[
            styles.inputWithButton,
            genderError ? { borderColor: colors.error } : {},
          ]}
        >
          <TextInput
            placeholder="Gender"
            style={[
              { flex: 1 },
              genderError ? { borderColor: colors.error } : {},
            ]}
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
