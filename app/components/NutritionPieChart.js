import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles/colors";

const NutritionPieChart = ({ data }) => {
  const { user } = useAuth().user;

  if (!data?.macronutrients) return null;

  const macronutrients = data.macronutrients;

  const totalMacros =
    (macronutrients.protein || 0) +
    (macronutrients.fat || 0) +
    (macronutrients.sugar || 0) +
    (macronutrients.salt || 0);

  if (totalMacros === 0) return null;

  const goalMacros = {
    "Fat Loss (Moderate)": { protein: 35, fat: 30, sugar: 30, salt: 5 },
    "Fat Loss (Aggressive)": { protein: 40, fat: 30, sugar: 25, salt: 5 },
    "Maintain Weight": { protein: 30, fat: 30, sugar: 35, salt: 5 },
    "Muscle Gain (Slow)": { protein: 30, fat: 35, sugar: 30, salt: 5 },
    "Muscle Gain (Fast)": { protein: 25, fat: 40, sugar: 30, salt: 5 },
  };

  const goalMacro = goalMacros[user?.goal] || goalMacros["Maintain Weight"];

  const chartData = [
    {
      name: "Protein",
      population: +(macronutrients?.protein ?? 0).toFixed(2),
      color: colors.primary,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Fat",
      population: +(macronutrients?.fat ?? 0).toFixed(2),
      color: colors.accent,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Sugar",
      population: +(macronutrients?.sugar ?? 0).toFixed(2),
      color: colors.secondary,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Salt",
      population: +(macronutrients?.salt ?? 0).toFixed(2),
      color: colors.error,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
  ];

  const eatenPercent = {
    protein: ((macronutrients.protein / totalMacros) * 100).toFixed(0),
    fat: ((macronutrients.fat / totalMacros) * 100).toFixed(0),
    sugar: ((macronutrients.sugar / totalMacros) * 100).toFixed(0),
    salt: ((macronutrients.salt / totalMacros) * 100).toFixed(0),
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: colors.backgroundWhite,
          backgroundGradientFrom: colors.backgroundWhite,
          backgroundGradientTo: colors.backgroundWhite,
          color: () => colors.primary,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
      />

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Macro</Text>
          <Text style={styles.tableHeaderText}>Total</Text>
          <Text style={styles.tableHeaderText}>Goal</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{eatenPercent.protein}%</Text>
          <Text style={styles.macroGoal}>{goalMacro.protein}%</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.macroLabel}>Fat</Text>
          <Text style={[styles.macroValue, { marginLeft: 25 }]}>
            {eatenPercent.fat}%
          </Text>
          <Text style={styles.macroGoal}>{goalMacro.fat}%</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.macroLabel}>Sugar</Text>
          <Text style={styles.macroValue}>{eatenPercent.sugar}%</Text>
          <Text style={styles.macroGoal}>{goalMacro.sugar}%</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.macroLabel}>Salt</Text>
          <Text style={[styles.macroValue, { marginLeft: 5 }]}>
            {eatenPercent.salt}%
          </Text>
          <Text style={styles.macroGoal}>{goalMacro.salt}%</Text>
        </View>
      </View>
    </View>
  );
};

export default NutritionPieChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  tableContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.primary,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  macroLabel: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  macroValue: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  macroGoal: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
