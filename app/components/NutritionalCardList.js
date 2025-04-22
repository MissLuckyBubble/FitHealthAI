import React, { use } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  dietaryOptions,
  allergens as allergenOptions,
} from "../../assets/options";
import { colors } from "../../styles/colors";
import { useAuth } from "../../context/AuthContext";

const NutritionalCardList = ({ data, onSelect }) => {
  const { user } = useAuth().user;
  const getDietary = (val) =>
    dietaryOptions.find((o) => o.value === val)?.label || val;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(item)}
      activeOpacity={0.8}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.name || item.recipeName}</Text>
        {item.verifiedByAdmin && (
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={colors.secondary}
            style={styles.verifiedIcon}
          />
        )}
      </View>

      <View style={styles.badges}>
        {item.dietaryPreferences?.map((pref) => (
          <View key={pref} style={styles.badge}>
            <Text style={styles.badgeText}>{getDietary(pref)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoRow}>
        {item.preparationTime && (
          <View style={styles.infoGroup}>
            <Ionicons name="time-outline" size={16} color="#1f2937" />
            <Text style={styles.infoText}>
              Prep: {item.preparationTime} min
            </Text>
          </View>
        )}

        {item.servingSize && (
          <View style={styles.infoGroup}>
            <Ionicons name="person-outline" size={16} color="#1f2937" />
            <Text style={styles.infoText}>Servings: {item.servingSize}</Text>
          </View>
        )}

        {item.macronutrients?.calories && (
          <View style={styles.infoGroup}>
            <Ionicons name="flame-outline" size={16} color="#1f2937" />
            <Text style={styles.infoText}>
              {item.macronutrients.calories} kcal
            </Text>
          </View>
        )}

        {item.allergens?.length > 0 &&
          item.allergens[0] !== "Allergen Free" && (
            <View style={styles.infoGroup}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={colors.error}
              />
              <Text style={[styles.infoText, { color: colors.error }]}>
                {item.allergens.join(", ")}
              </Text>
            </View>
          )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

export default NutritionalCardList;

const styles = StyleSheet.create({
  list: {
    padding: 20,
    backgroundColor: colors.backgroundWhite,
  },
  card: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#059669",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    rowGap: 6,
  },
  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#1f2937",
  },
});
