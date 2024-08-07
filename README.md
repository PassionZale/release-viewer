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
  /// 活跃的
  ACTIVED = 1,
  /// 禁用的
  FORZEN,
}
```
