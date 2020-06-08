import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Text,
  TextInput,
  Alert
} from "react-native";

import { ScreenOrientation } from "expo";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EMPLOYEE_ID: "",

      // Default Value for LoginButtonStateHolder state. Now the button is Disabled.
      LoginButtonStateHolder: false
    };

    this.url = 'http://ec2-54-183-214-25.us-west-1.compute.amazonaws.com:3000';
    // this.url = 'http://localhost:3000';
  }

  getEmployeeInfo = employeeId => {
    if ((employeeId || "").length < 1) {
      this.textInputRef.focus();
      return;
    }
    
    fetch(`${this.url}/order/login?employee_code=${employeeId}`)
    .then(response => response.json())
    .then(async responseJson => {
      if (100 === responseJson.code) {
        new Promise((resolve) => {
          Alert.alert(
            'info',
            responseJson.status,
            [
              {
                text: 'Ok',
                onPress: () => {
                  resolve('YES');
                }
              }
            ],
            { 
              cancelable: false
            }
          );
        }).then(() => {
          this.textInputRef.clear();
          this.onChangeTextEmpployeeId('');
        });
      } else {
        this.props.navigation.push('Welcome', {
          URL: this.url,
          EMPLOYEE_ID: responseJson.EMPLOYEE_ID,
          FIRST_NAME: responseJson.FIRST_NAME,
          LAST_NAME: responseJson.LAST_NAME
        });
      }
    })
    .catch(error => {
      console.log("getEmployeeInfo err");
      console.log(error);
      alert(error);
    });
  };

  componentDidMount() {
    StatusBar.setHidden(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    this.textInputRef.focus();
  }

  componentDidUpdate() {
    this.textInputRef.focus();
  }

  onChangeTextEmpployeeId = (text) => {
    console.log(text);
    const obj = this.state;
    obj.EMPLOYEE_ID = text;
    obj.LoginButtonStateHolder = (7 < obj.EMPLOYEE_ID.length);
    this.setState(obj);
  }

  onSubmitEditingEmployeeId = () => {
    this.onPressLoginBtn();
  }

  onPressLoginBtn = () => {
    this.getEmployeeInfo(this.state.EMPLOYEE_ID);
  }

  onPressCreate = () => {
    this.props.navigation.push('SignUp', {
      URL: this.url
    });
  }

  render() {
    const images = {
      CHECK_BOX: {
        true: require('./images/signin_check_activated.png'),
        false: require('./images/signin_check_default.png')
      },
      LOGIN_BTN: {
        true: require('./images/signin_login_btn_activated.png'),
        false: require('./images/signin_login_btn_default.png')
      }
    }

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("./images/signin_bg.jpg")}
          style={styles.background}
          imageStyle={{ resizeMode: "stretch" }}
        >
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
                SIGN IN
              </Text>
            </View>
          </View>
          <View style={[{flex: 4}]}></View>
          <View style={[styles.signInInputContainer, {flex: 4}]}></View>
          <View style={[styles.signInInputContainer, {flex: 4}]}>
            <View style={[{flex: 1}]}></View>
            <View style={[{flex: 2, flexDirection: "row"}]}>
              <View style={[{flex: 5}]}></View>
              <View style={[{flex: 6}]}>
                <View style={[{flex: 3, flexDirection: "row"}]}>
                  <View style={[{flex: 19}, {alignItems: "center", justifyContent: "flex-end"}]}>
                    <TextInput style={[styles.signInFont, {justifyContent: "center"}, {fontSize: 35}]}
                      ref={c => {this.textInputRef = c;}}
                      placeholder={'Employee ID Number'}
                      onChangeText={this.onChangeTextEmpployeeId}
                      // onBlur={this.onBlurTracking}
                      onSubmitEditing={this.state.LoginButtonStateHolder ? this.onSubmitEditingEmployeeId : ()=>{}}
                      // onKeyPress={this.onKeyPressTracking}
                      value={this.state.EMPLOYEE_ID}
                    />
                  </View>
                  <View style={[{flex: 1}]}>
                    <View style={[{flex: 1}]}></View>
                    <View style={[{flex: 2}]}>
                      <Image
                        style={[{flex: 1, width: undefined, height: undefined}]}
                        resizeMode="contain"
                        source={images.CHECK_BOX[7 < this.state.EMPLOYEE_ID.length]}
                      />
                    </View>
                  </View>
                </View>
                <View style={[{flex: 1}]}>
                  <Image
                    style={[{flex: 1, width: undefined, height: undefined}]}
                    resizeMode="contain"
                    source={require('./images/signin_id_underline.png')}
                  />
                </View>
              </View>
              <View style={[{flex: 5}]}></View>
            </View>
          </View>
          <View style={[styles.signInInputContainer, {flex: 4}]}></View>
          <View style={[{flex: 16, flexDirection: "row"}]}>
            <View style={[{flex: 5}]}></View>
            <View style={[{flex: 6}]}>
              <View style={[{flex: 8}]}>
                <TouchableOpacity style={[styles.touchableOpacity, {flex: 1}]}
                  activeOpacity={this.state.LoginButtonStateHolder ? 0.1 : 1}
                  onPress={this.state.LoginButtonStateHolder ? this.onPressLoginBtn: ()=>{}}>
                  <Image
                    style={[{flex: 1, width: undefined, height: undefined}]}
                    resizeMode="contain"
                    source={images.LOGIN_BTN[this.state.LoginButtonStateHolder]}
                  />
                </TouchableOpacity>
              </View>
              <View style={[{flex: 3}]}>
                <TouchableOpacity style={[styles.touchableOpacity, {flex: 1}]}
                  onPress={this.onPressCreate}>
                  <Image
                    style={[{flex: 1, width: undefined, height: undefined}]}
                    resizeMode="contain"
                    source={require('./images/signin_create.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={[{flex: 9}]}></View>
            </View>
            <View style={[{flex: 5}]}></View>
          </View>
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
