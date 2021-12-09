first:
in line comand:
    npm i @supersami/rn-foreground-service

in code files:

    ./android/app/src/main/AndroidManifest.xml

    inside tag manifest:
        <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />

    inside tag application: 
        <meta-data
        android:name="com.supersami.foregroundservice.notification_channel_name"
        android:value="Sticky Title"
        />
        <meta-data
        android:name="com.supersami.foregroundservice.notification_channel_description"
        android:value="Sticky Description."
        />
        <meta-data
        android:name="com.supersami.foregroundservice.notification_color"
        android:resource="@color/blue"
        />
        <service android:name="com.supersami.foregroundservice.ForegroundService"></service>
        <service android:name="com.supersami.foregroundservice.ForegroundServiceTask"></service>

    ./android/app/src/main/java/com/backgroundlocaction/MainActivity.java

        out class MainActivity:
            import android.content.Intent;
            import android.util.Log;
            import com.facebook.react.bridge.WritableMap;
            import com.facebook.react.bridge.Arguments;
            import com.facebook.react.modules.core.DeviceEventManagerModule;

        inside class MainActivity: 
            public boolean isOnNewIntent = false;

            @Override
            public void onNewIntent(Intent intent) {
                super.onNewIntent(intent);
                isOnNewIntent = true;
                ForegroundEmitter();
            }

            @Override
            protected void onStart() {
                super.onStart();
                if(isOnNewIntent == true){}else {
                    ForegroundEmitter();
                }
            }

            public  void  ForegroundEmitter(){
                // this method is to send back data from java to javascript so one can easily
                // know which button from notification or the notification button is clicked
                String  main = getIntent().getStringExtra("mainOnPress");
                String  btn = getIntent().getStringExtra("buttonOnPress");
                WritableMap  map = Arguments.createMap();
                if (main != null) {
                    map.putString("main", main);
                }
                if (btn != null) {
                    map.putString("button", btn);
                }
                try {
                    getReactInstanceManager().getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("notificationClickHandle", map);
                } catch (Exception  e) {
                Log.e("SuperLog", "Caught Exception: " + e.getMessage());
                }
            }
        
    created android/app/src/main/res/values/colors.xml:

        <resources>
            <item  name="blue"  type="color">#00C4D1
            </item>
            <integer-array  name="androidcolors">
            <item>@color/blue</item>
            </integer-array>
        </resources>

    ./index.js

        import ReactNativeForegroundService from "@supersami/rn-foreground-service";

        ReactNativeForegroundService.register();

    inside you want to run backgroundTask:

        import lib: 
            import ReactNativeForegroundService from "@supersami/rn-foreground-service";        

        to facility, created two functions, for start end stop your background task:

            const onStart = () => {
                ReactNativeForegroundService.add_task(() => console.log("I am Being Tested"), {
                delay: 100,
                onLoop: true,
                taskId: "taskid",
                onError: (e) => console.log(`Error logging:`, e),
            });
                ReactNativeForegroundService.start({
                id: 144,
                title: "Foreground Service",
                message: "you are online!",
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

        For altered the action that will run in second plane, you need to change the first argument the function 'ReactNativeForegroundService.add_task' inside 'onStart()'




