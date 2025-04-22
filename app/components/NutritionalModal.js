import React, { useState } from "react";
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

const NutritionalModal = ({
  visible,
  onClose,
  data,
  date,
  selectedMeal,
  viewOnly = true,
  type = "",
  onDelete,
  onCopyToDiary,
  navigation,
  loading,
}) => {
  const { user } = useAuth().user;
  const { dataFromFetch, isLoading, error, fetchData, status } = useFetch();
  const [saving, setSaving] = useState(false);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [showIngredientDetailsModal, setShowIngredientDetailsModal] =
    useState(false);

  const handleAddToDairyPress = () => {
    if (!selectedMeal) {
      Alert.alert(
        "No Meal Selected",
        "Please select a meal to add the food item to.",
        [{ text: "OK" }]
      );
      return;
    }
    console.log("date: ", date);
    setShowIngredientDetailsModal(true);
  };

  const handleSave = async ({ quantity, unit }) => {
    setSaving(true);
    setShowIngredientDetailsModal(false);

    const isMeal = !!data.mealItems?.length;
    const isRecipe = !!data.ingredients?.length;

    const dto = {
      mealId: isMeal ? data.id : null,
      mealName: `${user.username}'s ${date} ${selectedMeal}`,
      componentId: !isMeal ? data.id : null,
      componentType: isMeal ? null : isRecipe ? "RECIPE" : "FOOD_ITEM",
      quantity: parseFloat(quantity),
      unit: unit,
      recipeType: selectedMeal,
      date: date,
    };
    console.log("DTO: ", dto);
    await fetchData("diary-entries/assign-meal", "POST", null, dto);
    console.log("status: ", status);
    onClose();

    setSaving(false);
  };

  if (!data) return null;

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <NutritionalInfoCard
                data={data}
                showTooltip={showTooltip}
                onPressVerifiedIcon={() => setShowTooltip(!showTooltip)}
                showInfo={type != "meal-plan"}
              />

              {data.ingredients?.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {data.ingredients.map((i, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedIngredient(i.foodItem)}
                      style={styles.itemStyle}
                    >
                      <Text style={styles.ingredientText}>
                        {i.foodItem?.name ?? "Unknown"} — {i.quantity} {i.unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {data.mealItems?.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Meal Items</Text>
                  {data.mealItems.map((i, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedIngredient(i.component)}
                      style={styles.itemStyle}
                    >
                      <Text style={styles.ingredientText}>
                        {i.component?.name ?? "Unknown"} — {i.quantity} {i.unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {type === "meal-plan" && (
                <>
                  <Text style={styles.sectionTitle}>Meals</Text>
                  {["breakfast", "lunch", "dinner", "snack"].map((slot) => {
                    const meal = data?.[slot];
                    if (!meal) return null;

                    return (
                      <TouchableOpacity
                        key={slot}
                        style={styles.itemStyle}
                        onPress={() => setSelectedIngredient(meal)}
                      >
                        <Text style={styles.ingredientText}>
                          {slot.charAt(0).toUpperCase() + slot.slice(1)}:{" "}
                          {meal.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}

              {!viewOnly && (
                <TouchableOpacity
                  style={[
                    styles.modalCloseButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => handleAddToDairyPress()}
                >
                  <Text
                    style={[
                      styles.modalCloseText,
                      {
                        paddingHorizontal: 20,
                        alignSelf: "center",
                        color: "#fff",
                      },
                    ]}
                  >
                    Add to Diary
                  </Text>
                </TouchableOpacity>
              )}

              <IngredientDetailsModal
                visible={showIngredientDetailsModal}
                foodItem={data}
                onSave={handleSave}
                onCancel={() => setShowIngredientDetailsModal(false)}
                title="Add to Dairy"
                isMeal={!!data.mealItems?.length}
              />

              {type === "meal-plan" && (
                <>
                  {user.id === data.owner.id && (
                    <View style={styles.row}>
                      <TouchableOpacity
                        style={[
                          styles.modalCloseButton,
                          { backgroundColor: colors.accent, width: "45%" },
                        ]}
                        onPress={() => {
                          onClose();
                          navigation.navigate("Create Meal Plan", {
                            editMealPlan: data,
                          });
                        }}
                      >
                        <Text
                          style={[styles.modalCloseText, { color: "#fff" }]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.modalCloseButton,
                          { backgroundColor: colors.error, width: "45%" },
                        ]}
                        onPress={async () => {
                          const confirm = await new Promise((res) => {
                            Alert.alert("Confirm Delete", "Are you sure?", [
                              {
                                text: "Cancel",
                                style: "cancel",
                                onPress: () => res(false),
                              },
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => res(true),
                              },
                            ]);
                          });
                          if (confirm) {
                            onDelete(data.id);
                          }
                        }}
                      >
                        <Text
                          style={[styles.modalCloseText, { color: "#fff" }]}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.modalCloseButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => {
                      onCopyToDiary(data.id);
                    }}
                  >
                    <Text style={[styles.modalCloseText, { color: "#fff" }]}>
                      Copy to Diary
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.modalCloseText,
                    { paddingHorizontal: 20, alignSelf: "center" },
                  ]}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
        {(isLoading || loading) && (
          <View style={styles.loadingOverlay}>
            <Loader />
          </View>
        )}
      </Modal>

      <NutritionalModal
        visible={!!selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
        data={selectedIngredient}
        type="FoodItem"
      />
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
