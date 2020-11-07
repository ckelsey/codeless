module.exports = api => {
    const isTest = api.env('test');

    const targets = {
        browsers: "> 0.25%, not dead"
    }

    if (isTest) {
        delete targets.browsers;
        targets.node = "current";
    }

    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "useBuiltIns": "entry",
                    "corejs": "3.0.0",
                    targets
                }
            ],
            // "@babel/preset-typescript"
        ],
        "plugins": [
            // "./test-plugin",
            ["@babel/plugin-transform-typescript", {
                onlyRemoveTypeImports: true,
                allowDeclareFields: false,
                allowNamespaces: true,
                allExtensions: true
            }],
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread"
        ]
    };
};