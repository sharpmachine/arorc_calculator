import { StatusBar } from 'expo-status-bar';
import { useRef, useState, useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import  SegmentedControl from './SegmentedControl';
import TextField from './TextField';
import './App.css';
import good from './assets/good.png';
import bad from './assets/bad.png';

export default function App() {
  const showOutput = false;
  
  const [trade, setTrade] = useState({
    type: 'BPS',
    spread: 1,
    strike: 1.08,
    costBasis: 65,
    dte: 28,
    credit: 0.19
  });

  const [tradeReturns, setArorc] = useState({
    arorc: 20, 
    rorc: 20, 
    minCredit: 1.09
  });

  const spreads = [
    {
      label: '$1',
      value: 1
    },
    {
      label: '$5',
      value: 5
    },
    {
      label: '$10',
      value: 10
    },
    {
      label: '$20',
      value: 20
    }
  ]

  const trades = [
    {
      label: 'BPS',
      value: 'BPS'
    },
    {
      label: 'BCS',
      value: 'BCS'
    },
    {
      label: 'ROP',
      value: 'ROP'
    },
    {
      label: 'ROC',
      value: 'ROC'
    }
  ]

  function onValueChange(name, value) {
    setTrade({
      ...trade,
      [name]: value
    }, calculateArorc());
  }

  function meetsMarr() {
    if (trade.type == "BPS" || trade.type == "BCS") {
      if (tradeReturns.arorc >= 48) {
        return true
      } else return false
    } else {
      if (tradeReturns.arorc >= 20) {
        return true
      } else return false
    }
  }

  function calculateArorc() {
    let riskCapital, expectedArorc, s
    if (trade.type == "BCS" || trade.type == "BPS") {
      s = trade.spread
      riskCapital = s - trade.credit
      expectedArorc = 0.48
    } else if (trade.type == "ROP") {
      s = trade.strike
      riskCapital = s - trade.credit
      expectedArorc = 0.20
    } else {
      s = trade.costBasis
      riskCapital = s - trade.credit;
      expectedArorc = 0.20
    }

    console.log(expectedArorc, s, trade.strike, trade.dte)

    let returnOnRiskCapital = trade.credit / riskCapital;
    let multiplier = 365 / trade.dte;
    let annualizedReturnOnRiskCapital = (returnOnRiskCapital * multiplier) * 100;
    let minCredit = ((expectedArorc * trade.dte * s)/(365 + (expectedArorc * trade.dte))).toFixed(2)
    //TODO: calculate min credit
    setArorc({ arorc: annualizedReturnOnRiskCapital, rorc: returnOnRiskCapital, minCredit: minCredit });
  }

  function ShowBaseField() {
    if (trade.type == 'BPS' || trade.type == 'BCS') {
      return <SegmentedControl
      name="spread"
      callback={onValueChange}
      defaultIndex={spreads.findIndex(s => s.value === trade.spread)}
      label="Spread"
      segments={spreads}
    />

    } else if (trade.type == 'ROP') {
      return <TextField
      name="strike"
      defaultValue={trade.strike}
      showCurrencySign={true}
      callback={onValueChange}
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
      label="Cost Basis"
    />
    }
  }

  useEffect(() => {
    calculateArorc();
}, []);
  
  return (
    <View style={styles.container} className="test">
      
      <SegmentedControl
        name="type"
        callback={onValueChange}
        defaultIndex={trades.findIndex(t => t.value === trade.type)}
        label="Trade"
        segments={trades}
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
        minCredit={tradeReturns.minCredit}
      />
      {showOutput &&
        <div>
          <div>{JSON.stringify(trade, null, 2)}</div>
          <div>{JSON.stringify(tradeReturns, null, 2)}</div> 
        </div>
      }

      <div className="result">
        <div className='result-arorc'>
          <img src={meetsMarr() ? good : bad} alt="" width="32" />
          <span className='result-percentage'>{Math.floor(tradeReturns.arorc)}%</span>
          <span className='result-label'>ARORC</span>
        </div>
        <div className='result-marr'>
          {trade.type} minimal return: {trade.type == "BCS" || trade.type == "BPS" ? "48%" : "20%"}
        </div>
      </div>
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 24,
    gap: 16,
  },
});
