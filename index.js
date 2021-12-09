import {AppRegistry} from 'react-native';
import App from './src/index';
import {name as appName} from './app.json';

// Add 
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

ReactNativeForegroundService.register();
// Add end

AppRegistry.registerComponent(appName, () => App);
