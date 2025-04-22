import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dietaryOptions, allergenOptions } from "../../assets/options";
import { colors } from "../../styles/colors";

const getDietaryLabel = (value) =>
  dietaryOptions.find((o) => o.label === value)?.label || value;

const getDietaryIcon = (value) =>
  dietaryOptions.find((o) => o.label === value)?.image;

const getAllergenIcon = (value) =>
  allergenOptions.find((o) => o.label === value)?.image;

const NutritionalInfoCard = ({
  data,
  onPressVerifiedIcon,
  showTooltip,
  showInfo = true,
}) => {
  if (!data) return null;

  return (
    <View>
      <View style={styles.headerRow}>
        {(data.name || data.recipeName) && (
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View>
              <Text style={styles.recipeTitle}>
                {data.name || data.recipeName}
              </Text>
              {data.description && (
                <Text style={styles.recipeSubtitle}>{data.description}</Text>
              )}
            </View>

            {data.verifiedByAdmin && (
              <TouchableOpacity onPress={onPressVerifiedIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            Verified by admin – this and all related data have been reviewed for
            accuracy.
          </Text>
        </View>
      )}

      <View style={styles.inlineInfoRow}>
        {data.preparationTime && (
          <>
            <Ionicons name="time-outline" size={16} color="#1f2937" />
            <Text style={styles.inlineInfoText}>
              Prep: {data.preparationTime} min
            </Text>
          </>
        )}

        {data.servingSize && (
          <>
            <Ionicons
              name="person-outline"
              size={16}
              color="#1f2937"
              style={styles.iconSpacer}
            />
            <Text style={styles.inlineInfoText}>
              Servings: {data.servingSize}
            </Text>
          </>
        )}
      </View>

      <View style={styles.nutritionCard}>
        <Text style={styles.bigCalories}>
          {data.macronutrients?.calories?.toFixed(2) ?? "–"} kcal
        </Text>
        <Text style={styles.nutritionLabel}>Calories</Text>

        <View style={styles.macroRow}>
          {["protein", "fat", "salt", "sugar"].map((macro) => (
            <View key={macro} style={styles.macroBox}>
              <Text style={styles.macroValue}>
                {data.macronutrients?.[macro]?.toFixed(2) ?? "–"}g
              </Text>
              <Text style={styles.macroLabel}>
                {macro.charAt(0).toUpperCase() + macro.slice(1)}
              </Text>
            </View>
          ))}
        </View>
        {showInfo && (
          <Text style={[styles.macroLabel, { marginTop: 6 }]}>
            {data?.component
              ? `Info for ${data.quantity} ${data.unit}`
              : data?.servingSize
              ? `Info for the full recipe (serves ${data.servingSize})`
              : data?.mealItems
              ? `Info for full meal (${data?.mealItems.length} meal items)`
              : "Info per 100g"}
          </Text>
        )}
      </View>

      <Text style={styles.recipeDetails}>
        Created by: {data.owner?.username}
      </Text>

      <View style={styles.tagsContainer}>
        {data.dietaryPreferences?.map((pref) => (
          <View key={pref} style={styles.tag}>
            {getDietaryIcon(pref) && (
              <Image source={getDietaryIcon(pref)} style={styles.tagIcon} />
            )}
            <Text style={styles.tagText}>{getDietaryLabel(pref)}</Text>
          </View>
        ))}
        {data.allergens?.map((all) => (
          <View
            key={all}
            style={[all !== "Allergen Free" ? styles.allergenTag : styles.tag]}
          >
            {getAllergenIcon(all) && (
              <Image source={getAllergenIcon(all)} style={styles.tagIcon} />
            )}
            <Text
              style={
                all === "Allergen Free" ? styles.tagText : styles.allergenText
              }
            >
              {all}
            </Text>
          </View>
        ))}
      </View>

      {data.healthConditionSuitabilities?.length > 0 && (
        <View style={styles.healthTagsContainer}>
          {data.healthConditionSuitabilities.map((tag) => (
            <Text key={tag} style={styles.healthTag}>
              {tag}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default NutritionalInfoCard;

const styles = StyleSheet.create({
  // 👇 Use the same styles from the original modal component
  // You can import the styles if they're shared, or extract to a common file
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  recipeSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  recipeDetails: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 6,
  },
  tooltip: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 6,
    top: 30,
    right: 10,
    zIndex: 10,
    maxWidth: 200,
    position: "absolute",
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
  },
  inlineInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inlineInfoText: {
    fontSize: 12,
    color: "#1f2937",
    marginRight: 12,
  },
  iconSpacer: {
    marginLeft: 10,
  },
  nutritionCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  bigCalories: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    width: "100%",
  },
  macroBox: {
    alignItems: "center",
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  macroLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  allergenTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  tagIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    color: "#065f46",
    fontWeight: "500",
  },
  allergenText: {
    fontSize: 12,
    color: "#991b1b",
    fontWeight: "500",
  },
  healthTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  healthTag: {
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 4,
  },
});
