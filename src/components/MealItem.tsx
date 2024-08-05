// src/components/MealItem.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Meal } from '../types';

type Props = {
  meal: Meal;
  onPress: () => void;
};

const MealItem: React.FC<Props> = ({ meal, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{meal.strMeal}</Text>
    </TouchableOpacity>
  );
};

export default MealItem;
