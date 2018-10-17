module.exports = {
  port: 9000,
  root: "dist",
  webpack: {
    console: true,
    publicPath: "/server/",
    // publicPath: "/",
    output: {
      "./index.html": {
        entry: "./src/app",
        commons:['common']
      },
      "./login.html": {
        entry: "./src/login",
        commons:['common']
      }
    },
    commonTrunk: {
      common:[
        "heyui/themes/common.less",
        "axios",
        "manba",
        "js-model",
        "./src/js/common/utils",
        "./src/js/common/request",
        'hey-global',
        'hey-log',
        "heyui",
        "vue",
        "vue-router"
      ]
    },
    alias: {
      model: './src/js/model/',
      js: './src/js',
      components: './src/components/',
    },
    global: {
      "Utils": './src/js/common/utils',
      "Manba": 'manba',
      "HeyUI": 'heyui',
      "Model": "js-model",
      "G": 'hey-global',
      "log": 'hey-log',
      "axios": 'axios',
      "R": './src/js/common/request'
    },
    devServer: {
	    "proxy": {
	      "/umock": {
	        "target": "http://localhost:8000"
	      }
	    },
      historyApiFallback: true
    },
    globalVars: './src/css/var.less',
    externals: {
    }
  },
  copy: ['./static/images/*']
};