/** 角色 */
export enum Role {
  /** 管理员（可以新增、编辑、删除等操作） */
  ADMIN = 1,
  /** 开发者（可以查看和进行发布） */
  DEVELOPER,
  /** 访客（只能查看，默认值） */
  VISITOR,
}

/** 状态 */
export enum Status {
  /** 关闭 */
  OFF = 1,
  /** 开启 */
  ON,
}

/**
 * API 业务编码
 *
 * 鉴权相关以 4 开头
 * 上传相关以 5 开头
 * 业务相关以 6 开头
 * etc...
 */
export enum ApiCode {
  /** 成功 */
  SUCCESS = 200,
  /**
   * 失败（默认错误码）
   */
  FAIL = 4000,
  /**
   * jwt 解析异常：过期、不合法、未到使用时间等
   */
  JWT_INVALID = 4001,
  /** 账号禁用 */
  ACCOUNT_DISABLED = 4002,
  /**
   * 权限不足
   */
  PERMISSION_DENIED = 4003,
  /**
   * 上传文件类型不合法
   */
  FILE_MIMETYPE_INVALID = 5003,
}
