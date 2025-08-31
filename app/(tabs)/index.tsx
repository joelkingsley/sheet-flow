import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from '@gluestack-ui/themed';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOutUser } = useAuth();
  
  // List of available MusicXML files in assets/sheets
  const musicFiles = [
    {
      id: 'MuzioClementi_SonatinaOpus36No1_Part2.xml',
      title: 'Sonatina Op.36 No.1 - Andante',
      composer: 'Muzio Clementi',
      path: require('../../assets/sheets/MuzioClementi_SonatinaOpus36No1_Part2.xml'),
    },
    {
      id: 'Beethoven_AnDieFerneGeliebte.xml',
      title: 'An die ferne Geliebte - Op. 98',
      composer: 'Ludwig van Beethoven',
      path: require('../../assets/sheets/Beethoven_AnDieFerneGeliebte.xml'),
    },
    {
      id: 'Mendelssohn.xml',
      title: 'Mendelssohn - Op. 98',
      composer: 'Felix Mendelssohn',
      path: require('../../assets/sheets/Mendelssohn.xml'),
    },
    {
      id: 'Original_Silent_Night.xml',
      title: 'Original Silent Night',
      composer: 'Traditional',
      path: require('../../assets/sheets/Original_Silent_Night.xml'),
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

  const renderSheetItem = ({ item }: { item: typeof musicFiles[0] }) => (
    <TouchableOpacity
      style={styles.sheetItem}
      onPress={() => handleSelectFile(item.id)}
    >
      <ThemedView style={styles.sheetItemContent}>
        <ThemedText type="subtitle" style={styles.sheetTitle}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.sheetComposer}>
          by {item.composer}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sheet Flow</ThemedText>
      </ThemedView>
      
      {/* User Authentication Section */}
      <ThemedView style={styles.userSection}>
        {user ? (
          <ThemedView style={styles.userInfo}>
            <ThemedText style={styles.welcomeText}>
              Welcome back, {user.isAnonymous ? 'Guest' : user.email}!
            </ThemedText>
            <Button size="sm" action="negative" onPress={handleSignOut}>
              <ButtonText>Sign Out</ButtonText>
            </Button>
          </ThemedView>
        ) : (
          <ThemedView style={styles.userInfo}>
            <ThemedText style={styles.welcomeText}>Welcome to Sheet Flow</ThemedText>
            <Button size="sm" action="primary" onPress={handleSignIn}>
              <ButtonText>Sign In</ButtonText>
            </Button>
          </ThemedView>
        )}
      </ThemedView>
      
      <ThemedView style={styles.listContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Available Sheet Music
        </ThemedText>
      </ThemedView>
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={musicFiles}
        renderItem={renderSheetItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
    marginStart: 10,
  },
  userSection: {
    marginHorizontal: 10,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  listContainer: {
    marginBottom: 12,
    marginStart: 10,
    marginEnd: 10,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  flatList: {
    flex: 1,
  },
  sheetItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSheetItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  sheetItemContent: {
    flex: 1,
  },
  sheetTitle: {
    marginBottom: 4,
  },
  sheetComposer: {
    opacity: 0.7,
    fontSize: 14,
  },
  displayContainer: {
    marginTop: 20,
  },
  sheetMusicContainer: {
    marginTop: 12,
  },
});