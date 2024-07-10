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
        clientId: "c424a79f-6415-4779-8384-073583585a92",
        // Your application user ID token, eg the JWT
        // May be Anon-provided as the `example_app_user_id_token` from 1pass
        appUserIdToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5veC03NDQ1NCJ9.eyJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsImVtYWlsIjoibW9sbHkrc2FuZGJveEBoZXlub3guY29tIiwiZXhwIjoxNzIxMzMyMDc4LCJpYXQiOjE3MTg3NDAwNzgsImlzcyI6InVybjpleGFtcGxlOmlzc3VlciIsInN1YiI6IjgyMjcxMjgwLWIyNjQtNGUxOS05Y2NiLTVlN2Q0ZDA1YjhjOCJ9.S7Nb1NZZAdC1EZZ_XNKNTDj1YkyuOzcdG0HyDoB-9H4VuxBZARJ6WlQ1m0Iee13YPKZPqhXj4UHOvQ89TD0X0ws6dnx-bLAeZW9SEVTRO27gm2K-YnMK6PcJUBqoDGHqmX579LJ5faNoBermKij7mu8FaR_jdKhKjrRwNHEScdIYRMU7pfve_RFMA6xlqDDH_TQm0Uef5BgznJiZqUZFv5tUOfrR2IcAZDWWfvhCvFeAnvuSl7Hpgzo4qfWcj8gwSRekGEXOa_jjV18xbEqxRI3Ok8Nr2_RB_oHBPzO53yBcXlB6Xl12YGFnlkB21IFO1ZDonfc6lNYGSCFkrqoHkA"
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
                app: "instagram",
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
