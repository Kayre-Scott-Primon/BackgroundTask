import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image
} from 'react-native'

export default function Splash({navigation}) {


    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Home')
        },1200)
    },[])
  

  return(
    <View style={styles.container}>
      <Image source={require('../../assets/overlap.png')} style={styles.image}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(90,0,90,1)',
    padding: 50,
    justifyContent: 'center',
    flex: 1
  },
  image: {
    alignSelf: 'center',
    height: '45%',
    width: '100%'
  }
})
