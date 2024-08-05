// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { RouteProp } from '@react-navigation/native';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { getMealDetails } from '../services/mealService';
// import { auth, db } from '../services/firebaseConfig';
// import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

// type RootStackParamList = {
//   MealDetail: { mealId: string };
// };

// type MealDetailScreenRouteProp = RouteProp<RootStackParamList, 'MealDetail'>;

// type Props = {
//   route: MealDetailScreenRouteProp;
// };

// type Ingredient = {
//   strIngredient: string;
//   strIngredientThumb: string;
// };

// const MealDetailScreen: React.FC<Props> = ({ route }) => {
//   const { mealId } = route.params;
//   const [meal, setMeal] = useState<any>(null);
//   const [isFavorite, setIsFavorite] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchMealDetails = async () => {
//       const mealData = await getMealDetails(mealId);
//       setMeal(mealData);

//       // Check if the meal is already favorited
//       const favoriteDoc = doc(db, 'favorites', auth.currentUser?.uid || 'guest');
//       const docSnapshot = await getDoc(favoriteDoc);
//       const favorites = docSnapshot.data()?.meals || [];
//       setIsFavorite(favorites.includes(mealId));
//     };

//     fetchMealDetails();
//   }, [mealId]);

//   const handleFavorite = async () => {
//     try {
//       const favoriteDoc = doc(db, 'favorites', auth.currentUser?.uid || 'guest');
//       const docSnapshot = await getDoc(favoriteDoc);
//       const favorites = docSnapshot.data()?.meals || [];

//       if (isFavorite) {
//         const updatedFavorites = favorites.filter((id: string) => id !== mealId);
//         await setDoc(favoriteDoc, { meals: updatedFavorites });
//         setIsFavorite(false);
//       } else {
//         const updatedFavorites = [...favorites, mealId];
//         await setDoc(favoriteDoc, { meals: updatedFavorites });
//         setIsFavorite(true);
//       }
//     } catch (error) {
//       console.error('Error updating favorite:', error);
//     }
//   };

//   const renderIngredient = ({ item }: { item: Ingredient }) => (
//     <View style={styles.ingredientItem}>
//       <Image source={{ uri: item.strIngredientThumb }} style={styles.ingredientImage} />
//       <Text style={styles.ingredientName}>{item.strIngredient}</Text>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       {meal && (
//         <>
//           <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
//           <View style={styles.header}>
//             <Text style={styles.dishName}>{meal.strMeal}</Text>
//             <TouchableOpacity onPress={handleFavorite}>
//               <FontAwesome
//                 name={isFavorite ? 'heart' : 'heart-o'}
//                 size={30}
//                 color={isFavorite ? 'red' : '#ccc'}
//               />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Ingredients</Text>
//             <FlatList
//               data={meal.ingredients}
//               renderItem={renderIngredient}
//               keyExtractor={(item, index) => `${item.strIngredient}-${index}`}
//               horizontal
//               contentContainerStyle={styles.ingredientList}
//             />
//           </View>
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Instructions</Text>
//             {meal.strInstructions.split('.').map((step, index) => (
//               <Text key={index} style={styles.step}>
//                 {index + 1}. {step.trim()}
//               </Text>
//             ))}
//           </View>
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   image: {
//     width: '100%',
//     height: 250,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   dishName: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   section: {
//     margin: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   ingredientList: {
//     paddingVertical: 8,
//   },
//   ingredientItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   ingredientImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 8,
//   },
//   ingredientName: {
//     fontSize: 16,
//     color: '#333',
//   },
//   instructions: {
//     fontSize: 16,
//     color: '#333',
//   },
//   step: {
//     fontSize: 16,
//     color: '#333',
//     marginVertical: 4,
//   },
// });

// export default MealDetailScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getMealDetails } from '../services/mealService';
import { auth, db } from '../services/firebaseConfig';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { WebView } from 'react-native-webview';

type RootStackParamList = {
  MealDetail: { mealId: string };
};

type MealDetailScreenRouteProp = RouteProp<RootStackParamList, 'MealDetail'>;

type Props = {
  route: MealDetailScreenRouteProp;
};

type Ingredient = {
  strIngredient: string;
  strIngredientThumb: string;
};

const MealDetailScreen: React.FC<Props> = ({ route }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchMealDetails = async () => {
      const mealData = await getMealDetails(mealId);
      setMeal(mealData);

      const favoriteDoc = doc(db, 'favorites', auth.currentUser?.uid || 'guest');
      const docSnapshot = await getDoc(favoriteDoc);
      const favorites = docSnapshot.data()?.meals || [];
      setIsFavorite(favorites.includes(mealId));
    };

    fetchMealDetails();
  }, [mealId]);

  const handleFavorite = async () => {
    try {
      const favoriteDoc = doc(db, 'favorites', auth.currentUser?.uid || 'guest');
      const docSnapshot = await getDoc(favoriteDoc);
      const favorites = docSnapshot.data()?.meals || [];

      if (isFavorite) {
        const updatedFavorites = favorites.filter((id: string) => id !== mealId);
        await setDoc(favoriteDoc, { meals: updatedFavorites });
        setIsFavorite(false);
      } else {
        const updatedFavorites = [...favorites, mealId];
        await setDoc(favoriteDoc, { meals: updatedFavorites });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const renderIngredient = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientItem}>
      <Image source={{ uri: item.strIngredientThumb }} style={styles.ingredientImage} />
      <Text style={styles.ingredientName}>{item.strIngredient}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {meal && (
        <>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <View style={styles.header}>
            <Text style={styles.dishName}>{meal.strMeal}</Text>
            <TouchableOpacity onPress={handleFavorite}>
              <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={30}
                color={isFavorite ? 'red' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
          {meal.strTags && meal.strTags.length > 0 && (
            <Text style={styles.tags}>{`Tags: ${meal.strTags.join(', ')}`}</Text>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <FlatList
              data={meal.ingredients}
              renderItem={renderIngredient}
              keyExtractor={(item, index) => `${item.strIngredient}-${index}`}
              horizontal
              contentContainerStyle={styles.ingredientList}
            />
          </View>
          {meal.strYoutube && (
            <WebView
              style={styles.video}
              javaScriptEnabled={true}
              source={{ uri: `https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}` }}
            />
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {meal.strInstructions.split('.').map((step, index) => (
              <Text key={index} style={styles.step}>
                {index + 1}. {step.trim()}
              </Text>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dishName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  tags: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredientList: {
    paddingVertical: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ingredientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
  },
  step: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  video: {
    height: 200,
    margin: 16,
  },
});

export default MealDetailScreen;
