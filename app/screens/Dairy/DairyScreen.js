import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  format,
  addDays,
  subDays,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { useAuth } from "../../../context/AuthContext";
import ScreenHeader from "../../components/ScreenHeader";
import { colors } from "../../../styles/colors";
import useFetch from "../../../hooks/useFetch";
import MealSection from "../../components/MealSection";
import NutritionalInfoCard from "../../components/NutritionalInfoCard";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../components/Loader";

const DiaryScreen = ({ navigation, route }) => {
  const passedDate = route.params?.date;

  const { user } = useAuth().user;
  const { fetchData } = useFetch();
  const [currentDate, setCurrentDate] = useState(
    passedDate ? new Date(passedDate) : new Date()
  );
  const [diaryEntry, setDiaryEntry] = useState(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDiary, setIsLoadingDiary] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDiaryEntry(currentDate);
    }, [currentDate])
  );

  useEffect(() => {
    loadDiaryEntry(currentDate);
  }, [currentDate]);

  const loadDiaryEntry = async (date) => {
    setIsLoadingDiary(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const { data, status } = await fetchData(`diary-entries/${dateStr}`, "GET");
    if (status === 200) {
      setDiaryEntry(data);
    } else {
      setDiaryEntry(null);
    }
    setIsLoadingDiary(false);
  };

  const totalCalories = diaryEntry?.macronutrients?.calories || 0;
  const goalCalories = diaryEntry?.dailyCalorieGoal || user.dailyCalorieGoal;
  const remainingCalories = (goalCalories - totalCalories).toFixed(2);

  const goToPreviousDay = () => {
    setCurrentDate((prev) => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setCurrentDate((prev) => addDays(prev, 1));
  };

  const isTodaySelected = isToday(currentDate);

  const handleDelete = async (item) => {
    setIsLoading(true);
    console.log("isLoading ", isLoading);
    const { status, data, error } = await fetchData(
      `diary-entries/mealItem/${item.id}`,
      "DELETE"
    );
    if (status === 200) {
      loadDiaryEntry(currentDate);
    } else {
      console.error("Error deleting meal item:", error);
    }
    console.log("isLoading ", isLoading);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundWhite }}>
      <ScrollView>
        <ScreenHeader title="Diary" />
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={goToPreviousDay}>
            <Text style={styles.navArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {isTodaySelected
              ? "Today"
              : isTomorrow(currentDate)
              ? "Tomorrow"
              : isYesterday(currentDate)
              ? "Yesterday"
              : format(currentDate, "dd.MM.yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextDay}>
            <Text style={styles.navArrow}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Calories Remaining</Text>
          <View style={styles.caloriesRow}>
            <View style={styles.calBox}>
              <Text style={styles.calValue}>{goalCalories.toFixed(2)}</Text>
              <Text style={styles.calLabel}>Goal</Text>
            </View>
            <Text style={styles.calOperator}>–</Text>
            <View style={styles.calBox}>
              <Text style={styles.calValue}>{totalCalories.toFixed(2)}</Text>
              <Text style={styles.calLabel}>Food</Text>
            </View>
            <Text style={styles.calOperator}>=</Text>
            <View style={styles.calBox}>
              <Text style={styles.calValue}>{remainingCalories}</Text>
              <Text style={styles.calLabel}>Remaining</Text>
            </View>
          </View>

          <NutritionalInfoCard
            data={diaryEntry}
            showTooltip={showTooltip}
            onPressVerifiedIcon={() => setShowTooltip(!showTooltip)}
            showInfo={false}
          />
        </View>
        {isLoadingDiary ? (
          <Loader />
        ) : (
          <MealSection
            title="Breakfast"
            data={diaryEntry?.breakfast?.mealItems}
            onDelete={(item) => handleDelete(item)}
            navigation={navigation}
            date={format(currentDate, "yyyy-MM-dd")}
            isLoading={isLoading}
          />
        )}
        {isLoadingDiary ? (
          <Loader />
        ) : (
          <MealSection
            title="Lunch"
            data={diaryEntry?.lunch?.mealItems}
            onDelete={(item) => handleDelete(item)}
            navigation={navigation}
            date={format(currentDate, "yyyy-MM-dd")}
            isLoading={isLoading}
          />
        )}
        {isLoadingDiary ? (
          <Loader />
        ) : (
          <MealSection
            title="Dinner"
            data={diaryEntry?.dinner?.mealItems}
            onDelete={(item) => handleDelete(item)}
            navigation={navigation}
            date={format(currentDate, "yyyy-MM-dd")}
            isLoading={isLoading}
          />
        )}
        {isLoadingDiary ? (
          <Loader />
        ) : (
          <MealSection
            title="Snack"
            data={diaryEntry?.snack?.mealItems}
            onDelete={(item) => handleDelete(item)}
            navigation={navigation}
            date={format(currentDate, "yyyy-MM-dd")}
            isLoading={isLoading}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiaryScreen;

const styles = StyleSheet.create({
  dateNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  navArrow: {
    fontSize: 24,
    color: colors.primary,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#FAFAFA",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.primary,
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calBox: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  calValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  calLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  calOperator: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
});
