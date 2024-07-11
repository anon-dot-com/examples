//
//  ContentView.swift
//  connect-ios-swiftui
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

@MainActor
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

@MainActor
struct AppRow: View {
    let imageName: String
    let imageTint: Color
    let appName: String
    
    var body: some View {
        Image(systemName: imageName)
            .resizable()
            .frame(
                minWidth: 16, idealWidth: 32, maxWidth: 48,
                minHeight: 16, idealHeight: 32, maxHeight: 48,
                alignment: .trailing
            )
            .padding([.leading, .trailing], 8)
            .foregroundColor(imageTint)
        
        Text(appName.capitalized)
            .padding()
            .font(.title2)
            .foregroundColor(imageTint)
    }
}

@MainActor
struct ContentView: View {
    // We move to immediately present in AppClip builds
#if APPCLIP
    @State private var isPresenting = true // State to manage SDK presentation
#else
    @State private var isPresenting = false // State to manage SDK presentation
#endif
    @State private var selectedApp: String? = "delta"

    // Configuration for Anon SDK
    let anonConfig = Config(
        // Change to the appropriate environment as needed.
        environment: .staging,
        // The uuid of your SdkClient /associated with your UserPool/
        // ie the one which returned   "auth": { "type": "userPool", "userPoolId": "..." }
        clientId: "d3d694c2-dedd-4696-880c-c605a89afe64",
                    // todo: grab from env.ANON_APP_USER_ID_TOKEN
        appUserIdToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFYQXotRy1xeFIxbmdnSzlHZ2wzNktGckpTQzB3TzUzVVdCbEd3NjVaYWcifQ.eyJlbWFpbCI6Iml0ZXN0LWFwcC11c2VyLTg3NDZAdGVhbS5hbm9uLmNvbSIsImlhdCI6MTcwODYzNzYyMSwiaXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIiwiYXVkIjoidXJuOmV4YW1wbGU6YXVkaWVuY2UiLCJleHAiOjE3MTEyMjk2MjEsInN1YiI6ImV4dGVybmFsLWlkLTczNDgifQ.Ptc0416ZzWSFrqiYvIbojrFjBDAV7d_ny4wQT-NjQINxEQ4tpxK3N26v85cHbMZ6gnsgSQF5k8WtjU__XkFc2VRWzbNi2XLHq51SZFDmsX0vkbFN5Y7PYQK5R51-nph9q_56kMdGwIfTbGhRg6LAb6ZCWYOHMwUolNrGcPvdLV6BxluoQY3iLMswsAaXLdcbvDvoy5yRXSwJIeEZRPXtmnCaoIAF-sKVH-1zk70oyWaUkf2c4jZaXiYKJ9qAwJwcbvrh7i4Zx6gzskmcYZX1OE6W32X3mfdoafjdI4K6JKweEDzZ0xhXyAHyS6Wd0lCqrRcb66I0sNFI4P5tdvvUvA"
    )

    var body: some View {
        NavigationView {
#if APPCLIP
            Text("App Clip!")
                .font(.largeTitle)
#endif
            VStack(alignment: .leading, spacing: 32) {
                
                AppButton(appRow: AppRow(
                    imageName: "table.furniture.fill",
                    imageTint: .red,
                    appName: "opentable"
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
            .padding()
        }
        .onChange(of: selectedApp, { oldValue, newValue in
            if let app = selectedApp, !app.isEmpty {
                isPresenting.toggle()
            }
        })
        .fullScreenCover(isPresented: $isPresenting, onDismiss: didDismiss) {
            if let app = selectedApp {
                AnonUIView(
                    app: app,
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
    }

    func didDismiss() {
        selectedApp = nil
        // Handle the dismissing action here.
        print("SDK was dismissed")
    }
}


#Preview {
    ContentView()
}
