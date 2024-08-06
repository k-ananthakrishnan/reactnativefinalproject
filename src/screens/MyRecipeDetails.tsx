import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Linking, TouchableOpacity } from 'react-native';
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

  const renderItem = ({ item }: { item: string }) => (
    <Text style={styles.listItem}>• {item}</Text>
  );

  return (
    <FlatList
      data={[
        { key: recipe.recipeName},
        { key: 'Image', value: recipe.images[0] || '' },
        { key: 'Ingredients', value: recipe.ingredients.join(', ') },
        { key: 'Instructions', value: recipe.instructions.join('\n') },
        { key: 'Video', value: youtubeEmbedUrl }
      ]}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => {
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
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.key}</Text>
            <Text style={styles.text}>{item.value}</Text>
          </View>
        );
      }}
      ListEmptyComponent={<Text style={styles.notFound}>Recipe details not available.</Text>}
    />
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  text: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  video: {
    height: 200,
    marginVertical: 16,
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
});

export default MyRecipeDetails;
