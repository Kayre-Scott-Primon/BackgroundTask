import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text
} from 'react-native'
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

export default function App() {

  useEffect(() => {
  },[])

  const onStart = () => {
    ReactNativeForegroundService.add_task(() => task(), {
    delay: 1000,
    onLoop: true,
    taskId: "taskid",
    onError: (e) => console.log(`Error logging:`, e),
  });
    ReactNativeForegroundService.start({
      id: 144,
      title: "Name App",
      message: "I am trying",
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

  const task = () => {
    console.log('Estou vivo!')
    //setTimeout(() => {console.log('delay')}, 2000)
  }

  return(
    <View style={styles.container}>
      <Text style={styles.text}>App for test backround activity onreact native</Text>
      <View style={styles.button}>
        <Button onPress={onStart} title='Start'/>
      </View>
      <View style={styles.button}>
        <Button onPress={onStop} title='Stop'/>
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
