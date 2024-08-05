// import axios from 'axios';

// const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

// export const getMealsByCategory = async (category: string) => {
//   try {
//     const response = await axios.get(`${API_URL}filter.php?c=${category}`);
//     return response.data.meals;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// export const getRandomMeals = async () => {
//     try {
//       const response = await axios.get(`${API_URL}search.php?s=`);
//       return response.data.meals
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

// export const getMealDetails = async (mealId: string) => {
//     try {
//       const response = await axios.get(`${API_URL}lookup.php?i=${mealId}`);
//       const meal = response.data.meals[0];
  
//       const ingredients = [];
//       for (let i = 1; i <= 20; i++) {
//         const ingredient = meal[`strIngredient${i}`];
//         if (ingredient) {
//           ingredients.push({
//             strIngredient: ingredient,
//             strIngredientThumb: `https://www.themealdb.com/images/ingredients/${ingredient.toLowerCase()}-small.png`,
//           });
//         }
//       }
  
//       return {
//         ...meal,
//         ingredients,
//         strTags: meal.strTags ? meal.strTags.split(',') : [],
//         strYoutube: meal.strYoutube,
//       };
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

// export const getCategories = async () => {
//     try {
//       const response = await axios.get(`${API_URL}categories.php`);
//       return response.data.categories;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };
  
//   export const searchMeals = async (search: string) => {
//     try {
//       const response = await axios.get(`${API_URL}search.php?s=${search}`);
//       return response.data.meals;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };


import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const getMealsByCategory = async (category: string) => {
  try {
    const response = await axios.get(`${API_URL}filter.php?c=${category}`);
    return response.data.meals;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRandomMeals = async () => {
  try {
    const response = await axios.get(`${API_URL}search.php?s=`);
    return response.data.meals;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMealDetails = async (mealId: string) => {
  try {
    const response = await axios.get(`${API_URL}lookup.php?i=${mealId}`);
    const meal = response.data.meals[0];

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient) {
        ingredients.push({
          strIngredient: ingredient,
          strIngredientThumb: `https://www.themealdb.com/images/ingredients/${ingredient.toLowerCase()}-small.png`,
        });
      }
    }

    return {
      ...meal,
      ingredients,
      strTags: meal.strTags ? meal.strTags.split(',') : [],
      strYoutube: meal.strYoutube,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}categories.php`);
    return response.data.categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchMeals = async (search: string) => {
  try {
    const response = await axios.get(`${API_URL}search.php?s=${search}`);
    return response.data.meals;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
