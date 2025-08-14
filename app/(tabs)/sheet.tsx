import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import SheetMusicDisplay from '@/components/SheetMusicDisplay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SheetsScreen() {
  const [selectedFile, setSelectedFile] = useState('1');
  const [showDropdown, setShowDropdown] = useState(false);

// Clementi Sonatina Op.36 No.1 Part 2 - Complete MusicXML
const clementniXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise>
  <work>
    <work-title>Sonatina Op.36 No 1 Teil 2 Andante</work-title>
    </work>
  <identification>
  <creator type="composer">Muzio Clementi</creator>
    <encoding>
      <software>MuseScore 1.2</software>
      <encoding-date>2012-08-06</encoding-date>
      </encoding>
    </identification>
  <defaults>
    <scaling>
      <millimeters>8.46668</millimeters>
      <tenths>40</tenths>
      </scaling>
    <page-layout>
      <page-height>1320</page-height>
      <page-width>1020</page-width>
      <page-margins type="both">
        <left-margin>59.5832</left-margin>
        <right-margin>56.6667</right-margin>
        <top-margin>96.6665</top-margin>
        <bottom-margin>79.9999</bottom-margin>
        </page-margins>
      </page-layout>
    </defaults>
  <credit page="1">
    <credit-words default-x="509.999" default-y="1223.33" font-size="24" justify="center" valign="top">Sonatina op36 No1 Part2</credit-words>
    </credit>
  <credit page="1">
    <credit-words default-x="963.332" default-y="1150.83" font-size="12" justify="right" valign="top">Muzio Clementi</credit-words>
    </credit>
  <part-list>
    <score-part id="P1">
      <part-name>Piano (right)</part-name>
      <score-instrument id="P1-I3">
        <instrument-name>Piano (right)</instrument-name>
        </score-instrument>
      <midi-instrument id="P1-I3">
        <midi-channel>1</midi-channel>
        <midi-program>1</midi-program>
        <volume>78.7402</volume>
        <pan>0</pan>
        </midi-instrument>
      </score-part>
    <score-part id="P2">
      <part-name>Piano (left)</part-name>
      <score-instrument id="P2-I3">
        <instrument-name>Piano (left)</instrument-name>
        </score-instrument>
      <midi-instrument id="P2-I3">
        <midi-channel>2</midi-channel>
        <midi-program>1</midi-program>
        <volume>78.7402</volume>
        <pan>0</pan>
        </midi-instrument>
      </score-part>
    </part-list>
  <part id="P1">
    <measure number="1" width="308.00">
      <print>
        <system-layout>
          <system-margins>
            <left-margin>120.31</left-margin>
            <right-margin>0.00</right-margin>
            </system-margins>
          <top-system-distance>271.11</top-system-distance>
          </system-layout>
        </print>
      <attributes>
        <divisions>12</divisions>
        <key>
          <fifths>-1</fifths>
          <mode>major</mode>
          </key>
        <time>
          <beats>3</beats>
          <beat-type>4</beat-type>
          </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
          </clef>
        </attributes>
      <direction placement="above">
        <direction-type>
          <metronome parentheses="no">
            <beat-unit>quarter</beat-unit>
            <per-minute>92</per-minute>
            </metronome>
          </direction-type>
        <sound tempo="91.9998"/>
        </direction>
      <direction placement="above">
        <direction-type>
          <words>Andante</words>
          </direction-type>
        </direction>
      <note default-x="82.28" default-y="-15.00">
        <pitch>
          <step>C</step>
          <octave>5</octave>
          </pitch>
        <duration>24</duration>
        <voice>1</voice>
        <type>half</type>
        <stem>down</stem>
        </note>
      <note default-x="231.70" default-y="0.00">
        <pitch>
          <step>F</step>
          <octave>5</octave>
          </pitch>
        <duration>12</duration>
        <voice>1</voice>
        <type>quarter</type>
        <stem>down</stem>
        </note>
      </measure>
    </part>
    <part id="P2">
      <measure number="1" width="308.00">
        <print>
          <staff-layout number="1">
            <staff-distance>65.00</staff-distance>
            </staff-layout>
          </print>
        <attributes>
          <divisions>12</divisions>
          <key>
            <fifths>-1</fifths>
            <mode>major</mode>
            </key>
          <time>
            <beats>3</beats>
            <beat-type>4</beat-type>
            </time>
          <clef>
            <sign>F</sign>
            <line>4</line>
            </clef>
          </attributes>
        <note default-x="82.28" default-y="-115.00">
          <pitch>
            <step>F</step>
            <octave>3</octave>
            </pitch>
          <duration>4</duration>
          <voice>1</voice>
          <type>eighth</type>
          <time-modification>
            <actual-notes>3</actual-notes>
            <normal-notes>2</normal-notes>
            </time-modification>
          <stem>down</stem>
          <beam number="1">begin</beam>
          <notations>
            <tuplet type="start" bracket="no"/>
            </notations>
          </note>
        </measure>
      </part>
  </score-partwise>`;

// Beethoven An die ferne Geliebte - First page
const beethovenXML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="2.0">
  <work>
    <work-number>Op. 98</work-number>
    <work-title>An die ferne Geliebte (Page 1)</work-title>
  </work>
  <identification>
    <creator type="composer">Ludwig van Beethoven</creator>
    <creator type="lyricist">Aloys Jeitteles</creator>
    <rights>Copyright © 2002 Recordare LLC</rights>
    <encoding>
      <software>Finale 2011 for Windows</software>
      <software>Dolet Light for Finale 2011</software>
      <encoding-date>2010-12-10</encoding-date>
      <supports attribute="new-system" element="print" type="yes" value="yes"/>
      <supports attribute="new-page" element="print" type="yes" value="yes"/>
    </encoding>
  </identification>
  <defaults>
    <scaling>
      <millimeters>6.35</millimeters>
      <tenths>40</tenths>
    </scaling>
    <page-layout>
      <page-height>1760</page-height>
      <page-width>1360</page-width>
      <page-margins type="both">
        <left-margin>80</left-margin>
        <right-margin>80</right-margin>
        <top-margin>80</top-margin>
        <bottom-margin>80</bottom-margin>
      </page-margins>
    </page-layout>
    <system-layout>
      <system-margins>
        <left-margin>71</left-margin>
        <right-margin>0</right-margin>
      </system-margins>
      <system-distance>108</system-distance>
      <top-system-distance>65</top-system-distance>
    </system-layout>
    <staff-layout>
      <staff-distance>101</staff-distance>
    </staff-layout>
    <appearance>
      <line-width type="stem">0.957</line-width>
      <line-width type="beam">5.0391</line-width>
      <line-width type="staff">0.957</line-width>
      <line-width type="light barline">1.875</line-width>
      <line-width type="heavy barline">5.0391</line-width>
      <line-width type="leger">1.875</line-width>
      <line-width type="ending">0.957</line-width>
      <line-width type="wedge">0.957</line-width>
      <line-width type="enclosure">0.957</line-width>
      <line-width type="tuplet bracket">0.957</line-width>
      <note-size type="grace">60</note-size>
      <note-size type="cue">60</note-size>
    </appearance>
    <music-font font-family="Maestro" font-size="18"/>
    <word-font font-family="Times New Roman" font-size="9"/>
    <lyric-font font-family="Times New Roman" font-size="10"/>
  </defaults>
  <credit page="1">
    <credit-words default-x="680" default-y="1678" font-size="24" justify="center" valign="top">An die ferne Geliebte</credit-words>
    <credit-words font-size="24" font-weight="bold"> 
</credit-words>
    <credit-words font-size="14" font-weight="normal">Op. 98</credit-words>
  </credit>
  <part-list>
    <score-part id="P1">
      <part-name>Voice</part-name>
      <score-instrument id="P1-I3">
        <instrument-name>Voice</instrument-name>
      </score-instrument>
      <midi-instrument id="P1-I3">
        <midi-channel>1</midi-channel>
        <midi-program>53</midi-program>
        <volume>80</volume>
        <pan>0</pan>
      </midi-instrument>
    </score-part>
    <score-part id="P2">
      <part-name>Piano</part-name>
      <score-instrument id="P2-I2">
        <instrument-name>Acoustic Grand Piano</instrument-name>
      </score-instrument>
      <midi-instrument id="P2-I2">
        <midi-channel>2</midi-channel>
        <midi-program>1</midi-program>
        <volume>80</volume>
        <pan>0</pan>
      </midi-instrument>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1" width="324">
      <print page-number="1">
        <system-layout>
          <system-margins>
            <left-margin>150</left-margin>
            <right-margin>0</right-margin>
          </system-margins>
          <top-system-distance>300</top-system-distance>
        </system-layout>
        <measure-numbering>system</measure-numbering>
      </print>
      <attributes>
        <divisions>24</divisions>
        <key>
          <fifths>-3</fifths>
          <mode>major</mode>
        </key>
        <time>
          <beats>3</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <direction directive="yes" placement="above">
        <direction-type>
          <words default-y="26" font-size="11" font-weight="bold">Ziemlich langsam und mit Ausdruck</words>
        </direction-type>
        <sound tempo="60"/>
      </direction>
      <direction directive="yes" placement="above">
        <direction-type>
          <words default-y="60" font-size="16" font-weight="bold" xml:lang="de">No. 1</words>
        </direction-type>
      </direction>
      <note default-x="136">
        <rest/>
        <duration>24</duration>
        <voice>1</voice>
        <type>quarter</type>
      </note>
      <note default-x="196">
        <pitch>
          <step>B</step>
          <alter>-1</alter>
          <octave>4</octave>
        </pitch>
        <duration>24</duration>
        <voice>1</voice>
        <type>quarter</type>
        <stem default-y="-55.5">down</stem>
        <lyric default-y="-80" number="1">
          <syllabic>single</syllabic>
          <text>Auf</text>
        </lyric>
      </note>
      <note default-x="257">
        <pitch>
          <step>B</step>
          <alter>-1</alter>
          <octave>4</octave>
        </pitch>
        <duration>24</duration>
        <voice>1</voice>
        <type>quarter</type>
        <stem default-y="-55.5">down</stem>
        <lyric default-y="-80" number="1">
          <syllabic>single</syllabic>
          <text>dem</text>
        </lyric>
      </note>
    </measure>
  </part>
  <part id="P2">
    <measure number="1" width="324">
      <print>
        <staff-layout number="2">
          <staff-distance>70</staff-distance>
        </staff-layout>
        <measure-numbering>none</measure-numbering>
      </print>
      <attributes>
        <divisions>96</divisions>
        <key>
          <fifths>-3</fifths>
          <mode>major</mode>
        </key>
        <time>
          <beats>3</beats>
          <beat-type>4</beat-type>
        </time>
        <staves>2</staves>
        <clef number="1">
          <sign>G</sign>
          <line>2</line>
        </clef>
        <clef number="2">
          <sign>F</sign>
          <line>4</line>
        </clef>
      </attributes>
      <direction placement="below">
        <direction-type>
          <dynamics default-y="-81">
            <p/>
          </dynamics>
        </direction-type>
        <staff>1</staff>
        <sound dynamics="54"/>
      </direction>
      <note default-x="136">
        <pitch>
          <step>B</step>
          <alter>-1</alter>
          <octave>3</octave>
        </pitch>
        <duration>96</duration>
        <voice>1</voice>
        <type>quarter</type>
        <stem default-y="15.5">up</stem>
        <staff>1</staff>
      </note>
    </measure>
  </part>
</score-partwise>`;

const musicFiles = [
  {
    id: '1',
    title: 'Sonatina Op.36 No.1 - Andante',
    composer: 'Muzio Clementi',
    xml: clementniXML
  },
  {
    id: '2',
    title: 'An die ferne Geliebte - Op. 98',
    composer: 'Ludwig van Beethoven',
    xml: beethovenXML
  }
];  const getMusicXML = () => {
    const selected = musicFiles.find(file => file.id === selectedFile);
    return selected ? selected.xml : musicFiles[0].xml;
  };

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
          musicXML={getMusicXML()} 
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
