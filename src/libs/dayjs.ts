import dayjs from "dayjs";
import zhCN from "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone"

dayjs.locale(zhCN);
dayjs.extend(relativeTime);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Shanghai')

export default dayjs;
