import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Text
} from "react-native";

import { ScreenOrientation } from "expo";

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    this.navigation = navigation;
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    this.timerId = setTimeout(this.tick, 2000);
    // this.setState({timer});
  }

  componentWillUnmount() {
    // clearInterval(this.state.timer);
  }

  tick = () => {
    // if (this.state.timer) {
    //   clearInterval(this.state.timer);
    // }

    this.onPress();
  }

  onPress = () => {
    if (this.timerId) clearTimeout(this.timerId);
    this.props.navigation.navigate('Main', {
      URL: this.navigation.getParam('URL', ''),
      EMPLOYEE_ID: this.navigation.getParam('EMPLOYEE_ID', '')
    });
  }

  render() {
    const navigation = this.navigation
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("./images/signin_bg.jpg")}
          style={styles.background}
          imageStyle={{ resizeMode: "stretch" }}
        >
          <TouchableOpacity style={[styles.touchableOpacity, {flex: 1}]}
            onPress={this.onPress}>
            <View style={[styles.signInUpBackgroundBtnContainer, {flex: 3}]}></View> 
            <View style={[styles.signInTextContainer, {flex: 4}]}>
              <View style={[{flex: 2}]}></View>
              <View style={[styles.signInTextBarImageBox, {flex: 1}]}>
                <Image
                  style={[]}
                  resizeMode="center"
                  source={require('./images/signin_bar.png')}
                />
              </View>
              <View style={[styles.signUpTextBox, {flex: 1}]}>
                <Text
                  style={[styles.signInFont]}
                >
                  SUCCESSFULLY SIGNED IN
                </Text>
              </View>
            </View>
            <View style={[{flex: 4}]}></View>
            <View style={[styles.signInInputContainer, {flex: 12}, {alignItems: "center"}]}>
              <View style={[{flex: 1}, {justifyContent: "flex-end"}]}>
                <Text style={[styles.signInFont, {fontSize: 65, fontWeight: "100"}]}
                >
                    Welcome Back,
                </Text>
              </View>
              <View style={[{flex: 1}]}>
                <Text style={[styles.signInFont, {fontSize: 60, fontWeight: "100"}]}>
                    {`${navigation.getParam('FIRST_NAME', '')} ${navigation.getParam('LAST_NAME', '')}`}
                </Text>
              </View>
            </View>
            <View style={[{flex: 16, flexDirection: "row"}]}>
              <View style={[{flex: 5}]}></View>
              <View style={[{flex: 6}]}>
                <View style={[{flex: 8}]}>
                  
                </View>
                <View style={[{flex: 3}]}>
                  
                </View>
                <View style={[{flex: 9}]}></View>
              </View>
              <View style={[{flex: 5}]}></View>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    width: '100%',
    height: '100%'
  },
  signInFont: {
    fontSize: 20,
    color: "#353535"
  },
  signInBackgroundBtnContainer: {
  },
  signInTextContainer: {
    alignItems: "center",
  },
  signInTextBarImageBox: {
    // justifyContent: "flex-end",
    // paddingBottom: '10%',
  },
  signInTextBox: {
    justifyContent: "flex-start",
  },
  signInInputContainer: {
    alignItems: "center",
  },
  signInInputBox: {
    // justifyContent: "center",
    // flexDirection: "row",
  },
  signInInputTextBox: {
    // justifyContent: "center",
    // alignItems: "center",
    // borderWidth: 1,
    // borderColor: "yellow"
  },
  signInInputCheckBox: {
    justifyContent: "flex-end",
  },
  signInInputUnderlineBox: {
    alignItems: "center"
  },
  loginBtnContainer: {
    alignItems: "center",
  },
  loginBtnBox: {
  },
  signInSignUpBtnContainer: {
  },
  signInSignUpBtnBox: {
    alignItems: "center"
  }
});
