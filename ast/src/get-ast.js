module.exports = content => require("@babel/parser").parse(
    content, {
    presets: ['@babel/preset-env'],
    sourceType: 'module'
})