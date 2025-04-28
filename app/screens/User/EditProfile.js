import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../../../context/AuthContext";
import useFetch from "../../../hooks/useFetch";
import MultipleChoicePicker from "../../components/MultipleChoicePicker";
import SingleChoicePicker from "../../components/SingleChoicePicker";
import {
  dietaryOptions,
  healthOptions,
  allergenOptions,
  activityLevelOptions,
  goalOptions,
  genderOptions,
} from "../../../assets/options";
import { colors } from "../../../styles/colors";
import Toast from "react-native-toast-message";

const EditProfileScreen = ({ navigation }) => {
  const { user, login } = useAuth();
  const { data, isLoading, error, fetchData, status } = useFetch();
  const [formData, setFormData] = useState({ ...user.user });
  const [enums, setEnums] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDietary, setShowDietary] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showGender, setShowGender] = useState(false);

  useEffect(() => {
    if (status === 200) {
      setEnums(data);
    } else if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error || "Failed to load data.",
        position: "bottom",
      });
    }
  }, [status, data, error]);

  useEffect(() => {
    fetchEnums();
  }, []);

  const fetchEnums = async () => {
    await fetchData("enums", "GET");
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    const endpoint = `users/${formData.id}`;
    const { id, password, role, dailyCalorieGoal, ...cleanedFormData } =
      formData;
    const { data, status, error } = await fetchData(endpoint, "PUT", null, {
      user: cleanedFormData,
    });

    if (status === 200) {
      const updatedUser = { ...user, user: data };
      try {
        await login(updatedUser);
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your changes have been saved successfully!",
          position: "bottom",
        });
        navigation.navigate("User Profile");
      } catch (err) {
        console.log("Error saving user:", err);
      }
    } else if (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error || "Something went wrong.",
        position: "bottom",
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <Text style={styles.label}>Birth Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {formData.birthDate
            ? new Date(formData.birthDate).toLocaleDateString()
            : "Select your birth date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === "ios");
            if (selectedDate) {
              const isoDate = selectedDate.toISOString().split("T")[0]; // format: YYYY-MM-DD
              handleChange("birthDate", isoDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(formData.heightCM)}
        onChangeText={(text) => handleChange("heightCM", Number(text))}
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(formData.weightKG)}
        onChangeText={(text) => handleChange("weightKG", Number(text))}
      />

      {/* Selectors */}
      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity
        onPress={() => setShowGender(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {formData.gender || "Not selected"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Activity Level</Text>
      <TouchableOpacity
        onPress={() => setShowActivity(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {formData.activityLevel || "Not selected"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Goal</Text>
      <TouchableOpacity
        onPress={() => setShowGoal(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {formData.goal || "Not selected"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Dietary Preferences</Text>
      <TouchableOpacity
        onPress={() => setShowDietary(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {" "}
          {formData.dietaryPreferences?.join(", ") || "None"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Health Conditions </Text>
      <TouchableOpacity
        onPress={() => setShowHealth(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          {formData.healthConditions?.join(", ") || "None"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity
        onPress={() => setShowAllergens(true)}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>
          Allergens: {formData.allergens?.join(", ") || "None"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Save Changes</Text>
      </TouchableOpacity>

      {/* MODALS */}
      <MultipleChoicePicker
        modalVisible={showDietary}
        setModalVisible={setShowDietary}
        options={dietaryOptions}
        selectedValues={formData.dietaryPreferences}
        handleSelect={(item) => {
          const current = [...formData.dietaryPreferences];
          const updated = current.includes(item.value)
            ? current.filter((val) => val !== item.value)
            : [...current, item.value];
          handleChange("dietaryPreferences", updated);
        }}
      />

      <MultipleChoicePicker
        modalVisible={showHealth}
        setModalVisible={setShowHealth}
        options={healthOptions}
        selectedValues={formData.healthConditions}
        handleSelect={(item) => {
          const current = [...formData.healthConditions];
          const updated = current.includes(item.value)
            ? current.filter((val) => val !== item.value)
            : [...current, item.value];
          handleChange("healthConditions", updated);
        }}
      />

      <MultipleChoicePicker
        modalVisible={showAllergens}
        setModalVisible={setShowAllergens}
        options={allergenOptions}
        selectedValues={formData.allergens}
        handleSelect={(item) => {
          const current = [...formData.allergens];
          const updated = current.includes(item.value)
            ? current.filter((val) => val !== item.value)
            : [...current, item.value];
          handleChange("allergens", updated);
        }}
      />

      <SingleChoicePicker
        modalVisible={showActivity}
        setModalVisible={setShowActivity}
        options={activityLevelOptions}
        selectedValue={formData.activityLevel}
        handleSelect={(item) => handleChange("activityLevel", item.value)}
      />

      <SingleChoicePicker
        modalVisible={showGoal}
        setModalVisible={setShowGoal}
        options={goalOptions}
        selectedValue={formData.goal}
        handleSelect={(item) => handleChange("goal", item.value)}
      />

      <SingleChoicePicker
        modalVisible={showGender}
        setModalVisible={setShowGender}
        options={genderOptions}
        selectedValue={formData.gender}
        handleSelect={(item) => handleChange("gender", item.value)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: colors.backgroundLight,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.backgroundWhite,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  selector: {
    backgroundColor: colors.backgroundWhite,
    padding: 12,
    borderRadius: 10,
  },
  selectorText: {
    fontSize: 16,
    color: colors.textDark,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfileScreen;
