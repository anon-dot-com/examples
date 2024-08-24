//
//  connect_ios_swiftuiApp.swift
//  connect-ios-swiftui
//
//  Created by Haoyu Yun on 6/21/24.
//

import SwiftUI
import AnonKit

@main
struct AnonApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(appName: .constant(""))
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: { userActivity in
                    if userActivity.activityType == NSUserActivityTypeBrowsingWeb {
                        print("Launched via userActivity BrowsingWeb - URL: \(userActivity.webpageURL?.absoluteString ?? "missing")")
                    }
                })
                .onAppear(perform: {
                    /// Disable animations under test
                    if ProcessInfo.isUITestEnvironment {
                        CATransaction.setDisableActions(true)
                        CATransaction.setAnimationDuration(CFTimeInterval(0))
                        UIApplication.shared.keyWindow?.layer.speed = 1000.0
                        UserDefaults.standard.set(-1, forKey: "com.apple.xctest.iOSMaximumTypingFrequency")
                    }
                })
        }
    }
    
    init() {
        loadRocketSimConnect()
    }
    
    private func loadRocketSimConnect() {
#if DEBUG && targetEnvironment(simulator)
        guard (Bundle(path: "/Applications/RocketSim.app/Contents/Frameworks/RocketSimConnectLinker.nocache.framework")?.load() == true) else {
            print("Failed to load linker framework")
            return
        }
        print("RocketSim Connect successfully linked")
#endif
    }

}
