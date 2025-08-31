import {
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Pressable,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOutUser } = useAuth();
  
  // Helper function to get difficulty badge styling
  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return { action: 'success' as const, text: 'Easy' };
      case 'medium':
        return { action: 'warning' as const, text: 'Medium' };
      case 'hard':
        return { action: 'error' as const, text: 'Hard' };
      default:
        return { action: 'muted' as const, text: 'Unknown' };
    }
  };
  
  // List of available MusicXML files in assets/sheets
  const musicFiles = [
    {
      id: 'MuzioClementi_SonatinaOpus36No1_Part2.xml',
      title: 'Sonatina Op.36 No.1 - Andante',
      composer: 'Muzio Clementi',
      difficulty: 'easy' as const,
      path: require('../../assets/sheets/MuzioClementi_SonatinaOpus36No1_Part2.xml'),
    },
    {
      id: 'Beethoven_AnDieFerneGeliebte.xml',
      title: 'An die ferne Geliebte - Op. 98',
      composer: 'Ludwig van Beethoven',
      difficulty: 'hard' as const,
      path: require('../../assets/sheets/Beethoven_AnDieFerneGeliebte.xml'),
    },
    {
      id: 'Mendelssohn.xml',
      title: 'Mendelssohn - Op. 98',
      composer: 'Felix Mendelssohn',
      difficulty: 'medium' as const,
      path: require('../../assets/sheets/Mendelssohn.xml'),
    },
    {
      id: 'Original_Silent_Night.xml',
      title: 'Original Silent Night',
      composer: 'Traditional',
      difficulty: 'easy' as const,
      path: require('../../assets/sheets/Original_Silent_Night.xml'),
    },
    {
      id: 'ToGodBeTheGlory.xml',
      title: 'To God Be The Glory',
      composer: 'Traditional',
      difficulty: 'easy' as const,
      path: require('../../assets/sheets/ToGodBeTheGlory.xml'),
    }
  ];

  const handleSelectFile = (fileId: string) => {
    // Navigate to the sheet tab with the file ID parameter
    router.push(`/sheet?fileId=${fileId}`);
  };

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

  const renderSheetItem = ({ item }: { item: typeof musicFiles[0] }) => {
    const difficultyBadge = getDifficultyBadge(item.difficulty);
    
    return (
      <Pressable
        onPress={() => handleSelectFile(item.id)}
        style={styles.pressableItem}
      >
        <Box style={styles.sheetItem}>
          <HStack justifyContent="space-between" alignItems="flex-start" space="md">
            <VStack space="xs" flex={1}>
              <Text size="lg" bold style={styles.sheetTitle}>
                {item.title}
              </Text>
              <Text size="sm" style={styles.sheetComposer}>
                by {item.composer}
              </Text>
            </VStack>
            <Badge action={difficultyBadge.action} size="sm">
              <BadgeText>{difficultyBadge.text}</BadgeText>
            </Badge>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  const renderHeader = () => (
    <VStack space="lg" style={styles.headerContainer}>
      <Box style={styles.titleContainer}>
        <Heading size="2xl">Sheet Flow</Heading>
      </Box>
      
      {/* User Authentication Section */}
      <Box style={styles.userSection}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text size="md" style={styles.welcomeText}>
            {user 
              ? `Welcome back, ${user.isAnonymous ? 'Guest' : user.email}!`
              : 'Welcome to Sheet Flow'
            }
          </Text>
          {user ? (
            <Button size="sm" action="negative" onPress={handleSignOut}>
              <ButtonText>Sign Out</ButtonText>
            </Button>
          ) : (
            <Button size="sm" action="primary" onPress={handleSignIn}>
              <ButtonText>Sign In</ButtonText>
            </Button>
          )}
        </HStack>
      </Box>
      
      <Box style={styles.listContainer}>
        <Heading size="lg" style={styles.sectionTitle}>
          Available Sheet Music
        </Heading>
      </Box>
    </VStack>
  );

  return (
    <Box style={styles.container}>
      <FlatList
        data={musicFiles}
        renderItem={renderSheetItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  userSection: {
    marginHorizontal: 4,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  welcomeText: {
    flex: 1,
    marginRight: 12,
  },
  listContainer: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  flatList: {
    flex: 1,
  },
  pressableItem: {
    marginBottom: 8,
    marginHorizontal: 4,
  },
  sheetItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sheetTitle: {
    marginBottom: 4,
  },
  sheetComposer: {
    opacity: 0.7,
  },
});