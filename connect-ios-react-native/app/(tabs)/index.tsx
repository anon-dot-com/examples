import AnonKit, { AnonKitEnvironment } from "@anon/sdk-react-native";
import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";

export default function MyScreen() {
  const [showAnon, setShowAnon] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {showAnon ? (
        <AnonKit
          appName="instagram"
          style={styles.container}
          onDismiss={() => setShowAnon(false)}
          ui={{
            theme: "light",
            // todo: fill out
            orgName: "YourCompany",
            // todo: fill out
            orgIconUrl: "https://example.com/logo.png",
            showAnonLogo: true,
            showPrivacyPolicy: true,
          }}
          config={{
            environment: AnonKitEnvironment.sandbox,
            // todo: grab from env.ANON_SDKCLIENT_ID
            clientId: "XXXX-XXXX-XXXX-XXXX-XXXX",
            // todo: grab from env.ANON_APP_USER_ID_TOKEN
            appUserIdToken: "ey************",
          }}
        />
      ) : (
        <View style={[styles.container, styles.center]}>
          <Button title="Show Anon" onPress={() => setShowAnon(true)} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
