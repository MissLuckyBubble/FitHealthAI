import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import ScreenHeader from "../../components/ScreenHeader";
import NutritionalInfoCard from "../../components/NutritionalInfoCard";
import Loader from "../../components/Loader";
import { colors } from "../../../styles/colors";
import useFetch from "../../../hooks/useFetch";
import { useAuth } from "../../../context/AuthContext";
import FoodItemSelectorModal from "../../components/FoodItemSelectorModal";
import SingleChoicePicker from "../../components/SingleChoicePicker";
import { visibilityOptions } from "../../../assets/options";
import { styles } from "../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";

const CreateMealPlanScreen = ({ navigation, route }) => {
  const { user } = useAuth().user;
  const { fetchData, isLoading } = useFetch();
  const editMealPlan = route.params?.editMealPlan;

  const [mealPlan, setMealPlan] = useState(
    editMealPlan
      ? {
          name: editMealPlan.name,
          breakfast: editMealPlan.breakfast,
          lunch: editMealPlan.lunch,
          dinner: editMealPlan.dinner,
          snack: editMealPlan.snack,
          visibility: editMealPlan.visibility,
          id: editMealPlan.id,
        }
      : {
          name: "",
          breakfast: null,
          lunch: null,
          dinner: null,
          snack: null,
          visibility: "Private",
        }
  );

  const [visibleModal, setVisibleModal] = useState(null);
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [hasMealError, setHasMealError] = useState(false);

  const handleSave = async () => {
    const nError = !mealPlan.name.trim();
    const hMeal =
      mealPlan.breakfast || mealPlan.lunch || mealPlan.dinner || mealPlan.snack;
    setNameError(nError);

    setHasMealError(!hMeal);

    if (nError) {
      Alert.alert("Validation Error", "Meal Plan name is required.");
      return;
    }

    if (!hMeal) {
      Alert.alert(
        "Validation Error",
        "Please add at least one meal to the plan."
      );
      return;
    }

    const body = {
      name: mealPlan.name,
      breakfast: mealPlan.breakfast?.id ? { id: mealPlan.breakfast.id } : null,
      lunch: mealPlan.lunch?.id ? { id: mealPlan.lunch.id } : null,
      dinner: mealPlan.dinner?.id ? { id: mealPlan.dinner.id } : null,
      snack: mealPlan.snack?.id ? { id: mealPlan.snack.id } : null,
      visibility: mealPlan.visibility,
    };

    console.log(body);
    const url = editMealPlan ? `meal-plans/${mealPlan.id}` : "meal-plans";
    const method = editMealPlan ? "PUT" : "POST";

    const { status } = await fetchData(url, method, null, body);

    if (status === 200 || status === 201) {
      handleClearAll();
      navigation.navigate("Meal Plans");
    } else {
      console.log(status);
      alert("Failed to save meal plan");
    }
  };

  const handleClearAll = () => {
    setMealPlan({
      name: "",
      breakfast: null,
      lunch: null,
      dinner: null,
      snack: null,
      visibility: "Private",
    });
    setNameError(false);
    setHasMeal(false);
  };

  const handleClearSlot = (type) => {
    setMealPlan((prev) => ({ ...prev, [type]: null }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      <ScrollView>
        <ScreenHeader
          title={editMealPlan ? "Edit Meal Plan" : "Create Meal Plan"}
        />
        <View style={styles.container}>
          <View style={localStyles.formGroup}>
            <Text style={localStyles.label}>Meal Plan Name</Text>
            <TextInput
              style={[styles.input, nameError && { borderColor: colors.error }]}
              placeholder="e.g. Low Carb Plan"
              value={mealPlan.name}
              onChangeText={(text) => setMealPlan({ ...mealPlan, name: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.input]}
            onPress={() => setShowVisibilityPicker(true)}
          >
            <Text style={[styles.text, { marginTop: 13 }]}>
              Visibility: {mealPlan.visibility}
            </Text>
          </TouchableOpacity>

          {["breakfast", "lunch", "dinner", "snack"].map((type) => (
            <View key={type} style={{ marginBottom: 16, width: "100%" }}>
              <TouchableOpacity
                onPress={() => setVisibleModal(type)}
                style={[
                  localStyles.selectContainer,
                  hasMealError && { borderColor: colors.error },
                ]}
              >
                <Text style={localStyles.selectTitle}>
                  {type.toUpperCase()}
                </Text>
                {mealPlan[type] ? (
                  <NutritionalInfoCard data={mealPlan[type]} showInfo={false} />
                ) : (
                  <Text style={localStyles.placeholder}>Select a {type}</Text>
                )}
                {mealPlan[type] && (
                  <TouchableOpacity onPress={() => handleClearSlot(type)}>
                    <Text style={localStyles.clear}>
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={colors.error}
                      />{" "}
                      Clear {type}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.button, isLoading && { backgroundColor: "#ccc" }]}
            disabled={isLoading}
          >
            {isLoading && <Loader />}
            {!isLoading && (
              <Text style={styles.buttonText}>Save Meal Plan</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {visibleModal && (
        <FoodItemSelectorModal
          visible={!!visibleModal}
          onClose={() => setVisibleModal(null)}
          fetchEndpoint="meals/search"
          onlyFood={false}
          onSelect={({ foodItem }) => {
            setMealPlan((prev) => ({ ...prev, [visibleModal]: foodItem }));
            setVisibleModal(null);
          }}
          isMeal={true}
          isMealPlan={true}
        />
      )}

      {showVisibilityPicker && (
        <SingleChoicePicker
          modalVisible={showVisibilityPicker}
          setModalVisible={setShowVisibilityPicker}
          options={visibilityOptions}
          selectedValue={mealPlan.visibility}
          handleSelect={(item) =>
            setMealPlan((prev) => ({ ...prev, visibility: item.value }))
          }
        />
      )}
    </SafeAreaView>
  );
};

export default CreateMealPlanScreen;

const localStyles = StyleSheet.create({
  formGroup: {
    marginHorizontal: 20,
    marginBottom: 20,
    width: "100%",
  },
  selectContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    backgroundColor: colors.backgroundWhite,
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4,
  },
  selectTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    width: "100%",
  },
  placeholder: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveButton: {
    margin: 20,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  clear: {
    color: colors.error,
    textAlign: "center",
    marginHorizontal: 20,
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
});
