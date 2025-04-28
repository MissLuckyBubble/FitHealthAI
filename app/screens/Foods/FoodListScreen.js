import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import NutritionalCardList from "../../components/NutritionalCardList";
import Loader from "../../components/Loader";
import useFetch from "../../../hooks/useFetch";
import { colors } from "../../../styles/colors";
import NutritionalModal from "../../components/NutritionalModal";
import ScreenHeader from "../../components/ScreenHeader";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import SearchAndFilterBar from "../../components/SearchAndFilterBar";
import { useAuth } from "../../../context/AuthContext";
import { useCallback } from "react";
import { format } from "date-fns";
import Toast from "react-native-toast-message";

const tabs = ["All", "My Meals", "My Recipes", "My Foods"];

const FoodListScreen = ({ navigation }) => {
  const { user } = useAuth().user;
  const { data, isLoading, error, fetchData, status } = useFetch();
  const [activeTab, setActiveTab] = useState("All");
  const [itemModal, setItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
  });

  const [selectedMeal, setSelectedMeal] = useState(false);

  const handleCreatePress = () => {
    if (activeTab === "My Meals") {
      navigation.navigate("Create Meal");
    } else if (activeTab === "My Recipes") {
      navigation.navigate("Create Recipe");
    } else if (activeTab === "My Foods") {
      navigation.navigate("Create Food Item");
    }
  };

  const route = useRoute();
  useFocusEffect(
    useCallback(() => {
      console.log("FOODS SCREEN FOCUSED", route.params);

      if (route.params?.selectedMeal) {
        setSelectedMeal(route.params.selectedMeal);
      } else {
        setSelectedMeal(null);
      }
    }, [route.params])
  );

  const handleFetch = async () => {
    const filtersToSend = {
      ...filters,
      minCalories: filters.caloriesRange[0],
      maxCalories: filters.caloriesRange[1],
      minProtein: filters.proteinRange[0],
      maxProtein: filters.proteinRange[1],
      onlyRecipes: activeTab === "My Recipes",
      onlyFoodItems: activeTab === "My Foods",
      ownerId: activeTab !== "All" ? user.id : null,
      visibility: "Public",
    };

    try {
      if (activeTab === "My Meals") {
        await fetchData("meals/search", "POST", null, filtersToSend);
      } else {
        await fetchData("meal-components/search", "POST", null, filtersToSend);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch food list.",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  useEffect(() => {
    handleFetch();
  }, [activeTab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundWhite }}>
      <ScreenHeader
        selectedMeal={selectedMeal}
        onMealChange={(meal) => setSelectedMeal(meal)}
      />

      <SearchAndFilterBar
        filters={filters}
        setFilters={setFilters}
        onSearch={handleFetch}
      />

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab !== "All" && (
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCreatePress()}
          >
            <Text>Create New</Text>
          </TouchableOpacity>
        </View>
      )}
      {isLoading ? (
        <Loader color="white" />
      ) : (
        <NutritionalCardList
          data={data || []}
          onSelect={(item) => {
            console.log(item);
            setSelectedItem(item);
            setItemModalVisible(true);
          }}
        />
      )}

      <NutritionalModal
        visible={itemModal}
        onClose={() => setItemModalVisible(false)}
        id={selectedItem?.id}
        type={
          activeTab === "My Meals"
            ? "MEAL"
            : selectedItem?.ingredients?.length > 0
            ? "RECIPE"
            : "FOOD_ITEM"
        }
        date={route.params?.date ?? format(new Date(), "yyyy-MM-dd")}
        selectedMeal={selectedMeal}
        viewOnly={false}
      />
    </View>
  );
};

export default FoodListScreen;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: colors.accent,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  activeTabText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  cardContainer: {
    padding: 10,
    backgroundColor: colors.backgroundLight,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
});
