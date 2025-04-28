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
import { colors } from "../../../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { mealTypesOptions } from "../../../assets/options";
import MultipleChoicePicker from "../../components/MultipleChoicePicker";
import FoodItemSelectorModal from "../../components/FoodItemSelectorModal";
import Toast from "react-native-toast-message";

const CreateMeal = ({ navigation }) => {
  const { isLoading, fetchData } = useFetch();

  const [mealName, setMealName] = useState("");
  const [mealItems, setMealItems] = useState([]);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [recipeTypeModal, setRecipeTypeModal] = useState(false);
  const [showFoodItemSelector, setShowFoodItemSelector] = useState(false);
  const [invalidFields, setInvalidFields] = useState(false);

  const validateFields = () => {
    return mealName.trim() && recipeTypes.length > 0 && mealItems.length > 0;
  };

  const handleAddMealItem = (foodItem, quantity, unit) => {
    if (!foodItem || !quantity || !unit) {
      Toast.show({
        type: "error",
        text1: "Missing Data",
        text2: "Please fill in all required fields.",
        position: "bottom",
      });

      return;
    }

    setMealItems((prev) => [
      ...prev,
      {
        componentId: foodItem.id,
        quantity: parseFloat(quantity),
        unit,
        name: foodItem.name,
      },
    ]);
  };

  const saveMeal = async () => {
    if (!validateFields()) {
      setInvalidFields(true);
      Toast.show({
        type: "error",
        text1: "Missing Data",
        text2: "Please fill in all required fields.",
        position: "bottom",
      });

      return;
    }

    const mealData = {
      name: mealName,
      recipeTypes,
      mealItems: mealItems.map(({ componentId, quantity, unit }) => ({
        componentId,
        quantity,
        unit,
      })),
      visibility: "Public",
    };

    const { status, error } = await fetchData("meals", "POST", null, mealData);

    if (status === 200 || status === 201) {
      setMealName("");
      setRecipeTypes([]);
      setMealItems([]);
      setInvalidFields(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Meal created successfully!",
        position: "bottom",
      });

      navigation.navigate("Foods");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error || "Failed to create meal",
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Create Meal</Text>

            <TextInput
              placeholder="Meal Name *"
              style={[
                styles.input,
                invalidFields && !mealName && { borderColor: colors.error },
              ]}
              value={mealName}
              onChangeText={setMealName}
            />

            <TouchableOpacity
              style={[
                styles.input,
                { justifyContent: "center" },
                invalidFields &&
                  recipeTypes.length <= 0 && {
                    borderColor: colors.error,
                  },
              ]}
              onPress={() => setRecipeTypeModal(true)}
            >
              <Text style={styles.text}>
                {recipeTypes.length > 0
                  ? recipeTypes.join(", ")
                  : "Select Meal Types"}
              </Text>
              <MultipleChoicePicker
                modalVisible={recipeTypeModal}
                setModalVisible={setRecipeTypeModal}
                options={mealTypesOptions}
                handleSelect={(item) => {
                  const exists = recipeTypes.includes(item.value);
                  const updated = exists
                    ? recipeTypes.filter((t) => t !== item.value)
                    : [...recipeTypes, item.value];
                  setRecipeTypes(updated);
                }}
                selectedValues={recipeTypes}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={() => setShowFoodItemSelector(true)}
            >
              <Text style={styles.buttonText}>Add Meal Item</Text>
            </TouchableOpacity>

            <FoodItemSelectorModal
              visible={showFoodItemSelector}
              onClose={() => setShowFoodItemSelector(false)}
              onSelect={({ foodItem, quantity, unit }) => {
                handleAddMealItem(foodItem, quantity, unit);
              }}
              onlyFood={false}
            />

            {mealItems.length > 0 && (
              <View style={styles.ingredientList}>
                {mealItems.map((item, index) => (
                  <View key={index} style={styles.ingredientCard}>
                    <Text style={styles.ingredientText}>
                      {item.name} – {item.quantity} {item.unit}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setMealItems((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Ionicons name="trash" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={saveMeal}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.backgroundLight}
                />
              ) : (
                <Text style={styles.buttonText}>Save Meal</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateMeal;
