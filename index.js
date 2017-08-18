/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/18 10:58
 */

'use strict';

var ctx = hexo;
var enable = ctx.config.oss_asset;

if(enable){
    var p = require('./lib/process')(ctx);
    ctx.extend.helper.register('url_for', require('./lib/url_for'));
    console.log('注册插件完毕');
    //ctx.extend.processor.register( p.pattern, p.process );
    //ctx.extend.filter.register( 'before_generate', p.process );
    //ctx.extend.filter.register( 'after_generate', p.routeProcess );
    //hexo.extend.generator.register( 'aliyun',  p.process );
}