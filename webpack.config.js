const path = require('path');
const copyPlugin = require('copy-webpack-plugin');

const basicConfig = {
    module: {
        rules: [
            {
                test: /\.[tj]s?$/u,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'ts-loader',
                        options: { transpileOnly: true },
                    },
                ],
            },
        ],
    },
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.js'],
    },
    watchOptions: {
        ignored: ['node_modules'],
    },
};

const frontConfig = {
    ...basicConfig,
    target: 'web',
    entry: [path.join(__dirname, 'src', 'front', 'index.ts')],
    externals: [],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist', 'front'),
    },
    plugins: [
        new copyPlugin({
            patterns: [
                {
                    from: path.join('src', 'front', 'index.html'),
                    to: 'index.html',
                },
            ],
        }),
    ],
};

const configs = [frontConfig];

if (process.env.BUILD_ENV === 'production') {
    module.exports = configs.map((config) => ({
        ...config,
        mode: 'production',
    }));
} else {
    module.exports = configs.map((config) => ({
        ...config,
        mode: 'development',
        devtool: 'source-map',
    }));
}
