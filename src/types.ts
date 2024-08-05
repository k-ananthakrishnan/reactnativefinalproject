export type Meal = {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
  };


  import { StackNavigationProp } from '@react-navigation/stack';

  export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    MealDetail: { mealId: string };
    Profile: undefined;
    Favourites: undefined;
  };
  
  export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  export type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;
  export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  export type MealDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MealDetail'>;
  export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
 