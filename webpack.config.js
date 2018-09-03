// import path from 'path'
// import webpack from 'webpack'
// import babelPresets from "./babel.config.js";

var gulp = require("gulp"),
path = require("path"),
webpack = require("webpack"),
babelPresets = require("./babel.config.js");

let config = {
    entry: './temp/js/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, "dist/assets/js/")
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            loader: "babel-loader",
            include:"/temp/js/main,js",
            exclude: [/node_modules/, /bower_components/, "vendor"],
            query: {
                presets: babelPresets.presets
            }
        }
        ]
     },
     stats: {
         colors: true
     },
     mode:"production"
 };

function webpackTask() {

    return new Promise(function (resolve) { 

        
        // webpack(config, function (err, stats) {

        //     if (err) console.log('Webpack', err)

        //     console.log(stats.toString({ /* stats options */ }))

        //     resolve()
        // })

        resolve();


    });
}


module.exports = { webpackTask }