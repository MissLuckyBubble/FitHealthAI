import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  View,
} from "react-native";
import NutritionalInfoCard from "../components/NutritionalInfoCard";
import { colors } from "../../styles/colors";
import IngredientDetailsModal from "./IngredientDetailsModal";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import Loader from "./Loader";
import PreferenceButtons from "./PreferenceButtons";
import Toast from "react-native-toast-message";

const NutritionalModal = ({
  visible,
  onClose,
  type,
  id,
  viewOnly = true,
  selectedMeal,
  date,
  onDelete,
  onCopyToDiary,
  navigation,
  loading: externalLoading = false,
}) => {
  const { user } = useAuth().user;
  const { data: fetchedData, isLoading: fetchLoading, fetchData } = useFetch();
  const [localData, setLocalData] = useState(null);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showIngredientDetailsModal, setShowIngredientDetailsModal] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const isLoading = fetchLoading || saving || externalLoading;

  useEffect(() => {
    console.log("id:", id);
    console.log("type: ", type);
    if (id && type) {
      let endpoint = "";
      if (type === "FOOD_ITEM") endpoint = `food-items/${id}`;
      else if (type === "RECIPE") endpoint = `recipes/${id}`;
      else if (type === "MEAL") endpoint = `meals/${id}`;
      else if (type === "MEAL_PLAN") endpoint = `meal-plans/${id}`;
      else if (type == "COMPONENT") endpoint = `meal-components/${id}`;
      else console.error("Unsupported type:", type);

      fetchData(endpoint, "GET", null).then((response) => {
        if (response?.data) {
          setLocalData(response.data);
        }
      });
    }
  }, [visible, id, type]);

  const handleAddToDiary = () => {
    if (!selectedMeal) {
      Alert.alert(
        "No Meal Selected",
        "Please select a meal to add the food item to.",
        [{ text: "OK" }]
      );
      return;
    }
    setShowIngredientDetailsModal(true);
  };

  const handleSave = async ({ quantity, unit }) => {
    setSaving(true);
    setShowIngredientDetailsModal(false);
    const isMeal = !!localData?.mealItems?.length;
    const isRecipe = !!localData?.ingredients?.length;
    onClose();
    const dto = {
      mealId: isMeal ? localData.id : null,
      mealName: `${user.username}'s ${date} ${selectedMeal}`,
      componentId: !isMeal ? localData.id : null,
      componentType: isMeal ? null : isRecipe ? "RECIPE" : "FOOD_ITEM",
      quantity: parseFloat(quantity),
      unit,
      recipeType: selectedMeal,
      date,
    };
    const { status } = await fetchData(
      "diary-entries/assign-meal",
      "POST",
      null,
      dto
    );
    setSaving(false);
    if (status === 200 || status === 201) {
      Toast.show({
        type: "success",
        text1: "Added to Diary!",
        text2: "Meal successfully added.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add meal to diary.",
      });
    }
  };

  if (!visible) return null;

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable style={styles.modalContainer}>
            {isLoading || !localData ? (
              <Loader />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <NutritionalInfoCard
                  data={localData}
                  showInfo={type !== "MEAL_PLAN"}
                />
                {localData.ingredients?.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {localData.ingredients.map((i, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          setSelectedIngredient({
                            id: i.foodItem.id,
                            type: "FOOD_ITEM",
                          })
                        }
                        style={styles.itemStyle}
                      >
                        <Text style={styles.ingredientText}>
                          {i.foodItem?.name ?? "Unknown"} — {i.quantity}{" "}
                          {i.unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* Meal Items */}
                {localData.mealItems?.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Meal Items</Text>
                    {localData.mealItems.map((i, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          setSelectedIngredient({
                            id: i.component.id,
                            type: i.componentType,
                          })
                        }
                        style={styles.itemStyle}
                      >
                        <Text style={styles.ingredientText}>
                          {i.component?.name ?? "Unknown"} — {i.quantity}{" "}
                          {i.unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* MealPlan Meals */}
                {type === "MEAL_PLAN" && (
                  <>
                    <Text style={styles.sectionTitle}>Meals</Text>
                    {["breakfast", "lunch", "dinner", "snack"].map(
                      (mealSlot) => {
                        const meal = localData?.[mealSlot];
                        if (!meal) return null;
                        return (
                          <TouchableOpacity
                            key={mealSlot}
                            style={styles.itemStyle}
                            onPress={() =>
                              setSelectedIngredient({
                                id: meal.id,
                                type: "MEAL",
                              })
                            }
                          >
                            <Text style={styles.ingredientText}>
                              {mealSlot.charAt(0).toUpperCase() +
                                mealSlot.slice(1)}
                              : {meal.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </>
                )}

                {/* Preference Buttons */}
                {localData?.id && (
                  <PreferenceButtons itemId={localData.id} itemType={type} />
                )}

                {/* Add to Diary */}
                {!viewOnly && (
                  <TouchableOpacity
                    style={[
                      styles.modalCloseButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleAddToDiary}
                  >
                    <Text style={[styles.modalCloseText, { color: "#fff" }]}>
                      Add to Diary
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Edit / Delete for MealPlan */}
                {type === "MEAL_PLAN" && user?.id === localData?.owner?.id && (
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={[
                        styles.modalCloseButton,
                        { backgroundColor: colors.accent, width: "45%" },
                      ]}
                      onPress={() => {
                        onClose();
                        navigation.navigate("Create Meal Plan", {
                          editMealPlan: localData,
                        });
                      }}
                    >
                      <Text style={[styles.modalCloseText, { color: "#fff" }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modalCloseButton,
                        { backgroundColor: colors.error, width: "45%" },
                      ]}
                      onPress={() => onDelete(localData.id)}
                    >
                      <Text style={[styles.modalCloseText, { color: "#fff" }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Copy to Diary */}
                {type === "MEAL_PLAN" && (
                  <TouchableOpacity
                    style={[
                      styles.modalCloseButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => onCopyToDiary(localData.id)}
                  >
                    <Text style={[styles.modalCloseText, { color: "#fff" }]}>
                      Copy to Diary
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={onClose}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>

        <IngredientDetailsModal
          visible={showIngredientDetailsModal}
          foodItem={localData}
          onSave={handleSave}
          onCancel={() => setShowIngredientDetailsModal(false)}
          title="Add to Diary"
          isMeal={!!localData?.mealItems?.length}
        />
      </Modal>

      {selectedIngredient && (
        <NutritionalModal
          visible={!!selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
          type={
            type == "MEAL_PLAN"
              ? "MEAL"
              : selectedIngredient?.ingredients?.length > 0
              ? "RECIPE"
              : "FOOD_ITEM"
          }
          id={selectedIngredient.id}
        />
      )}
    </>
  );
};

export default NutritionalModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: "90%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    color: "#111827",
  },
  itemStyle: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
  },
  ingredientText: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },
  modalCloseButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    marginTop: 10,
    padding: 12,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#1f2937",
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8, 50, 84, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
