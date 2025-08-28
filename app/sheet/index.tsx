import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import SheetMusicDisplay from '@/components/sheetMusicDisplay/SheetMusicDisplay';
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
      path: require('../../assets/sheets/MuzioClementi_SonatinaOpus36No1_Part2.xml'),
    },
    {
      id: 'Beethoven_AnDieFerneGeliebte.xml',
      title: 'An die ferne Geliebte - Op. 98',
      composer: 'Ludwig van Beethoven',
      path: require('../../assets/sheets/Beethoven_AnDieFerneGeliebte.xml'),
    },
  ];

  // Get the selected file from params or default to first file
  const selectedFileId = params.fileId as string || musicFiles[0].id;
  const selectedFile = musicFiles.find(file => file.id === selectedFileId) || musicFiles[0];

  // Debug: Log what the require path resolves to
  console.log('Selected file path resolves to:', selectedFile.path);

  // Load XML when component mounts or selectedFileId changes
  React.useEffect(() => {
    const loadXML = async () => {
      if (!selectedFile) {
        setMusicXML('');
        return;
      }
      if (Platform.OS === 'web') {
        try {
          console.log('Loading XML file for web using require path:', selectedFile.path);
          // For web, use the bundled asset path directly
          const response = await fetch(selectedFile.path);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const text = await response.text();
          console.log('Successfully loaded XML, length:', text.length);
          console.log('XML preview:', text.substring(0, 200));
          setMusicXML(text);
        } catch (error) {
          console.error('Failed to load XML file:', error);
          setMusicXML('');
        }
      } else {
        // For native, pass the asset reference
        console.log('Loading XML file for native:', selectedFile.path);
        setMusicXML(selectedFile.path);
      }
    };
    loadXML();
  }, [selectedFileId]);

  // Debug log
  console.log('Rendering with musicXML:', musicXML ? `${musicXML.length} chars` : 'empty');

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
