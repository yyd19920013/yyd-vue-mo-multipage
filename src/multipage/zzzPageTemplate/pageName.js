import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import routes from './router';
import store from './store';

import header1 from 'components/header/header1';
import footer1 from 'components/footer/footer1';
import footer2 from 'components/footer/footer2';
import footer3 from 'components/footer/footer3';

import {XDialog,AlertPlugin,ConfirmPlugin} from 'src/VUX'
import fastclick from 'fastclick';
import * as yyd from 'js/yydjs';
import * as filter from 'filter';
import {QSA,alerts,consoleNull,htmlFontSize,networkHandle,openMoblieDebug,bind,unbind,pDef,lStore,sStore,isPhone,strToJson,controlBodyScroll,hasPrevHistoryPageFn} from 'js/yydjs';
import {URL,findDic} from 'page1/services';

//处理点击延迟
let hostname=window.location.hostname;
let noNative=hostname!='localhost'&&hostname!='127.0.0.1'&&hostname!='172.16.21.92';;

if(noNative){
    fastclick.attach(document.body);
}

//调用插件
// Vue.use(VueRouter);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);

const vmEvent=new Vue();
const MyPlugin={};

MyPlugin.install=function(Vue,options){
    //1. 添加全局方法或属性
    //获取相对域名
    Vue.prototype.URL=()=>{
        return URL;
    };
    //获取绝对域名
    Vue.prototype.URL1=()=>{
        return window.location.origin;
    };
    //功能正在开发提示
    Vue.prototype.HINT=()=>{
        alerts('该功能尚未开放，敬请期待！');
    };
    //下载app提示
    Vue.prototype.HINT1=()=>{
        vm.$vux.alert.show({
            title:'提示',
            content:'网页版不支持该功能，请下载app进行体验！',
            onShow(){

            },
            onHide(){

            },
        });
        vm.$vux.confirm.show({
            title:'提示',
            content:'网页版不支持该功能，请下载app进行体验！',
            onConfirm(){

            },
            onCancel(){

            },
        });
    };

    //2. 添加全局资源
    Vue.directive('myDirective',{
        bind(el,binding,vnode,oldVnode){//只调用一次，指令第一次绑定到元素时调用。

        },
        inserted(el,binding,vnode,oldVnode){//被绑定元素插入父节点时调用

        },
        update(el,binding,vnode,oldVnode){//所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。

        },
        componentUpdated(el,binding,vnode,oldVnode){//指令所在组件的 VNode 及其子 VNode 全部更新后调用。

        },
        unbind(el,binding,vnode,oldVnode){//只调用一次，指令与元素解绑时调用。

        },
    });

    //3. 注入组件
    Vue.mixin({
        data(){
            return{

            }
        },
        mounted(){

        },
        methods:{

        },
        components:{
            header1,
            footer1,
            footer2,
            footer3,
        },
    });

    //4. 添加实例方法
    //Vue.prototype.method=yyd;

    //挂载字典
    const setDictionaries=(endFn)=>{
        let prefix='cfs.dic.';
        let params=[[
            'ih_foodAllergy',//食物过敏
            'ih_medicalAllergy',//药物过敏
            'ih_familyDiseaseHistory',//家族病史
            'ih_operationOrTrauma',//手术外伤
            'ih_orderCurrentStatus',//订单状态
            'base_conStatus',//问诊状态
            'ih_commentStatus',//评论状态
            'ih_commentTagCode',//评价标签
        ]];
        let dictionaries={
            statusJson:{},
            statusDetailJson:{},
        };

        for(let i=0;i<params[0].length;i++){
            dictionaries[params[0][i]]={};
            params[0][i]=prefix+params[0][i];
        }

        Vue.prototype.dictionaries=dictionaries;

        findDic(params,(res)=>{
            let arr=res.body;

            for(let item of arr){
                let key=item.dicId.replace(prefix,'');

                key=key.replace('ih_','');
                dictionaries[key]=item.items;
            }

            let {base_conStatus,orderCurrentStatus,medicalAllergy,foodAllergy,familyDiseaseHistory,operationOrTrauma}=dictionaries;
            let color='';
            let btText='';
            let btBg='';

            function createOrderStatus(statusArr,name){
                if(!dictionaries[name]){
                    dictionaries[name]={};
                }

                for(let item of statusArr){
                    color='#333';
                    btBg='transparent';
                    btText='';
                    switch(item.key){
                        case '11':
                                color='#ff7955';
                                btBg='#ff7955';
                                btText='立即支付';
                            break;
                        case '12':
                                color='#999';
                            break;
                        case '15':
                                color='#999';
                                btBg='#33adff';
                                btText='重新下单';
                            break;
                        case '51':
                                color='#33adff';
                            break;
                        case '52':
                                color='#33adff';
                            break;
                        case '53':
                                color='#999';
                            break;
                    }

                    dictionaries[name][item.key]={
                        text:item.text,
                        color,
                        btText,
                        btBg,
                    };
                }
            };

            createOrderStatus(base_conStatus,'statusJson');
            createOrderStatus(orderCurrentStatus,'statusDetailJson');

            dictionaries.goodsJson={
                '01':'30',
                '02':'40',
                '03':'50',
            };
            endFn&&endFn(dictionaries);
        });
    };

    setDictionaries((dictionaries)=>{
        Vue.prototype.dictionaries=dictionaries;
        vmEvent.$emit('dictionariesFinished',dictionaries);
    });
}

//调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin);

//挂载过滤器
for(let attr in filter){
    Vue.filter(attr,filter[attr]);
}

//路由对象
const router=new VueRouter({
    // mode:'history',
    routes,
});

let oldTo={};

//路由改变之前显示loading
router.beforeEach((to,from,next)=>{
    store.commit({
        type:'UPDATE_LOADINGSTATUS',
        isLoading:true,
    });

    //根据meta值改变title
    if(to.meta&&to.meta.title)document.title=to.meta.title;

    //恢复正常样式
    document.body.classList.remove('app');

    next();
});

//路由改变之后隐藏loading
router.afterEach((to,from)=>{
    store.commit({
        type:'UPDATE_LOADINGSTATUS',
        isLoading:false,
    });

    //关闭vux组件的遮罩
    vm.$vux.alert.hide();
    vm.$vux.confirm.hide();

    //记录历史记录
    hasPrevHistoryPageFn.record();

    //给#号前面加上问号(解决微信支付无法定位当前网址支付失败)
    const solveWxPay=()=>{
        let arr=window.location.href.split('#');

        //if(arr[0][arr[0].length-1]!='?'){
        // window.location.href=arr[0]+'?#'+arr[1];
        //}
    };
    solveWxPay();

    //根据meta的传值执行不同操作
    const metaHandle=()=>{
        if(!to.meta.keepPos||to.query.goTop){//允许body滚动，并回到顶部
            controlBodyScroll(false,true);
        }
    };
    metaHandle();

    //根据query的传值执行不同操作
    const queryHandle=()=>{
        //加上app样式
        if(to.query.app){
            document.body.classList.add('app');
        }
        //存储地址传值
        if(to.query.app){
            lStore.set('app',to.query.app);
        }
        if(to.query.statusBarHeight){
            lStore.set('statusBarHeight',to.query.statusBarHeight);
        }
        if(to.query.token){
            lStore.set('token',to.query.token);
        }
        if(to.query.mobile){
            lStore.set('mobile',to.query.mobile);
        }
        if(to.query.bCode){
            lStore.set('bCode',to.query.bCode);
        }
        if(to.query.tCode){
            lStore.set('tCode',to.query.tCode);
        }
    };
    queryHandle();

    //根据地址传参计算状态栏高度
    const computedStatusBarHeight=()=>{
        let {app,statusBarHeight}=to.query;

        app=app||lStore.get('app');
        statusBarHeight=+(statusBarHeight||lStore.get('statusBarHeight'));

        Vue.prototype.statusBarHeight=app&&statusBarHeight?statusBarHeight:(app?20:0);
    };
    computedStatusBarHeight();

    //暴露全局方法
    const windowFn=()=>{
        const fnJson={
            goBack(pageIndex){//返回历史记录的方法
                vm.$router.go(pageIndex);
            },
            setLocalStorage(key,value){//setLocalStorage的方法
                lStore.set(key,value);
            },
            setSessionStorage(key,value){//setSessionStorage的方法
                sStore.set(key,value);
            },
            logout(){//logout方法
                lStore.set('token','');
            },
        };

        for(let attr in fnJson){
            window[attr]=fnJson[attr];
        }
    };
    windowFn();
});

//路由器会创建一个App示例，并且挂载到选择符#app匹配的元素上
const vm=new Vue({
    router,
    store,
}).$mount('#app');

//开发与线上模式控制台切换
if(noNative){
    consoleNull(['log','dir','info']);
}

//rem根据屏幕变化
htmlFontSize();

//网络处理
networkHandle();

//手机调试模式
openMoblieDebug(['ih.dev.aijk.net','ih2.test.aijk.net']);

console.dir(vm);

export default vmEvent;


