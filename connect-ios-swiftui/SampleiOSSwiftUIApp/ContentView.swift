//
//  ContentView.swift
//  SampleiOSSwiftUI
//
//  Created by Anonymity Labs.
//

import SwiftUI
import AnonKit

struct ContentView: View {
    @State private var isPresenting = false
    var body: some View {
        NavigationView {
            VStack {
                Image("Color=Winter White")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Welcome to Anon, tap to proceed")
            }
            .padding()
            .onTapGesture {
                print("tapped!")
                isPresenting.toggle()
            }
        }.fullScreenCover(isPresented: $isPresenting,
                          onDismiss: didDismiss) {
            AnonUIView(
                app: "instagram",
                config: anonConfig,
                ui: AnonKit.UIConfig(
                    organizationName: "My Company",
                    organizationIconUrl: URL(string: "https://gist.githubusercontent.com/kaiba42/ff36c05cd3e712eb37da2a1fbceb3452/raw/126654beee234078b06588afd55ee7623b9b7c9b/org-logo-multion-dark.png"),
                    theme: .dark
                )
            )
        }
    }
    
    func didDismiss() {
        // Handle the dismissing action.
        print("clicked dismiss")
    }
}

#Preview {
    ContentView()
}
