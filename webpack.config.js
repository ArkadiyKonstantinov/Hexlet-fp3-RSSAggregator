// Generated using webpack-cli https://github.com/webpack/webpack-cli

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackPluginServe } from 'webpack-plugin-serve';
import { AddDependencyPlugin } from "webpack-add-dependency-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mode = process.env.NODE_ENV || 'development';

export default {
    watch: mode === "development",
    // watchOptions: {
    //     aggregateTimeout: 300, // Delay the first rebuild (in ms)
    //     poll: 1000, // Poll using interval (in ms or a boolean)
    //     ignored: /node_modules/, // Ignore to decrease CPU usage
    //   },
    mode: mode,
    entry: ["./src", "webpack-plugin-serve/client"],
    output: {
        clean: true,
        path: resolve(process.cwd(), './dist'),
    },
    devServer: {
        static: {
            directory: resolve(process.cwd(), 'dist'),
        },
        watchFiles: [resolve(process.cwd(), 'dist/index.html')],
        open: true,
        hot: true,
        liveReload: true,
        compress: true,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hexlet App',
            filename: 'index.html',
            template: 'src/template.html',
        }),

        // new MiniCssExtractPlugin({
        //     filename: "stryle.css",
        //   }),

        // new AddDependencyPlugin({ path: "./src/template.html" }),

        // new WebpackPluginServe({
        //     port: 8080,
        //     static: "./dist",
        //     liveReload: true,
        //     waitForBuild: true,
        //   }),
    ],
    module: {
        rules: [
            { 
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.(js|jsx)$/i,
            //     loader: 'babel-loader',
            //     options: {
            //         presets: ['@babel/preset-env'],
            //     },
            // },
            // {
            //     test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            //     type: 'asset',
            // },
            // {
            //     test: /\.scss$/,
            //     use: ['style-loader', 'css-loader', 'sass-loader'],
            // },
            // {
            //     test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     use: 'url-loader?limit=10000',
            // },
            // {
            //     test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
            //     use: 'file-loader',
            // },
        ],
    },
};
