// https://developer.work.weixin.qq.com/document/path/99110
class WorkweixinChatBot {
  webhook: string;

  constructor(webhook: string) {
    if (!webhook) {
      throw new Error("webhook is required!");
    }

    this.webhook = webhook;
  }

  send(payload: object) {
    return fetch(this.webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  text(content: string, mobiles?: string[]) {
    mobiles = mobiles || [];

    console.log("workweixin robot send msg", { content, mobiles });

    return this.send({
      msgtype: "text",
      text: {
        content,
        mentioned_mobile_list: mobiles,
      },
    });
  }
}

export default WorkweixinChatBot;
