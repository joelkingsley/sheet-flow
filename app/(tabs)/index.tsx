import {
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOutUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filter music files based on search query
  const filteredMusicFiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return musicFiles;
    }
    
    const query = searchQuery.toLowerCase();
    return musicFiles.filter(file => 
      file.title.toLowerCase().includes(query) ||
      file.composer.toLowerCase().includes(query) ||
      file.difficulty.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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

  const renderSheetItem = React.useCallback(({ item }: { item: typeof musicFiles[0] }) => {
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
  }, []);

  const renderHeader = React.useCallback(() => (
    <VStack space="lg" style={styles.headerContainer}>
      <Box style={styles.titleContainer}>
        <HStack space="md" alignItems="center">
          <Image
            source={require('../../assets/images/adaptive-icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
          <VStack space="xs" flex={1}>
            <Heading size="2xl" style={{ fontStyle: 'italic' }}>SheetFlow</Heading>
            <Text 
              size="md" 
              style={styles.subtitle}
              color="$textLight600" 
              $dark-color="$textDark400"
            >
              Your personal sheet music reader
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  ), []);

  const renderScrollableHeader = React.useCallback(() => (
    <VStack space="lg">
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

      {/* Search Bar */}
      <Box style={styles.searchContainer}>
        <Input>
          <InputField
            placeholder="Search by title, composer, or difficulty..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            blurOnSubmit={false}
          />
        </Input>
      </Box>
      
      <Box style={styles.listContainer}>
        <Heading size="lg" style={styles.sectionTitle}>
          Available Sheet Music
        </Heading>
      </Box>
    </VStack>
  ), [user, handleSignOut, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <Box style={styles.innerContainer}>
        <VStack flex={1}>
          {/* Fixed Header - Only App Title */}
          {renderHeader()}
          
          {/* Scrollable Content - Everything from Welcome onwards */}
          <FlatList
            data={filteredMusicFiles}
            renderItem={renderSheetItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderScrollableHeader}
            style={styles.flatList}
            contentContainerStyle={styles.musicListContainer}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
          />
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
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  userSection: {
    marginHorizontal: 20,
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
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  musicListContainer: {
    padding: 16,
    paddingTop: 8,
  },
  flatList: {
    flex: 1,
    marginBottom: 50,
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