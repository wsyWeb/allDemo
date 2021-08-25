const path = require('path')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    devServer: {
        port: 4000,
        open: false,
        overlay: {
            warnings: false,
            errors: true,
        },
    },

    // css: {
    //     loaderOptions: {
    //         // 给 sass-loader 传递选项
    //         sass: {
    //             prependData: `@import "@/assets/stylesheets/_new_variable";`,
    //         },
    //     },
    // },
    configureWebpack: (config) => {
        const myConfig = {}
        if (process.env.NODE_ENV === 'production') {
            myConfig.plugins = []
            // 去掉注释
            // 去掉注释
            myConfig.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false, // 去掉注释
                        },
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log'], //移除console
                        },
                    },
                })
            )
        }
        Object.assign(config.resolve, {
            alias: {
                '@': path.resolve(__dirname, './src'),
                assets: path.resolve(__dirname, './src/assets'),
                common: path.resolve(__dirname, './src/common'),
                components: path.resolve(__dirname, './src/components'),
                api: path.resolve(__dirname, './src/api'),
                views: path.resolve(__dirname, './src/views'),
            },
        })
    },
    chainWebpack(config) {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        const svgRule = config.module.rule('svg');
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。防止报错
        svgRule.uses.clear();
        svgRule
          .test(/\.svg$/)
          .include.add(path.resolve(__dirname, './src/icons/svg'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          });
        // const fileRule = config.module.rule('file');
        // fileRule.uses.clear();
        // fileRule
        //   .test(/\.svg$/)
        //   .exclude.add(path.resolve(__dirname, './src/icons/svg'))
        //   .end()
        //   .use('file-loader')
        //   .loader('file-loader');


        // config.module
        //     .rule("vue")
        //     .use("vue-loader")
        //     .loader("vue-loader")
        //     .tap((options) => {
        //         options.compilerOptions.preserveWhitespace = true;
        //         return options;
        //     })
        //     .end();
        config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-source-map'))

        config.when(process.env.NODE_ENV !== 'development', (config) => {
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        inline: /runtime\..*\.js$/,
                    },
                ])
                .end()
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial',
                    },
                    // elementUI: {
                    //     name: "chunk-elementUI",
                    //     priority: 20,
                    //     test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                    // },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'),
                        minChunks: 3,
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            })
            config.optimization.runtimeChunk('single')
        })
    },
}
