const {withGradleProperties} = require('@expo/config-plugins');

/**
 * Use this plugin to customise the gradle.properties file produced by Expo
 * @param {ExpoConfig} config
 * @param {Array<{ key: String, value: String | Number}>} [args] Each key should be a recognised Gradle property.
 * @return {ExpoConfig}
 */
module.exports = (config, args = []) => {
    const newProperties = args.map(({key, value}) => ({type: 'property', key, value}))
    return withGradleProperties(config, (config) => {
        newProperties.map((property) => {
            const index= config.modResults.findIndex((item) => item.key === property.key)

            if (index >= 0) {
                config.modResults[index] = property
            } else {
                config.modResults.push(property)
            }
        })

        return config
    })
};
