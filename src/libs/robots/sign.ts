import crypto from "crypto";

export default function sign(secret: string, content: string) {
  const str = crypto
    .createHmac("sha256", secret)
    .update(content)
    .digest()
    .toString("base64");
  return encodeURIComponent(str);
}
