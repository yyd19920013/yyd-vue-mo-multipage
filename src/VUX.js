import md5 from 'vux/src/tools/md5/index.js';
import dateFormat from 'vux/src/tools/date/format.js';
import numberComma from 'vux/src/tools/number/comma.js';
import numberPad from 'vux/src/tools/number/pad.js';
import numberRandom from 'vux/src/tools/number/random.js';
import querystring from 'vux/src/tools/querystring/index.js';
import cookie from 'vux/src/tools/cookie/index.js';
import Qrcode from 'vux/src/components/qrcode/index.vue';

import XDialog from 'vux/src/components/x-dialog/index.vue';
import Popup from 'vux/src/components/popup/index.vue';
import AlertPlugin from 'vux/src/plugins/alert/index.js';
import ConfirmPlugin from 'vux/src/plugins/confirm/index.js';
import Datetime from 'vux/src/components/datetime/index.vue';
import Picker from 'vux/src/components/picker/index.vue';
import Swiper from 'vux/src/components/swiper/swiper.vue';
import SwiperItem from 'vux/src/components/swiper/swiper-item.vue';


export{
    md5,//md5加密
    dateFormat,//日期格式化
    numberComma,//用于分割数字，默认为3位分割，一般用于格式化金额。
    numberPad,//用于按照位数补0
    numberRandom,//用于生成两个整数范围内的随机整数
    querystring,//url 参数解析
    cookie,//cookie插件
    Qrcode,//生成二维码

    XDialog,//会话窗
    Popup,//弹窗
    AlertPlugin,//点击确定的弹窗
    ConfirmPlugin,//确定取消的弹窗
    Datetime,//时间选取器
    Picker,//自定义选取器
    Swiper,//轮播图
    SwiperItem,//轮播图子元素
};
