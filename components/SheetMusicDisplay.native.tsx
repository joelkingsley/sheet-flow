import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';

interface SheetMusicDisplayNativeProps {
  musicXML: string;
  style?: any;
}

const SheetMusicDisplayNative: React.FC<SheetMusicDisplayNativeProps> = ({ musicXML, style }) => {
  const generateWebViewHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenSheetMusicDisplay</title>
    <script src="https://unpkg.com/opensheetmusicdisplay@1.8.7/build/opensheetmusicdisplay.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        #osmdContainer {
            width: 100%;
            height: auto;
            min-height: 400px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
            box-sizing: border-box;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .error {
            text-align: center;
            padding: 40px;
            color: #d32f2f;
            background-color: #ffebee;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div id="osmdContainer">
        <div class="loading">Loading sheet music...</div>
    </div>
    
    <script>
        function loadSheetMusic() {
            try {
                const osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdContainer");
                
                const musicXML = \`${musicXML.replace(/`/g, '\\`')}\`;
                
                osmd.load(musicXML).then(() => {
                    osmd.render();
                    console.log("Sheet music rendered successfully");
                }).catch((error) => {
                    console.error("Error rendering sheet music:", error);
                    document.getElementById("osmdContainer").innerHTML = 
                        '<div class="error">Error loading sheet music: ' + error.message + '</div>';
                });
            } catch (error) {
                console.error("Error initializing OSMD:", error);
                document.getElementById("osmdContainer").innerHTML = 
                    '<div class="error">Error initializing sheet music display: ' + error.message + '</div>';
            }
        }
        
        // Load when the page is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadSheetMusic);
        } else {
            loadSheetMusic();
        }
    </script>
</body>
</html>`;
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: generateWebViewHTML() }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Loading sheet music...</ThemedText>
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
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
  webView: {
    flex: 1,
    minHeight: 500,
    backgroundColor: 'transparent',
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
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default SheetMusicDisplayNative;
