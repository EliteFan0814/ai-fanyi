import * as https from "https";
import { Md5 } from "ts-md5";
import { appid, appSecret } from "./private";
interface BaiduTranslateResult {
  from: string;
  to: string;
  trans_result: { src: string; dst: string }[];
  error_code?: string;
  error_msg?: string;
}
const errorMap: { [key: string]: string } = {
  52001: "请求超时",
  52002: "系统错误",
  52003: "未授权用户",
  54000: "必填参数为空",
  54001: "签名错误",
  54003: "访问频率受限",
  54004: "账户余额不足",
  54005: "长query请求频繁",
  58000: "客户端IP非法",
  58001: "译文语言方向不支持",
  58002: " 服务当前已关闭",
  90107: "认证未通过或未生效",
};
export const translate = (q: string, to = "zh"): void => {
  const from = "auto";
  const salt = Math.random().toString();
  const sign = Md5.hashStr(appid + q + salt + appSecret);
  const params = new URLSearchParams({
    q,
    from,
    to,
    appid,
    salt,
    sign,
  });
  const options = {
    hostname: "fanyi-api.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + params,
    method: "GET",
  };
  const req = https.request(options, (res) => {
    const chunks: Uint8Array[] = [];
    res.on("data", (chunk) => {
      chunks.push(chunk);
    });
    res.on("end", () => {
      const resObj: BaiduTranslateResult = JSON.parse(
        Buffer.concat(chunks).toString()
      );
      if (resObj.error_code) {
        console.log(errorMap[resObj.error_code] || resObj.error_msg);
        process.exit(2);
      } else {
        console.log(`${q} 翻译结果：`);
        console.log(`--------------------------------`);
        resObj.trans_result.map((item, index) => {
          console.log(`${index + 1}. ${item.dst}`);
        });
        process.exit();
      }
    });
  });
  req.on("error", (e) => {
    console.error(e);
  });
  req.end();
};
