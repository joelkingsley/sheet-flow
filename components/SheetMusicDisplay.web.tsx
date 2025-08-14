import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface SheetMusicDisplayWebProps {
  musicXML: string;
  style?: any;
}

declare global {
  interface Window {
    opensheetmusicdisplay: any;
  }
}

const SheetMusicDisplayWeb: React.FC<SheetMusicDisplayWebProps> = ({ musicXML, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadOSMD = async () => {
      try {
        // Check if OSMD is already loaded
        if (window.opensheetmusicdisplay) {
          initializeOSMD();
          return;
        }

        // Load OSMD script dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/opensheetmusicdisplay@1.8.7/build/opensheetmusicdisplay.min.js';
        script.onload = () => {
          initializeOSMD();
        };
        script.onerror = () => {
          setError('Failed to load OpenSheetMusicDisplay library');
          setIsLoading(false);
        };
        document.head.appendChild(script);

        return () => {
          if (script.parentNode) {
            document.head.removeChild(script);
          }
        };
      } catch (err) {
        setError('Error loading sheet music library');
        setIsLoading(false);
      }
    };

    const initializeOSMD = () => {
      try {
        if (containerRef.current && window.opensheetmusicdisplay) {
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Create OSMD instance
          osmdRef.current = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(containerRef.current);
          
          // Load and render the music
          osmdRef.current.load(musicXML)
            .then(() => {
              osmdRef.current.render();
              setIsLoading(false);
              setError(null);
            })
            .catch((err: Error) => {
              setError(`Error rendering sheet music: ${err.message}`);
              setIsLoading(false);
            });
        }
      } catch (err) {
        setError(`Error initializing sheet music display: ${(err as Error).message}`);
        setIsLoading(false);
      }
    };

    loadOSMD();
  }, [musicXML]);

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading sheet music...</ThemedText>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}
      {/* @ts-ignore - Using HTML div for web-specific DOM manipulation */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: 400,
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 20,
          boxSizing: 'border-box',
          display: isLoading || error ? 'none' : 'block',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 500,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffebee',
    margin: 20,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});

export default SheetMusicDisplayWeb;
