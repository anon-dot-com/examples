//
//  ContentView.swift
//  connect-ios-swiftui
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

struct AppNameEnvironmentKey: EnvironmentKey {
    static var defaultValue: String = ""
}

/// We'll add the provider to our environment to make it accessible in any view that might need it
extension EnvironmentValues {
    /// The current app metadata
    var appName: String {
        get { self[AppNameEnvironmentKey.self] }
        set { self[AppNameEnvironmentKey.self] = newValue }
    }
}

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

let integrationToIcon: [String: Image] = [
    "github": Image(systemName: "server.rack"),
    "uber": Image(systemName: "car.circle.fill"),
    "delta": Image(systemName: "airplane.circle.fill"),
    "united_airlines": Image(systemName: "airplane.circle.fill"),
    "opentable": Image(systemName: "fork.knife.circle.fill"),
    "resy": Image(systemName: "fork.knife.circle.fill"),
    "amazon": Image(systemName: "books.vertical.circle.fill"),
    "instacart": Image(systemName: "carrot.fill"),
    "linkedin": Image(systemName: "briefcase.circle.fill"),
    "facebook": Image(systemName: "person.line.dotted.person.fill"),
    "instagram": Image(systemName: "camera.aperture")
]

let integrationToColor: [String: Color] = [
    "github": .gray,
    "uber": .gray,
    "delta": .red,
    "united_airlines": .blue,
    "opentable": .red,
    "resy": .orange,
    "amazon": .brown,
    "instacart": .green,
    "linkedin": .blue,
    "facebook": .purple,
    "instagram": .yellow
]

@MainActor
struct AppButton: View {
    let appRow: AppRow
    let onTap: (AppRow) -> Void
    
    var body: some View {
        Button {
            onTap(appRow)
        } label: {
            appRow
        }
    }
}

@MainActor
struct AppRow: View {
    let integration: AnonClient.Response.IntegrationList.ActiveIntegration
    
    var image: Image {
        integrationToIcon[integration.id] ?? Image(systemName: "questionmark.circle.fill")
    }
    
    var imageTint: Color {
        integrationToColor[integration.id] ?? .red
    }
    
    var appName: String {
        integration.displayName
    }
    
    init(integration: AnonClient.Response.IntegrationList.ActiveIntegration) {
        self.integration = integration
    }
    
    var body: some View {
        HStack {
            image
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 16, height: 16, alignment: .center)
                .foregroundColor(imageTint)
            
            Text(appName.capitalized.replacingOccurrences(of: "_", with: " "))
                .padding([.leading], 4)
                .font(.title2)
                .foregroundColor(imageTint)
        }
    }
}

extension AnonClient.Response.IntegrationList.ActiveIntegration: Identifiable {}

@MainActor
struct AppList: View {
    @Environment(\.appName) private var appName: String
    
    @State var loadedIntegrations: [AnonClient.Response.IntegrationList.ActiveIntegration]
    
    @State var selectedIntegration: AnonClient.Response.IntegrationList.ActiveIntegration?
    
    var body: some View {
//        let integration = Binding.constant(loadedIntegrations.first(where: { $0.id == appName}))
        

            let anonView = AnonUIView(
                app: selectedIntegration?.id ?? "linkedin",
                config: anonConfig,
                ui: UIConfig(
                    organizationName: "Example App",
                    // Your organization's icon URL
                    organizationIconUrl: URL(string: "https://example.com/favicon.ico"),
                    // Theme selection
                    theme: .dark
                )
            )
            let client = anonView.client
            
            List(loadedIntegrations, id: \.id) { integration in
                AppButton(appRow: AppRow(integration: integration)) { newSelectedIntegration in
                    selectedIntegration = loadedIntegrations.first() {
                        $0.id == newSelectedIntegration.integration.id
                    }
                }
            }
            .fullScreenCover(item: $selectedIntegration) { integration in
                anonView
            }
            .onReceive(
                client
                    .integrationListPublisher()
                    .receive(on: DispatchQueue.main)
                    .replaceError(with: [])
                    .share()
                , perform: { integrationList in
                    if integrationList.count > 0,
                       self.loadedIntegrations.count != integrationList.count {
                        self.loadedIntegrations = integrationList
                        if !appName.isEmpty {
                            self.selectedIntegration = loadedIntegrations.first() {
                                $0.id == appName
                            }
                        }
                    }
                })
    }
}

@MainActor
struct ContentView: View {
    @Binding var appName: String?
    var body: some View {
        NavigationView {
            NavigationStack {
                AppList(
                    loadedIntegrations: []
                )
#if APPCLIP
                        .navigationTitle("App Clip Integrations")
#else
                        .navigationTitle("Integrations")
#endif
                        .environment(\.appName, appName ?? "")
            }
        }
    }
}


#Preview {
    ContentView(appName: .constant(""))
}
