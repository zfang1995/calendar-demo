let moment = require("moment");

export default {
  [moment().format("YYYY-M-D")]: [
    {
      title: "iuu撒阿萨是的此次三",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "奥术大师多的大三外侧",
      content: "UKis看来你",
      role: "交办人",
      time: "13:24"
    },
    {
      title: "沙发上发文风格化三",
      content: "UKis看来你",
      role: "经办人",
      time: "09:24"
    },
    {
      title: "覆盖多个环节",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "iuogfdg",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "iuu撒阿萨是的此次三",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    }
  ],
  [moment()
    .clone()
    .subtract(3, "M")
    .format("YYYY-M-D")]: [
    {
      title: "沙发上发文风格化三",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "iuogfdg",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "iuu撒阿萨是的此次三",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    }
  ],
  [moment()
    .subtract(1, "M")
    .format("YYYY-M-D")]: [
    {
      title: "覆盖多个环节",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "iuogfdg",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    },
    {
      title: "iuu撒阿萨是的此次三",
      content: "UKis看来你",
      role: "经办人",
      time: "16:24"
    }
  ]
};
