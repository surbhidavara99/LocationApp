import React from 'react';
import {Text, View, StyleSheet, Image, ScrollView} from 'react-native';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';

const NearByResults = ({resultList}) => {
  /// Comman space view
  const normalSpaceView = () => {
    return <View style={{height: 8}} />;
  };

  /// Single item view which contains all other view.
  const singleNearByItem = (item, index) => {
    return (
      <Card
        key={index}
        elevation={3}
        style={styles.baseCardStyle}
        onPress={() => {
          console.log('ITem pressed..');
        }}
      >
        <View style={styles.cardRootView}>
          <Image
            source={{
              uri: item.icon,
              height: 80,
              width: 80,
            }}
          />
          <View style={{width: 10}} />
          {detailsLayout(item)}
        </View>
      </Card>
    );
  };

  /// Tags layout showed in the single card.
  const tagsLayout = (singleItem) => {
    return singleItem.types != undefined &&
      singleItem.types != null &&
      singleItem.types.length != 0 ? (
      <View style={styles.tagsRootView}>
        {singleItem.types.map((type, index) => {
          return (
            <View key={index} style={styles.typeDecoration}>
              <Text>{type}</Text>
            </View>
          );
        })}
      </View>
    ) : null;
  };

  /// Details layout will have all the vertical text details for the single item.
  const detailsLayout = (singleItem) => {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {tagsLayout(singleItem)}
        {normalSpaceView()}
        <Text style={{flex: 1}}>{singleItem.name}</Text>
        {normalSpaceView()}
        <View style={{flexDirection: 'row'}}>
          <Text style={{flexWrap: 'wrap'}}>{singleItem.vicinity}</Text>
        </View>
        {normalSpaceView()}
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>{singleItem.rating}</Text>
          <Icon
            name="star"
            color="#f9d71c"
            size={21}
            style={{marginHorizontal: 8}}
          />
        </View>
      </View>
    );
  };

  if (resultList == null || resultList.length == 0) {
    return (
      <View style={styles.noResultsStyle}>
        <Text>No nearby results.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {resultList.map((singleMap, index) => {
        return singleNearByItem(singleMap, index);
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noResultsStyle: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseCardStyle: {
    marginVertical: 8.0,
    marginHorizontal: 10.0,
    padding: 8.0,
  },
  cardRootView: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  tagsRootView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeDecoration: {
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    margin: 2,
  },
});

export default NearByResults;
