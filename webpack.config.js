const webpack   = require('webpack')
const path      = require('path')

const config = {
    output: {
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    cache: true,
                    emitWarning: true,
                    emitError: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
				options: {
					presets: ['env']
				}
            }/*,
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            }
            */
        ]
    },
    resolve: {
        alias: {
            //'vue$':         'vue/dist/vue',

            'components':   path.resolve(__dirname, 'resources/_assets/js/components'),
            'classes':      path.resolve(__dirname, 'resources/_assets/js/classes')
        }
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery/dist/jquery',
            jQuery: 'jquery/dist/jquery',
            'window.jQuery': 'jquery/dist/jquery',
            //Vue: 'vue',
            Popper: ['popper.js', 'default'],

            // bootstrap
            Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
            Button: 'exports-loader?Button!bootstrap/js/dist/button',
            Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Index: 'exports-loader?Index!bootstrap/js/dist/index',
            Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
            Util: 'exports-loader?Util!bootstrap/js/dist/util'
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'common' })
    ],
    watch: false
}

module.exports = config