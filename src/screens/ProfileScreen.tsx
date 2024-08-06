import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Animated, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = doc(db, 'users', userId);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }
      } else {
        console.log('No user ID available.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, fadeAnim]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            signOut(auth)
              .then(() => {
                navigation.navigate('Login');
              })
              .catch((error) => {
                console.error('Logout error:', error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="sign-out" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#8B4513',
      },
      headerTintColor: '#ffffff',
      title: 'Profile',
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const userSex = userData?.sex?.trim().toLowerCase();
  const isMale = userSex === 'male';

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.profileHeader}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              isMale
                ? require('../../assets/male-placeholder.jpeg')
                : require('../../assets/female-placeholder.png')
            }
            style={styles.profilePicture}
          />
        </View>
        <Text style={styles.username}>{userData?.username}</Text>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.info}>{userData?.firstName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.info}>{userData?.lastName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{userData?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Sex:</Text>
          <Text style={styles.info}>{userData?.sex}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Favourites')}>
        <Icon name="heart" size={20} color="red" />
        <Text style={styles.linkText}>My Favourites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('MyRecipeList')}>
        <Icon name="book" size={20} color="blue" />
        <Text style={styles.linkText}>My Recipes</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#8B4513',
    marginBottom: 10,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileInfo: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
  },
  info: {
    fontSize: 16,
    color: '#333333',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#8B4513',
  },
  logoutButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
  },
});

export default ProfileScreen;
