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

let anonConfig = Config(
    environment: .staging,
    clientId: ProcessInfo.clientIdentifier,
    appUserIdToken: ProcessInfo.applicationUserIdentifiterToken
)

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
            AsyncImage(url: integration.iconUrl) { image in
                image.image?.resizable()
            }
            .frame(width: 40, height: 40, alignment: .center)
            .aspectRatio(contentMode: .fit)
            
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
                        $0.id.lowercased() == newSelectedIntegration.integration.id.lowercased()
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
                .eraseToAnyPublisher()
                .removeDuplicates(by: { integrations, newIntegrations in
                    integrations.count == newIntegrations.count
                })
                , perform: { integrationList in
                    if integrationList.count > 0,
                       self.loadedIntegrations.count != integrationList.count {
                        self.loadedIntegrations = integrationList
                        self.selectedIntegration = loadedIntegrations.first() {
                            $0.id.lowercased() == appName.lowercased()
                        }
                    }
                }
            )
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
    ContentView(appName: .constant("resy"))
}

#Preview("App List") {
    AppList(loadedIntegrations: [
        .init(
            id: "resy",
            iconUrl: URL(string: "https://logo.clearbit.com/resy.com")
        ),
        .init(
            id: "delta",
            iconUrl: URL(string: "https://logo.clearbit.com/delta.com")
        )
        ]
    )
}
