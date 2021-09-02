import React, {useState} from 'react';
import {TouchableHighlight, View} from 'react-native';

const CommonText = ({navigation}) => {
  var [testVar, setTestVar] = useState(0);
  return (
    <View>
      <TouchableHighlight
        onPress={() => {
          navigation.navigate('Details');
        }}
      >
        <Text>Test text {testVar}</Text>
      </TouchableHighlight>
    </View>
  );
};

export default CommonText;
