import { Box, Button, ButtonText, HStack, Text, VStack } from '@gluestack-ui/themed';
import { type OSMDRef, OSMDView } from '@joelkingsley/react-native-osmd';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface SheetMusicDisplayNativeProps {
  musicXML: string | any;
  style?: any;
}

type PlaybackState = 'play' | 'pause' | 'stop';

const SheetMusicDisplayNative: React.FC<SheetMusicDisplayNativeProps> = ({ musicXML, style }) => {
  const [xmlString, setXmlString] = useState<string>('');
  const osmdRef = useRef<OSMDRef | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [playbackState, setPlaybackState] = useState<PlaybackState | undefined>();
  const playback = useRef<PlaybackState>('stop');
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height ? 'landscape' : 'portrait'
  );
  const [renderKey, setRenderKey] = useState(0);
  const [isRerendering, setIsRerendering] = useState(false);
  const preservedPlaybackState = useRef<PlaybackState>('stop');
  
  // Cursor configuration
  const cursors = [
    { type: 0, color: '#ff0000', alpha: 0.5, follow: true }, // red
    { type: 0, color: '#00ff00', alpha: 0.5, follow: true }, // green
  ];
  const cursor = useRef(cursors[0]);

  // Zoom handler for buttons
  const handleZoom = useCallback((scale: number) => {
    if (osmdRef.current && osmdRef.current.setZoom) {
      try {
        osmdRef.current.setZoom(scale);
        setZoomLevel(scale);
      } catch (error) {
        console.warn('Error setting zoom:', error);
      }
    }
  }, []);

  // Zoom controls
  const zoomIn = () => handleZoom(Math.min(zoomLevel * 1.2, 3));
  const zoomOut = () => handleZoom(Math.max(zoomLevel / 1.2, 0.5));
  const resetZoom = () => handleZoom(1);

  // Playback controls
  const onPlayPause = useCallback(() => {
    if (!osmdRef.current) return;
    
    switch (playback.current) {
      case 'pause':
      case 'stop':
        osmdRef.current.play();
        playback.current = 'play';
        setPlaybackState('play');
        break;
      case 'play':
        osmdRef.current.pause();
        playback.current = 'pause';
        setPlaybackState('pause');
        break;
    }
  }, []);

  const onStop = useCallback(() => {
    if (!osmdRef.current) return;
    
    osmdRef.current.stop();
    playback.current = 'stop';
    setPlaybackState('stop');
  }, []);

  const onToggleCursor = useCallback(() => {
    if (!osmdRef.current) return;
    
    const newCursor = cursors.filter((c) => c.color !== cursor.current?.color);
    if (newCursor[0]?.color !== undefined) {
      osmdRef.current.setCursorColor(newCursor[0].color);
      cursor.current = newCursor[0];
    }
  }, [cursors]);

  // OSMD options
  const options = {
    backend: 'svg',
    drawTitle: true,
    drawingParameters: 'default',
  };

  useEffect(() => {
    let isMounted = true;
    const loadXML = async () => {
      if (typeof musicXML === 'string') {
        setXmlString(musicXML);
      } else if (musicXML) {
        // Use expo-asset to resolve asset URI
        try {
          const asset = Asset.fromModule(musicXML);
          await asset.downloadAsync();
          const fileContent = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
          if (isMounted) setXmlString(fileContent);
        } catch (err) {
          console.error('Error loading MusicXML asset:', err);
          if (isMounted) setXmlString('');
        }
      } else {
        setXmlString('');
      }
    };
    loadXML();
    return () => { isMounted = false; };
  }, [musicXML]);

  // Listen for orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newOrientation = window.width > window.height ? 'landscape' : 'portrait';
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
        
        // Force OSMD to re-render without remounting the WebView
        if (osmdRef.current && xmlString) {
          console.log('Handling orientation change:', newOrientation);
          
          setTimeout(() => {
            // Inject JavaScript to force OSMD to re-render with new dimensions
            const webViewRef = (osmdRef.current as any)?._component?._nativeTag;
            if (osmdRef.current) {
              // Use the existing setZoom method to trigger a re-render
              // This will cause OSMD to recalculate layout without losing playback state
              const currentZoom = zoomLevel;
              osmdRef.current.setZoom(currentZoom * 1.001); // Tiny change to trigger re-render
              setTimeout(() => {
                osmdRef.current?.setZoom(currentZoom); // Restore original zoom
              }, 50);
            }
          }, 100);
        }
      }
    });

    return () => subscription?.remove();
  }, [orientation, xmlString, zoomLevel]);

  const onRender = () => {
    console.log('Sheet music rendered successfully with OSMDView');
    setPlaybackState('stop');
    playback.current = 'stop';
    
    // Set initial zoom to 50%
    osmdRef.current?.setZoom(0.5);
    // Always attempt to set zoom after a delay, as methods may not be immediately available
    setTimeout(() => {
      if (osmdRef.current && osmdRef.current.setZoom) {
        try {
          osmdRef.current.setZoom(0.5);
          setZoomLevel(0.5);
        } catch (error) {
          console.warn('Error setting initial zoom:', error);
        }
      } else {
        console.log('OSMD setZoom method not yet available after timeout');
      }
    }, 100);
  };

  // Debug: log the XML string before rendering
  React.useEffect(() => {
    console.log('SheetMusicDisplayNative xmlString length:', xmlString.length);
  }, [xmlString]);

  // Determine if controls should be in a horizontal layout (landscape)
  const isLandscape = orientation === 'landscape';
  const ControlsContainer = isLandscape ? HStack : VStack;

  return (
    <VStack style={[styles.container, style]} space="md">
      {/* Controls */}
      <Box style={[styles.controlsContainer, isLandscape && styles.controlsContainerLandscape]}>
        <ControlsContainer space={isLandscape ? "xl" : "sm"}>
          {/* Zoom Controls */}
          <HStack space="md" style={styles.zoomControls}>
            <Button size="sm" onPress={zoomOut}>
              <ButtonText>-</ButtonText>
            </Button>
            <Text style={styles.zoomText}>
              {Math.round(zoomLevel * 100)}%
            </Text>
            <Button size="sm" onPress={zoomIn}>
              <ButtonText>+</ButtonText>
            </Button>
            <Button size="sm" variant="outline" onPress={resetZoom}>
              <ButtonText>Reset</ButtonText>
            </Button>
          </HStack>
          
          {/* Playback Controls */}
          {xmlString && (
            <HStack space="md" style={styles.playbackControls}>
              {playbackState === undefined ? (
                <Box style={styles.loadingPlayback}>
                  <ActivityIndicator size="small" />
                  <Text style={styles.loadingText}>Preparing playback...</Text>
                </Box>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    onPress={onPlayPause}
                    bg={playbackState === 'play' ? '$red500' : '$green500'}
                  >
                    <ButtonText>
                      {playbackState === 'play' ? '⏸️ Pause' : '▶️ Play'}
                    </ButtonText>
                  </Button>
                  <Button size="sm" variant="outline" onPress={onStop}>
                    <ButtonText>⏹️ Stop</ButtonText>
                  </Button>
                  <Button size="sm" variant="outline" onPress={onToggleCursor}>
                    <ButtonText>🎯 Cursor</ButtonText>
                  </Button>
                </>
              )}
            </HStack>
          )}
        </ControlsContainer>
      </Box>
      
      {/* Sheet Music Display */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sheetContainer}>
          {xmlString ? (
            <OSMDView
              ref={osmdRef}
              options={options}
              musicXML={xmlString}
              onRender={onRender}
              style={styles.osmdView}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ThemedText style={styles.loadingText}>Loading sheet music...</ThemedText>
            </View>
          )}
        </View>
      </SafeAreaView>
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  controlsContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  controlsContainerLandscape: {
    paddingVertical: 8,
  },
  zoomControls: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackControls: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPlayback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoomText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sheetContainer: {
    flex: 1,
    minHeight: 500,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  osmdView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default SheetMusicDisplayNative;
