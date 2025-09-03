import {
  Badge,
  BadgeText,
  Box,
  Heading,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_SCROLL_DISTANCE = 120;
  
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

  const handleProfilePress = () => {
    // Navigate to the library tab
    router.push('/(tabs)/library');
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
    <VStack space="lg" style={styles.scrollableHeaderContainer}>
      <Box style={styles.titleContainer}>
        <HStack space="md" alignItems="center" justifyContent="space-between">
          <Heading size="2xl" style={styles.homeTitle}>Home</Heading>
          
          {/* Profile Icon */}
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <Image
              source={
                user?.photoURL 
                  ? { uri: user.photoURL }
                  : require('../../assets/images/adaptive-icon.png')
              }
              style={styles.profileIcon}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </HStack>
      </Box>
    </VStack>
  ), [handleProfilePress, user]);

  const renderScrollableHeader = React.useCallback(() => (
    <VStack space="lg">
      {/* Title and Profile Icon - Now scrollable */}
      {renderHeader()}
      
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
  ), [searchQuery, renderHeader]);

  // Calculate the opacity for the sticky header
  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stickyHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [-50, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Box style={styles.innerContainer}>
        <VStack flex={1}>
          {/* Scrollable Content */}
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
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
          
          {/* Sticky Header - Appears when scrolling */}
          <Animated.View 
            style={[
              styles.stickyHeader,
              {
                opacity: stickyHeaderOpacity,
                transform: [{ translateY: stickyHeaderTranslateY }],
              }
            ]}
          >
            <Box style={styles.stickyHeaderContent}>
              <Heading size="lg" style={styles.stickyTitle}>Home</Heading>
            </Box>
          </Animated.View>
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
  scrollableHeaderContainer: {
    paddingTop: 60,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  titleContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  homeTitle: {
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 2,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  stickyHeader: {
    position: 'absolute',
    top: -44, // Position above the visible area to cover status bar
    left: 0,
    right: 0,
    paddingTop: 44 + 44, // Status bar height + additional padding for content
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  stickyHeaderContent: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stickyTitle: {
    fontWeight: 'bold',
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