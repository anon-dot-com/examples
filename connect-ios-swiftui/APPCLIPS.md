# Want instant results?

**COMING SOON** 

> Make use of our publicly deployed App Clip instead! 
> 
> You can even [launch our App Clip from within your iOS Application](https://developer.apple.com/documentation/appclip/launching-another-app-s-app-clip-from-your-app) this integration is quick and painless, and arguably one of the easiest integrations of any SDK these days.
> 
> If you'd like to link to the Anon App Clip simply make a link of the form https://clip.anon.com?id=#{integration} where #{integration} is one of our supported integrations in all lower case (e.g.):
> 
>- https://clip.anon.com?id=paypal
>- https://clip.anon.com?id=resy
>- https://clip.anon.com?id=google


> ### Note
> The lack of a trailing backslash at the end of the link is intentional. Including a backslash before the `?id` is a mistake and will cause the QR code to not be recognized.

# Running the Example App Clip

Run the Anon App Clip directly in your local Xcode. You'll see how you can present integrations to your users and link their sessions to your organization.

## Setup

1. Paste your (SDK Client ID) `ANON_CLIENT_ID` and (User Token) `ANON_USER_ID_TOKEN` environment variables from https://console.anon.com into `Tokens.xcconfig`.
1. Open Xcode and select either `LinkApp` or `LinkClip` as the build target. `LinkClip` is the **App Clip** experience and `LinkApp` is the complete installed application. Please be aware that the two are mutually exclusive. You can't have an app and it's child **App Clip** installed concurrently. This is due to a limitation in how App Clips are packaged within the App itself.
1. Click run to see the **App Clip** in your iOS simulator, or adjust the **Bundle ID** to one that your organization controls and test locally on your device. Please note that you can adjust the tested **App Clip** URL in the **Xcode Scheme Settings** to speed up your testing.

# Working with Anon App Clips

Deploying an App Clip all the way to production requires a number of steps and has a deep blocker based on Apple's actions. We'll summarize the steps below, but you're expected to complete them in your own App Store Connect console.

Most of the work involved in shipping an App Clip is not writing code at all, but rather creating and setting entitlements, and creating an AASA file to prove to Apple that you own a domain you wish to use with App Clips.

The following steps can be accomplished in less than two hours, but you'll need to wait for Apple to crawl the file that you created. This seems to happen once per week so you want to put this file in place as soon as possible to prevent a multiple week delay.

## A note about the requirements

The actual configuration of your App Clip experiences typically happens when you upload the first build that contains an App Clip to App Store Connect. However, it’s important you understand how App Clip experiences work before you start developing your App Clip. You need to identify invocations, invocation URLs, and plan changes to your code before or in parallel to implementing functionality provided by your App Clip. 

Additionally, to support advanced App Clip experiences or iOS versions older than iOS 16.4, you need to make changes to your server to associate your App Clip with your website.

## Preview the Anon App Clip from within your App

Use the [Link Presentation](https://developer.apple.com/documentation/LinkPresentation) framework to include a rich preview of the App Clip in your app that people tap to launch the App Clip directly:

1. Fetch metadata using the invocation URL of the App Clip with [`LPMetadataProvider`](https://developer.apple.com/documentation/LinkPresentation/LPMetadataProvider).
2. Display the App Clip preview with the metadata you receive in an [`LPLinkView`](https://developer.apple.com/documentation/LinkPresentation/LPLinkView).

The following example fetches the metadata and then passes it to a link view.

```
let provider = LPMetadataProvider()
let url = URL(string: "https://clip.anon.com?id=facebook")!
var linkView = ... // A reference to the link view. This could 
// also be a custom view that contains the LPLinkView.

provider.startFetchingMetadata(for: url) { (metadata, error) in
    guard let metadata = metadata else {
        // The fetch failed; handle the error.
        return
    }

    DispatchQueue.main.async {
        // Create the LPLinkView using the metadata. 
        // If you use a custom view, you could pass the 
        // metadata to the custom view and let it handle 
        // the creation or formatting of the LPLinkView.
        linkView = LPLinkView(metadata: metadata)
    }
}
```

# Requirements

You must first create a new [App Clip Target](https://developer.apple.com/documentation/appclip/creating-an-app-clip-with-xcode) for your existing code and assets.

To associate your app and App Clip with your website:

* Specify your invocation URL’s domain within an [`Associated Domains Entitlement`](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains) on both your app and App Clip targets in Xcode.
* Add or modify an AASA file on the domain’s server.

The system verifies that both the entitlement and the configuration in the AASA file match before it permits the invocation of the App Clip. App Store Connect also verifies the match when you create an App Clip experience; for more information, see [Set up an App Clip experience](https://help.apple.com/app-store-connect/#/dev43c15c696).

## A Temporary Workaround

Since the above steps can easily take a number of weeks to get through the verifications and deploy the required files, there is a temporary workaround that can be done while in development:

* Configure the `Local Experiences` setting on the device prior to demonstrating or attempting to scan any QR code.
  * Note that users who haven't configured these steps, or don't have access to Developer mode will instead see `No Usable Data` when they scan QR codes.
* We also think this approach loses the *magic* of App Clips since it requires configuration ahead of time.

## After Creating a new App Clip Target

Adding an App Clip target to your app’s Xcode project and modifying the project are only the first steps in offering an App Clip. Next, plan to spend time designing the launch experience of your App Clip by:

* Reviewing how invocations work
* Identifying invocations you want to support
* Planning which URLs launch your App Clip
* Changing your code to respond to invocations

Based on the decisions you make, you’ll use [App Store Connect](https://appstoreconnect.apple.com/) to:

* Configure the required default App Clip experience in App Store Connect.
* Enable default App Clip links.
* Configure optional advanced App Clip experience.
* Create App Clip Codes.

You may also have to associate your App Clip with your website by adding the [`Associated Domains Entitlement`](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains) to your app and App Clip targets and making changes to your server. To learn more about the App Clip launch experience for your App Clip, see [Configuring the launch experience of your App Clip](https://developer.apple.com/documentation/appclip/configuring-the-launch-experience-of-your-app-clip) and [Responding to invocations](https://developer.apple.com/documentation/appclip/responding-to-invocations). For more information about making changes to your server, see [Associating your App Clip with your website](https://developer.apple.com/documentation/appclip/associating-your-app-clip-with-your-website).

When it’s time to test your App Clip, use Xcode to test the launch experience locally or test it with [TestFlight](https://developer.apple.com/testflight/). For more information, see [Testing the launch experience of your App Clip](https://developer.apple.com/documentation/appclip/testing-the-launch-experience-of-your-app-clip).

>### Important
> When people install the corresponding app for an App Clip, the full app replaces the App Clip. Every invocation from that moment on launches the full app instead of the App Clip. As a result, the full app must handle all invocations and offer the same functionality that the App Clip provides.

No matter which invocation you want to support for your App Clip, you need to create a default App Clip experience in [App Store Connect](https://appstoreconnect.apple.com/login). With a default App Clip experience, you can enable default App Clip links to support a subset of invocations without having to make changes to your server. For some App Clips, this minimal configuration may be enough to provide their functionality on their supported platforms. However, your app could benefit from suppporting invocations that require associating your App Clip with your website.

## Steps

First, open your project in Xcode; then, in your project settings, enable the Associated Domains capability to add the [`Associated Domains Entitlement`](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains).

Next, create an AASA file as described in [Supporting associated domains](https://developer.apple.com/documentation/Xcode/supporting-associated-domains). Then, add an entry for the App Clip with the `appclips` key to the file.

Further, add the AASA file to your website’s `.well-known` directory. If you previously added an AASA file to your server, add the entry for the `appclips` key to the existing file.

Finally, to make sure the system can validate the association between your App Clip and the AASA file on your server, check your server’s configuration and make sure it allows `AASA-Bot` and `CFNetwork` as user agents.

# **Review how people invoke an App Clip**

People don’t search the App Store for an App Clip. They discover it when and where they need it, and launch the App Clip by performing one of the following invocations:

* Scanning an App Clip Code, NFC tag, or QR code at a physical location
* Tapping a location-based suggestion from Siri Suggestions
* Tapping a link in the Maps app
* Tapping a Smart App Banner on a website in Safari or an app that uses [`SFSafariViewController`](https://developer.apple.com/documentation/SafariServices/SFSafariViewController)
* Tapping the action button of an App Clip card that appears in Safari or an [`SFSafariViewController`](https://developer.apple.com/documentation/SafariServices/SFSafariViewController) (requires **iOS 15** or later)
* Tapping a link that someone shares in the Messages app (as a text message only)
* Tapping an App Clip preview or link to an App Clip in an app (requires **iOS 17** or later)

# Testing

When you debug your App Clip with Xcode, the App Clip launches right away with the value you set for the `_XCAppClipURL` variable. Note that the App Clip card doesn’t appear. To see the App Clip card on invocation when testing and test your entire launch experience, register a local experience on your test device.

Leveraging the `_XCAppClipURL` environment variable is helpful when you debug the code that handles the invocation URL. However, you need to ensure your App Clip provides a fast and reliable launch experience from various invocations. In addition, exploring imagery, text, and a call-to-action verb for the App Clip card is especially important because the App Clip card is the user’s first interaction when they launch your App Clip.

To test invocations and explore the design of your App Clip card during development, configure a local experience on your test device. With a local experience, you can launch your App Clip by:

* Scanning an App Clip Code, QR code, or NFC tag you’ve created to launch the local experience. For information on creating App Clip Codes for testing, see [Creating App Clip Codes with the App Clip Code Generator](https://developer.apple.com/documentation/appclip/creating-app-clip-codes-with-the-app-clip-code-generator). To create a QR code or write an NFC tag, use your favorite tool.
* Tapping a Smart Banner you added to your website or an App Clip card that appears in Safari or an [`SFSafariViewController`](https://developer.apple.com/documentation/SafariServices/SFSafariViewController).
* Sharing a link to the website that displays a Smart App Banner. Make sure to add the sender of the message as a contact on the test device.

When you configure a local experience on a device, the local experience takes precedence over App Clip experiences you configure in [App Store Connect](https://appstoreconnect.apple.com/login). However, local experiences only launch an App Clip that’s signed for Development, Ad Hoc, or TestFlight distribution. They don’t launch an App Clip or full app that’s published on the App Store. Remember to remove the local experience before testing App Clip experiences you configure in App Store Connect.

> **Important**
>
> Unlike local experiences, creating an App Clip experience for testers in TestFlight requires you to associate your App Clip with your website. For more information on configuring associated domains, see [Associating your App Clip with your website](https://developer.apple.com/documentation/appclip/associating-your-app-clip-with-your-website).

Testers can also configure a local experience to launch the App Clip you distribute with TestFlight. However, you must still associate your App Clip with your website so testers can launch it from the TestFlight app. In addition, testers must launch the App Clip from an App Clip experience you configure for testing in App Store Connect at least once to ensure that the App Clip is cached on the device.

## **Verify the configuration of your released App Clip**

When you’ve released your app with an App Clip on the App Store, verify the configuration of your App Clip experiences to be sure that your website displays the Smart App Banner and that the App Clip appears on users’ devices:

1. Configure a default and optional advanced App Clip experiences in [App Store Connect](https://appstoreconnect.apple.com/login) and release the version of your app that contains the App Clip on the App Store.
2. On iPhone, open the Settings app, and navigate to the iOS developer settings by choosing Developer.
3. Choose Diagnostics in the App Clips Testing section.
4. Enter the URL of the website you associated with your App Clip and that you use for your App Clip experiences — for example, `https://fruta.example.com`.

When you enter a URL, the system verifies your App Clip configuration and indicates whether you:

* Registered an advanced App Clip experience
* Published your App Clip on the App Store
* Associated your App Clip with the entered URL
* Picked an invocation URL that fits into an App Clip Code
* Added a Smart App Banner to your website

If the system found issues with your configuration, the App Clip diagnostics functionality on iPhone indicates errors and offers links to App Clip documentation to help resolve issues. Note that advanced App Clip experiences and displaying a Smart App Banner on your website are optional but recommended steps that help users discover your App Clip.

# Further Possibilities

We're so excited about the future of App Clips. We think this technology has the potential to drastically accelerate your usage of [Anon](https://anon.com).

[Configuring the launch experience of your App Clip](https://developer.apple.com/documentation/appclip/configuring-the-launch-experience-of-your-app-clip)

## Additional Resources

* [WWDC20: What’s New in App Store Connect](https://developer.apple.com/videos/play/wwdc2020/10651/)
* [Supporting associated domains](https://developer.apple.com/documentation/Xcode/supporting-associated-domains)
* [universal links](https://developer.apple.com/ios/universal-links/)
  * [Supporting universal links in your app](https://developer.apple.com/documentation/Xcode/supporting-universal-links-in-your-app)
  * [Allowing apps and websites to link to your content](https://developer.apple.com/documentation/Xcode/allowing-apps-and-websites-to-link-to-your-content)
