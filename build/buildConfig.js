const queryBuildConfig = () => {
    const { buildType, theme, h5URL } = process.env
    return {
        buildType,
        h5URL,
        theme
    }
}
module.exports = {
    queryBuildConfig
}
