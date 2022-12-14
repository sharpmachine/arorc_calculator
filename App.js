import { StatusBar } from 'expo-status-bar';
import { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import  SegmentedControl from './SegmentedControl';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your sapp!</Text>
      <SegmentedControl
        name="group-1"
        callback={(val) => console.log(val)}
        defaultIndex={0}
        controlRef={useRef()}
        segments={[
          {
            label: 'Complete',
            value: 'complete',
            ref: useRef(),
          },
          {
            label: 'Incomplete',
            value: 'incomplete',
            ref: useRef(),
          },
          {
            label: 'Pending',
            value: 'pending',
            ref: useRef(),
          }
        ]}
      />
      <StatusBar style="auto" />
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
});
