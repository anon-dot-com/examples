//
//  LinkClipApp.swift
//  LinkClip
//
//  Created by Sam Green on 7/10/24.
//

import SwiftUI
import AnonKit
import Foundation

@main
struct LinkClipApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: { userActivity in
                    if userActivity.activityType == NSUserActivityTypeBrowsingWeb {
                        print("Launched via userActivity BrowsingWeb - URL: \(userActivity.webpageURL?.absoluteString ?? "missing")")
                    }
                })
        }
    }
    
    init() {
        loadRocketSimConnect()
    }
    
    private func loadRocketSimConnect() {
        #if DEBUG
        guard (Bundle(path: "/Applications/RocketSim.app/Contents/Frameworks/RocketSimConnectLinker.nocache.framework")?.load() == true) else {
            print("Failed to load linker framework")
            return
        }
        print("RocketSim Connect successfully linked")
        #endif
    }
}
