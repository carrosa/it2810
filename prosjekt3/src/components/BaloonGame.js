import React from 'react';
import {Text, View, StyleSheet, Dimensions, Animated, TouchableOpacity} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {black} from 'react-native-paper/src/styles/colors';
import {Audio} from "expo"


let styles =
    {
      button: {
        position: "absolute",
        height: 100,
        width: 100
      }
    };


export default class BaloonGame extends React.Component {

  // This generates 5 baloons as defined by the styles
  render() {
    return (
        <View style = {{backgroundColor:"black", height: Dimensions.get("window").height}}>
          <TopAnimation style={styles.button}/>
          <TopAnimation style={styles.button}/>
          <TopAnimation style={styles.button}/>
          <TopAnimation style={styles.button}/>
          <TopAnimation style={styles.button}/>
        </View>
    );
  }
}

class TopAnimation extends React.Component {
  state = {
    sleft: new Animated.Value(10),
    topAnim: new Animated.Value(Dimensions.get("window").height),
    baloonColor: ""
  };

  //this doesnt work atm
  GenerateStartPosition() {
    return Dimensions.get("window").height;
  }

  GenerateLeft() {
    return Math.floor(Math.random() * Dimensions.get("window").width) - 50;
  }

  ChooseRandom(array){
    return array[Math.floor(Math.random() * array.length)];
  }
  GenerateColor() {
    let baloonColors = ['red', 'blue', 'yellow', 'orange', 'green', "purple"] 
    return this.ChooseRandom(baloonColors);}

  GenerateSound(){
    let soundOption = [
      require("../sound/pop1.mp3"),
      require("../sound/pop2.mp3"),
      require("../sound/pop3.mp3")
    ]
    return this.ChooseRandom(soundOption);
  }

  componentDidMount() {
    this.RunAnimation();
  }

  async pressHandler() {
    this.RunAnimation();
    pop = new Audio.Sound()
    let soundloc = this.GenerateSound();
    try {
      await pop.loadAsync(this.GenerateSound());
      await pop.playAsync();
      await pop.setPositionAsync(0);
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  RunAnimation() {
    let newLeft = this.GenerateLeft();
    let newColor = this.GenerateColor();
    this.setState({sleft: newLeft});
    this.setState({baloonColor: newColor});
    this.state.topAnim.setValue(this.GenerateStartPosition());
    Animated.loop(
        Animated.timing(
            this.state.topAnim,
            {
              toValue: 0,
              duration: 10000
            })).start();
  }

  render() {
    return (
        <Animated.View style={{...this.props.style, top: this.state.topAnim, left: this.state.sleft}}>
          {this.props.children}
          <TouchableOpacity
          style={
            this.props.style
          }
              onPress={() => {
                this.pressHandler();
              }}
          >
            <View
                style={{
                  ...this.props.style,
                  backgroundColor: this.GenerateColor(),
                  borderRadius: 50
                }}
            >
            </View>
          </TouchableOpacity>
        </Animated.View>
    );

  }
}

