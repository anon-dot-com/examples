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
        Image(systemName: imageName)
            .resizable()
            .frame(
                minWidth: 16, idealWidth: 32, maxWidth: 48,
                minHeight: 16, idealHeight: 32, maxHeight: 48,
                alignment: .trailing
            )
            .foregroundColor(imageTint)
        
        Text(appName.capitalized)
            .padding()
            .font(.title2)
            .foregroundColor(imageTint)
    }
}

struct ContentView: View {
#if APPCLIP
    @State private var isPresenting = true // State to manage SDK presentation
#else
    @State private var isPresenting = false // State to manage SDK presentation
#endif
    @State private var selectedApp = "delta"

    // Configuration for Anon SDK
    let anonConfig = AnonKit.Config(
        // Change to the appropriate environment as needed.
        environment: .staging,
        // The uuid of your SdkClient /associated with your UserPool/
        // ie the one which returned   "auth": { "type": "userPool", "userPoolId": "..." }
        clientId: "d3d694c2-dedd-4696-880c-c605a89afe64",
                    // todo: grab from env.ANON_APP_USER_ID_TOKEN
        appUserIdToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFYQXotRy1xeFIxbmdnSzlHZ2wzNktGckpTQzB3TzUzVVdCbEd3NjVaYWcifQ.eyJlbWFpbCI6Iml0ZXN0LWFwcC11c2VyLTg3NDZAdGVhbS5hbm9uLmNvbSIsImlhdCI6MTcwODYzNzYyMSwiaXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIiwiYXVkIjoidXJuOmV4YW1wbGU6YXVkaWVuY2UiLCJleHAiOjE3MTEyMjk2MjEsInN1YiI6ImV4dGVybmFsLWlkLTczNDgifQ.Ptc0416ZzWSFrqiYvIbojrFjBDAV7d_ny4wQT-NjQINxEQ4tpxK3N26v85cHbMZ6gnsgSQF5k8WtjU__XkFc2VRWzbNi2XLHq51SZFDmsX0vkbFN5Y7PYQK5R51-nph9q_56kMdGwIfTbGhRg6LAb6ZCWYOHMwUolNrGcPvdLV6BxluoQY3iLMswsAaXLdcbvDvoy5yRXSwJIeEZRPXtmnCaoIAF-sKVH-1zk70oyWaUkf2c4jZaXiYKJ9qAwJwcbvrh7i4Zx6gzskmcYZX1OE6W32X3mfdoafjdI4K6JKweEDzZ0xhXyAHyS6Wd0lCqrRcb66I0sNFI4P5tdvvUvA"
//        clientId: "37c47c57-458f-4f75-8ef6-08b66f366a9b",
//        // Your application user ID token, eg the JWT
//        // May be Anon-provided as the `example_app_user_id_token` from 1pass
//        appUserIdToken: "eyJraWQiOiJhWEF6LUctcXhSMW5nZ0s5R2dsMzZLRnJKU0Mwd081M1VXQmxHdzY1WmFnIiwiYWxnIjoiUlMyNTYifQ.eyJleHAiOjE3MjE0OTg5MTgsInN1YiI6ImNocmlzQHRlYW0uYW5vbi5jb20iLCJpYXQiOjE3MTg5MDY5MTgsImF1ZCI6InVybjpleGFtcGxlOmF1ZGllbmNlIiwiZW1haWwiOiJjaHJpc0B0ZWFtLmFub24uY29tIiwiaXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIn0.W6SIyYOxYBGc9JtITBJ3dvUFzGZkwWJncIMFmQsLjukv6HM7i3A1iDYfNudldWwSX5Yg2UrEUP2HltT4F68Tv3Szw2DQ2v3Wm_gBKA9dTZlRB578vSWG5dQZFEzJfWkYCOU4CCX7f8i56gP5TfIJVA9XjAMYrdfhKZgoU2d7PstFKRwHKlkgB-UKQvv01d39ZaTpcKVk4hqrZRf9zUYqTbEzJONSbhc3NSlU-xUXBxigD801jKlZmo2-xRPifHkFOEsUfVDum-UDLQbMckdgbv9uc6j2qEVZ1lXb1i_py62pOBAnoLUewvEQE_UHywSWgq36XUhJfqz-SUneLvghpA"
    )

    var body: some View {
        NavigationView {
#if APPCLIP
            Text("App Clip!")
                .font(.largeTitle)
#else
            VStack(alignment: .leading, spacing: 32) {
                AppButton(appRow: AppRow(
                    imageName: "fork.knife.circle.fill",
                    imageTint: .orange,
                    appName: "resy"
                ), onTap: { newApp in
                    selectedApp = newApp
                })
                
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
#endif
        }
        .onChange(of: selectedApp, { oldValue, newValue in
            isPresenting.toggle()
        })
        .fullScreenCover(isPresented: $isPresenting, onDismiss: didDismiss) {
            print("Selected App \(selectedApp.debugDescription)")
            // Present Anon SDK UI
            return AnonUIView(
                    app: "resy",
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
