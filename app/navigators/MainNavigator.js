import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import CreateFoodItem from "../screens/FoodItem/CreateFoodItem";
import CreateEditRecipe from "../screens/Recipe/CreateEditRecipe";
import UserProfile from "../screens/User/UserProfile";
import EditProfile from "../screens/User/EditProfile";
import profilePic from "../../assets/profilepic.png";
import FoodListScreen from "../screens/Foods/FoodListScreen";
import CreateMeal from "../screens/Meals/CreateMeal";
import DiaryScreen from "../screens/Dairy/DairyScreen";
import MealPlansScreen from "../screens/MealPlan/MealPlans";
import CreateMealPlanScreen from "../screens/MealPlan/CreateMealPlan";
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    props.navigation.navigate("User Profile");
  };

  return (
    <DrawerContentScrollView {...props}>
      {user && (
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleProfileClick}>
            <Image source={profilePic} style={styles.profilePicture} />
          </TouchableOpacity>
          <Text style={styles.username}>{user?.user?.username}</Text>
        </View>
      )}
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 300,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
  },
});

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Foods"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Foods"
        component={FoodListScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Diary"
        component={DiaryScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Create Food Item"
        component={CreateFoodItem}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Create Recipe"
        component={CreateEditRecipe}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Create Meal"
        component={CreateMeal}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Meal Plans"
        component={MealPlansScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Create Meal Plan"
        component={CreateMealPlanScreen}
        options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="User Profile"
        component={UserProfile}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
