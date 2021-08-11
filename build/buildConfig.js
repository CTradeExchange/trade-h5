const queryBuildConfig = () => {
    const { buildType, theme } = process.env
    return {
        buildType,
        theme
    }
}
module.exports = {
    queryBuildConfig
}
