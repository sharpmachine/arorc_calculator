import { StatusBar } from 'expo-status-bar';
import { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import  SegmentedControl from './SegmentedControl';

export default function App() {
  return (
    <View style={styles.container}>
      <SegmentedControl
        name="trade"
        callback={(val) => console.log(val)}
        defaultIndex={0}
        controlRef={useRef()}
        label="Trade"
        segments={[
          {
            label: 'BPS',
            value: 'BPS',
            ref: useRef(),
          },
          {
            label: 'BCS',
            value: 'BCS',
            ref: useRef(),
          },
          {
            label: 'ROP',
            value: 'ROP',
            ref: useRef(),
          },
          {
            label: 'ROC',
            value: 'ROC',
            ref: useRef(),
          }
        ]}
      />
      <SegmentedControl
        name="trade"
        callback={(val) => console.log(val)}
        defaultIndex={0}
        controlRef={useRef()}
        label="Spread"
        segments={[
          {
            label: '$1',
            value: '$1',
            ref: useRef(),
          },
          {
            label: '$5',
            value: '$5',
            ref: useRef(),
          },
          {
            label: '$10',
            value: '$10',
            ref: useRef(),
          },
          {
            label: '$20',
            value: '$20',
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
    backgroundColor: '#F2F3EE',
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 24,
    gap: 16

  },
});
