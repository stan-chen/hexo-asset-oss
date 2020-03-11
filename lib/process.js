'use strict';
/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/19 18:40
 */
const url = require('url');
const Promise = require('bluebird');
const fs = require('hexo-fs');
const co = require('co');
const OSS = require('ali-oss');
const pathFn = require('path');
const chalk = require('chalk');

module.exports = function(ctx) {
  var log = ctx.log || console.log;
  const checkOssResult = function(result) {
    if (result.res.status === 200) {
      log.log('OSS文件:', result.name, ' 上传OSS成功');
    } else {
      log.log(
        'OSS文件:',
        result.name,
        ' 上传失败!失败代码:',
        result.res.status,
        ' ',
        result.res.statusCode
      );
    }
  };

  const getOssClient = function(config) {
    var internal = false;
    if (config.oss_internal) {
      internal = true;
    }
    return new OSS({
      region: config.oss_region,
      accessKeyId: config.oss_acid,
      accessKeySecret: config.oss_ackey,
      bucket: config.oss_bucket,
      internal: internal,
    });
  };

  return function() {
    const Assets = ctx.model('Asset');
    const PostAsset = ctx.model('PostAsset');
    const config = ctx.config.asset_oss;
    const oss_client = getOssClient(config);
    const oss_dir = config.oss_root;

    Promise.filter([...Assets.toArray(), ...PostAsset.toArray()], function(
      asset
    ) {
      return fs.exists(asset.source).then(function(exist) {
        if (exist) return exist;
        return asset.remove().thenReturn(exist);
      });
    }).map(function(asset) {
      const source = asset.source;
      let path = asset.path;
      oss_client.useBucket(config.oss_bucket);
      let put_path = undefined;
      if (asset.post) {
        put_path = pathFn.join(oss_dir, 'post-assets', path);
      } else {
        put_path = pathFn.join(oss_dir, 'static', path);
      }

      if (asset.renderable && ctx.render.isRenderable(path)) {
        var extname = pathFn.extname(path);
        var filename = path.substring(0, path.length - extname.length);

        path = filename + '.' + ctx.render.getOutput(path);
        put_path = url.resolve(oss_dir, path);

        return ctx.render
          .render({
            path: source,
            toString: true,
          })
          .then(function(result) {
            // 上传渲染后Buffer
            co(function*() {
              // eslint-disable-next-line no-undef
              var presult = yield oss_client.put(put_path, new Buffer(result));
              checkOssResult(presult);
            }).catch(function(err) {
              console.log(err);
            });
          })
          .catch(function(err) {
            ctx.log.error(
              { err: err },
              'Asset render failed: %s',
              chalk.magenta(path)
            );
          });
      } else {
        // 上传原始文件
        co(function*() {
          var presult = yield oss_client.put(put_path, source);
          checkOssResult(presult);
        }).catch(function(err) {
          console.log(err);
        });
      }
    });
  };
};
