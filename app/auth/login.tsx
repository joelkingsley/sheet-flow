import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/config/auth';
import { auth } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { AntDesign } from '@expo/vector-icons';
import {
    Box,
    Button,
    ButtonText,
    Center,
    Heading,
    HStack,
    Input,
    InputField,
    Pressable,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInAnonymously, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { user } = useAuth();

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  // Redirect to tabs if user is already authenticated
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      let userCredential;
      
      if (isSignUp) {
        // Sign up new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Welcome back to Sheet Flow!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }
      
      console.log('User:', userCredential.user.email);
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Authentication failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Would you like to create one?';
          Alert.alert('User Not Found', errorMessage, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: () => setIsSignUp(true) }
          ]);
          setIsLoading(false);
          return;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Try signing in instead.';
          setIsSignUp(false);
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setIsLoading(true);
    
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('Anonymous user:', userCredential.user.uid);
      Alert.alert('Success', 'Signed in as guest!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      console.error('Anonymous auth error:', error);
      Alert.alert('Error', 'Failed to sign in as guest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const result = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(result.data?.idToken);
      
      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      Alert.alert('Success', 'Signed in with Google!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
      
      console.log('Google user:', userCredential.user.email);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === 'sign_in_cancelled') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'play_services_not_available') {
        errorMessage = 'Google Play Services not available';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      // Create an Apple credential with the token
      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken || undefined,
        rawNonce: undefined,
      });
      
      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, firebaseCredential);
      
      Alert.alert('Success', 'Signed in with Apple!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
      
      console.log('Apple user:', userCredential.user.email);
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      
      let errorMessage = 'Apple sign-in failed';
      
      if (error.code === 'ERR_REQUEST_CANCELED') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Box flex={1} bg="$backgroundLight0" $dark-bg="$backgroundDark900">
          <Center flex={1} px="$4">
            <VStack space="xl" width="$full" maxWidth="$96">
              
              {/* App Logo/Title */}
              <VStack space="lg" alignItems="center">
                <Image
                  source={require('../../assets/images/adaptive-icon.png')}
                  style={styles.appIcon}
                  resizeMode="contain"
                />
                <Heading size="2xl" textAlign="center" color="$textLight900" $dark-color="$textDark50">
                  Sheet Flow
                </Heading>
                <Text 
                  size="md" 
                  textAlign="center" 
                  color="$textLight600" 
                  $dark-color="$textDark400"
                >
                  Your personal sheet music reader
                </Text>
              </VStack>

              {/* Login Form */}
              <VStack space="lg">
                <VStack space="xs">
                  <Text size="sm" fontWeight="$medium" color="$textLight900" $dark-color="$textDark50">
                    Email
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text size="sm" fontWeight="$medium" color="$textLight900" $dark-color="$textDark50">
                    Password
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} p="$2">
                      <Text color="$textLight400">
                        {showPassword ? '�' : '👁️'}
                      </Text>
                    </Pressable>
                  </Input>
                </VStack>

                <Button
                  onPress={handleEmailAuth}
                  isDisabled={!email || !password || isLoading}
                  bg="$primary600"
                  $active-bg="$primary700"
                >
                  <ButtonText color="$white">
                    {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                  </ButtonText>
                </Button>
                
                {/* Toggle between Sign In and Sign Up */}
                <Pressable 
                  alignItems="center"
                  onPress={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                >
                  <Text size="sm" color="$primary600" $dark-color="$primary400" textDecorationLine="underline">
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </Text>
                </Pressable>
              </VStack>

              {/* Social Authentication */}
              <VStack space="md">
                <VStack space="xs" alignItems="center">
                  <Text size="sm" color="$textLight500" $dark-color="$textDark500">
                    or continue with
                  </Text>
                </VStack>
                
                <VStack space="sm">
                  {/* Google Sign-In Button */}
                  <Button
                    onPress={handleGoogleSignIn}
                    isDisabled={isLoading}
                    bg="$white"
                    borderColor="$borderLight300"
                    borderWidth="$1"
                    $dark-bg="$backgroundDark700"
                    $dark-borderColor="$borderDark700"
                    $active-bg="$backgroundLight100"
                    $dark-active-bg="$backgroundDark600"
                  >
                    <HStack space="sm" alignItems="center">
                      <AntDesign name="google" size={20} color="#4285f4" />
                      <ButtonText color="$textLight900" $dark-color="$textDark50">
                        Continue with Google
                      </ButtonText>
                    </HStack>
                  </Button>

                  {/* Apple Sign-In Button (iOS only) */}
                  {Platform.OS === 'ios' && (
                    <Button
                      onPress={handleAppleSignIn}
                      isDisabled={isLoading}
                      bg="$black"
                      $active-bg="$backgroundDark800"
                    >
                      <HStack space="sm" alignItems="center">
                        <AntDesign name="apple" size={20} color="white" />
                        <ButtonText color="$white">
                          Continue with Apple
                        </ButtonText>
                      </HStack>
                    </Button>
                  )}
                </VStack>
              </VStack>

              {/* Guest Access */}
              <VStack space="md" alignItems="center">
                <Text size="sm" color="$textLight500" $dark-color="$textDark500">
                  or
                </Text>
                <Pressable onPress={handleGuestAccess}>
                  <Text size="sm" color="$textLight600" $dark-color="$textDark400" textDecorationLine="underline">
                    Continue as guest
                  </Text>
                </Pressable>
              </VStack>
            </VStack>
          </Center>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
