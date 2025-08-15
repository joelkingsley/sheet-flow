import { router } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
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
  ];

  const handleSelectFile = (fileId: string) => {
    // Navigate to the sheet tab with the file ID parameter
    router.push(`/sheet?fileId=${fileId}`);
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

  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sheet Music Library</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.listContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Available Sheet Music
        </ThemedText>
        <FlatList
          data={musicFiles}
          renderItem={renderSheetItem}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          scrollEnabled={false}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
    marginStart: 10,
  },
  listContainer: {
    marginBottom: 20,
    marginStart: 10,
    marginEnd: 10,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  flatList: {
    maxHeight: 300,
  },
  sheetItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
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