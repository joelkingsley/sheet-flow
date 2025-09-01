import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/config/auth';
import { auth } from '@/config/supabase';
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
import React, { useEffect, useState } from 'react';
import {
    Alert,
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
      let result;
      
      if (isSignUp) {
        // Sign up new user
        result = await auth.signUp(email, password);
        if (result.error) {
          throw result.error;
        }
        
        if (result.data?.user && !result.data.session) {
          Alert.alert(
            'Check your email', 
            'Please check your email for a confirmation link to complete your registration.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Success', 'Account created successfully!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
          ]);
        }
      } else {
        // Sign in existing user
        result = await auth.signInWithPassword(email, password);
        if (result.error) {
          throw result.error;
        }
        
        Alert.alert('Success', 'Welcome back to Sheet Flow!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }
      
      console.log('User:', result.data?.user?.email);
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Authentication failed';
      
      switch (error.message) {
        case 'User not found':
          errorMessage = 'No account found with this email. Would you like to create one?';
          Alert.alert('User Not Found', errorMessage, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: () => setIsSignUp(true) }
          ]);
          setIsLoading(false);
          return;
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 'Invalid email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'User already registered':
          errorMessage = 'This email is already registered. Try signing in instead.';
          setIsSignUp(false);
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

    const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user's ID token from Google
      const result = await GoogleSignin.signIn();
      
      if (!result.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Use the Google ID token to sign in with Supabase
      const { data, error } = await auth.signInWithIdToken('google', result.data.idToken);
      
      if (error) {
        throw error;
      }
      
      Alert.alert('Success', 'Signed in with Google!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
      
      console.log('Google user signed in successfully');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === 'sign_in_cancelled') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'play_services_not_available') {
        errorMessage = 'Google Play Services not available';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
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
      
      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Use the Apple identity token to sign in with Supabase
      const { data, error } = await auth.signInWithIdToken(
        'apple', 
        credential.identityToken,
        // Apple provides a nonce for security
        credential.nonce
      );
      
      if (error) {
        throw error;
      }
      
      Alert.alert('Success', 'Signed in with Apple!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
      
      console.log('Apple user signed in successfully');
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      
      let errorMessage = 'Apple sign-in failed';
      
      if (error.code === 'ERR_REQUEST_CANCELED') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
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
                <Box
                  width="$20"
                  height="$20"
                  bg="$primary500"
                  borderRadius="$full"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="$2xl" fontWeight="$bold" color="$white">
                    🎼
                  </Text>
                </Box>
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
});
