import GetLocation from 'react-native-get-location';
import {
    Alert,
    AppState,
    Linking,
    Platform,
} from 'react-native';
import {
    requestMultiple,
    PERMISSIONS,
    request
} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export class Locations {
    static isAlertDisplayed = false;
    static lastPermission = false;
    static appName = 'Location';
    static permissionRequired = 'App requires location tracking permission.';
    static permissionRequiredBackground = 'App requires location tracking permission in background. Turn on Always for Location Services in your device settings.';
    static permissionRequiredSettings = 'App requires location tracking permission. Turn on Always for Location Services in your device settings.';
    static permissionRequiredAppSettings = `App requires location permission. Go to Settings > Privacy > Location Services > Enable Location Services & Enable access to ${this.appName}.`;

    static requestLocationPermission = (locationEnabled) => {
        if (Platform.OS === 'android') {
            requestMultiple([
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ]).then((statuses) => {
                console.log("Status --> ", statuses);
                if (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted') {
                    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                            interval: 10000,
                            fastInterval: 5000,
                        })
                        .then(() => {
                            locationEnabled(true);
                        })
                        .catch(() => {
                            locationEnabled(false);
                        });
                } else {
                    if (AppState.currentState !== 'background') {
                        Alert.alert(
                            this.appName,
                            this.permissionRequired,
                            [{
                                text: 'OK',
                                onPress: () => {
                                    locationEnabled(false);
                                },
                                style: 'cancel',
                            }, ],
                        );
                    } else {
                        locationEnabled(false);
                    }
                }
            }).catch((error) => {
                console.log("Error --> ", error);
            });
        } else {
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
                if (result === 'granted') {
                    if (AppState.currentState !== 'background') {
                        Alert.alert(
                            this.appName,
                            this.permissionRequiredBackground,
                            [{
                                    text: 'Settings',
                                    onPress: () => {
                                        Linking.openSettings();
                                        Locations.isAlertDisplayed = true;
                                        locationEnabled(true);
                                    },
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        Locations.isAlertDisplayed = true;
                                        locationEnabled(true);
                                    },
                                    style: 'cancel',
                                },
                            ],
                        );
                    } else {
                        locationEnabled(true);
                    }
                } else if (result === 'denied') {
                    if (AppState.currentState !== 'background') {
                        Alert.alert(
                            this.appName,
                            this.permissionRequiredSettings,
                            [{
                                    text: 'Settings',
                                    onPress: () => {
                                        Linking.openSettings();
                                        Locations.isAlertDisplayed = true;
                                        locationEnabled(false);
                                    },
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        Locations.isAlertDisplayed = true;
                                        locationEnabled(false);
                                    },
                                    style: 'cancel',
                                },
                            ],
                        );
                    } else {
                        locationEnabled(false);
                    }
                } else if (result === 'unavailable') {
                    if (AppState.currentState !== 'background') {
                        Alert.alert(
                            this.appName,
                            this.permissionRequiredAppSettings,
                            [{
                                text: 'OK',
                                onPress: () => {
                                    Locations.isAlertDisplayed = true;
                                    locationEnabled(false);
                                },
                            }, ],
                        );
                    } else {
                        locationEnabled(false);
                    }
                }
            });
        }
    }

    static getLocation = (callbackPosition) => {
        GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
            .then((location) => {
                callbackPosition({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    altitude: location.altitude,
                    accuracy: location.accuracy,
                    altitudeAccuracy: 0,
                    heading: location.bearing,
                    speed: location.speed,
                    mocked: false //FIXME
                });
            })
            .catch((error) => {
                callbackPosition(undefined);
            });
    };
}