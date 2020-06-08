import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Animated
} from "react-native";

import { Overlay } from "react-native-elements";

export default class SimpleToast extends Component {
  constructor(props) {
    super(props);

    this.animateOpacityValue = new Animated.Value(0);
    this.state = {
      ShowToast: false
    };
  }

  componentWillUnmount() {
    this.timerID && clearTimeout(this.timerID);
  }

  ShowToastFunction() {
    this.position = this.props.position || "bottom"
    this.backgroundColor = this.props.backgroundColor || "#666666";
    this.duration = this.props.duration || 1500;
    this.autoHide = this.props.autoHide === undefined && true || this.props.autoHide || false;
    this.message = this.props.message || "Custom message";
    this.closeCallBack = this.props.closeCallBack || null;

    this.setState({ ShowToast: true }, () => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 1,
        duration: 500
      }).start(() => {
        if (this.autoHide)
          this.timerID = setTimeout(this.HideToastFunction(), this.duration);
      });
    });
  }

  HideToastFunction = () => {
    Animated.timing(this.animateOpacityValue, {
      toValue: 0,
      duration: 500
    }).start(() => {
      this.timerID && clearTimeout(this.timerID);
      this.setState({ ShowToast: false }, () => {
        if (this.closeCallBack) this.closeCallBack();
      });
    });
  }
  
  render() {
    if (this.state.ShowToast) {
      return (
        <Overlay
          isVisible={this.state.ShowToast}
          style={[styles.toastContainer]}
          windowBackgroundColor="rgba(0, 0, 0, .5)"
          overlayBackgroundColor="rgba(0, 0, 0, 0)"
          onBackdropPress={this.HideToastFunction}
        >
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={this.HideToastFunction}
          >
            <Animated.View
              style={[
                styles.animatedToastView,
                {
                  opacity: this.animateOpacityValue,
                  top: this.position == "top" ? "10%" : "80%",
                  backgroundColor: this.backgroundColor || "#666666"
                }
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.ToastBoxInsideText,
                  { color: this.props.textColor || "#fff" }
                ]}
              >
                {this.message}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </Overlay>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  toastContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS == "ios" ? 20 : 0,
    margin: 10
  },
  animatedToastView: {
    marginHorizontal: 30,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 9999,
    position: "absolute",
    justifyContent: "center"
  },
  touchableOpacity: {
    flex: 1,
    alignItems: "center"
  },

  ToastBoxInsideText: {
    fontSize: 45,
    alignSelf: "stretch",
    textAlign: "center"
  }
});
