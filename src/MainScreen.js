import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Text,
  TextInput,
  FlatList,
  Dimensions
} from "react-native";

import { ScreenOrientation } from "expo";

import ItemView from "./ItemView";
import SimpleToast from "./SimpleToast";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    this.navigation = navigation;
    // this.url = navigation.getParam("URL", "");
    this.employeeId = navigation.getParam("EMPLOYEE_ID", "");
    // this.url = 'http://localhost:3000'
    this.url = 'http://ec2-54-183-214-25.us-west-1.compute.amazonaws.com:3000';

    this.state = {
      data: {
        TRACKING_NO: ""
      },
      toastPosition: "bottom",
      toastColor: "#666666",
      toastCallBack: null,
      toastDuration: 1500,
      toastAutoHide: true
    };
  }

  initStateData = () => {
    // console.log("initStateData");
    new Promise((resolve, reject) => {
      this.setState({
        data: {
          TRACKING_NO: (this.state.data && this.state.data.TRACKING_NO) || ""
        }
      });
      resolve();
    })
    .then(
      () => {
        this.textInputRef.focus();
      },
      error => console.log(error)
    )
    .catch(error => console.log(error));
  };

  getOrderDetailAsync = async trackingNo => {
    if ((trackingNo || "").length < 1) {
      this.initStateData();
      return;
    }

    try {
      this.setState({ data: { TRACKING_NO: trackingNo } });
      console.log("trackingNo : " + trackingNo);
      const response = await fetch(
        `${this.url}/order/order_data/${trackingNo}`
      );
      const responseJson = await response.json();

      // console.log("retJson:");
      // console.log(responseJson);

      if (100 === responseJson.code) {
        new Promise(resolve => {
          this.showToast({
            toastPosition: 'top',
            toastColor: '#E91E63',
            toastAutoHide: false,
            toastMessage: responseJson.status,
            toastCallBack: resolve
          });
        }).then(() => {
          // this.textInputRef.clear();
          this.state.data.TRACKING_NO = "";
          this.getOrderDetailAsync("");
        });

        return;
      }

      if (responseJson && responseJson.ORDER_DATE) {
        const year = responseJson.ORDER_DATE.substring(0, 4);
        const month = responseJson.ORDER_DATE.substring(4, 6);
        const day = responseJson.ORDER_DATE.substring(6);
        responseJson.ORDER_DATE = `${month}/${day}/${year}`;
      }

      if (responseJson && responseJson.SHIPPING_STATUS) {
        const setShippingStatus = (holdYn, completeYn) => {
          responseJson.HOLD_YN = holdYn;
          responseJson.COMPLETE_YN = completeYn;
        };

        const setStatus = {
          "00": _ => setShippingStatus("N", "N"),
          "01": _ => setShippingStatus("N", "Y"),
          "02": _ => setShippingStatus("Y", "N"),
          "03": _ => setShippingStatus("Y", "N")
        };

        setStatus[responseJson.SHIPPING_STATUS]();
      }

      // console.log("final json: ");
      // console.log(responseJson);
      this.setState({ data: responseJson });
    } catch (error) {
      console.log("Search error!!");
      console.log(error);

      this.showToast({
        toastPosition: 'top',
        toastColor: '#E91E63',
        toastAutoHide: false,
        toastMessage: '' + error
      });
    }
  };

  updateOrderDetailAsync = param => {
    // console.log(param);
    return fetch(`${this.url}/order/update_packing_stat`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(param)
    })
      .then(response => response.json())
      .then(async responseJson => {
        if (200 === responseJson.code) {
          new Promise(resolve => {
            this.showToast({
              toastMessage: 'Succeed to save',
              toastCallBack: resolve
            });
          }).then(() => {
            this.textInputRef.clear();
            this.state.data.TRACKING_NO = "";
            this.getOrderDetailAsync("");
          });
        } else {
          this.showToast({
            toastPosition: 'top',
            toastColor: '#E91E63',
            toastAutoHide: false,
            toastMessage: `Fail to save.\n${responseJson.status}`
          });
        }
      })
      .catch(error => {
        console.log("updateOrderDetailAsync err");
        console.log(error);
        this.showToast({
          toastPosition: 'top',
          toastColor: '#E91E63',
          toastAutoHide: false,
          toastMessage: '' + error
        });
      });
  };

  componentDidMount() {
    StatusBar.setHidden(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    this.getOrderDetailAsync("");
  }

  componentDidUpdate() {
    if (0 === this.state.data.TRACKING_NO.length) {
      this.textInputRef.focus();
    }
  }

  onChangeTextTracking = text => {
    // console.log(`onChangeTextTracking: ${text}`);
    const obj = this.state;
    obj.data.TRACKING_NO = text;
    this.setState(obj);
  };

  onBlurTracking = () => {
    // console.log("onBlurTracking");
    // this.getOrderDetailAsync("123456789405510298370024390656");
  };

  onSubmitEditingTracking = event => {
    console.log(
      `onSubmitEditingTracking: ${(event &&
        event.nativeEvent &&
        event.nativeEvent.text) ||
        ""}`
    );

    // console.log(this.state.data.TRACKING_NO);

    if (30 === this.state.data.TRACKING_NO.length)
      this.state.data.TRACKING_NO = this.state.data.TRACKING_NO.slice(-22);
    this.getOrderDetailAsync(this.state.data.TRACKING_NO);
  };

  onKeyPressTracking = event => {
    console.log(
      `onKeyPressTracking: ${(event &&
        event.nativeEvent &&
        event.nativeEvent.key) ||
        ""}`
    );
    const key = event.nativeEvent.key;
    const obj = this.state;

    if ("0" <= key && key <= "9") {
      obj.data.TRACKING_NO = obj.data.TRACKING_NO + key;
    } else if ("Backspace" === key) {
      obj.data.TRACKING_NO = obj.data.TRACKING_NO.slice(0, -1);
    }

    this.setState(obj);
  };

  onPressHold = () => {
    this.state.data.HOLD_YN = 'Y';
    this.state.data.EMPLOYEE_ID = this.employeeId;
    this.updateOrderDetailAsync(this.state.data);
  };

  onPressComplete = () => {
    if ("N" === (this.state.data.COMPLETE || "N")) return;

    this.state.data.COMPLETE_YN = "Y";
    this.state.data.EMPLOYEE_ID = this.navigation.getParam("EMPLOYEE_ID", "");
    this.updateOrderDetailAsync(this.state.data);
  };

  onEndReachedFlatList = distanceFromEnd => {
    console.log("onEndReachedFlatList");
    console.log(distanceFromEnd);
    const data = this.state.data;

    data.COMPLETE = "Y";
    this.setState({ data: data });
  };

  showToast({
    toastPosition,
    toastColor,
    toastDuration,
    toastAutoHide,
    toastMessage,
    toastCallBack
  } = {}) {
    const state = this.state;
    state.toastPosition = toastPosition || 'bottom';
    state.toastColor = toastColor || '#666666';
    state.toastDuration = toastDuration || 1500;
    state.toastAutoHide = toastAutoHide === undefined && true || toastAutoHide;
    state.toastMessage = toastMessage || 'Hello Simple Toast';
    state.toastCallBack = toastCallBack || null;
    
    this.setState(state);
    this.refs.defaultToastBottom.ShowToastFunction();
  }

  render() {
    const data = this.state.data;
    const marketplaceImageUrl = `${this.url}/${(data &&
      data.MARKET_IMAGE_PATH) ||
      "market_place_amazon_prime_icon.png"}`;

    const {
      orderNofontSize,
      dateFontSize,
      quantityFontSize,
      itemViewHeight,
      itemViewMetaFontSize,
      itemViewResizeMode
    } = ((width, orderNoLength) => {
      if (width < 1081) 
        return {
          orderNofontSize: 16 < orderNoLength ? 19 : 25,
          dateFontSize: 35,
          quantityFontSize: 70,
          itemViewHeight: 290,
          itemViewMetaFontSize: 25,
          itemViewResizeMode: 'contain'
        };
      
      return {
        orderNofontSize: 16 < orderNoLength ? 23 : 30,
        dateFontSize: 40,
        quantityFontSize: 80,
        itemViewHeight: 390,
        itemViewMetaFontSize: 35,
        itemViewResizeMode: 'stretch'
      };
    })(Dimensions.get('window').width, ((data && data.CHANNEL_ORDER_NO) || "").length);
      
    const images = {
      COMPLETE: {
        Y: require("./images/complete_enabled_icon.png"),
        N: require("./images/complete_disabled_icon.png")
      },
      SCROLL: {
        Y: require("./images/page_down_enabled_icon.png"),
        N: require("./images/page_down_disabled_icon.png")
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <ImageBackground
            source={require("./images/date_icon.png")}
            style={styles.topBarIconView}
            imageStyle={{ resizeMode: "contain" }}
          >
            <View style={[styles.dateView]}>
              <Text style={[styles.dateFont, { fontSize: dateFontSize }]}>{data && data.ORDER_DATE}</Text>
            </View>
          </ImageBackground>
          <ImageBackground
            source={require("./images/order_icon.png")}
            style={styles.topBarIconView}
            imageStyle={{ resizeMode: "contain" }}
          >
            <View style={styles.orderNoView}>
              <Text style={[styles.orderNoFont, { fontSize: orderNofontSize }]}>
                {data && data.CHANNEL_ORDER_NO}
              </Text>
            </View>
          </ImageBackground>
          <ImageBackground
            source={require("./images/tracking_icon.png")}
            style={styles.topBarIconView}
            imageStyle={{ resizeMode: "contain" }}
          >
            <View style={styles.trackingNoView}>
              <View style={styles.trackingNoTextView}>
                <TextInput
                  style={[styles.trackingNoFont]}
                  // keyboardType={"numeric"}
                  ref={c => {
                    this.textInputRef = c;
                  }}
                  onChangeText={this.onChangeTextTracking}
                  // onBlur={this.onBlurTracking}
                  onSubmitEditing={this.onSubmitEditingTracking}
                  // onKeyPress={this.onKeyPressTracking}
                  value={this.state.data && this.state.data.TRACKING_NO}
                />
              </View>
              <View style={styles.trackingNoBtnView}>
                <TouchableHighlight
                  style={[styles.touchableOpacity, styles.trackingNoBtn]}
                  onPress={() =>
                    (this.textInputRef.isFocused() &&
                      this.textInputRef.blur()) & this.onSubmitEditingTracking()
                  }
                >
                  <View style={{ flex: 1 }}></View>
                </TouchableHighlight>
              </View>
            </View>
          </ImageBackground>
          <ImageBackground
            source={{ uri: marketplaceImageUrl }}
            style={styles.topBarIconView}
            imageStyle={{ resizeMode: "contain" }}
          ></ImageBackground>
          <ImageBackground
            source={require("./images/quantity_icon.png")}
            style={styles.topBarIconViewSmall}
            imageStyle={{ resizeMode: "contain" }}
          >
            <View style={styles.quantityView}>
              <Text style={[styles.quantityFont, {fontSize: quantityFontSize}]}>{data && data.ORDER_QTY}</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.scrollView}>
          <FlatList
            data={(data && data.ORDER_LIST) || []}
            renderItem={({ item }) => {
              return <ItemView item={item} key={0} height={itemViewHeight} metaFontSize={itemViewMetaFontSize} resizeMode={itemViewResizeMode} />;
            }}
            keyExtractor={(data, index) => index.toString()}
            onEndReached={this.onEndReachedFlatList}
            onEndReachedThreshold={0.1}
          />
        </View>
        <View style={styles.bottomBar}>
          <View style={styles.holdBtnView}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={this.onPressHold}
            >
              <Image
                style={styles.bottomButton}
                resizeMode="stretch"
                source={require("./images/hold_enabled_icon.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.scrollDown}>
            <View style={styles.scrollDownView}>
              <Image
                style={styles.bottomButton}
                resizeMode="stretch"
                source={
                  images.SCROLL[
                    2 <
                    ((data && data.ORDER_LIST && data.ORDER_LIST.length) || 0)
                      ? "Y"
                      : "N"
                  ]
                }
              />
            </View>
          </View>
          <View style={styles.completeBtnView}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={this.onPressComplete}
            >
              <Image
                style={styles.bottomButton}
                resizeMode="stretch"
                source={images.COMPLETE[(data && data.COMPLETE) || "N"]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <SimpleToast
          ref="defaultToastBottom"
          position={this.state.toastPosition}
          backgroundColor={this.state.toastColor}
          closeCallBack={this.state.toastCallBack}
          message={this.state.toastMessage}
          duration={this.state.toastDuration}
          autoHide={this.state.toastAutoHide}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  topBar: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EDEDED",
    width: "100%",
    padding: 10
  },
  topBarIconView: {
    flex: 1
  },
  topBarIconViewSmall: {
    flex: 0.7
  },
  topBarIcons: {
    height: undefined,
    width: undefined,
    aspectRatio: 1
  },
  dateView: {
    flex: 1,
    flexDirection: "column",
    marginTop: "25%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  dateFont: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
    paddingTop: "2%"
  },
  orderNoView: {
    flex: 1,
    marginTop: "25%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  orderNoFont: {
    alignContent: "center",
    textAlign: "center",
    paddingTop: "5%",
    color: "#0e94c3"
  },
  trackingNoView: {
    flex: 1,
    flexDirection: "row",
    marginTop: "27%",
    marginLeft: "8%",
    marginRight: "8%",
    marginBottom: "9%"
  },
  trackingNoTextView: {
    paddingTop: "6%",
    marginBottom: "21%",
    flex: 5
  },
  trackingNoFont: {
    fontSize: 15,
    textAlign: "center",
    color: "#0e94c3"
  },
  trackingNoBtnView: {
    flex: 1,
    marginBottom: "21%"
  },
  trackingNoBtn: {
    flex: 1,
    marginBottom: "95%"
  },
  quantityView: {
    flex: 1,
    marginTop: "23%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  quantityFont: {
    // fontSize: 90,
    textAlign: "center",
    color: "white"
  },
  scrollView: {
    flex: 8.2,
    width: "100%",
    paddingLeft: 10
  },
  itemView: {
    flexGrow: 1
  },
  bottomBar: {
    flex: 0.8,
    flexDirection: "row",
    backgroundColor: "#EDEDED",
    width: "100%"
  },
  holdBtnView: {
    flex: 1,
    padding: "0.3%",
    paddingLeft: "1%"
  },
  completeBtnView: {
    flex: 1,
    padding: "0.3%",
    paddingRight: "1%"
  },
  bottomButton: {
    flex: 1,
    height: undefined,
    width: undefined,
    alignSelf: "stretch"
  },
  scrollDown: {
    flex: 6,
    width: undefined,
    height: "100%",
    aspectRatio: 1
  },
  scrollDownView: {
    flex: 1,
    paddingLeft: "47%",
    paddingRight: "47%",
    paddingTop: "0.5%",
    marginBottom: "93%"
  },
  touchableOpacity: {
    flex: 1,
    alignItems: "center"
  }
});
