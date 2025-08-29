import { auth } from '@/config/firebase';
import {
    Box,
    Button,
    ButtonText,
    Center,
    Heading,
    Input,
    InputField,
    Pressable,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
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
        Alert.alert('Success', 'Account created successfully!');
      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Welcome back to Sheet Flow!');
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
      Alert.alert('Success', 'Signed in as guest!');
    } catch (error: any) {
      console.error('Anonymous auth error:', error);
      Alert.alert('Error', 'Failed to sign in as guest. Please try again.');
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
});
