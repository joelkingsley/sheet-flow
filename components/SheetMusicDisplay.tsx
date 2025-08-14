import React from 'react';
import { Platform } from 'react-native';

interface SheetMusicDisplayProps {
  musicXML: string;
  style?: any;
}

const SheetMusicDisplay: React.FC<SheetMusicDisplayProps> = (props) => {
  if (Platform.OS === 'web') {
    // Dynamically import the web component
    const SheetMusicDisplayWeb = require('./SheetMusicDisplay.web').default;
    return <SheetMusicDisplayWeb {...props} />;
  } else {
    // Dynamically import the native component
    const SheetMusicDisplayNative = require('./SheetMusicDisplay.native').default;
    return <SheetMusicDisplayNative {...props} />;
  }
};

export default SheetMusicDisplay;
