import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';

const OnBoardResults = ({resultList}) => {
  /// Comman space view
  const normalSpaceView = () => {
    return <View style={{height: 8}} />;
  };

  /// Single item view which contains all other view.
  const singleOnBoardItem = (item, index) => {
    return (
      <Card
        key={index}
        elevation={3}
        style={styles.baseCardStyle}
        onPress={() => {
          console.log('On board Item pressed..');
        }}
      >
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{
              uri: item.headerData.mainMenuIconUri,
              height: 120,
              width: 120,
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
    return singleItem.categories != undefined &&
      singleItem.categories != null &&
      singleItem.categories.length != 0 ? (
      <View style={styles.tagsRootView}>
        {singleItem.categories.map((category, index) => {
          return (
            <View key={index} style={styles.categoryDecoration}>
              <Text>{category}</Text>
            </View>
          );
        })}
      </View>
    ) : null;
  };

  /// Details layout will have all the vertical text details for the single item.
  const detailsLayout = (singleItem) => {
    console.log('Categories --> ', singleItem.categories);
    return (
      <View style={{flexDirection: 'column'}}>
        {tagsLayout(singleItem)}
        {normalSpaceView()}
        <Text>{singleItem.headerData.address}</Text>
        {normalSpaceView()}
        <Text>{singleItem.headerData.mainMenuTitle}</Text>
        {normalSpaceView()}
        <Text>{singleItem.headerData.phoneNumber}</Text>
      </View>
    );
  };

  if (resultList == null || resultList.length == 0) {
    return (
      <View style={styles.noResultsStyle}>
        <Text>No onboard results.</Text>
      </View>
    );
  }

  return resultList.map((singleMap, index) => {
    return singleOnBoardItem(singleMap, index);
  });
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
  tagsRootView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingEnd: 80,
  },
  categoryDecoration: {
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
  },
});

export default OnBoardResults;
