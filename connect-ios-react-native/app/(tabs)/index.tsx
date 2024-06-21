import AnonKit, { AnonKitEnvironment } from "@anon/sdk-react-native";
import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";

export default function MyScreen() {
  const [showAnon, setShowAnon] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {showAnon ? (
        <AnonKit
          appName="resy"
          style={styles.container}
          onDismiss={() => setShowAnon(false)}
          ui={{
            theme: "light",
            orgName: "Your Company",
            orgIconUrl: "https://example.com/logo.png",
            showAnonLogo: true,
            showPrivacyPolicy: true,
          }}
          config={{
            environment: AnonKitEnvironment.local,
            clientId: "XXXX-XXXX-XXXX-XXXX-XXXX",
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
