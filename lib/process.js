/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/18 11:47
 */

var url = require('url');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var util = require('hexo-util');
var Pattern = util.Pattern;

module.exports = function (ctx) {
    var Assets = ctx.model('Asset');
    var PostAssets = ctx.model('PostAsset');

    return {
        pattern: new Pattern(':js'),
        process: function ( file ) {
            if ( ctx.render.isRenderable(file.path) ) return;
            console.log('开始处理', file.path );
            var asset = Assets.findOne({path: file.path});
            asset.path = url.resolve( 'static/', asset.path );
            return asset.save();
        },
        routeProcess: function () {
            var routes = ctx.route.list();
            console.log('修改路由');
        }
    }

}