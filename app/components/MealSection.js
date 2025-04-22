import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import NutritionalModal from "./NutritionalModal";
import Loader from "./Loader";

const MealSection = ({
  title,
  data,
  onDelete,
  navigation,
  date,
  isLoading,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.itemRow}>
              <TouchableOpacity
                onPress={() => handleOpenModal(item)}
                style={styles.itemTextWrapper}
              >
                <Text style={styles.itemText}>
                  {item.component?.name ?? "Unknown"} — {item.quantity}{" "}
                  {item.unit}
                </Text>
              </TouchableOpacity>
              {isLoading ? (
                <Loader color={colors.error} size="20" />
              ) : (
                <TouchableOpacity onPress={() => onDelete(item)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No items added yet.</Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("Foods", {
            selectedMeal: title,
            date: date,
            dairy: true,
          })
        }
      >
        <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
        <Text style={styles.addText}>Add Food</Text>
      </TouchableOpacity>

      <NutritionalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedItem}
      />
    </View>
  );
};

export default MealSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    borderStyle: "solid",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    marginHorizontal: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemTextWrapper: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  addText: {
    marginLeft: 6,
    color: colors.accent,
    fontWeight: "600",
  },
});
