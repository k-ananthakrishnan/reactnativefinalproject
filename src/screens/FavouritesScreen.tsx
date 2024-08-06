import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import { getMealDetails } from '../services/mealService';
import { useIsFocused } from '@react-navigation/native';

type FavouritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favourites'>;

interface Props {
  navigation: FavouritesScreenNavigationProp;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  ingredients: { strIngredient: string; strIngredientThumb: string }[];
  strTags: string[];
  strYoutube: string;
}

const FavouritesScreen: React.FC<Props> = ({ navigation }) => {
  const [favouriteMeals, setFavouriteMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchFavouriteMeals = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        console.log('User ID:', user.uid);
                const userDocRef = doc(db, 'favorites', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userDocData = userDocSnapshot.data();
          if (!userDocData || !Array.isArray(userDocData.meals)) {
            setFavouriteMeals([]);
            return;
          }

          const mealIds: string[] = userDocData.meals;
          if (mealIds.length === 0) {
            setFavouriteMeals([]);
            return;
          }
          const mealDetailsPromises = mealIds.map((id) => getMealDetails(id));
          const meals = await Promise.all(mealDetailsPromises);
          setFavouriteMeals(meals);
        } else {
          console.log('User document does not exist.');
          setFavouriteMeals([]);
        }
      } else {
        setFavouriteMeals([]);
      }
    } catch (error) {
      console.error('Error fetching favourite meals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchFavouriteMeals();
    }
  }, [isFocused]);

  const renderFavouriteItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MealDetail', { mealId: item.idMeal })}
    >
      <Text style={styles.itemText}>{item.strMeal}</Text>
      <Image source={{ uri: item.strMealThumb }} style={styles.itemImage} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favouriteMeals}
        renderItem={renderFavouriteItem}
        keyExtractor={(item) => item.idMeal}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No favourite meals available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default FavouritesScreen;
