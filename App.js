import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

const PANDA_API_BASE_URL = `https://download-fr01.pandavideo.com:7443/videos`
const PANDAS_API_KEY = 'panda-XXXXXXX'

export async function downloadVideo(video_id, onProgress) {
  try {
    const downloadLink = `${PANDA_API_BASE_URL}/${video_id}/hd/download`;

    const headers = { 'Authorization': PANDAS_API_KEY };

    const path = FileSystem.documentDirectory + `video-${video_id}.mp4`;

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadLink,
      path,
      { headers },
      (data) => {
        const progress = data.totalBytesWritten / data.totalBytesExpectedToWrite;
        onProgress(progress);
      }
    );

    const file = await downloadResumable.downloadAsync();
    console.log(file)
    return file.uri;
  } catch (error) {
    return null;
  }
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [uri, setUri] = useState(null);
  const videoRef = useRef(null);

  const handleDownload = async () => {
    const video_id = 'XXXXXX';
    const uri = await downloadVideo(video_id, setProgress);
    setUri(uri);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title="Download Video" onPress={handleDownload} />
      <Text>Progress: {Math.round(progress * 100)}%</Text>
      {uri && (
        <>
          <Text>Download Complete: {uri}</Text>
          <Video
            ref={videoRef}
            source={{ uri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={status => console.log(status)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    marginTop: 15,
    width: '100%',
    height: 300,
    backgroundColor: 'black'
  },
});
