import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import SheetMusicDisplay from '@/components/SheetMusicDisplay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SheetsScreen() {
  const [selectedFile, setSelectedFile] = useState('MuzioClementi_SonatinaOpus36No1_Part2.xml');
  const [showDropdown, setShowDropdown] = useState(false);

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

  // State to hold loaded XML content
  const [musicXML, setMusicXML] = useState<string>('');

  // Load XML when selectedFile changes
  React.useEffect(() => {
    const loadXML = async () => {
      const selected = musicFiles.find(file => file.id === selectedFile);
      if (!selected) {
        setMusicXML('');
        return;
      }
      if (Platform.OS === 'web') {
        const response = await fetch(`/assets/sheets/${selected.id}`);
        const text = await response.text();
        setMusicXML(text);
      } else {
        // For native, you may need to use expo-file-system or asset loader
        // Here, we just set the asset reference (SheetMusicDisplay should handle it)
        setMusicXML(selected.path);
      }
    };
    loadXML();
  }, [selectedFile]);

  const showPicker = () => {
    if (Platform.OS === 'web') {
      setShowDropdown(!showDropdown);
    } else {
      // For mobile platforms, we can use a simple selection
      const currentIndex = musicFiles.findIndex(file => file.id === selectedFile);
      const nextIndex = (currentIndex + 1) % musicFiles.length;
      setSelectedFile(musicFiles[nextIndex].id);
    }
  };

  const selectFile = (fileId: string) => {
    setSelectedFile(fileId);
    setShowDropdown(false);
  };

  const getSelectedLabel = () => {
    const selected = musicFiles.find(file => file.id === selectedFile);
    return selected ? `${selected.title} - ${selected.composer}` : selectedFile;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">OpenSheetMusicDisplay in React Native</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Select Sheet Music</ThemedText>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity style={styles.pickerContainer} onPress={showPicker}>
            <ThemedText style={styles.pickerText}>
              {getSelectedLabel()}
            </ThemedText>
            <ThemedText style={styles.dropdownArrow}>
              {Platform.OS === 'web' ? (showDropdown ? '▲' : '▼') : '⟲'}
            </ThemedText>
          </TouchableOpacity>
          
          {Platform.OS === 'web' && showDropdown && (
            <View style={styles.dropdownMenu}>
              {musicFiles.map((file, index) => (
                <TouchableOpacity
                  key={file.id}
                  style={[
                    styles.dropdownItem,
                    selectedFile === file.id && styles.selectedItem
                  ]}
                  onPress={() => selectFile(file.id)}
                >
                  <ThemedText style={styles.dropdownItemText}>
                    {file.title} - {file.composer}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {Platform.OS !== 'web' && (
          <ThemedText style={styles.helpText}>
            Tap to cycle through available pieces
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sheet Music Display</ThemedText>
        <ThemedText>Selected: {getSelectedLabel()}</ThemedText>
        {/* Sheet music display */}
        <SheetMusicDisplay 
          musicXML={musicXML} 
          style={styles.sheetMusicContainer}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 24,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 5,
  },
  sheetMusicContainer: {
    // This style will be passed to the SheetMusicDisplay component
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
