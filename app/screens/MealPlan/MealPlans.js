import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import NutritionalCardList from "../../components/NutritionalCardList";
import Loader from "../../components/Loader";
import useFetch from "../../../hooks/useFetch";
import { colors } from "../../../styles/colors";
import NutritionalModal from "../../components/NutritionalModal";
import ScreenHeader from "../../components/ScreenHeader";
import { useFocusEffect } from "@react-navigation/native";
import SearchAndFilterBar from "../../components/SearchAndFilterBar";
import { useAuth } from "../../../context/AuthContext";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";

const tabs = ["My Plans", "Explore"];

const MealPlansScreen = ({ navigation }) => {
  const { user } = useAuth().user;
  const { data, isLoading, fetchData, status } = useFetch();
  const [activeTab, setActiveTab] = useState("My Plans");
  const [query, setQuery] = useState("");
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [onDatePicked, setOnDatePicked] = useState(() => () => {});

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

  const handleFetch = async () => {
    const filtersToSend = {
      ...filters,
      minCalories: filters.caloriesRange[0],
      maxCalories: filters.caloriesRange[1],
      minProtein: filters.proteinRange[0],
      maxProtein: filters.proteinRange[1],
      ownerId: activeTab === "My Plans" ? user.id : null,
      visibility: activeTab === "Explore" ? "Public" : null,
    };

    await fetchData("meal-plans/search", "POST", null, filtersToSend);
  };

  useEffect(() => {
    handleFetch();
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      handleFetch();
    }, [activeTab])
  );

  const handleCreatePress = () => {
    navigation.navigate("Create Meal Plan");
  };

  const onDelete = async (id) => {
    setIsSaving(true);
    const { status } = await fetchData(`meal-plans/${id}`, "DELETE");
    if (status === 200 || status === 204) {
      setSelectedMealPlan(null);
      setModalVisible(false);
      handleFetch();
    } else {
      Alert.alert("Error", "Failed to delete Meal Plan.");
    }
    setIsSaving(false);
  };

  const onCopyToDiary = async (mealPlanId) => {
    if (!mealPlanId) return;

    try {
      const selectedDate = await new Promise((resolve) => {
        setShowDatePicker(true);
        setTempDate(new Date());
        setOnDatePicked(() => (date) => resolve(date));
      });

      setIsSaving(true);

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { status } = await fetchData(
        `meal-plans/${mealPlanId}/copy-to-diary/${dateStr}`,
        "POST"
      );

      if (status === 200) {
        navigation.navigate("Diary", { date: dateStr });
      } else {
        Alert.alert("Error", "Failed to copy meal plan to diary.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
      console.error("Copy to Diary Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundWhite }}>
      <ScreenHeader title="Meal Plans" />

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

      {activeTab === "My Plans" && (
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={handleCreatePress}>
            <Text>Create New Meal Plan</Text>
          </TouchableOpacity>
        </View>
      )}
      {activeTab === "Explore" && (
        <SearchAndFilterBar
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilters={setFilters}
          onSearch={handleFetch}
        />
      )}

      {isLoading || isSaving ? (
        <Loader />
      ) : (
        <NutritionalCardList
          data={data || []}
          onSelect={(item) => {
            setSelectedMealPlan(item);
            setModalVisible(true);
          }}
        />
      )}

      <NutritionalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedMealPlan}
        type="meal-plan"
        viewOnly={true}
        date={format(new Date(), "yyyy-MM-dd")}
        onDelete={(id) => onDelete(id)}
        onCopyToDiary={(id) => onCopyToDiary(id)}
        navigation={navigation}
        loading={isSaving}
      />

      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) onDatePicked(selectedDate);
          }}
        />
      )}
    </View>
  );
};

export default MealPlansScreen;

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
