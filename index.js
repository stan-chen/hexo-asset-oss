/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/18 10:58
 */

'use strict';
const url = require('url');
const pathFn = require('path');
// eslint-disable-next-line no-undef
const ctx = hexo;
const oss_config = ctx.config.asset_oss;
const enable =
  oss_config.enable &&
  oss_config.oss_url.length &&
  oss_config.oss_acid.length &&
  oss_config.oss_ackey.length &&
  oss_config.oss_region.length &&
  oss_config.oss_bucket.length;

if (enable) {
  // eslint-disable-next-line no-undef
  hexo.extend.tag.register('ossimg', function(args) {
    const PostAsset = ctx.model('PostAsset');
    let imageRoot = ctx.config.root;
    if (oss_config.oss_root) {
      imageRoot = pathFn.join(oss_config.oss_root, 'post-assets/');
      imageRoot = url.resolve(oss_config.oss_url, imageRoot);
    }
    const slug = args.shift();
    if (!slug) return;
    const asset = PostAsset.findOne({ post: this._id, slug: slug });
    if (!asset) return;
    const title = args.length ? args.join(' ') : '';
    const alt = title || asset.slug;
    return (
      '<img src="' +
      url.resolve(imageRoot, asset.path) +
      '" alt="' +
      alt +
      '" title="' +
      title +
      '">'
    );
  });
  // eslint-disable-next-line no-undef
  hexo.extend.filter.register('after_generate', require('./lib/process')(ctx));
}
