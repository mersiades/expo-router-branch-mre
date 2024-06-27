import withCustomGradleProperties from './plugins/withCustomGradleProperties'

const IS_DEV = process.env.APP_VARIANT === 'development';

let scheme;
let bundleIdentifier
let androidPackage;
let apiKey;
let iosAppDomain
let associatedDomains
let iosUniversalLinkDomains
let host

if (IS_DEV) {
    scheme = 'erb-dev'
    bundleIdentifier = "com.neonkingkong.erb.dev"
    androidPackage = "com.neonkingkong.erb.dev"
    apiKey = process.env.BRANCH_TEST_KEY ?? 'undefined';
    associatedDomains = ['applinks:17p1j.test-app.link', 'applinks:17p1j-alternate.test-app.link'];
    host = iosAppDomain = iosUniversalLinkDomains = ['17p1j.test-app.link', '17p1j-alternate.test-app.link'];
} else {
    scheme = 'erb'
    bundleIdentifier = "com.neonkingkong.erb"
    androidPackage = "com.neonkingkong.erb"
    apiKey = process.env.BRANCH_LIVE_KEY ?? 'undefined';
    associatedDomains = ['applinks:17p1j.app.link', 'applinks:17p1j-alternate.app.link'];
    host = iosAppDomain = iosUniversalLinkDomains = ['17p1j.app.link', '17p1j-alternate.app.link'];
}

console.log('scheme', scheme);

const appConfig = {
    "expo": {
        name: process.env.EXPO_PUBLIC_APP_NAME ?? "ERB_1972",
        slug: "expo-router-branch-mre",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme,
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier,
            associatedDomains
        },
        android: {
            adaptiveIcon: {
                "foregroundImage": "./assets/images/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            package: androidPackage,
            config: {
                branch: {
                    apiKey,
                },
            },
            intentFilters: [
                // Branch URI scheme
                {
                    action: 'VIEW',
                    category: ['DEFAULT', 'BROWSABLE'],
                    data: {
                        scheme,
                        host: 'open',
                    },
                },
                // Branch app links
                {
                    autoVerify: true,
                    action: 'VIEW',
                    category: ['DEFAULT', 'BROWSABLE'],
                    data: {
                        scheme: 'https',
                        host,
                    },
                },
            ],
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },

        plugins: [
            "expo-router",
            "expo-font",
            ["./plugins/withCustomGradleProperties", [{
                key: 'org.gradle.jvmargs',
                value: '-Xmx4096m -XX:MaxMetaspaceSize=512m'
            }]],
            ["@config-plugins/react-native-branch",
                {
                    apiKey,
                    iosAppDomain,
                    iosUniversalLinkDomains
                }]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            eas: {
                projectId: "295b36dd-3a93-4e00-b5d5-9d9e165e3021"
            }
        }
    }
}

export default withCustomGradleProperties(appConfig)