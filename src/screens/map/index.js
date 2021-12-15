import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native'
import moment from "moment";
import { tokenMapBox } from "../../token";
import RNLocation from 'react-native-location';
import MapboxGL from '@react-native-mapbox-gl/maps';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

MapboxGL.setAccessToken(tokenMapBox);

export default function Map({ navigation }) {

  var [map, setMap] = useState()
  const [userLocation, setUserLocation] = useState([0, 0])
  const [oldUserLocation, setOldUserLocation] = useState([0, 0])
  var [track, setTrack] = useState({
    type: 'FeatureCollection',
    features: []
  })
  var [line, setLine] = useState({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    }
  })
  const [statusButton, setStatusButton] = useState(false)

  const onStart = () => {
    ReactNativeForegroundService.add_task(saveRoute, {
      delay: 1000,
      onLoop: true,
      taskId: "taskid",
      onError: (e) => console.log(`Error logging:`, e),
    });
    ReactNativeForegroundService.start({
      id: 144,
      title: "Background Location",
      message: "We are walking",
      icon: 'ic_launcher_round'
    });
  }

  const onStop = () => {
    // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
    if (ReactNativeForegroundService.is_task_running('taskid')) {
      ReactNativeForegroundService.remove_task('taskid');
    }
    // Stoping Foreground service.
    return ReactNativeForegroundService.stop();
  };

  function saveRoute() {
    console.log(oldUserLocation, userLocation)
    if (oldUserLocation[0] != userLocation[0] || oldUserLocation[1] != userLocation[1]) {
      console.log('andou')
      track.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: userLocation,
        },
        properties: {
          moment: moment().format('DD MM YYYY , h:mm:ss')
        }
      })
      setTrack(track)
      line.geometry.coordinates.push(userLocation)
      setLine(line)
      setOldUserLocation(userLocation)
    }
  }

  async function permission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('garanted permission 1')
      } else {
        console.log('negaded permission 1')
      }

      const coarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      )
      if (coarse === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted permission 3')
      } else {
        console.log('negaded permission 3')
      }

      const backgroundgranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      )
      console.log(backgroundgranted)
      if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted permission 2')
      } else {
        console.log('negaded permission 2')
      }
    } catch (e) {
      console.log('error ' + e)
    }
  }

  useEffect(() => {
    permission()

    RNLocation.configure({
      distanceFilter: 50, // Meters
      desiredAccuracy: {
        ios: 'best',
        android: 'highAccuracy',
      },
      // Android only
      androidProvider: 'auto',
      interval: 1000, // Milliseconds
      fastestInterval: 5000, // Milliseconds
      maxWaitTime: 1000, // Milliseconds
      // iOS Only
      activityType: 'other',
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: 'portrait',
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });
    let locationSubscription = null;
    let locationTimeout = null;

    ReactNativeForegroundService.add_task(
      () => {
        RNLocation.requestPermission({
          ios: 'whenInUse',
          android: {
            detail: 'fine',
          },
        }).then((granted) => {
          //console.log('Location Permissions: ', granted);
          // if has permissions try to obtain location with RN location
          if (granted) {
            locationSubscription && locationSubscription();
            locationSubscription = RNLocation.subscribeToLocationUpdates(
              ([locations]) => {
                locationSubscription();
                locationTimeout && clearTimeout(locationTimeout);
                console.log('5', [locations.longitude, locations.latitude]);
                setUserLocation([locations.longitude, locations.latitude])
              },
            );
          } else {
            locationSubscription && locationSubscription();
            locationTimeout && clearTimeout(locationTimeout);
            console.log('no permissions to obtain location');
          }
        });
      },
      {
        delay: 1000,
        onLoop: true,
        taskId: 'taskid',
        onError: (e) => console.log('Error logging:', e),
      },
    );
  }, [])

  useEffect(() => {
    saveRoute()
  }, [userLocation])

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={r => { map = r, setMap(map) }}
        style={styles.map}
        compassViewPosition={3}
        styleURL={MapboxGL.StyleURL.TrafficNight}
      >
        <MapboxGL.Camera
          centerCoordinate={oldUserLocation}
          zoomLevel={15}
        />
        <MapboxGL.UserLocation
          renderMode={'normal'}
          showsUserHeadingIndicator={true}
          androidRenderMode={true}
          onUpdate={location => setUserLocation([location.coords.longitude, location.coords.latitude])}
        />
        <MapboxGL.ShapeSource id={'shapeLine'} shape={line}>
          <MapboxGL.LineLayer id={'layerLine'} style={{ lineColor: '#f00', lineWidth: 3 }} />
        </MapboxGL.ShapeSource>

      </MapboxGL.MapView>
      <View style={styles.head}>
        <Text style={styles.textInfo}>Testting background save user's router</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {
        statusButton ? onStop() : onStart()
        setStatusButton(!statusButton)
      }}>
        <Text style={styles.textButton}>{statusButton ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(20,20,200,1)',
    padding: 5,
    justifyContent: 'center',
    flex: 1
  },
  button: {
    position: 'absolute',
    backgroundColor: 'rgba(12,233,20,0.75)',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 40,
    alignSelf: 'center',
    bottom: 15
  },
  textButton: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  head: {
    position: 'absolute',
    alignSelf: 'center',
    top: 15
  },
  textInfo: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    margin: 5,
    fontWeight: '500',
  },
  map: {
    flex: 1
  },
})
