import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import SheetMusicDisplay from '@/components/SheetMusicDisplay';
import { ThemedView } from '@/components/ThemedView';

export default function SheetsScreen() {
  const params = useLocalSearchParams();
  const [musicXML, setMusicXML] = useState<string>('');

  // List of available MusicXML files in assets/sheets
  const musicFiles = [
    {
      id: 'MuzioClementi_SonatinaOpus36No1_Part2.xml',
      title: 'Sonatina Op.36 No.1 - Andante',
      composer: 'Muzio Clementi',
      path: require('@/assets/sheets/MuzioClementi_SonatinaOpus36No1_Part2.xml'),
    },
    {
      id: 'Beethoven_AnDieFerneGeliebte.xml',
      title: 'An die ferne Geliebte - Op. 98',
      composer: 'Ludwig van Beethoven',
      path: require('@/assets/sheets/Beethoven_AnDieFerneGeliebte.xml'),
    },
  ];

  // Get the selected file from params or default to first file
  const selectedFileId = params.fileId as string || musicFiles[0].id;
  const selectedFile = musicFiles.find(file => file.id === selectedFileId) || musicFiles[0];

  // Load XML when component mounts or selectedFileId changes
  React.useEffect(() => {
    const loadXML = async () => {
      if (!selectedFile) {
        setMusicXML('');
        return;
      }
      if (Platform.OS === 'web') {
        const response = await fetch(`/assets/sheets/${selectedFile.id}`);
        const text = await response.text();
        setMusicXML(text);
      } else {
        // For native, pass the asset reference
        setMusicXML(selectedFile.path);
      }
    };
    loadXML();
  }, [selectedFileId]);

  return (
    <ThemedView style={styles.sheetContainer}>
      <SheetMusicDisplay 
        musicXML={musicXML} 
        style={styles.sheetMusicContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  composer: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  sheetContainer: {
    flex: 1,
    // marginTop: 20,
  },
  sheetMusicContainer: {
    height: '100%',
    minHeight: 400,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 8,
  },
});
