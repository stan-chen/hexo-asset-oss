# hexo-asset-oss

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
asset_oss:
    enable: true
    oss_url: https://assets.example.com
    oss_root: /static/ # optional default '/'
    oss_acid: <AccessID>
    oss_ackey: <AccessKey>
    oss_region: oss-cn-shenzhen
    oss_bucket: assets-example-com
    oss_internal: false # optional is internal default false
```

## License

Copyright (c) 2020, Stanley Chen. Licensed under the [MIT license](LICENSE).
