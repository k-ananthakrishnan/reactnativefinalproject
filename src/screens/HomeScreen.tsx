import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import { getCategories, getMealsByCategory, getRandomMeals, searchMeals } from '../services/mealService';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strTags: string;
}

interface Category {
  idCategory: string;
  strCategory: string;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsData = await getRandomMeals();
        setMeals(mealsData);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName || 'User');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchMeals();
    fetchCategories();
    fetchUserData(); 
  }, []);

  const handleMealPress = (mealId: string) => {
    navigation.navigate('MealDetail', { mealId });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const mealsData = await searchMeals(search);
      setMeals(mealsData);
    } catch (error) {
      console.error('Error searching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category: string) => {
    let updatedSelectedCategories = [...selectedCategories];
    if (selectedCategories.includes(category)) {
      updatedSelectedCategories = updatedSelectedCategories.filter(cat => cat !== category);
    } else {
      updatedSelectedCategories.push(category);
    }
    setSelectedCategories(updatedSelectedCategories);
    updateMealList(updatedSelectedCategories);
  };

  const updateMealList = async (selectedCategories: string[]) => {
    setLoading(true);
    try {
      if (selectedCategories.length === 0) {
        const mealsData = await getRandomMeals();
        setMeals(mealsData);
      } else {
        let mealsData: Meal[] = [];
        for (let category of selectedCategories) {
          const categoryMeals = await getMealsByCategory(category);
          mealsData = [...mealsData, ...categoryMeals];
        }
        setMeals(mealsData);
      }
    } catch (error) {
      console.error('Error updating meal list:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity style={styles.mealItem} onPress={() => handleMealPress(item.idMeal)}>
      <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.mealName}>{item.strMeal}</Text>
        {item.strTags && <Text style={styles.mealTags}>{item.strTags}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategories.includes(item.strCategory) && styles.selectedCategory]}
      onPress={() => handleCategoryPress(item.strCategory)}
    >
      <Text
        style={[
          styles.categoryName,
          selectedCategories.includes(item.strCategory) && styles.selectedCategoryName,
        ]}
      >
        {item.strCategory}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Meal App</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user-circle-o" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for meals..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.categoryListContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.idCategory}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="grey" />
      ) : (
        <FlatList
          data={meals}
          renderItem={renderItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.mealList}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No meals available.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleBar: {
    backgroundColor: '#8B4513',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mealList: {
    padding: 16,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4 
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mealImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  mealName: {
    fontSize: 18,
    padding: 16,
    color: '#333',
  },
  mealTags: {
    fontSize: 14,
    paddingLeft: 16,
    color: 'lightgrey',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    margin: 16,
  },
  categoryListContainer: {
    height: 60,
  },
  categoryList: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4 
  },
  selectedCategory: {
    backgroundColor: '#8B4513',
    color: 'white'
  },
  categoryName: {
    color: '#333',
  },
  selectedCategoryName: {
    color: '#fff',
  },
});

export default HomeScreen;
