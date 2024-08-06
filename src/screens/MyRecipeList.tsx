import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';

interface Recipe {
  id: string;
  recipeName: string;
  images: string[];
}

const MyRecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MyRecipeList'>>();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true); 
      try {
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
          console.error("No user is logged in.");
          setRecipes([]);
          return;
        }
    
        const userId = currentUser.uid;
    
        const q = query(collection(db, 'UserRecipes'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const recipesData: Recipe[] = [];
        querySnapshot.forEach((doc) => {
          recipesData.push({ id: doc.id, ...doc.data() } as Recipe);
        });
    
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchRecipes();
  }, []);

  const handlePress = (recipe: Recipe) => {
    navigation.navigate('MyRecipeDetails', { recipeId: recipe.id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Recipe List</Text>
      {recipes.length === 0 ? (
        <Text style={styles.noRecipes}>No recipes found.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.recipeCard}>
              {item.images.length > 0 && (
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.image}
                />
              )}
              <Text style={styles.recipeName}>{item.recipeName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  noRecipes: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 8,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
});

export default MyRecipeList;
