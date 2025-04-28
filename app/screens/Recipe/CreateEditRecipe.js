import React, { useEffect, useState } from "react";
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
import FoodItemSelectorModal from "../../components/FoodItemSelectorModal";
import MultipleChoicePicker from "../../components/MultipleChoicePicker";
import { mealTypesOptions } from "../../../assets/options";
import Toast from "react-native-toast-message";

const CreateRecipe = ({ navigation }) => {
  const { isLoading, fetchData } = useFetch();

  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [invalidFields, setInvalidFields] = useState(false);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [recipeTypeModal, setRecipeTypeModal] = useState(false);

  const [showFoodItemSelector, setShowFoodItemSelector] = useState(false);

  const validateFields = () => {
    return (
      recipeName.trim() &&
      preparationTime &&
      cookingTime &&
      servingSize &&
      ingredients.length > 0
    );
  };

  const saveRecipe = async () => {
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

    const newRecipe = {
      name: recipeName,
      description,
      preparationTime: parseFloat(preparationTime),
      cookingTime: parseFloat(cookingTime),
      servingSize: parseFloat(servingSize),
      recipeTypes,
      ingredients: ingredients.map((ingredient) => ({
        foodItem: ingredient.foodItem.id,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
      type: "RECIPE",
    };

    const { status, error } = await fetchData(
      "recipes",
      "POST",
      null,
      newRecipe
    );

    if (status === 200 || status === 201) {
      setRecipeName("");
      setDescription("");
      setPreparationTime("");
      setCookingTime("");
      setServingSize("");
      setIngredients([]);
      setRecipeTypes([]);
      setInvalidFields(false);
      setShowFoodItemSelector(false);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Recipe created successfully!",
        position: "bottom",
      });

      navigation.navigate("Foods");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error || "Failed to create recipe",
        position: "bottom",
      });
    }
  };
  const handleaddIngredient = (foodItem, quantity, unit) => {
    if (!foodItem || !quantity || !unit) {
      Toast.show({
        type: "error",
        text1: "Invalid Ingredient",
        text2: "Please select food item, quantity and unit.",
        position: "bottom",
      });
      return;
    }

    setIngredients((prev) => [
      ...prev,
      { foodItem, quantity: parseFloat(quantity), unit },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Create Recipe</Text>

            <TextInput
              placeholder="Recipe Name *"
              style={[
                styles.input,
                invalidFields && !recipeName && { borderColor: colors.error },
              ]}
              value={recipeName}
              onChangeText={setRecipeName}
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              placeholder="Preparation Time (min) *"
              style={[
                styles.input,
                invalidFields &&
                  !preparationTime && { borderColor: colors.error },
              ]}
              value={preparationTime}
              onChangeText={setPreparationTime}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Cooking Time (min) *"
              style={[
                styles.input,
                invalidFields && !cookingTime && { borderColor: colors.error },
              ]}
              value={cookingTime}
              onChangeText={setCookingTime}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Serving Size *"
              style={[
                styles.input,
                invalidFields && !servingSize && { borderColor: colors.error },
              ]}
              value={servingSize}
              onChangeText={setServingSize}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[
                styles.input,
                { alignContent: "center", justifyContent: "center" },
                invalidFields &&
                  recipeTypes.length <= 0 && { borderColor: colors.error },
              ]}
              onPress={() => setRecipeTypeModal(true)}
            >
              <Text style={[styles.text]}>
                {recipeTypes.length > 0
                  ? recipeTypes.join(", ")
                  : "Select Recipe Type"}
              </Text>
              <MultipleChoicePicker
                modalVisible={recipeTypeModal}
                setModalVisible={setRecipeTypeModal}
                options={mealTypesOptions}
                handleSelect={(item) => {
                  const exists = recipeTypes.includes(item.value);
                  const updated = exists
                    ? recipeTypes.filter((type) => type !== item.value)
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
              <Text style={styles.buttonText}>Add Ingredient</Text>
            </TouchableOpacity>
            <FoodItemSelectorModal
              visible={showFoodItemSelector}
              onClose={() => setShowFoodItemSelector(false)}
              onSelect={({ foodItem, quantity, unit }) => {
                handleaddIngredient(foodItem, quantity, unit);
              }}
            />

            {ingredients.length > 0 && (
              <View style={styles.ingredientList}>
                {ingredients.map((ing, index) => (
                  <View key={index} style={styles.ingredientCard}>
                    <Text style={styles.ingredientText}>
                      {ing.foodItem?.name} - {ing.quantity} {ing.unit}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIngredients((prev) =>
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
              onPress={saveRecipe}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.backgroundLight}
                />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateRecipe;
