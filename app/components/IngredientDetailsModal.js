import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { unitOptions } from "../../assets/options";
import NutritionalInfoCard from "./NutritionalInfoCard";
import SingleChoicePicker from "./SingleChoicePicker";
import NutritionalModal from "./NutritionalModal";
import { Pressable, ScrollView } from "react-native-gesture-handler";

const IngredientDetailsModal = ({
  visible,
  foodItem,
  onSave,
  onCancel,
  title = "Add Ingredient",
  isMeal = false,
  isMealPlan = false,
}) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const handleAccept = () => {
    if (!quantity && !isMealPlan) {
      Alert.alert("Missing Information", "Please enter a quantity");
      return;
    }
    if (!isMeal && !unit) {
      Alert.alert("Missing Information", "Please select a unit");
      return;
    }

    onSave({
      quantity: parseFloat(quantity),
      unit: isMeal ? "Serving" : unit,
    });
    setQuantity("");
    setUnit("");
  };

  const handleClose = () => {
    setQuantity("");
    setUnit("");
    onCancel();
  };

  const handleSelectUnit = (item) => {
    setUnit(item.value);
    setModalVisible(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      transparent={true}
    >
      <Pressable style={styles.modalOverlay}>
        <ScrollView style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleAccept}>
              <Ionicons name="checkmark" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputs}>
            {!isMealPlan && (
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            )}
            {!isMeal && (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.unitText}>
                  {unit ? unit : "Select a Unit"}
                </Text>
                <SingleChoicePicker
                  options={unitOptions}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  handleSelect={handleSelectUnit}
                  selectedValue={unit}
                />
              </TouchableOpacity>
            )}
          </View>
          <NutritionalInfoCard data={foodItem} />

          {foodItem?.mealItems?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Meal Items</Text>
              {foodItem.mealItems.map((i, index) => (
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
          <NutritionalModal
            visible={!!selectedIngredient}
            onClose={() => setSelectedIngredient(null)}
            data={selectedIngredient}
            type="FoodItem"
          />
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  inputs: {
    padding: 10,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderColor: colors.primary,
    borderWidth: 0.5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitText: {
    fontSize: 15,
    color: colors.primary,
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
});

export default IngredientDetailsModal;
