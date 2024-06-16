import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodItems from '../components/Main/FoodItems';
import Recipes from '../components/Main/Recipes';

const MainStack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName="FoodItems">
      <MainStack.Screen name="FoodItems" component={FoodItems} />
      <MainStack.Screen name="Recipes" component={Recipes} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
