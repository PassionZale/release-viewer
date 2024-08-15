import { z } from "zod";

export const RobotSchema = z.object({
  webhook: z.string({ required_error: "webhook 不能为空" }).url("webhook 不合法"),
  secret: z.string().optional(),
});

