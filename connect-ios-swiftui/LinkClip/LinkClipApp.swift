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
    @State private var appName: String?
    var body: some Scene {
        WindowGroup {
            ContentView(appName: self.$appName)
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: { userActivity in
                    if userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL {
                        let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
                        self.appName = components?.queryItems?.first(where: { $0.name == "id"})?.value ?? "missing"
                        print("Launched via userActivity BrowsingWeb - URL: \(userActivity.webpageURL?.absoluteString ?? "missing") - App Name: \(String(describing: self.appName))")
                    }
                })
        }    }
    
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
