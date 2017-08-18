/**
 * Author Xuefei Chen
 * Email chenxuefei_pp@163.com
 * Created on 2017/8/18 17:19
 */


var staticUrl = function (path) {

}



module.exports = function (path, options) {

    console.log('调用自定义url_helper');

    path = path || '/';

    if (path[0] === '#' || path.substring(0, 2) === '//') {
        return path;
    }

    var config = this.config;
    var root = config.root;
    var data = url.parse(path);

    options = _.assign({
        relative: config.relative_link
    }, options);

    // Exit if this is an external path
    if (data.protocol) {
        return path;
    }

    // Resolve relative url
    if (options.relative) {
        return this.relative_url(this.path, path);
    }

    // Prepend root path
    path = root + path;

    return path.replace(/\/{2,}/g, '/');
}