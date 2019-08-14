import React from 'react';
import Expo, {Pedometer} from 'expo';
import {View, StyleSheet} from 'react-native';
import { Text} from 'react-native-elements';


export default class PedometerSensor extends React.Component {

  // Kode tatt fra https://docs.expo.io/versions/latest/sdk/pedometer START
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    /*
    * Teller hvor mange skritt du har gått mens PedomeyerSensor er mounted
    * Med på å hjelpe til å oppdatere antall skritt i dag dynamisk
    */
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    // Sjekker om skritteller er tilgjengelig på tlf
    Pedometer.isAvailableAsync().then(
        result => {
          this.setState({
            isPedometerAvailable: String(result)
          });
        },
        error => {
          this.setState({
            isPedometerAvailable: "Could not get isPedometerAvailable: " + error
          });
        }
    );

    // Henter skritt du har gått idag fra tlf
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
        result => {
          this.setState({pastStepCount: result.steps});
        },
        error => {
          this.setState({
            pastStepCount: "Could not get stepCount: " + error
          });
        }
    );
  };

  // Unsubscriber på skritt denne session
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  // Kode tatt fra https://docs.expo.io/versions/latest/sdk/pedometer SLUTT

  /*
   * Sjekker om du har gått for langt idag for å minne deg på at
   * du må prokrastinere litt mer
   */


  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.mediumText}>
            Skritt i dag:
          </Text>
          <Text style={styles.bigText}>
            {/*
             Plusser sammen pastStepCount (Alle steps så langt idag)
             og currenStepCount (Alle steps du har tatt mens du er inne i skritteller appen
             Dette fordi pasStepCount ikke teller hele tiden, men henter fra google fit/core motion når du
             åpner siden "Pedometer"
             */}
            {this.state.pastStepCount + this.state.currentStepCount}
          </Text>
        </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  bigText: {
    fontSize: 72
  },
  mediumText: {
    fontSize: 32
  }
});
