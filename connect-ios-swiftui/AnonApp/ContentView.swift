//
//  ContentView.swift
//  connect-ios-swiftui
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

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
    let integration: SupportedIntegration
    
    var image: Image {
        integrationToIcon[integration.name] ?? Image(systemName: "questionmark.circle.fill")
    }
    
    var imageTint: Color {
        integrationToColor[integration.name] ?? .red
    }
    
    var appName: String {
        integration.name
    }
    
    init(integration: SupportedIntegration) {
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

@MainActor
struct AppList: View {
    let supportedIntegrations: [SupportedIntegration]
    
#if APPCLIP
    @State private var currentIntegration: SupportedIntegration? = SupportedIntegration(name: "delta")
#else
    @State private var currentIntegration: SupportedIntegration?
#endif
    
    var body: some View {

        List(supportedIntegrations, id: \.id) { integration in
            AppButton(appRow: AppRow(integration: integration)) { newSelectedIntegration in
                currentIntegration = newSelectedIntegration.integration
            }
        }.fullScreenCover(item: $currentIntegration) { integration in
            AnonUIView(
                app: integration.name,
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

struct SupportedIntegration: Identifiable {
    var id: Int {
        name.hashValue
    }
    let isEnabled: Bool = true
    let name: String
}

@MainActor
struct ContentView: View {
    let integrations: [String] = [
        "github",
        "delta",
        "united_airlines",
        "opentable",
        "resy",
        "amazon",
        "instacart",
        "linkedin",
        "facebook",
        "instagram"
    ]

    var body: some View {
        NavigationView {
            NavigationStack {
                AppList(
                    supportedIntegrations: integrations.compactMap { SupportedIntegration(name: $0) }
                )
#if APPCLIP
                .navigationTitle("App Clip Integrations")
#else
                .navigationTitle("Integrations")
#endif
            }
        }
    }
}


#Preview {
    ContentView()
}
