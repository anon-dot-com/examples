//
//  ContentView.swift
//  connect-ios-swiftui
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

struct AppButton: View {
    let appRow: AppRow
    let onTap: (String) -> Void
    
    var body: some View {
        Button {
            onTap(appRow.appName)
        } label: {
            appRow
        }
    }
}

struct AppRow: View {
    let imageName: String
    let imageTint: Color
    let appName: String
    
    var body: some View {
        HStack {
            Spacer()
            Image(systemName: imageName)
                .resizable()
                .frame(width: 64, height: 64, alignment: .trailing)
                .foregroundColor(imageTint)
            Text(appName.capitalized)
                .padding()
                .font(.title2)
                .foregroundColor(imageTint)
                .frame(width: 150, alignment: .leading)
            Spacer()
        }
    }
}

struct ContentView: View {
    @State private var isPresenting = false // State to manage SDK presentation
    @State private var selectedApp = ""

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
            VStack(spacing: 32) {
                AppButton(appRow: AppRow(
                    imageName: "fork.knife.circle.fill",
                    imageTint: .orange,
                    appName: "resy"
                ), onTap: { newApp in
                    selectedApp = newApp
                })
                
                AppButton(appRow: AppRow(
                    imageName: "briefcase.circle.fill",
                    imageTint: .blue,
                    appName: "linkedin"
                ), onTap: { newApp in
                    selectedApp = newApp
                })
                
                AppButton(appRow: AppRow(
                    imageName: "carrot.fill",
                    imageTint: .green,
                    appName: "instacart"
                ), onTap: { newApp in
                    selectedApp = newApp
                })
                
                AppButton(appRow: AppRow(
                    imageName: "airplane.circle.fill",
                    imageTint: .red,
                    appName: "delta"
                )) { newApp in
                    selectedApp = newApp
                }

                AppButton(appRow: AppRow(
                    imageName: "books.vertical.circle.fill",
                    imageTint: .yellow,
                    appName: "amazon"
                )) { newApp in
                    selectedApp = newApp
                }
            }
        }
        .onChange(of: selectedApp, { oldValue, newValue in
            isPresenting.toggle()
        })
        .fullScreenCover(isPresented: $isPresenting, onDismiss: didDismiss) {
            print("Selected App \(selectedApp.debugDescription)")
            // Present Anon SDK UI
            return AnonUIView(
                // Example app identifier
                app: selectedApp,
                config: anonConfig,
                ui: UIConfig(
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
