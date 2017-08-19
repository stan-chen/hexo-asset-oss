/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/18 10:58
 */

'use strict';

var ctx = hexo;
var oss_config = ctx.config.asset_oss;
var enable = false;
if (oss_config.enable &&
    oss_config.oss_url.length &&
    oss_config.oss_acid.length &&
    oss_config.oss_ackey.length &&
    oss_config.oss_region.length &&
    oss_config.oss_bucket.length  ){
    enable = true;
}

if(enable){
    hexo.extend.filter.register('after_generate', require('./lib/process')(ctx) );
}