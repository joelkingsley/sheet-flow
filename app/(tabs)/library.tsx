import {
    Box,
    Button,
    ButtonText,
    Heading,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, SafeAreaView, StyleSheet } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function LibraryScreen() {
  const { user, signOutUser } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out', 
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOutUser();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const getDisplayName = () => {
    if (!user) return 'Guest';
    if (user.isAnonymous) return 'Guest';
    return user.displayName || user.email || 'User';
  };

  const getProfileImage = () => {
    if (user?.photoURL) {
      return { uri: user.photoURL };
    }
    return require('../../assets/images/adaptive-icon.png');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Box style={styles.innerContainer}>
        <VStack flex={1} space="lg" style={styles.content}>
          {/* Header */}
          <Box style={styles.header}>
            <Heading size="2xl" style={styles.title}>Library</Heading>
          </Box>

          {/* Profile Section */}
          <Box style={styles.profileSection}>
            <VStack space="lg" alignItems="center">
              {/* Profile Image */}
              <Image
                source={getProfileImage()}
                style={styles.profileImage}
                resizeMode="cover"
              />
              
              {/* User Info */}
              <VStack space="sm" alignItems="center">
                <Heading size="lg" style={styles.userName}>
                  {getDisplayName()}
                </Heading>
                {user && !user.isAnonymous && (
                  <Text size="md" style={styles.userEmail}>
                    {user.email}
                  </Text>
                )}
                <Text size="sm" style={styles.userStatus}>
                  {user 
                    ? (user.isAnonymous ? 'Signed in as Guest' : 'Signed in') 
                    : 'Not signed in'
                  }
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <Box style={styles.actionsSection}>
            <VStack space="md">
              {user ? (
                <Button action="negative" onPress={handleSignOut}>
                  <ButtonText>Sign Out</ButtonText>
                </Button>
              ) : (
                <Button action="primary" onPress={handleSignIn}>
                  <ButtonText>Sign In</ButtonText>
                </Button>
              )}
            </VStack>
          </Box>

          {/* Spacer to push content up */}
          <Box flex={1} />
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  userName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userEmail: {
    textAlign: 'center',
    opacity: 0.8,
  },
  userStatus: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  actionsSection: {
    marginTop: 20,
  },
});
