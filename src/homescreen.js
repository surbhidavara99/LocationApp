import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  Text,
  Button,
} from 'react-native';
import {Card} from 'react-native-paper';
import {Locations} from '../utils/locations';
import Icon from 'react-native-vector-icons/Entypo';
import Slider from '@react-native-community/slider';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OnBoardResults from './onboardresults';
import NearByResults from './nearbyresults';

const Homescreem = () => {
  const FETCH_URL =
    'https://us-central1-vmallapp.cloudfunctions.net/findRelevantStores';
  let [getLatLng, setLatLng] = useState({lat: 0.0, lng: 0});
  let [showAddressView, setAddressView] = useState(false);
  let [address, setAddress] = useState('');
  let [radius, setRadius] = useState(3000);
  let [keyword, setKeyword] = useState('');
  let [onBoardList, setOnBoardList] = useState([]);
  let [nearByList, setNearByList] = useState([]);
  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    getLocation();
  }, []);

  /// Fetch data function will call api and response data will be set in the respective tabs
  const fetchData = async (dataMap) => {
    try {
      let response = fetch(FETCH_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: dataMap,
        }),
      });
      let json = await (await response).json();
      if (json['result'] != null && json['result']['nearByResult'] != null) {
        setNearByList(json['result']['nearByResult']);
      }
      if (json['result'] != null && json['result']['onboardedStores'] != null) {
        setOnBoardList(json['result']['onboardedStores']);
      }
    } catch (error) {
      console.log('Error ==> ', error);
    }
  };

  /// This function will fetch the current location of the user and call the api after the user's location is fetched.
  const getLocation = () => {
    Locations.requestLocationPermission((isGranted) => {
      if (isGranted) {
        Locations.getLocation((pos) => {
          if (pos != undefined) {
            setLatLng({lat: pos.latitude, lng: pos.longitude});
            setTimeout(() => {
              var dataMap = {
                lat: pos.latitude,
                lng: pos.longitude,
                radius: radius,
                address: address,
                keyword: keyword,
              };

              fetchData(dataMap);
            }, 1000);
          }
        });
      } else {
        setLatLng({lat: 0.0, lng: 0.0});
      }
    });
  };

  /// Comman space view
  const normalSpaceView = () => {
    return <View style={{height: 10}} />;
  };

  /// Conponent for the address icon view. This will toggle the advance options.
  const addressIconView = () => {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={onAddressIconClick}
      >
        <Icon name="address" color="black" size={21} style={styles.iconStyle} />
      </TouchableHighlight>
    );
  };

  /// Function for the clickevent of the address icon
  function onAddressIconClick() {
    setAddressView(!showAddressView);
  }

  /// The right most icon of the search bar
  const rightIconView = () => {
    return (
      <TouchableHighlight onPress={() => {}}>
        <Icon
          name="dots-three-vertical"
          color="black"
          size={21}
          style={styles.iconStyle}
        />
      </TouchableHighlight>
    );
  };

  /// The ui for the advance options.
  const extraOptionsView = () => {
    return (
      <Card elevation={3} style={styles.extraOptionCardStyle}>
        {normalSpaceView()}
        <View style={styles.singleBarViewStyle}>
          <TextInput
            style={styles.dropDownTextInput}
            value={address}
            onChangeText={(value) => {
              setAddress(value);
            }}
            placeholder="Search Address"
          />
        </View>
        {normalSpaceView()}
        <Text style={styles.radiusTextView}>Radius</Text>
        {normalSpaceView()}
        <Slider
          style={styles.sliderView}
          minimumValue={0}
          maximumValue={50000}
          value={radius}
          onValueChange={(value) => {
            setRadius(parseInt(value));
          }}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        />
        <View style={styles.sliderBottomView}>
          <Text style={styles.radiusTextView}>0</Text>
          <View style={{flex: 1}} />
          <Text style={styles.radiusTextView}>50000</Text>
        </View>
        <View style={styles.buttonView}>
          <Button
            title="Search"
            onPress={() => {
              setAddressView(false);
              if (address != '') {
                setLatLng({lat: 0.0, lng: 0.0});
                setTimeout(() => {
                  var dataMap = {
                    lat: 0.0,
                    lng: 0.0,
                    radius: radius,
                    address: address,
                    keyword: keyword,
                  };
                  fetchData(dataMap);
                }, 1000);
              } else {
                getLocation();
              }
            }}
          />
        </View>
      </Card>
    );
  };

  return (
    <NavigationContainer independent={true}>
      <View style={styles.rootStyle}>
        <Card elevation={3} style={styles.singleBarCardStyle}>
          <View style={styles.singleBarViewStyle}>
            <TextInput
              style={styles.textInputStyle}
              onChangeText={(value) => {
                setKeyword(value);
              }}
              onSubmitEditing={() => {
                var dataMap = {
                  lat: getLatLng.lat,
                  lng: getLatLng.lng,
                  radius: radius,
                  address: address,
                  keyword: keyword,
                };
                fetchData(dataMap);
              }}
              placeholder="Search Keyword"
            />
            {addressIconView()}
            {rightIconView()}
          </View>
        </Card>
        {showAddressView ? extraOptionsView() : null}
      </View>
      <Tab.Navigator>
        <Tab.Screen
          name="On Board"
          children={() => <OnBoardResults resultList={onBoardList} />}
        />
        <Tab.Screen
          name="Near by"
          children={() => <NearByResults resultList={nearByList} />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  rootStyle: {
    backgroundColor: '#f5f7f6',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  singleBarViewStyle: {
    backgroundColor: 'white',
    height: 50,
    width: '98%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  singleBarCardStyle: {
    height: 50,
    width: '100%',
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    marginStart: 8,
  },
  extraOptionCardStyle: {
    width: '100%',
    marginTop: 1,
    paddingHorizontal: 10,
  },
  dropDownTextInput: {
    flex: 1,
    fontSize: 16,
    marginStart: 8,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  iconStyle: {
    marginHorizontal: 8,
  },
  radiusTextView: {
    paddingLeft: 10,
  },
  sliderView: {
    width: 350,
    height: 40,
  },
  sliderBottomView: {
    flexDirection: 'row',
    marginBottom: 15,
    width: 350,
  },
  buttonView: {
    width: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default Homescreem;
