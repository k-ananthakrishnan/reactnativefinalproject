// // src/screens/SignupScreen.tsx
// import React, { useState } from 'react';
// import { View, TextInput, Button } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// // import { firebase } from '../services/firebaseConfig';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// type RootStackParamList = {
//   Login: undefined;
//   Signup: undefined;
//   Home: undefined;
// };

// type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

// type Props = {
//   navigation: SignupScreenNavigationProp;
// };

// const SignupScreen: React.FC<Props> = ({ navigation }) => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');

//   const handleSignup = () => {
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then(() => {
//         navigation.navigate('Login');
//       })
//       .catch(error => {
//         alert(error.message);
//       });
//   };

//   return (
//     <View>
//       <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
//       <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
//       <Button title="Signup" onPress={handleSignup} />
//     </View>
//   );
// };

// export default SignupScreen;

// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});

export default SignupScreen;
