import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  Image
} from "react-native";

export default class OrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = { item: props.item };
    this.height = props.height;
    this.metaFontSize = props.metaFontSize;
    this.resizeMode = props.resizeMode;
  }

  onPressNoItem = () => {
    const YN = {
      'Y': 'N',
      'N': 'Y'
    }

    const item = this.state.item;
    item.NO_ITEM_YN = YN[item.NO_ITEM_YN];
    this.setState({ item: item });
  }

  onPressTagChange = () => {
    const YN = {
      'Y': 'N',
      'N': 'Y'
    }

    const item = this.state.item;
    item.TAG_CHANGE_YN = YN[item.TAG_CHANGE_YN];
    this.setState({ item: item });
  }

  render() {
    const item = this.state.item;
    
    const imageUri = {
      'NO_ITEM': {
        'N': require('./images/no_item_unchecked.png'),
        'Y': require('./images/no_item_checked.png')
      },
      'TAG_CHANGE': {
        'N': require('./images/tag_change_unchecked.png'),
        'Y': require('./images/tag_change_checked.png')
      }
    }

    return (
      <View style={[styles.container, {height: this.height}]}>
        <ImageBackground
          source={ require("./images/product_info.png") }
          style={ styles.productInfoView }
          imageStyle={{ resizeMode: this.resizeMode }}
        >
          <View style={[{flex: 1, flexDirection: 'column'}]}>
            <View style={[{flex: 1}]}></View>
            <View style={[{flex: 15, flexDirection: 'row'}]}>
              <View style={[{flex: 1.5}]}></View>
              <View style={[styles.productImageView]}>
                <Image
                  style={styles.productImage}
                  resizeMode={this.resizeMode}
                  source={{ uri: item.IMAGE_PATH }}
                />
              </View>
              <View style={[{flex: 1}]}></View>
            </View>
            <View style={[{flex: 1}]}></View>
          </View>
          <View style={[styles.productMetaView, {flex: 2, flexDirection: 'row'}]}>
            <View style={[{flex: 5.5}]}></View>
            <View style={[{flex: 25, flexDirection: 'column'}]}>
              <View style={[{flex: 1.8}]}></View>
              <View style={[{flex: 2.7, justifyContent: 'center'}]}>
                <Text style={[styles.productMetaFont, {fontSize: this.metaFontSize}]}>{item.LISTING_SKU}</Text>
              </View>
              <View style={[{flex: 1}]}></View>
              <View style={[{flex: 3.1}, {justifyContent: 'center'}]}>
                <Text style={[styles.productMetaFont, {fontSize: this.metaFontSize}]}>{item.BRAND_NAME}</Text>
              </View>
              <View style={[{flex: 0.8}]}></View>
              <View style={[{flex: 6.8}]}>
                <Text style={[styles.productMetaFont, {fontSize: this.metaFontSize}]}>{item.LISTING_PRODUCT_NAME}</Text>
              </View>
              <View style={[{flex: 0.8}]}></View>
              <View style={[{flex: 3.2, flexDirection: 'row'}]}>
                <View style={[{flex: 6, justifyContent: 'center'}]}>
                  <Text style={[styles.productMetaFont, {fontSize: this.metaFontSize}]}>{item.PRODUCT_SIZE}</Text>
                </View>
                <View style={[{flex: 0.8}]}></View>
                <View style={[{flex: 11.2, justifyContent: 'center'}]}>
                  <Text style={[styles.productMetaFont, {fontSize: this.metaFontSize}]}>{item.PRODUCT_COLOR}</Text>
                </View>
              </View>
              <View style={[{flex: 1.8}]}></View>
            </View>
            <View style={[{flex: 1}]}></View>
          </View>
        </ImageBackground>
        <ImageBackground
          source={require("./images/qty_box.png")}
          style={styles.productQtyView}
          imageStyle={{ resizeMode: this.resizeMode }}
        >
          <View style={[{flex: 1}]}></View>
          <View style={[{flex: 8}]}>
            <View style={[{flex: 2, flexDirection: 'row'}]}>
              <View style={[{flex: 4.5}]}></View>
              <View style={[{flex: 4, justifyContent: 'center'}]}>
                <Text style={[styles.productMetaFont, styles.qtyFont, {fontSize: this.metaFontSize+15}]}>{item.UNIT_QTY}</Text>
              </View>
              <View style={[{flex: 1.5}]}></View>
            </View>
            <View style={[{flex: 7}]}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={this.onPressNoItem}>
                  <Image style={styles.checkImage}
                    resizeMode={this.resizeMode}
                    source={imageUri['NO_ITEM'][item['NO_ITEM_YN']]}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={this.onPressTagChange}>
                  <Image style={styles.checkImage}
                    resizeMode={this.resizeMode}
                    source={imageUri['TAG_CHANGE'][item['TAG_CHANGE_YN']]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[{flex: 1}]}></View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 390,
    // overflow: 'hidden',
    // flex: 1,
    flexDirection: "row",
  },
  productInfoView: {
    flex: 2.88,
    flexDirection: "row"
  },
  productImageView: {
    // flex: 0.95,
    flex: 15,
    flexDirection: 'column',
    // margin: '1.5%',
    // alignItems: 'center',
    // justifyContent: "center",
    // overflow: 'hidden',
    borderRadius: 10
  },
  productMetaView: {
    flex: 2,
    flexDirection: 'column',
    // padding: '2%',
    // paddingLeft: '15%',
    // overflow: 'hidden',
    // marginBottom: '2%'
  },
  productMetaFont: {
    fontSize: 35,
    color: '#888888'
  },
  skuView: {
    flex: 1,
    // margin: '2%',
    // paddingTop: '1%',
    // marginBottom: 0
  },
  brandView: {
    flex: 1,
    // margin: '2%',
    // marginTop: 0,
    // marginBottom: 0,
    // paddingTop: '1%',
  },
  nameView: {
    flex: 2,
    // margin: '2%',
    // marginTop: 0,
    // marginBottom: 0
  },
  sizeColorView: {
    flex: 1,
    flexDirection: 'row',
    // margin: '2%'
  },
  sizeView: {
    flex: 3,
    // paddingTop: '1%'
  },
  colorView: {
    flex: 5,
    // paddingTop: '1%',
    // paddingLeft: '2%'
  },
  productQtyView: {
    flex: 1,
    flexDirection: 'column'
    // padding: '2%'
  },
  qtyView: {
    flex: 2,
    // marginLeft: '45%',
    // marginTop: '4%',
    // marginRight: '10%'
  },
  qtyFont: {
    fontSize: 55,
    alignContent: 'center',
    textAlign: 'center'
  },
  productImage: {
    flex: 1,
    flexDirection: 'column',
    height: undefined,
    width: undefined,
    // alignSelf: 'stretch',
    // marginTop: '1%',
    // marginBottom: '8%'
  },
  checkImage: {
    flex: 1,
    flexDirection: 'column',
    height: undefined,
    width: undefined,
    // alignSelf: 'stretch'
  }
});
