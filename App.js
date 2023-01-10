import { StatusBar } from "expo-status-bar";
import { useRef, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SegmentedControl from "./components/SegmentedControl";
import TextField from "./components/TextField";
import "./App.css";
import good from "./assets/good.png";
import bad from "./assets/bad.png";
import { spreads, trades } from "./constants";

export default function App() {
  const showOutput = false;

  const [trade, setTrade] = useState({
    type: "BPS",
    spread: 1,
    strike: 1.08,
    costBasis: 65,
    dte: 28,
    credit: 0.19,
  });

  const [tradeReturns, setArorc] = useState({
    arorc: 20,
    rorc: 20,
    minCredit: 1.09,
  });

  function onValueChange(name, value) {
    const newValue = { ...trade, [name]: value };
    setTrade(newValue);
    calculateArorc(newValue);
  }

  function meetsMarr() {
    if (trade.type == "BPS" || trade.type == "BCS") {
      if (tradeReturns.arorc >= 48) {
        return true;
      } else return false;
    } else {
      if (tradeReturns.arorc >= 20) {
        return true;
      } else return false;
    }
  }

  function calculateArorc(newTrade = trade) {
    let riskCapital, expectedArorc, s;
    if (newTrade.type == "BCS" || newTrade.type == "BPS") {
      s = newTrade.spread;
      riskCapital = s - newTrade.credit;
      expectedArorc = 0.48;
    } else if (newTrade.type == "ROP") {
      s = newTrade.strike;
      riskCapital = s - newTrade.credit;
      expectedArorc = 0.2;
    } else {
      s = newTrade.costBasis;
      riskCapital = s - newTrade.credit;
      expectedArorc = 0.2;
    }

    console.log(expectedArorc, s, newTrade.strike, newTrade.dte);

    let returnOnRiskCapital = newTrade.credit / riskCapital;
    let multiplier = 365 / newTrade.dte;
    let annualizedReturnOnRiskCapital = returnOnRiskCapital * multiplier * 100;
    let commission = 0.017;
    let minCredit = (
      (expectedArorc * newTrade.dte * s) /
        (365 + expectedArorc * newTrade.dte) +
      commission
    ).toFixed(2);

    setArorc({
      arorc: annualizedReturnOnRiskCapital,
      rorc: returnOnRiskCapital,
      minCredit: minCredit,
    });
  }

  function displayMinCredit() {
    return (
        <div className="min-credit">
          <span className="min-credit-lead-copy">Minimum: </span>
          <span className={`min-credit-trailing-copy ${meetsMarr() ? "min-credit-good" : "min-credit-bad"}`}>${tradeReturns.minCredit}</span>
        </div>
    )
  }

  function ShowBaseField() {
    if (trade.type == "BPS" || trade.type == "BCS") {
      return (
        <SegmentedControl
          name="spread"
          callback={onValueChange}
          defaultIndex={spreads.findIndex((s) => s.value === trade.spread)}
          label="Spread"
          segments={spreads}
        />
      );
    } else if (trade.type == "ROP") {
      return (
        <TextField
          name="strike"
          defaultValue={trade.strike}
          showCurrencySign={true}
          callback={onValueChange}
          label="Strike Price"
        />
      );
    } else {
      return (
        <TextField
          name="costBasis"
          defaultValue={trade.costBasis}
          showCurrencySign={true}
          showNudgers={false}
          showSlider={false}
          callback={onValueChange}
          label="Cost Basis"
        />
      );
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
        defaultIndex={trades.findIndex((t) => t.value === trade.type)}
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

      <div className="credit-field">

        {displayMinCredit()}

        <TextField
          name="credit"
          defaultValue={trade.credit}
          callback={onValueChange}
          showCurrencySign={true}
          controlRef={useRef()}
          label="Credit"
          minCredit={tradeReturns.minCredit}
        />

      </div>
      {showOutput && (
        <div>
          <div>{JSON.stringify(trade, null, 2)}</div>
          <div>{JSON.stringify(tradeReturns, null, 2)}</div>
        </div>
      )}

      <div className="result">
        <div className="result-arorc">
          <img src={meetsMarr() ? good : bad} alt="" width="32" />
          <span className="result-percentage">
            {Math.floor(tradeReturns.arorc)}%
          </span>
          <span className="result-label">ARORC</span>
        </div>
        <div className="result-marr">
          {trade.type} minimal return:{" "}
          {trade.type == "BCS" || trade.type == "BPS" ? "48%" : "20%"}
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
