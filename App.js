import { StatusBar } from 'expo-status-bar';
import { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import  SegmentedControl from './SegmentedControl';
import TextField from './TextField';

export default function App() {
  
  const [trade, setTrade] = useState({
    type: 'BPS',
    spread: 5,
    strike: 1.08,
    costBasis: 65,
    dte: 28,
    credit: 0.19
  });

  const [arorc, setArorc] = useState({arorc: 20, rorc: 20, minCredit: 0});

  const onValueChange = (name, value, index) => {
    setTrade({
      ...trade,
      [name]: value
    }, calculateArorc());
  }

  const tradeTypes = [
    "BPS",
    "BCS",
    "ROP",
    "ROC"
  ]

  const spreads = [1, 5, 10, 20]

  // const {
  //   type,
  //   spread,
  //   strike,
  //   costBasis,
  //   dte,
  //   credit
  // } = trade

  const calculateArorc = () => {
    let riskCapital = trade.spread - trade.credit; // RC formula varies based on trade type
    let returnOnRiskCapital = trade.credit / riskCapital;
    let multiplier = 365 / trade.dte;
    let annualizedReturnOnRiskCapital = (returnOnRiskCapital * multiplier) * 100;
    //TODO: calculate min credit
    setArorc({arorc: annualizedReturnOnRiskCapital, rorc: returnOnRiskCapital, minCredit: 0})
  }

  const ShowBaseField = () => {
    if (trade.type == 'BPS' || trade.type == 'BCS') {
      return <SegmentedControl
      name="spread"
      callback={onValueChange}
      defaultIndex={spreads.indexOf(trade.spread)}
      // controlRef={useRef()}
      label="Spread"
      segments={[
        {
          label: '$1',
          value: 1,
          // ref: useRef(),
        },
        {
          label: '$5',
          value: 5,
          // ref: useRef(),
        },
        {
          label: '$10',
          value: 10,
          // ref: useRef(),
        },
        {
          label: '$20',
          value: 20,
          // ref: useRef(),
        }
      ]}
    />

    } else if (trade.type == 'ROP') {
      return <TextField
      name="strike"
      defaultValue={trade.strike}
      showCurrencySign={true}
      callback={onValueChange}
      // controlRef={useRef()}
      label="Strike Price"
    />
    } else {
      return <TextField
      name="costBasis"
      defaultValue={trade.costBasis}
      showCurrencySign={true}
      showNudgers={false}
      showSlider={false}
      callback={onValueChange}
      // controlRef={useRef()}
      label="Cost Basis"
    />
    }
  }

  useEffect(() => {
    calculateArorc();
}, []);
  
  return (
    <View style={styles.container}>
      
      <SegmentedControl
        name="type"
        callback={onValueChange}
        defaultIndex={tradeTypes.indexOf(trade.type)}
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

      {ShowBaseField()}

      <TextField
        name="dte"
        defaultValue={trade.dte}
        callback={onValueChange}
        controlRef={useRef()}
        label="Days to Expiration"
      />

      <TextField
        name="credit"
        defaultValue={trade.credit}
        callback={onValueChange}
        showCurrencySign={true}
        controlRef={useRef()}
        label="Credit"
      />
      <div>{JSON.stringify(trade, null, 2)}</div>
      <div>{JSON.stringify(arorc, null, 2)}</div>
      <div>{Math.floor(arorc.arorc)}% <span>ARORC</span></div>
      <div>{trade.type} minimal return: {trade.type == "BCS" || trade.type == "BPS" ? "48%" : "20%"}</div>

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
    gap: 16,
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    // fontWeight: 600,
    fontSize: 14,
    lineHeight: 16,
  },
});
