# hexo-tag-ossimg

# About
> This is a [Hexo](http://hexo.io/) tag plugin for push all assets to aliyun OSS.

## Installation
```bash
npm install --save hexo-asset-oss
```
## Usage

## Configuration
You can configure the type, autoplay and size in your main _config.yml:

Example configuration:
```yml
# OSS Images Config
oss_url: https://assets.example.com
oss_dir: /images/ # optional
oss_acid: <AccessID>
oss_ackey: <AccessKey>
oss_region: oss-cn-shenzhen
oss_bucket: assets-example-com
oss_internal: false # optional is internal default false
```

## License

Copyright (c) 2017, Xuefei Chen. Licensed under the [MIT license](LICENSE).