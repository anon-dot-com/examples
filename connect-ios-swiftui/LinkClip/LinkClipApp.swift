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
                        print("Launched via userActivity: \(userActivity.debugDescription)")
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
    
    private func loadTLSWorkaround() {
//        AnonClient.session.delegate = TLSDelegate()
//        -URLSession:didReceiveChallenge:completionHandler: delegate method. To customize HTTPS server trust evaluation, look for a challenge whose protection space has an authentication method of NSURLAuthenticationMethodServerTrust. For those challenges, resolve them as described below. For other challenges, the ones that you don't care about, call the completion handler block with the NSURLSessionAuthChallengePerformDefaultHandling disposition and a NULL credential.
//
//        When dealing with the NSURLAuthenticationMethodServerTrust authentication challenge, you can get the trust object from the challenge's protection space by calling the -serverTrust method. After using the trust object to do your own custom HTTPS server trust evaluation, you must resolve the challenge in one of two ways:
//
//        If you want to deny the connection, call the completion handler block with the NSURLSessionAuthChallengeCancelAuthenticationChallenge disposition and a NULL credential.
//        If you want to allow the connection, create a credential from your trust object (using +[NSURLCredential credentialForTrust:]) and call the completion handler block with that credential and the NSURLSessionAuthChallengeUseCredential disposition.
    }
}
