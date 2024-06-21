//
//  ContentView.swift
//  connect-ios-swiftui
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

struct ContentView: View {
    @State private var isPresenting = false // State to manage SDK presentation

    // Configuration for Anon SDK
    let anonConfig = AnonKit.Config(
        // Change to the appropriate environment as needed.
        environment: .sandbox,
        // The uuid of your SdkClient /associated with your UserPool/
        // ie the one which returned   "auth": { "type": "userPool", "userPoolId": "..." }
        clientId: "your-client-id-here",
        // Your application user ID token, eg the JWT
        // May be Anon-provided as the `example_app_user_id_token` from 1pass
        appUserIdToken: "your-jwt-id-token-here"
    )

    var body: some View {
        NavigationView {
            VStack {
                Image(systemName: "message") // Placeholder for app content
                    .imageScale(.large)
                    .foregroundColor(.blue)
                Text("Welcome to my app, tap to proceed!")
            }
            .padding()
            .onTapGesture {
                isPresenting.toggle() // Toggle presentation state
            }
        }
        .fullScreenCover(isPresented: $isPresenting, onDismiss: didDismiss) {
            // Present Anon SDK UI
            AnonUIView(
                // Example app identifier
                app: "grubdash",
                config: anonConfig,
                ui: AnonKit.UIConfig(
                    organizationName: "My Company",
                    // Your organization's icon URL
                    organizationIconUrl: URL(string: "https://example.com/org-logo.png"),
                    // Theme selection
                    theme: .dark
                )
            )
        }
    }

    func didDismiss() {
        // Handle the dismissing action here.
        print("SDK was dismissed")
    }
}


#Preview {
    ContentView()
}
