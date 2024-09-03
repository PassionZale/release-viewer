import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import zhCN from "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale(zhCN);

export default dayjs;
