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

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FIRST_NAME: "",
      LAST_NAME: "",
      EMPLOYEE_ID: "",

      // Default Value for CreateButtonStateHolder state. Now the button is Disabled.
      CreateButtonStateHolder: false
    };

    const { navigation } = this.props;
    this.navigation = navigation;
    this.url = navigation.getParam('URL', '');
  }

  addEmployee = param => {
    console.log(param);
    fetch(`${this.url}/user/add_user`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param)
    })
    .then(response => response.json())
    .then(async responseJson => {
      if (200 === responseJson.code) {
        new Promise((resolve) => {
          Alert.alert(
            'info',
            'Created a user',
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
          this.props.navigation.push('Main', {
            URL: this.url,
            EMPLOYEE_ID: param.EMPLOYEE_ID
          });
        });
      } else {
        alert(responseJson.status);
      }
    })
    .catch(error => {
      console.log("addEmployee err");
      console.log(error);
      alert(error);
    });
  };

  componentDidMount() {
    StatusBar.setHidden(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }

  onPressBack = () => {
    console.log('onPressBack');
    this.props.navigation.goBack();
  }

  onChangeTextFirstName = (text) => {
    console.log("onChangeTextFirstName");
    console.log(text);
    const obj = this.state;
    obj.FIRST_NAME = text;
    obj.CreateButtonStateHolder = (0 < obj.FIRST_NAME.length && 0 < obj.LAST_NAME.length && 7 < obj.EMPLOYEE_ID.length);
    this.setState(obj);
  }

  onChangeTextLastName = (text) => {
    console.log("onChangeTextLastName");
    console.log(text);
    const obj = this.state;
    obj.LAST_NAME = text;
    obj.CreateButtonStateHolder = (0 < obj.FIRST_NAME.length && 0 < obj.LAST_NAME.length && 7 < obj.EMPLOYEE_ID.length);
    this.setState(obj);
  }

  onChangeTextEmpployeeId = (text) => {
    console.log("onChangeTextEmpployeeId");
    console.log(text);
    const obj = this.state;
    obj.EMPLOYEE_ID = text;
    obj.CreateButtonStateHolder = (0 < obj.FIRST_NAME.length && 0 < obj.LAST_NAME.length && 7 < obj.EMPLOYEE_ID.length);
    this.setState(obj);
  }

  onPressCreateBtn = () => {
    console.log("onPressCreateBtn");
    this.addEmployee({
      FIRST_NAME: this.state.FIRST_NAME,
      LAST_NAME: this.state.LAST_NAME,
      EMPLOYEE_ID: this.state.EMPLOYEE_ID
    });
  }

  render() {
    const images = {
      CHECK_BOX: {
        true: require('./images/signin_check_activated.png'),
        false: require('./images/signin_check_default.png')
      },
      CREATE_BTN: {
        true: require('./images/signup_create_btn_activated.png'),
        false: require('./images/signup_create_btn_default.png')
      }
    }

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("./images/signin_bg.jpg")}
          style={styles.background}
          imageStyle={{ resizeMode: "stretch" }}
        >
          <View style={[styles.signUpBackgroundBtnContainer, {flex: 3}]}>
            <View style={[{flex: 1}]}></View>
            <View style={[{flex: 1, flexDirection: "row"}]}>
              <View style={[{flex: 1}]}></View>
              <View style={[{flex: 3}]}>
                <TouchableOpacity style={[styles.touchableOpacity, {flex: 1}]}
                  onPress={this.onPressBack}>
                  <Image
                    style={[{flex: 1, height: undefined, width: undefined}]}
                    resizeMode="contain"
                    source={require('./images/signup_back_btn.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={[{flex: 16}]}></View>
            </View>
          </View> 
          <View style={[styles.signUpTextContainer, {flex: 4}]}>
            <View style={[{flex: 2}]}></View>
            <View style={[styles.signUpTextBarImageBox, {flex: 1}]}>
              <Image
                style={[]}
                resizeMode="center"
                source={require('./images/signin_bar.png')}
              />
            </View>
            <View style={[styles.signUpTextBox, {flex: 1}]}>
              <Text
                style={[styles.signUpFont]}
              >
                SIGN UP
              </Text>
            </View>
          </View>
          <View style={[{flex: 4}]}></View>
          <View style={[styles.signInInputContainer, {flex: 4}]}>
            <View style={[{flex: 1}]}></View>
            <View style={[{flex: 2, flexDirection: "row"}]}>
              <View style={[{flex: 5}]}></View>
              <View style={[{flex: 6}]}>
                <View style={[{flex: 3, flexDirection: "row"}]}>
                  <View style={[{flex: 19}, {alignItems: "center", justifyContent: "flex-end"}]}>
                    <TextInput style={[styles.signInFont, {justifyContent: "center"}, {fontSize: 35}]}
                      ref={c => {this.textInputRef = c;}}
                      placeholder={'First Name'}
                      onChangeText={this.onChangeTextFirstName}
                      // onBlur={this.onBlurTracking}
                      // onSubmitEditing={this.onSubmitEditingTracking}
                      // onKeyPress={this.onKeyPressTracking}
                      value={this.state.FIRST_NAME}
                    />
                  </View>
                  <View style={[{flex: 1}]}>
                    <View style={[{flex: 1}]}></View>
                    <View style={[{flex: 2}]}>
                      <Image
                        style={[{flex: 1, width: undefined, height: undefined}]}
                        resizeMode="contain"
                        source={images.CHECK_BOX[0 < this.state.FIRST_NAME.length]}
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
          <View style={[styles.signInInputContainer, {flex: 4}]}>
            <View style={[{flex: 1}]}></View>
            <View style={[{flex: 2, flexDirection: "row"}]}>
              <View style={[{flex: 5}]}></View>
              <View style={[{flex: 6}]}>
                <View style={[{flex: 3, flexDirection: "row"}]}>
                  <View style={[{flex: 19}, {alignItems: "center", justifyContent: "flex-end"}]}>
                    <TextInput style={[styles.signInFont, {justifyContent: "center"}, {fontStyle: "italic", fontSize: 25}]}
                      ref={c => {this.textInputRef = c;}}
                      placeholder={'Last Name'}
                      onChangeText={this.onChangeTextLastName}
                      // onBlur={this.onBlurTracking}
                      // onSubmitEditing={this.onSubmitEditingTracking}
                      // onKeyPress={this.onKeyPressTracking}
                      value={this.state.LAST_NAME}
                    />
                  </View>
                  <View style={[{flex: 1}]}>
                    <View style={[{flex: 1}]}></View>
                    <View style={[{flex: 2}]}>
                      <Image
                        style={[{flex: 1, width: undefined, height: undefined}]}
                        resizeMode="contain"
                        source={images.CHECK_BOX[0 < this.state.LAST_NAME.length]}
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
          <View style={[styles.signInInputContainer, {flex: 4}]}>
            <View style={[{flex: 1}]}></View>
            <View style={[{flex: 2, flexDirection: "row"}]}>
              <View style={[{flex: 5}]}></View>
              <View style={[{flex: 6}]}>
                <View style={[{flex: 3, flexDirection: "row"}]}>
                  <View style={[{flex: 19}, {alignItems: "center", justifyContent: "flex-end"}]}>
                    <TextInput style={[styles.signInFont, {justifyContent: "center"}, {fontStyle: "italic", fontSize: 25}]}
                      ref={c => {this.textInputRef = c;}}
                      placeholder={'Employee ID Number'}
                      onChangeText={this.onChangeTextEmpployeeId}
                      // onBlur={this.onBlurTracking}
                      // onSubmitEditing={this.onSubmitEditingTracking}
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
          <View style={[{flex: 16, flexDirection: "row"}]}>
            <View style={[{flex: 5}]}></View>
            <View style={[{flex: 6}]}>
              <TouchableOpacity style={[styles.touchableOpacity, {flex: 1}]}
                activeOpacity={this.state.CreateButtonStateHolder ? 0.1 : 1}
                onPress={this.state.CreateButtonStateHolder ? this.onPressCreateBtn: ()=>{}}>
                <Image
                  style={[{flex: 1, width: undefined, height: undefined}]}
                  resizeMode="contain"
                  source={images.CREATE_BTN[this.state.CreateButtonStateHolder]}
                />
              </TouchableOpacity>
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
  signIpFont: {
    fontSize: 20,
    color: "#353535"
  },
  signUpBackgroundBtnContainer: {
  },
  signUpTextContainer: {
    alignItems: "center",
  },
  signUpTextBarImageBox: {
    // justifyContent: "flex-end",
    // paddingBottom: '10%',
  },
  signUpTextBox: {
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
