import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const userId = auth.currentUser?.uid;

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
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.info}>{userData?.firstName}</Text>
        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.info}>{userData?.lastName}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{userData?.email}</Text>
        <Text style={styles.label}>Sex:</Text>
        <Text style={styles.info}>{userData?.sex}</Text>
      </View>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Favourites')}>
        <Icon name="heart" size={20} color="red" />
        <Text style={styles.linkText}>My Favourites</Text>
      </TouchableOpacity>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#4a90e2', 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
  },
  info: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#4a90e2', 
  },
});

export default ProfileScreen;
