import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";

const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];

const ScreenHeader = ({ title, selectedMeal, onMealChange }) => {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (meal) => {
    onMealChange(meal);
    setShowDropdown(false);
  };
  useEffect(() => {
    console.log("Selected meal:", selectedMeal);
  }, []);

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.centerContent}>
          {title ? (
            <Text style={styles.headerTitle}>{title}</Text>
          ) : (
            <TouchableOpacity
              style={styles.dropdownToggle}
              onPress={() => setShowDropdown(true)}
            >
              <Text style={styles.dropdownText}>
                {selectedMeal === false || selectedMeal === null
                  ? "Select a Meal"
                  : selectedMeal}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.primary}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filler for right alignment */}
        <View style={{ width: 28 }} />
      </View>

      {/* Custom dropdown modal */}
      <Modal
        transparent
        visible={showDropdown}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {meals.map((meal) => (
              <TouchableOpacity
                key={meal}
                style={styles.dropdownItem}
                onPress={() => handleSelect(meal)}
              >
                <Text style={styles.dropdownItemText}>{meal}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.backgroundWhite,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  centerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: -1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  dropdownToggle: {
    backgroundColor: "#FAFAFA",
    width: 150,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "flex-end",
    textAlign: "right",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.primary,
    height: 30,
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdownContainer: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 0,
  },
  dropdownItem: {
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.primary,
  },
});

export default ScreenHeader;
