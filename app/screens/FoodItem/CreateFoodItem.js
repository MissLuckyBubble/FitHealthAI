import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { styles } from "../../../styles/styles";
import useFetch from "../../../hooks/useFetch";
import SingleChoicePicker from "../../components/SingleChoicePicker";
import { colors } from "../../../styles/colors";
import { allergenOptions, allergens } from "../../../assets/options";
import Toast from "react-native-toast-message";

const CreateFoodItem = ({ navigator }) => {
  const { isLoading, fetchData } = useFetch();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [fatContent, setFatContent] = useState("");
  const [proteinContent, setProteinContent] = useState("");
  const [sugarContent, setSugarContent] = useState("");
  const [saltContent, setSaltContent] = useState("");
  const [selectedAllergen, setSelectedAllergen] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidFields, setInvalidFields] = useState(false);

  const validateFields = () => {
    return (
      foodName.trim() &&
      calories &&
      fatContent &&
      proteinContent &&
      sugarContent &&
      saltContent &&
      selectedAllergen
    );
  };

  const createFoodItem = async () => {
    if (!validateFields()) {
      Toast.show({
        type: "error",
        text1: "Missing Data",
        text2: "Please fill in all fields.",
        position: "bottom",
        visibilityTime: 3000,
      });
      setInvalidFields(true);
      return;
    }

    const newItem = {
      name: foodName,
      macronutrients: {
        calories: parseFloat(calories),
        fat: parseFloat(fatContent),
        protein: parseFloat(proteinContent),
        sugar: parseFloat(sugarContent),
        salt: parseFloat(saltContent),
      },
      allergens: [selectedAllergen],
      type: "FOOD_ITEM",
    };

    const { status, error } = await fetchData(
      "food-items",
      "POST",
      null,
      newItem
    );

    if (status === 201) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Food item created successfully!",
        position: "bottom",
        visibilityTime: 3000,
      });
      setFoodName("");
      setCalories("");
      setFatContent("");
      setProteinContent("");
      setSugarContent("");
      setSaltContent("");
      setSelectedAllergen("");
      navigator.navigate("Foods");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error || "Failed to create food item",
        position: "bottom",
        visibilityTime: 4000,
      });
    }
  };

  const handleSelectAllergen = (item) => {
    setSelectedAllergen(item.value);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView styles={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Create New Food Item</Text>
            <TextInput
              placeholder="Food Name *"
              style={[
                styles.input,
                invalidFields && !foodName && { borderColor: colors.error },
              ]}
              value={foodName}
              onChangeText={setFoodName}
            />
            <TextInput
              placeholder="Calories per 100g *"
              style={[
                styles.input,
                invalidFields && !calories && { borderColor: colors.error },
              ]}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Fat Content *"
              style={[
                styles.input,
                invalidFields && !fatContent && { borderColor: colors.error },
              ]}
              value={fatContent}
              onChangeText={setFatContent}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Protein Content *"
              style={[
                styles.input,
                invalidFields &&
                  !proteinContent && { borderColor: colors.error },
              ]}
              value={proteinContent}
              onChangeText={setProteinContent}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Sugar Content *"
              style={[
                styles.input,
                invalidFields && !sugarContent && { borderColor: colors.error },
              ]}
              value={sugarContent}
              onChangeText={setSugarContent}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Salt Content *"
              style={[
                styles.input,
                invalidFields && !saltContent && { borderColor: colors.error },
              ]}
              value={saltContent}
              onChangeText={setSaltContent}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                styles.pickerButton,
                invalidFields &&
                  !selectedAllergen && { borderColor: colors.error },
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedAllergen ? selectedAllergen : "Select Allergen *"}
              </Text>
            </TouchableOpacity>
            <SingleChoicePicker
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              options={allergenOptions}
              handleSelect={handleSelectAllergen}
              selectedValue={selectedAllergen}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={createFoodItem}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.backgroundLight}
                />
              ) : (
                <Text style={styles.buttonText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateFoodItem;
