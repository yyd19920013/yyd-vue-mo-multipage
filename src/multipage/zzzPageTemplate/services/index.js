import md5 from 'md5';
import { cookie, lStore, sStore, alerts, strToJson, axios, axiosWrap } from 'js/yydjs.js';

const URL = '/api'; //域名

const API = (config) => {
    let arr = config.url.split('/');
    let testToken = ['85630dde-615d-4a8b-a875-693164df9148'];

    lStore.set('token', testToken[0]);

    delete config.url;
    config.url = URL + '/*.request';
    config.method = 'post';
    config.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Service-Id': arr[0],
        'X-Access-Token': lStore.get('token'),
        'X-Service-Method': arr[1],
        'B-Product-Code': lStore.get('bCode') || 'hcn.zhongshanih.patient_android',
        // 'T-Product-Code':lStore.get('tCode')||'hcn.zhongshanih.patient_android',
    };
    config.store = import('pageName/store');

    return axiosWrap(config);
};

//axios请求示例
const testAxios = (params, success) => {
    API({
        url: 'cas_ih.indexService/residentIndex',
        params,
        success,
    });
};

/*
    []
*/
const findDic = (params, success) => {
    API({
        url: 'cas_ih.multipleDictionaryService/findDic',
        params,
        success,
    });
};

/*
    [
        'keyWord',//关键字
    ]
*/
const searchDoctor = (params, success) => {
    API({
        url: 'cas_ih.indexService/searchDoctor',
        params,
        success,
    });
};

/*
    [
        page,//页码
        limit,//每页数量
    ]
*/
const residentIndex = (params, success) => {
    API({
        url: 'cas_ih.indexService/residentIndex',
        params,
        success,
    });
};

/*
    []
*/
const findUnfinishConsult = (params, success) => {
    API({
        url: 'cas_ih.indexService/findUnfinishConsult',
        params,
        noToLogin: true,
        success,
    });
};

/*
    [{
        "standardDeptId":"科室id",
        "onlineType":"问诊类型",  // 01  图文问诊 02 视频问诊
        "doctorLevel":"职称筛选",
        "sortType":"排序类型", // 排序类型  默认按职称排序，  1为接诊量
        "page":1,
        "limit":10
    }]
*/
const findDoctors = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineService/findDoctors',
        params,
        success,
    });
};

/*
    [doctorId]
]
*/
const getDoctorInfo = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineService/getDoctorInfo',
        params,
        success,
    });
};

/*
    []
*/
const getFirstDeptList = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineService/getFirstDeptList',
        params,
        success,
    });
};

/*
    [
        1,  // 科室id
    ]
*/
const getSecondDeptList = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineService/getSecondDeptList',
        params,
        success,
    });
};

/*
    [
      1,  // 在线问诊医生id
      0,  // page  评价分页
      10  // limit
    ]
*/
const getOnlineConsultDoctorInfo = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineService/getOnlineConsultDoctorInfo',
        params,
        success,
    });
};

/*
    [
      1,  // 在线问诊医生id
      0,  // page  评价分页
      10  // limit
    ]
*/
const getDocScheduleList = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineService/getDocScheduleList',
        params,
        success,
    });
};

/*
    []
*/
const searchMyVoucher = (params, success) => {
    API({
        url: 'cas_ih.voucherH5Service/searchMyVoucher',
        params,
        success,
    });
};

/*
    []
*/
const searchMyVoucherUsed = (params, success) => {
    API({
        url: 'cas_ih.voucherH5Service/searchMyVoucherUsed',
        params,
        success,
    });
};

/*
    ["12345"]
*/
const exchangeVoucher = (params, success) => {
    API({
        url: 'cas_ih.voucherH5Service/exchangeVoucher',
        params,
        success,
    });
};

/*
    [
        "01",  // itemCode 问诊项  01图文  02视频  可用的传01的话不可用就要传02
         0,  // page
         10  // limit
    ]
*/
const getEnableVoucherList = (params, success) => {
    API({
        url: 'cas_ih.voucherH5Service/getEnableVoucherList',
        params,
        success,
    });
};

/*
    [
        "02",  // itemCode 问诊项  01图文  02视频  可用的传01的话不可用就要传02
         0,  // page
         10  // limit
    ]
*/
const getDisableVoucherList = (params, success) => {
    API({
        url: 'cas_ih.voucherH5Service/getDisableVoucherList',
        params,
        success,
    });
};

/*
    [
    "02",  // itemCode 问诊项  01图文  02视频  可用的传01的话不可用就要传02
    ]
*/
const getVoucherCount = (params, success) => {
    API({
        url: 'cas_ih.voucherH5Service/getVoucherCount',
        params,
        success,
    });
};

/*
    []
*/
const getPatientList = (params, success) => {
    API({
        url: 'cas_ih.patientMemberService/getPatientList',
        params,
        success,
    });
};

/*
    [{
     "name":"李大壮", //名称
     "idCardType":"01", //证件类型
     "idCard":"339005199110093015", //证件号码
     "sex":"1", //性别
     "birthday":"1991-10-09 00:00:00", //生日
     "phone":"18505811167"//电话
    }]
*/
const addPatient = (params, success) => {
    API({
        url: 'cas_ih.patientMemberService/addPatient',
        params,
        success,
    });
};

/*
    [就诊人id]
*/
const getHealthinfoById = (params, success) => {
    API({
        url: 'cas_ih.healthinfoService/getHealthinfoById',
        params,
        success,
    });
};

/*
    [{
        "id": "9",     //id 修改的时候传
        "foodAllergy": "牛奶",          //食物/接触物过敏的补充
        "medicalAllergy": "青霉素",  //药物过敏的补充
        "familyDiseaseHistory": "高血压",//家族病史的补充
        "operationOrTrauma": "小腿有疤",//手术或外伤的补充
        "foodAllergyCodes":"12|13", //食物/接触物过敏 多个|隔开  对应字典
        "medicalAllergyCodes":"32|33",//食物/接触物过敏 多个|隔开 对应字典
        "familyDiseaseHistoryCodes":"52|53",//食物/接触物过敏 多个|隔开 对应字典
        "operationOrTraumaCodes":"72|73",//食物/接触物过敏 多个|隔开 对应字典
        "outId":"12", //外部就诊人就有outId
        "mpiId":"111" //内部的就有mpiId outId 和mpiId传一个就行
    }]
*/
const saveOrUpdate = (params, success) => {
    API({
        url: 'cas_ih.healthinfoService/saveOrUpdate',
        params,
        success,
    });
};

/*
    [第三方就诊人Id outId或者mpiId传一个]
*/
const getHealthinfoByThirdpartyId = (params, success) => {
    API({
        url: 'cas_ih.healthinfoService/getHealthinfoByThirdpartyId',
        params,
        success,
    });
};

/*
    [
      {
        "userId": "8de1f395-bd8c-4924-834b-6c374cd561ca",// 不传则后台取当前登录用户Id
        "tenantId": "hcn.xijing",// 不传则后台取当前登录用户所属租户Id
        "itemCode": "01"// 问诊项目编码: 01 图文问诊    02 视频问诊  为空则全部
      }
    ]
*/
const askListPage = (params, success) => {
    API({
        url: 'cas_ih.askOrderService/askListPage',
        params,
        success,
    });
};

/*
    [
    ]
*/
const itemAndCount = (params, success) => {
    API({
        url: 'cas_ih.askOrderService/itemAndCount',
        params,
        success,
    });
};

/*
    [
      1   // 主键
    ]
*/
const askDetail = (params, success) => {
    API({
        url: 'cas_ih.askOrderService/detail',
        params,
        success,
    });
};

/*
    [
        {
            "userId":"5c5e8c09-7259-4cd0-949b-12dc351176de",    //下单人userId
            "userName":"库日天", //下单人姓名
            "userPhone":"18988888888",  //下单人手机号
            "shopName":"慕斯",    //必传，doctorName-医生姓名
            "shopId":"ff0a36b2-4141-46dd-888f-8de0a1bfad74",    //必传，doctorId-医生id
            "quantity":"1", //数量-问诊固定：1
            "shippingAmount":"0",   //必传，物流费用(没有则传0，不能为空)
            "discAmount":"100", //必传，优惠金额(没有则传0，不能为空)
            "orderAmount":"100",    //必传，订单金额(没有则传0，不能为空)
            "payChannel":"02",  //必传，支付渠道：02支付宝 03微信
            "remark":"备注说点什么",  //备注
            "postWay":"3",  //邮寄方式 ，1 自取、 2  邮件、3 无(到店消费)
            "ex":"无", //扩展信息
            "invoiceId":"111",  //发票编号,取自发票接口主键
            "orderShipId":"222",    //订单物流主键，取自物流信息接口主键
            "goodsCategory":"30",   //必传，商品分类:30图文问诊 40视频问诊
            "goodsCode":"02",   //必传，问诊项目code,来自医生线上问诊接口
            "goodsId":"333",    //必传，问诊项目id，来自医生线上问诊接口主键
            "goodsName":"图文问诊", //项目名称，图文问诊、视频问诊、远程会诊
            "price":"100"   //价格，与orderAmount相同(没有则传0，不能为空)
        },{
            "docScheduleId":"111",  //必传，医生排班主键
            "deptId":"222", //必传，科室主键
            "descr":"描述一下", //不舒服描述
            "itemCode":"01",    //必传，问诊项目：01图文问诊 02视频问诊
            "healthId":"444",   //必传，就诊人基本健康信息,引用healthInfo主键
            "startTime":"2018-10-12",   //视频问诊必传，预约开始时间
            "endTime":"2018-10-13", //视频问诊必传，预约结束时间
            "remark":"备注写一下", //备注信息
            "orgId":"111111111111111111111",    //必传，机构id
            "doctorOnlineExtraId":"444" //必传，线上问诊医生主键
        },{
            "name":"骚韦",    //必传，就诊人姓名
            "idCardType":"01",  //卡类型
            "idCard":"320201199901011111",  //卡号
            "sex":"1",  //必传，性别
            "dob":"1999-01-01", //必传，出生日期
            "phone":"18012341234",  //手机号
            "uniqueId":"8d35cf0c53724052864642b292c47db4",  //必传，患者主索引，大C端->mpiId，晞景->outId
            "ex":"444"  //外部扩展信息
        }
    ]
*/
const createConsultOrder = (params, success) => {
    API({
        url: 'cas_ih.orderService/createConsultOrder',
        params,
        success,
    });
};

/*
    ["201809190120180920"]  //订单号orderNo
*/
const cancelConsultOrder = (params, success) => {
    API({
        url: 'cas_ih.orderService/cancelConsultOrder',
        params,
        success,
    });
};

/*
    ["201809190120180920"]  //订单号orderNo
*/
const cancelLockOrder = (params, success) => {
    API({
        url: 'cas_ih.orderService/cancelLockOrder',
        params,
        success,
    });
};

/*
    ["201809190120180920"]  //订单号orderNo
*/
const payOrder = (params, success, finallyFn) => {
    API({
        url: 'cas_ih.orderService/payOrder',
        params,
        success,
        finally: finallyFn,
    });
};

/*
    ["201809190120180920"]  //订单号orderNo
*/
const notifyPayResult = (params, success) => {
    API({
        url: 'cas_ih.orderService/notifyPayResult',
        params,
        success,
    });
};

/*
    [
     1, // 在线问诊医生id
     0,  // page
     10 // limit
    ]
*/
const getComments = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineCommentService/getComments',
        params,
        success,
    });
};

/*
    [
        {
          "doctorId": "00011fc8-0dfc-4ffe-bf0d-413379d1dee8",  // 医生id
          "doctorName": "薛志华",  // 医生id
          "orderDetailId": 1,  // 问诊订单id
          "itemCode": "01",  // 问诊项code，01 图文问诊 02 视频问诊 02 基层会诊
          "score": 5,  // 评分
          "tagCodes": "02",  // 评价标签代码，多个逗号隔开
          "content": "asdasd",  // 评价内容
          "doctorOnlineExtraId": 1,  // 在线问诊医生id
          "orgId": "edc988e0-b6d1-4843-a6a7-b7e42299704f"  // 机构id
        }
    ]
*/
const addComment = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineCommentService/addComment',
        params,
        success,
    });
};

/*
    [
      3  // 主键
    ]
*/
const getByOrderDetailId = (params, success) => {
    API({
        url: 'cas_ih.doctorOnlineCommentService/getByOrderDetailId',
        params,
        success,
    });
};

/*
    ["code"] // 配置代码 04 问诊须知
*/
const getSetting = (params, success) => {
    API({
        url: 'cas_ih.settingService/getSetting',
        params,
        success,
    });
};

export {
    URL, //域名
    API, //api请求函数
    testAxios, //axios请求示例
    findDic, //请求字典通用接口
    searchDoctor, //搜索医生
    residentIndex, //首页
    findUnfinishConsult, //登陆后查询有无未结束的问诊
    findDoctors, //找医生
    getDoctorInfo, //医生详情
    getFirstDeptList, //一级科室
    getSecondDeptList, //二级科室
    getOnlineConsultDoctorInfo, //专家问诊详情
    getDocScheduleList, //排班列表
    searchMyVoucher, //获取可用问诊劵-个人中心
    searchMyVoucherUsed, //获取已用问诊劵-个人中心
    exchangeVoucher, //兑换问诊劵
    getEnableVoucherList, //获取可用问诊劵-支付
    getDisableVoucherList, //获取不可用问诊劵-支付
    getVoucherCount, //可用及不可用问诊卷数量
    getPatientList, //获取就诊人
    addPatient, //添加就诊人
    getHealthinfoById, //查询就诊人健康信息
    saveOrUpdate, //新增或者修改就诊人健康信息
    getHealthinfoByThirdpartyId, //根据第三方就诊人Id获取健康信息
    askListPage, //我的问诊列表
    itemAndCount, //问诊类型及类型下问诊数量
    askDetail, //问诊详情
    createConsultOrder, //问诊下单
    cancelConsultOrder, //取消问诊订单
    cancelLockOrder, //取消问诊订单锁定
    payOrder, //app支付
    notifyPayResult, //主动查询订单支付情况
    getComments, //获取医生的评价列表
    addComment, //评价某个医生
    getByOrderDetailId, //获取某个评价的详情
    getSetting, //配置
};
