// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Favourites')}>
        <Icon name="heart" size={20} color="red" />
        <Text style={styles.linkText}>My Favourites</Text>
      </TouchableOpacity>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 18,
    color: 'blue',
  },
});

export default ProfileScreen;
