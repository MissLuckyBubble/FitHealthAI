import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import useFetch from "../../hooks/useFetch";
import Loader from "./Loader";
import NutritionalCardList from "./NutritionalCardList";
import IngredientDetailsModal from "./IngredientDetailsModal";
import ScreenHeader from "./ScreenHeader";
import SearchAndFilterBar from "./SearchAndFilterBar";

const FoodItemSelectorModal = ({
  visible,
  onClose,
  onSelect,
  fetchEndpoint = "meal-components/search",
  onlyFood = true,
  userId = null,
  isMeal = false,
  isMealPlan = false,
}) => {
  const [query, setQuery] = useState("");
  const { data, isLoading, fetchData } = useFetch();
  const [filters, setFilters] = useState({
    dietaryPreferences: [],
    allergens: [],
    conditionSuitability: [],
    goal: null,
    verifiedOnly: false,
    caloriesRange: [0, 1600],
    proteinRange: [0, 100],
    sortBy: "date",
    sortDirection: "asc",
    visibility: "Public",
    userId: userId,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      handleFetch();
    }
  }, [visible]);

  const handleFetch = async () => {
    const filtersToSend = {
      ...filters,
      minCalories: filters.caloriesRange[0],
      maxCalories: filters.caloriesRange[1],
      minProtein: filters.proteinRange[0],
      maxProtein: filters.proteinRange[1],
      onlyFoodItems: onlyFood,
    };

    await fetchData(fetchEndpoint, "POST", null, filtersToSend);
  };

  const handleFoodItemPress = (item) => {
    setSelectedItem(item);
    setIngredientModalVisible(true);
  };

  const handleSaveIngredient = ({ quantity, unit }) => {
    onSelect({
      foodItem: selectedItem,
      quantity,
      unit,
    });
    setIngredientModalVisible(false);
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <ScreenHeader title={"Select an Item"} />
          <SearchAndFilterBar
            query={query}
            setQuery={setQuery}
            filters={filters}
            setFilters={setFilters}
            onSearch={handleFetch}
            onClose={onClose}
          />
          {isLoading ? (
            <Loader />
          ) : (
            <NutritionalCardList
              data={data || []}
              onSelect={handleFoodItemPress}
            />
          )}
        </View>
      </Modal>

      <IngredientDetailsModal
        visible={ingredientModalVisible}
        foodItem={selectedItem}
        onSave={handleSaveIngredient}
        onCancel={() => setIngredientModalVisible(false)}
        isMeal={isMeal}
        isMealPlan={isMealPlan}
        title={isMealPlan ? "Add meal" : null}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  searchRow: {
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 10,
    borderRadius: 8,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FoodItemSelectorModal;
