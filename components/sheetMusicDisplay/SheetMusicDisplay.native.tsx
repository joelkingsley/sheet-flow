import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '../ThemedText';

interface SheetMusicDisplayNativeProps {
  musicXML: string | any;
  style?: any;
}

const SheetMusicDisplayNative: React.FC<SheetMusicDisplayNativeProps> = ({ musicXML, style }) => {
  const [xmlString, setXmlString] = useState<string>('');

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
          if (isMounted) setXmlString('');
        }
      } else {
        setXmlString('');
      }
    };
    loadXML();
    return () => { isMounted = false; };
  }, [musicXML]);

  const generateWebViewHTML = () => {
  // Use JSON.stringify for safe JS injection
  const safeXML = JSON.stringify(xmlString || '');
  let html = `
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
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #ffffff;
    }
    #osmdContainer {
      width: 100%;
      height: auto;
      min-height: 400px;
      background-color: #ffffff;
      padding: 0;
      box-sizing: border-box;
    }
    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      background-color: #ffffff;
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
  const musicXML = REPLACE_MUSICXML;
        osmd.load(musicXML).then(() => {
          osmd.render();
          document.getElementById("osmdContainer").innerHTML = ""; // Remove loading text
          console.log("Sheet music rendered successfully");
        }).catch((error) => {
          console.error("Error rendering sheet music:", error);
          document.getElementById("osmdContainer").innerHTML = 
            '<div class="error">Error loading sheet music: ' + error.message + '<br><pre>' + (error.stack || '') + '</pre></div>';
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
  html = html.replace('REPLACE_MUSICXML', safeXML);
  // safeXML is JSON.stringify(xmlString), so this injects a valid JS string literal
  return html;
  };

  // Debug: log the XML string before rendering
  React.useEffect(() => {
    console.log('SheetMusicDisplayNative xmlString:', xmlString);
  }, [xmlString]);

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={styles.container}>
        {xmlString ? (
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
        ) : (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Loading sheet music...</ThemedText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    minHeight: 500,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    minHeight: 500,
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
