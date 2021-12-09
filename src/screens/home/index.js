import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text
} from 'react-native'

export default function Home({navigation}) {

  useEffect(() => {
  },[])

  return(
    <View style={styles.container}>
      <Text style={styles.text}>App for test backround activity onreact native</Text>
      <View style={styles.button}>
        <Button onPress={() => navigation.navigate('Basic')} title='Basic'/>
      </View>
      <View style={styles.button}>
        <Button onPress={() => navigation.navigate('Map')} title='Map'/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(200,20,20,1)',
    padding: 50,
    justifyContent: 'center',
    flex: 1
  },
  button: {
    marginVertical: 10
  },
  text: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '600'
  }
})
