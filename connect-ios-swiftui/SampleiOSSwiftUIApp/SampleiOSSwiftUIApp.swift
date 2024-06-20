//
//  SampleiOSSwiftUIApp.swift
//  SampleiOSSwiftUI
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

let anonConfig = AnonKit.Config(
    environment: .sandbox,
    // please paste in your values
    clientId: "TODO",
    appUserIdToken: "TODO"
)

@main
struct SampleiOSSwiftUIApp: App {
    @UIApplicationDelegateAdaptor private var appDelegate: AppDelegate

    init() {
        registerForNotification()
    }

    func registerForNotification() {
        // For device token and push notifications.
        UIApplication.shared.registerForRemoteNotifications()

        let center : UNUserNotificationCenter = UNUserNotificationCenter.current()
        //        center.delegate = self

        center.requestAuthorization(options: [.sound , .alert , .badge ], completionHandler: { (granted, error) in
            if ((error != nil)) { UIApplication.shared.registerForRemoteNotifications() }
            else {

            }
        })
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate, AnonLinkDelegate {
    func anonClientConfiguration() async -> AnonKit.Config {
        anonConfig
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions:[UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        print("registering for push notifications!")
        UIApplication.shared.registerForRemoteNotifications()
        return true
    }

    func application(didReceiveRemoteNotification: [AnyHashable : Any], fetchCompletionHandler: UIBackgroundFetchResult) -> Void {
        print("got notified")
    }


    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("did register for push")
        Task {
            await registerForPushNotifications(deviceToken: deviceToken)
        }
    }


    func application(_ application: UIApplication,
                     didFailToRegisterForRemoteNotificationsWithError
                     error: Error) {
        // Try again later.
        print("failed to register for push notifications")
    }

    func sendDeviceTokenToServer(data: Data) {
        let tokenString = data.map { String(format: "%02.2hhx", $0) }.joined()
        print("send to server \(tokenString)")
    }
}
