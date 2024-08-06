import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { WebView } from 'react-native-webview';

type MyRecipeDetailsRouteProp = RouteProp<RootStackParamList, 'MyRecipeDetails'>;

const MyRecipeDetails: React.FC = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRoute<MyRecipeDetailsRouteProp>();
  const { recipeId } = route.params;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'UserRecipes', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching recipe: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!recipe) {
    return <Text style={styles.notFound}>Recipe not found.</Text>;
  }

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^\s&]+)/) ||
                   url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^\s&]+)/);
    return match ? match[1] : null;
  };

  const youtubeVideoId = getYouTubeVideoId(recipe.youtubeLink);
  const youtubeEmbedUrl = youtubeVideoId ? `https://www.youtube.com/embed/${youtubeVideoId}` : '';

  const renderItem = ({ item }: { item: any }) => {
    if (item.key === 'Image') {
      return item.value ? (
        <Image source={{ uri: item.value }} style={styles.image} />
      ) : null;
    }
    if (item.key === 'Video') {
      return youtubeEmbedUrl ? (
        <WebView
          style={styles.video}
          javaScriptEnabled={true}
          source={{ uri: youtubeEmbedUrl }}
        />
      ) : (
        <Text style={styles.text}>No video available.</Text>
      );
    }
    if (item.key === 'Recipe Name') {
      return (
        <View style={styles.recipeNameContainer}>
          <Text style={styles.recipeName}>{item.value}</Text>
        </View>
      );
    }
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.key}</Text>
        <Text style={styles.text}>{item.value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: 'Recipe Name', value: recipe.recipeName },
          { key: 'Image', value: recipe.images[0] || '' },
          { key: 'Ingredients', value: recipe.ingredients.join(', ') },
          { key: 'Instructions', value: recipe.instructions.join('\n') },
          { key: 'Video', value: youtubeEmbedUrl }
        ]}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={<Text style={styles.notFound}>Recipe details not available.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: 'gray',
    margin: 16,
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  video: {
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  listContentContainer: {
    paddingBottom: 16,
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  recipeNameContainer: {
    marginBottom: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', 
    textAlign: 'center', 
  },
});

export default MyRecipeDetails;
