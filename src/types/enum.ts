/** 角色 */
export enum Role {
  /** 管理员 */
  ADMIN = 1,
  /** 开发者（可以进行发布） */
  DEVELOPER,
  /** 访客 */
  VISITOR,
}

/** 状态 */
export enum Status {
  /** 关闭 */
  OFF = 1,
  /** 开启 */
  ON,
}
