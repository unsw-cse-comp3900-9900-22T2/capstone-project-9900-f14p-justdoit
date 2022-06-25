
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const webpack = require('webpack')
const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const copyFile = promisify(fs.copyFile)

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'

module.exports = (phase, { defaultConfig }) => {
    console.log('phase', phase, PHASE_DEVELOPMENT_SERVER);

    let configObj = {
        crossOrign: 'anonymous',
        env: {
            customKey: 'hello',
            staticFolder: '/static'
        },
        serverRuntimeConfig: {
            mySecret: 'secret',
            secondSecret: process.env.SECOND_SECRET
        },

        generateEtags: false,
        useFileSystemPublicRoutes: true,
        webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
            config.plugins.push(
                new webpack.IgnorePlugin(/\/__tests__\//),
                new webpack.IgnorePlugin(/^encoding$/, /node-fetch/),
                new MiniCssExtractPlugin({
                    filename: '[name].style.css',
                    chunkFilename: '[name].style.css'
                }),
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorPluginOptions: {
                        preset: ['default', { discardComments: { removeAll: true } }],
                    },
                    canPrint: true
                })
            );
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                "@component": join(__dirname, 'component'),
                "@styles": join(__dirname, 'styles')
            };
            config.module.rules.push({
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                
                            hmr: !isProd,
                        },
                    },
                    'css-loader',
                    'less-loader'
                ]
            });
            config.module.rules.push({
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                
                            hmr: !isProd,
                        },
                    },
                    'css-loader'
                ]
            });
            config.module.rules.push({
                test: /\.jpg|.png$/,
                loader: require.resolve('url-loader'),
                options: { limit: 10000, name: 'static/[name].[ext]', },
            });
            return config
        },
        webpackDevMiddleware: config => {
            return config
        }
    }

    if (phase != PHASE_DEVELOPMENT_SERVER) {
        configObj.distDir = 'build'
    }

    return configObj
}