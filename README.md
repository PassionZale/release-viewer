# Release Viewer

## 快速开始

```shell
git clone https://github.com/PassionZale/release-viewer.git

cd release-viewer/

cp .env.example .env

yarn

yarn prisma:setup

yarn dev
```

`openssl rand -base64 32`

```ts
enum Role {
  /// 管理员
  ADMIN = 1,
  /// 开发者（可以进行发布）
  DEVELOPER,
  /// 访客
  VISITOR,
}

enum Status {
  /// 禁用的
  OFF = 1,
  /// 活跃的
  ON,
}
```
