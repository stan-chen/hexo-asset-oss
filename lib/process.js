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
const pathFn = require('path');
var chalk = require('chalk');



module.exports = function (ctx) {
  var log = ctx.log || console.log;
  const checkOssResult = function (result) {
    if(result.res.status === 200){
      log.log('文件:',result.name,' 上传OSS成功');
    }else{
      log.log('文件:',result.name,' 上传失败!失败代码:',result.res.status,' ',result.res.statusCode);
    }
  }

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
        if (exist) return exist;
        return asset.remove().thenReturn(exist);
      });
    }).map(function (asset) {
      var data;
      var source = asset.source;
      var path = asset.path;
      oss_client.useBucket(config.oss_bucket);
      var put_path = url.resolve( oss_dir, path );

      if (asset.renderable && ctx.render.isRenderable(path)) {
        var extname = pathFn.extname(path);
        var filename = path.substring(0, path.length - extname.length);

        path = filename + '.' + ctx.render.getOutput(path);
        put_path = url.resolve( oss_dir, path );

        return ctx.render.render({
          path: source,
          toString: true
        }).then(function (result) {
          // 上传渲染后Buffer
          co(function* () {
            var presult = yield oss_client.put( put_path , new Buffer(result));
            checkOssResult(presult);
          }).catch(function (err) {
            console.log(err);
          });

        }).catch(function(err) {
          ctx.log.error({err: err}, 'Asset render failed: %s', chalk.magenta(path));
        });
      } else {
        // 上传原始文件
        co(function* () {
          var presult = yield oss_client.put( put_path , source );
          checkOssResult(presult);
        }).catch(function (err) {
          console.log(err);
        });

      }
    });
  }
};
