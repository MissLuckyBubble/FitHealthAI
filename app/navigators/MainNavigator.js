import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FoodItems from "../components/Main/FoodItems";
import Recipes from "../components/Main/Recipes";

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="FoodItems">
      <Drawer.Screen name="FoodItems" component={FoodItems} />
      <Drawer.Screen name="Recipes" component={Recipes} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
