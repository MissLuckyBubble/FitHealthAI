import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import NutritionalCardList from "../../components/NutritionalCardList";
import useFetch from "../../../hooks/useFetch";
import { colors } from "../../../styles/colors";
import NutritionalModal from "../../components/NutritionalModal";
import ScreenHeader from "../../components/ScreenHeader";
import { useFocusEffect } from "@react-navigation/native";
import SearchAndFilterBar from "../../components/SearchAndFilterBar";
import { useAuth } from "../../../context/AuthContext";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

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

  const handleGeneratePress = async () => {
    Toast.show({
      type: "info",
      text1: "Generating Meal Plan...",
      text2: "Please wait while we create it!",
      position: "bottom",
    });

    setTimeout(async () => {
      const existingPlans = data.length;

      const { status } = await fetchData("meal-plans/generate", "POST", null, {
        recipeTypes: ["breakfast", "lunch", "dinner", "snack"],
        days: 1,
      });

      if (status === 200) {
        startPollingMealPlans(existingPlans);

        Toast.show({
          type: "success",
          text1: "Meal Plan Generation Started!",
          text2: "We will notify you when it's ready.",
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to start meal plan generation.",
          position: "bottom",
        });
      }
    }, 300);
  };

  const startPollingMealPlans = (existingCount) => {
    let pollingCount = 0;
    const pollingInterval = setInterval(async () => {
      pollingCount++;

      const { data } = await fetchData("meal-plans", "GET");

      if (data && data.length > existingCount) {
        clearInterval(pollingInterval);

        Toast.show({
          type: "success",
          text1: "Meal Plan Ready!",
          text2: "Check your list now.",
          position: "bottom",
        });
        await handleFetch();
      }

      if (pollingCount > 5) {
        Toast.show({
          type: "info",
          text1: "Meal Plan is still being generated",
          text2: "Please check back again shortly!",
          position: "bottom",
        });
        clearInterval(pollingInterval);
      }
    }, 10000);
  };

  const onDelete = async (id) => {
    const { status } = await fetchData(`meal-plans/${id}`, "DELETE");
    if (status === 200 || status === 204) {
      setSelectedMealPlan(null);
      setModalVisible(false);
      handleFetch();
    } else {
      Alert.alert("Error", "Failed to delete Meal Plan.");
    }
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

          <TouchableOpacity style={styles.card} onPress={handleGeneratePress}>
            <Image
              source={require("../../../assets/generated.png")}
              style={styles.icon}
            />
            <Text>Generate Meal Plan</Text>
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

      <NutritionalCardList
        data={data || []}
        onSelect={(item) => {
          setSelectedMealPlan(item);
          setModalVisible(true);
        }}
        isLoading={isLoading}
      />

      <NutritionalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type="MEAL_PLAN"
        id={selectedMealPlan?.id}
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
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
