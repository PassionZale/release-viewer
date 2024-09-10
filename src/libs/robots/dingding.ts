import sign from "./sign";

// https://open.dingtalk.com/document/orgapp/custom-bot-send-message-type
class DingdingRobotBot {
  webhook: string;
  secret?: string | null;

  constructor(options: { webhook: string; secret?: string | null }) {
    if (!options.webhook) {
      throw new Error("webhook is required!");
    }

    this.webhook = options.webhook;
    this.secret = options.secret;
  }

  send(payload: object) {
    let signStr = "";
    if (this.secret) {
      const timestamp = Date.now();
      signStr =
        "&timestamp=" +
        timestamp +
        "&sign=" +
        sign(this.secret, timestamp + "\n" + this.secret);
    }
    return fetch(this.webhook + signStr, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  markdown(
    title: string,
    text: string,
    at?: {
      atMobiles?: string[];
      atUserIds?: string[];
      isAtAll?: boolean;
    }
  ) {
    at = at || {};

		console.log('dingding robot send msg', { title, text, at })

    return this.send({
      msgtype: "markdown",
      markdown: {
        title,
        text,
      },
      at,
    });
  }
}

export default DingdingRobotBot;
