import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import MultipleChoicePicker from "./MultipleChoicePicker";
import SingleChoicePicker from "./SingleChoicePicker";
import {
  dietaryOptions,
  allergenOptions,
  conditionSuitabilityOptions,
  goalOptions,
} from "../../assets/options";
import { colors } from "../../styles/colors";
import { modalStyles } from "../../styles/modalStyles";

const sortFields = ["calories", "protein", "likes", "date"];
const sortDirections = ["asc", "desc"];

const SearchAndFilterBar = ({ filters, setFilters, onSearch }) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [showDietaryModal, setShowDietaryModal] = useState(false);
  const [showAllergenModal, setShowAllergenModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const allergenExpansionMap = {
    "Animal Product": ["Dairy", "Meat", "Eggs", "ShellFish", "Animal Product"],
    Nuts: ["Peanut", "Nuts"],
  };

  const resolveAllergens = (list) => {
    let expanded = [];
    list.forEach((item) => {
      if (allergenExpansionMap[item]) {
        expanded.push(...allergenExpansionMap[item]);
      } else {
        expanded.push(item);
      }
    });
    return [...new Set(expanded)];
  };

  const clearFilters = () => {
    setFilters({
      query: null,
      dietaryPreferences: [],
      allergens: [],
      conditionSuitability: [],
      goal: null,
      verifiedOnly: false,
      caloriesRange: [0, 1600],
      proteinRange: [0, 100],
      sortBy: "date",
      sortDirection: "asc",
    });
  };

  return (
    <>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={filters.query}
          onChangeText={(val) => setFilters({ ...filters, query: val })}
          onSubmitEditing={() => onSearch(filters.query)}
        />

        <TouchableOpacity style={styles.button} onPress={onSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.buttonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        visible={filterVisible}
      >
        <View style={modalStyles.modalContainer}>
          <ScrollView style={modalStyles.modalContent}>
            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={{ position: "absolute", top: 10, right: 20 }}
            >
              <Text style={{ fontSize: 24 }}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Dietary Preferences</Text>
            <TouchableOpacity
              onPress={() => setShowDietaryModal(true)}
              style={styles.selector}
            >
              <Text style={styles.selectorText}>
                {filters.dietaryPreferences.join(", ") || "None"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Exclude Allergens</Text>
            <TouchableOpacity
              onPress={() => setShowAllergenModal(true)}
              style={styles.selector}
            >
              <Text style={styles.selectorText}>
                {filters.allergens.join(", ") || "None"}
              </Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Health Conditions</Text>
                <TouchableOpacity
                  onPress={() => setShowHealthModal(true)}
                  style={styles.selector}
                >
                  <Text style={styles.selectorText}>
                    {filters.conditionSuitability.join(", ") || "None"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Goal</Text>
                <TouchableOpacity
                  onPress={() => setShowGoalModal(true)}
                  style={styles.selector}
                >
                  <Text style={styles.selectorText}>
                    {filters.goal || "None"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Verified Only</Text>
              <Switch
                value={filters.verifiedOnly}
                onValueChange={(val) =>
                  setFilters({ ...filters, verifiedOnly: val })
                }
                trackColor={{ false: "#ccc", true: colors.primary }}
                thumbColor={filters.verifiedOnly ? colors.accent : "#f4f3f4"}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Calories</Text>
                <Text style={styles.rangeText}>
                  {filters.caloriesRange.join(" - ")}
                </Text>
                <MultiSlider
                  values={filters.caloriesRange}
                  min={0}
                  max={1600}
                  step={10}
                  sliderLength={150}
                  onValuesChange={(val) =>
                    setFilters({ ...filters, caloriesRange: val })
                  }
                  selectedStyle={{ backgroundColor: colors.accent }}
                />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Protein</Text>
                <Text style={styles.rangeText}>
                  {filters.proteinRange.join(" - ")}
                </Text>
                <MultiSlider
                  values={filters.proteinRange}
                  min={0}
                  max={100}
                  step={1}
                  sliderLength={150}
                  onValuesChange={(val) =>
                    setFilters({
                      ...filters,
                      proteinRange: val,
                    })
                  }
                  selectedStyle={{ backgroundColor: colors.accent }}
                />
              </View>
            </View>

            <Text style={styles.label}>Sort By</Text>
            <View style={styles.sortRow}>
              {sortFields.map((field) => (
                <TouchableOpacity
                  key={field}
                  onPress={() => setFilters({ ...filters, sortBy: field })}
                  style={[
                    styles.sortButton,
                    filters.sortBy === field && styles.selectedSortButton,
                  ]}
                >
                  <Text
                    style={
                      filters.sortBy === field
                        ? styles.selectedSortText
                        : styles.sortText
                    }
                  >
                    {field}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Sort Direction</Text>
            <View style={styles.sortRow}>
              {sortDirections.map((dir) => (
                <TouchableOpacity
                  key={dir}
                  onPress={() => setFilters({ ...filters, sortDirection: dir })}
                  style={[
                    styles.sortButton,
                    filters.sortDirection === dir && styles.selectedSortButton,
                  ]}
                >
                  <Text
                    style={
                      filters.sortDirection === dir
                        ? styles.selectedSortText
                        : styles.sortText
                    }
                  >
                    {dir.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onSearch();
                setFilterVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: "#ddd" }]}
              onPress={() => {
                clearFilters();
                onSearch();
                setFilterVisible(false);
              }}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <MultipleChoicePicker
          modalVisible={showDietaryModal}
          setModalVisible={setShowDietaryModal}
          options={dietaryOptions}
          handleSelect={(item) => {
            const exists = filters.dietaryPreferences.includes(item.value);
            const updated = exists
              ? filters.dietaryPreferences.filter((d) => d !== item.value)
              : [...filters.dietaryPreferences, item.value];
            setFilters({ ...filters, dietaryPreferences: updated });
          }}
          selectedValues={filters.dietaryPreferences}
        />

        <MultipleChoicePicker
          modalVisible={showAllergenModal}
          setModalVisible={setShowAllergenModal}
          options={allergenOptions}
          handleSelect={(item) => {
            const exists = filters.allergens.includes(item.value);
            const updated = exists
              ? filters.allergens.filter((d) => d !== item.value)
              : [...filters.allergens, item.value];
            setFilters({ ...filters, allergens: resolveAllergens(updated) });
          }}
          selectedValues={filters.allergens}
        />

        <MultipleChoicePicker
          modalVisible={showHealthModal}
          setModalVisible={setShowHealthModal}
          options={conditionSuitabilityOptions}
          handleSelect={(item) => {
            const exists = filters.conditionSuitability.includes(item.value);
            const updated = exists
              ? filters.conditionSuitability.filter((d) => d !== item.value)
              : [...filters.conditionSuitability, item.value];
            setFilters({ ...filters, conditionSuitability: updated });
          }}
          selectedValues={filters.conditionSuitability}
        />

        <SingleChoicePicker
          modalVisible={showGoalModal}
          setModalVisible={setShowGoalModal}
          options={goalOptions}
          handleSelect={(item) => setFilters({ ...filters, goal: item.label })}
          selectedValue={filters.goal}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginLeft: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContent: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.backgroundWhite,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 6,
  },
  selector: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
    borderRadius: 8,
  },
  selectorText: {
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginVertical: 8,
  },
  half: {
    flex: 1,
  },
  rangeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 10,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  selectedSortButton: {
    backgroundColor: colors.primary,
  },
  sortText: {
    color: colors.textSecondary,
  },
  selectedSortText: {
    color: "#fff",
    fontWeight: "bold",
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default SearchAndFilterBar;
