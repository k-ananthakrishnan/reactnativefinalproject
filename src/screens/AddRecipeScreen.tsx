import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../services/firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const tagsList = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'];

const AddRecipeScreen = () => {
  const navigation = useNavigation();
  const [recipeName, setRecipeName] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };
  

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `images/${Date.now()}.jpg`);
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
            },
            (error) => {
              console.error('Upload error:', error.message || error);
              Alert.alert('Upload Error', `Upload failed: ${error.message || error}`);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImages([...images, downloadURL]);
              } catch (error) {
                console.error('Error getting download URL:', error.message || error);
                Alert.alert('Download URL Error', `Failed to get download URL: ${error.message || error}`);
              }
            }
          );
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleTagPress = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleSave = async () => {
    const userId = auth.currentUser?.uid;
    const userRecipesCollection = collection(db, 'UserRecipes');

    try {
      const docRef = await addDoc(userRecipesCollection, {
        recipeName,
        youtubeLink,
        ingredients,
        instructions,
        images,
        tags: selectedTags,
        userId,
      });

      Alert.alert('Recipe saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error saving recipe:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TextInput
        style={styles.input}
        placeholder="YouTube Link"
        value={youtubeLink}
        onChangeText={setYoutubeLink}
      />

      <Text style={styles.label}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Ingredient ${index + 1}`}
          value={ingredient}
          onChangeText={(text) => {
            const newIngredients = [...ingredients];
            newIngredients[index] = text;
            setIngredients(newIngredients);
          }}
        />
      ))}
      <Button title="Add Ingredient" onPress={handleAddIngredient} />

      <Text style={styles.label}>Instructions</Text>
      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Instruction ${index + 1}`}
          value={instruction}
          onChangeText={(text) => {
            const newInstructions = [...instructions];
            newInstructions[index] = text;
            setInstructions(newInstructions);
          }}
        />
      ))}
      <Button title="Add Instruction" onPress={handleAddInstruction} />

      <Text style={styles.label}>Tags</Text>
      <View style={styles.tagsContainer}>
        {tagsList.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              selectedTags.includes(tag) ? styles.selectedTag : null,
            ]}
            onPress={() => handleTagPress(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag) ? styles.selectedTagText : null,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Images</Text>
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      <Button title="Save Recipe" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5',
      marginBottom: 50, 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 12,
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    tag: {
      backgroundColor: '#e0e0e0',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      margin: 4,
    },
    selectedTag: {
      backgroundColor: '#8B4513',
    },
    tagText: {
      fontSize: 16,
      color: '#333',
    },
    selectedTagText: {
      color: '#fff',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
      margin: 4,
    },
    imageButton: {
      backgroundColor: '#8B4513',
      borderRadius: 8,
      padding: 12,
      margin: 4,
    },
    imageButtonText: {
      fontSize: 16,
      color: '#fff',
    },
    saveButton: {
      marginBottom: 20,
    },
  });
  
export default AddRecipeScreen;
