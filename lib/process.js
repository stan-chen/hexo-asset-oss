'use strict';
/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/19 18:40
 */
const url = require('url');
const Promise = require('bluebird');
const fs = require('hexo-fs');
const co  = require('co');
const OSS = require('ali-oss');

module.exports = function (ctx) {

  const getOssClient = function (config) {
    var internal = false;
    if (config.oss_internal){
      internal = true;
    }
    return new OSS({
      region: config.oss_region,
      accessKeyId: config.oss_acid,
      accessKeySecret: config.oss_ackey,
      bucket: config.oss_bucket,
      internal: internal
    });
  };

  return function () {
    var Assets = ctx.model('Asset');
    var config = ctx.config.asset_oss;
    var oss_client = getOssClient(config);
    var oss_dir = config.oss_root;
    Promise.filter(Assets.toArray(), function (asset) {
      return fs.exists(asset.source).then(function(exist) {
        if (exist) return asset.modified;
        return exist;
      });
    }).map(function (asset) {
      var data = ctx.route.get(asset.path);
      co(function* () {
        oss_client.useBucket(config.oss_bucket);
        var put_path = url.resolve( oss_dir, asset.path );
        var result = yield oss_client.put(put_path , asset.source);
      }).catch(function (err) {
        console.log( '同步上传至OSS失败：' , err );
      });
    });
  }
};
