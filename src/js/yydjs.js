// JavaScript Document
import md5 from 'md5';
import Decimal from 'yyd-decimal';
import axios from 'axios';
import postcssrc from 'root/.postcssrc';
import CONFIG from 'config';

//ajax包装
//支持回调函数和promise两种风格
/*
    参数：
    ajaxWrap({
        url:'',//请求地址
        type:'post',//请求方法
        data:'',//请求传参
        contentType:'',//设置请求头contentType
        closeToForm:false,//关闭json转form格式
        dataType:'json',//返回数据类型
        headers:{},//请求头设置
        timeout:5000,//超时设置
        getXhr:function(xhr){//获取xhr对象的函数
            console.log(xhr);
        },
        progress:function(ev){//上传文件时触发的函数
            console.log(ev);
        },
        success:function(res){//请求状态成功且code成功的回调
            console.log(res);
        },
        finally:function(data){//请求状态成功的回调，promise模式在catch里捕获
            console.log(data);
        },
        error:function(error){//请求状态错误的回调
            console.log(error);
        },
    });
*/
/*
    例子：
    回调函数风格：
    ajaxWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        type:'post',
        success:function(res){
            console.log(res);
        },
    });

    promise风格：
    ajaxWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        type:'post',
    }).then((res)=>{
        console.log(res);
    });
*/
function ajaxWrap(config){
    var str='';
    var errorPromise={
        then:function(){
            console.error('这是一个无效的then函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        catch:function(){
            console.error('这是一个无效的catch函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        finally:function(){
            console.error('这是一个无效的finally函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
    };
    var isTimeout=false;

    config.type=config.type?config.type.toLowerCase():'get';
    config.dataType=config.dataType?config.dataType.toLowerCase():'json';
    config.code=config.code||config.code==0?config.code:200;
    config.timeout=config.timeout||config.timeout==0?config.timeout:20000;

    if(!config.closeToForm&&config.data&&Type(config.data)=='object'){
        for(var attr in config.data){
            str+=attr+'='+config.data[attr]+'&';
        }
        config.data=str.substring(0,str.length-1);
    }

    var xhr=null;

    try{
        xhr=new XMLHttpRequest();
    }catch(e){
        xhr=new ActiveXObject('Microsoft.XMLHTTP');
    }

    if(config.getXhr&&Type(config.getXhr)=='function'){
        xhr=config.getXhr(xhr);
    }

    if(xhr.upload&&config.progress&&Type(config.progress)=='function'){
        bind(xhr.upload,'progress',config.progress);
    }

    if(config.type=='get'&&config.data){
        config.url+='?'+config.data;
    }

    xhr.open(config.type,config.url,true);

    if(config.type=='get'){
        xhr.send();
    }else{
        if(!config.closeToForm)xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
        if(config.headers&&Type(config.headers)=='object'){
            for(var attr in config.headers){
                xhr.setRequestHeader(attr,config.headers[attr]);
            }
        }
        xhr.send(config.data);
    }

    if(Type(config.timeout)=='number'){
        xhr.timeout=config.timeout;
    }

    function onreadystatechangeFn(resolve,reject){
        var data=null;

        if(xhr.readyState==4){
            if(xhr.status==200){
                try{
                    switch(config.dataType){
                        case 'text':
                                data=xhr.responseText;
                            break;
                        case 'json':
                                data=JSON.parse(xhr.responseText);
                            break;
                        case 'html':
                                var oDiv=document.createElement('div');

                                oDiv.setAttribute('dataType','html');
                                oDiv.innerHTML=xhr.responseText;
                                data=oDiv;
                            break;
                        case 'script':
                                var oScript=document.createElement('script');

                                oScript.setAttribute('dataType','script');
                                oScript.innerHTML=xhr.responseText;
                                document.body.appendChild(oScript);
                                data=oScript;
                            break;
                    }
                }catch(e){
                    console.log(e);
                }

                config.finally&&config.finally(data);
                if(data.code==config.code){
                    if(resolve&&(Type(resolve)=='function')){
                        return resolve(data);
                    }else{
                        config.success&&config.success(data);
                    }
                }else{
                    if(!config.noHint){
                        if(data.msg){
                            alerts(data.msg);
                        }else{
                            alerts('请求代码错误');
                        }
                    }

                    if(reject&&(Type(reject)=='function')){
                        return reject(data);
                    }
                }
            }else{
                if(xhr.status==0){
                    alerts('请求超时');
                }else{
                    alerts('网络异常'+xhr.status);
                }
                if(reject&&(Type(reject)=='function')){
                    return reject(xhr.status);
                }else{
                    config.error&&config.error(xhr.status);
                }
            }
        }
    };

    if(config.success||config.finally||config.error){
        xhr.onreadystatechange=onreadystatechangeFn;

        return errorPromise;
    }else{
        return new Promise(function(resolve,reject){
            xhr.onreadystatechange=function(){
                onreadystatechangeFn(resolve,reject);
            };
        });
    }
};

//axios包装
//支持回调函数和promise两种风格
/*
    参数：
    axiosWrap({
        url:'',//请求地址
        method:'post',//请求方法
        params:'',//请求传参
        responseType:'json',//返回数据类型
        headers:{},//请求头设置
        timeout:20000,//请求超时设置
        onUploadProgress:function(ev){//上传文件时触发的函数
            console.log(ev);
        },
        onDownloadProgress:function(ev){//下载文件时触发的函数
            console.log(ev);
        },
        success:function(res){//请求状态成功且code成功的回调
            console.log(res);
        },
        finally:function(data){//请求状态成功的回调，promise模式在catch里捕获
            console.log(data);
        },
        error:function(error){//请求状态错误的回调
            console.log(error);
        },
    });
*/
/*
    例子：
    单个请求：
    回调函数风格：
    axiosWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        method:'post',
        success(res){
            console.log(res);
        },
    });

    promise风格：
    axiosWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        method:'post',
    }).then((res)=>{
        console.log(res);
    });


    并发请求：
    回调函数风格：
    axiosWrap({
        all:{
            apis:[//所有api配置
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
                    method:'post',
                },
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/CarBrand.ashx',
                    method:'post',
                },
            ],
            success(resArr){//都成功回调
                console.log(resArr);
            },
        },
    });

    promise风格：
    axiosWrap({
        all:{
            apis:[//所有api配置
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
                    method:'post',
                },
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/CarBrand.ashx',
                    method:'post',
                },
            ],
        },
    }).then((resArr)=>{
        console.log(resArr);
    });
*/
function axiosWrap(config){
    var config=config||{};
    var hostname=window.location.hostname;
    var all=config.all;
    var errorPromise={
        then:function(){
            console.error('这是一个无效的then函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        catch:function(){
            console.error('这是一个无效的catch函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        finally:function(){
            console.error('这是一个无效的finally函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
    };

    config.code=config.code||config.code==0?config.code:200;

    function changeLoading(bool){
        try{
            var store=config.store;

            store.then((data)=>{
                data.default.commit({
                    type:'UPDATE_LOADINGSTATUS',
                    isLoading:bool,
                });
            });
        }catch(e){}
    };

    function changeRefresh(bool,status){
        try{
            var store=config.store;

            store.then((data)=>{
                data.default.commit({
                    type:'SHOW_REFRESH_BT',
                    showRefreshBt:bool,
                    status:status||'',
                });
            });
        }catch(e){}
    };

    changeRefresh(false);

    function createAxios(config){
        var url=(hostname=='localhost'||hostname=='127.0.0.1'||hostname=='172.16.21.92')?(config.url?config.url:'/api'):'/';
        var method=config.method?config.method.toLowerCase():'';
        var paramsOrData=method=='get'?'params':'data';
        var configResult={
            url:url,
            method:method,
            [paramsOrData]:config.params,
            headers:config.headers||{},
            timeout:config.timeout||20000,
            responseType:config.responseType||'json', //默认值是json，可选项 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
            onUploadProgress:function(ev){
                config.upFn&&config.upFn(ev);
            },
            onDownloadProgress:function(ev){
                config.downFn&&config.downFn(ev);
            },
        };
        var axiosFn=axios(configResult);

        function axiosResultFn(resolve,reject){
            axiosFn.then(function(res){
                var data=res.data;

                if(res.status==200){
                    changeLoading(false);
                    config.finally&&config.finally(data);

                    if(data.code==config.code){
                        if(resolve&&(Type(resolve)=='function')){
                            return resolve(data);
                        }else{
                            config.success&&config.success(data);
                        }
                    }else{
                        if(!config.noHint){
                            if(data.msg){
                                alerts(data.msg);
                            }else{
                                alerts('请求代码错误');
                            }
                        }
                        if(reject&&(Type(reject)=='function')){
                            return reject(data);
                        }
                    }
                }else{
                    alerts('网络异常'+res.status);
                    changeRefresh(true,res.status);
                    changeLoading(false);
                    if(reject&&(Type(reject)=='function')){
                        return reject(res);
                    }else{
                        config.error&&config.error(res);
                    }
                }
            }).catch(function(error){
                console.log(error);
                changeLoading(false);
                if(error.response){
                    alerts('网络异常');
                    changeRefresh(true,error.response.status);
                    if(reject&&(Type(reject)=='function')){
                        return reject(error.response)
                    }else{
                        config.error&&config.error(error.response);
                    }
                }else if(error.code=='ECONNABORTED'){
                    alerts('请求超时');
                    changeRefresh(true,'请求超时');
                    if(reject&&(Type(reject)=='function')){
                        return reject(error);
                    }else{
                        config.error&&config.error(error);
                    }
                }
            });
        };

        !config.noMask&&changeLoading(true);
        if(config.success||config.error||config.finally){
            axiosResultFn();
            return errorPromise;
        }else{
            return new Promise(function(resolve,reject){
                axiosResultFn(resolve,reject);
            });
        }
    };

    if(all&&all.apis&&all.apis.length>0){
        var apisArr=[];

        for(var i=0;i<all.apis.length;i++){
            if(all.apis[i].url){
                apisArr.push(createAxios(all.apis[i]));
            }
        }

        function axiosAllResultFn(resolve,reject){
            Promise.all(apisArr).then(function(){
                if(resolve&&(Type(resolve)=='function')){
                    return resolve(arguments[0]);
                }else{
                    all.success&&all.success(arguments[0]);
                }
            });
        };

        if(all.success||all.error||all.finally){
            axiosAllResultFn();
            return errorPromise;
        }else{
            return new Promise(function(resolve,reject){
                axiosAllResultFn(resolve,reject);
            });
        }
    }else{
        return createAxios(config);
    }
};

//WebSocket请求
//注：只能send字符串格式，一般用字符串json格式，断线会重新send之前send过的数据
/*
    主要api：
    var socMarket=Socket.init({
        url:'',//配置socket接口地址
        heartbeatJson:{},//配置后台心跳参数
        timeout:'',//断线重连时间，毫秒（默认5毫秒）
        timeout1:'',//心跳重连时间，毫秒（默认10毫秒）
        timeout2:'',//socket失败重连时间，毫秒（默认10毫秒）
    });

    socMarket.send({//发送的参数

    },function(res){//success函数，reqToken匹配的成功回调

    },function(res){//finally函数，不管是否匹配reqToken都会走

    },function(sendJson){//intervalSend函数，用于间隔执行send方法（可以在此写心跳重连函数）
        var timer=setInterval(function(){
            sendJson();
        },1000);
    });

    例子：
    var socMarket=new Socket();

    socMarket.init({
        url:'wss://api2018cfd-dev.ga096.cn/app/websocket/',
        heartbeatJson:{
            CMD:'1000',
            token:'',
            DATA:JSON.stringify({
                timeStamp:+new Date(),
            }),
        },
    });

    function subMarket(params,arr,endFn,intervalSendFn){
        var DATA=arr.map((item,index)=>({
            productCode:item,
        }));
        var params=Object.assign({},params,{
            CMD:'1004',
            token:params.token||'',
            DATA:JSON.stringify(DATA),
        });

        socMarket.send(params,null,function(res){
            if(res.CMD=='1005')endFn(res);
        },intervalSendFn);
    };

    var timer=null;

    subMarket({},['BTCUSD','EOSUSD','ETHUSD'],function(res){
        console.log(res);
    },function(sendJson){
        clearInterval(timer);
        timer=setInterval(function(){
            sendJson();
        },1000);
    });
*/
function Socket(){
    this.ws=null;
    this.paramsJson={};
    this.deleteParamsJson={};
    this.messageFnJson={};
    this.options={};

    this.timer=null;
    this.timer1=null;
    this.timer2=null;
    this.timeout=0;
    this.timeout1=0;
    this.timeout2=0;

    this.first=true;
    this.onOff=true;
    this.resend=false;
    this.keyArr=[];

    return this;
};

Socket.prototype={
    init:function(options){
        this.options=options;
        this.timeout=options.timeout||5000;
        this.timeout1=options.timeout1||10000;
        this.timeout2=options.timeout2||10000;
        this.reconect();

        return this;
    },
    reconect:function(){
        var This=this;

        function start(){
            This.ws=new WebSocket(This.options.url);

            bind(This.ws,'open',function(res){
                This.heartbeat();
                This.pubSend();
            });

            bind(This.ws,'message',function(res){
                This.heartbeat();
                This.pubSend();
            });

            bind(This.ws,'close',function(res){
                This.reconect();
                This.resend=true;

            });

            bind(This.ws,'error',function(res){
                This.reconect();
                This.resend=true;
            });
        };

        if(This.onOff){
            if(This.first){
                This.first=false;
                start();
            }else if(!This.ws||This.ws.readyState!=1){
                clearTimeout(This.timer);
                This.timer=setTimeout(start,This.timeout);
            }
        }

        return this;
    },
    messageFn:function(key,successFn,finallyFn){
        return function(res){
            var data=null;

            try{
                data=JSON.parse(res.data);
                data.data=JSON.parse(data.data);
            }catch(e){}

            finallyFn&&finallyFn(data,res);
            if(data&&data.reqToken==key){
                successFn&&successFn(data,res);
            }
        };
    },
    heartbeat:function(){
        var This=this;

        if(!This.timer1){
            clearTimeout(This.timer1);
            clearTimeout(This.timer2);

            This.timer1=setTimeout(function(){
                This.timer1=null;
                This.options.heartbeatJson&&This.ws&&This.ws.send(JSON.stringify(This.options.heartbeatJson));
                if(!This.ws||This.ws.readyState!=1){
                    This.timer2=setTimeout(function(){
                        This.ws&&This.ws.close();
                    },This.timeout2);
                }
            },This.timeout1);
        }

        return this;
    },
    pubSend:function(){
        if(this.resend){
            this.resend=false;
            this.paramsJson=copyJson(this.deleteParamsJson);
            this.deleteParamsJson={};
        }

        if(this.ws.readyState==1){
            for(var attr in this.paramsJson){
                bind(this.ws,'message',this.messageFnJson[attr]);
                this.ws.send(this.paramsJson[attr]);
                this.deleteParamsJson[attr]=this.paramsJson[attr];
                delete this.paramsJson[attr];
            }
        }
    },
    send:function(params,successFn,finallyFn,intervalSendFn){
        //send函数中的params指定reqToken（注意在别重复）时，可以给clearOne传reqToken取消订阅该业务的函数，否则clearOne只能取消最后一个订阅函数
        var This=this;
        var key=params.reqToken||soleString32();
        var messageFn=This.messageFn(key,successFn,finallyFn);

        params.reqToken=key;
        params=JSON.stringify(params);

        if(This.ws.readyState==1){
            bind(This.ws,'message',messageFn);
            This.ws.send(params);
            This.deleteParamsJson[key]=params;
        }else{
            This.paramsJson[key]=params;
        }

        intervalSendFn&&intervalSendFn(function(){
            This.ws.send(params);
        });

        This.keyArr.push(key);
        This.messageFnJson[key]=messageFn;

        return this;
    },
    open:function(){
        this.onOff=true;
        this.reconect();

        return this;
    },
    close:function(){
        this.onOff=false;
        this.ws&&this.ws.close();
        this.ws=null;

        return this;
    },
    clearOne:function(reqToken){
        //send函数中的params指定reqToken（注意在别重复）时，可以给clearOne传reqToken取消订阅该业务的函数，否则clearOne只能取消最后一个订阅函数
        var key=reqToken||this.keyArr.pop();

        if(key&&this.messageFnJson[key]){
            unbind(this.ws,'message',this.messageFnJson[key]);
            delete this.messageFnJson[key];
            delete this.deleteParamsJson[key]
        }

        return this;
    },
    clearAll:function(){
        for(var attr in this.messageFnJson){
            this.clearOne();
        }

        return this;
    },
    logState:function(str){
        console.log(str,'ws.readyState：'+this.ws.readyState);

        return this;
    },
};

//原生常用方法封装
function Id(id){
    return document.getElementById(id);
};
function Class(Class){
    return document.getElementsByClassName(Class);
};
function Tag(tag){
    return document.getElementsByTagName(tag);
};
function QS(Class){//带上选择符号(包括属性)，只能选一组中的一个元素
    return document.querySelector(Class);
};
function QSA(Class){//带上选择符号(包括属性)，能选一组元素
    return document.querySelectorAll(Class);
};
function Create(tag){
    return document.createElement(tag);
};
function Add(obj,obj1){
    obj.appendChild(obj1);
};
function Insert(obj,obj1,obj2){//父元素，要插入的元素，插入元素的后一个兄弟元素
    obj.insertBefore(obj1,obj2);
};
function Remove(obj,obj1){
    obj.removeChild(obj1);
};
function AddClass(obj,className){
    obj.classList.add(className);
};
function RemoveClass(obj,className){
    obj.classList.remove(className);
};
function ToggleClass(obj,className){
    obj.classList.toggle(className);
};
function HasClass(obj,className){
    return obj.classList.contains(className);
};
function parent(obj){
    return obj.parentElement||obj.parentNode;
};
function prevSibling(obj){
    return obj.previousElementSibling||obj.previousSibling;
};
function nextSibling(obj){
    return obj.nextElementSibling||obj.nextSibling;
};
function firstChild(obj){
    return obj.firstElementChild||obj.firstChild;
};
function lastChild(obj){
    return obj.lastElementChild||obj.lastChild;
};
function Scroll(obj,position,dis){
    var position='scroll'+position.toLowerCase().replace(/^[a-z]{1}/,position.charAt(0).toUpperCase());

    if(obj===document||obj===document.body){
        document.documentElement[position]=document.body[position]=dis;
    }else{
        obj[position]=dis;
    }
};

//根据屏幕大小设置根节点字体大小
//getFontSize（是否返回根节点fontSize大小）
//basic（基准值）
//maxScale（最大缩放比例）
/*
    最好结合postcss-pxtorem插件自动转换px为rem

    安装：
    npm i postcss-pxtorem -D

    修改根目录 .postcssrc.js 文件：
    注意：rootValue和basic（基准值）保持一致
    "postcss-pxtorem": {
        "rootValue": 100,
        "minPixelValue": 2, //如px小于这个值，就不会转换了
        "propList": ["*"], // 如需开启pxToRem模式，请在数组中加入"*"
        "selectorBlackList": [] //如需把css选择器加入黑名单，请在数组中加入对应的前缀，比如"mint-"
    }

    或者修改webpack.dev.conf.js和webpack.prod.conf.js
    test: /\.(css|scss|less)$/,
    use:[
        {
            options:{
                plugins:()=>[
                    require('postcss-pxtorem')({
                        "rootValue": 100,
                        "minPixelValue": 2, //如px小于这个值，就不会转换了
                        "propList": ["*"], // 如需开启pxToRem模式，请在数组中加入"*"
                        "selectorBlackList": [] //如需把css选择器加入黑名单，请在数组中加入对应的前缀，比如"mint-"
                    }),
                ],
            },
        },
        {
            loader: require.resolve('sass-loader'),
        },
    ],
*/
function htmlFontSize(getFontSize,basic,maxScale){
    var getFontSize=getFontSize||false;
    var basic=basic||100;
    var maxScale=maxScale||1.5;

    function change(){
        var oHtml=document.documentElement;
        var iWidth=oHtml.clientWidth;
        var iScale=Math.min(iWidth/375,maxScale);
        var fontSize=basic*iScale;

        if(!getFontSize){
            oHtml.style.fontSize=fontSize+'px';
        }else{
            return fontSize;
        }
    };

    if(!getFontSize){
        change();
        window.onresize=change;
    }else{
        return change();
    }
};

//转换单位为rem
//需要引入import postcssrc from 'root/.postcssrc';
function unit(num,basic){
    var length=0;

    if(postcssrc){
        length=postcssrc.plugins['postcss-pxtorem'].propList.length;
    }

    if(num==0)return 0;
    if(length==0)return num+'px';
    var basic=basic||100;
    var value=num/basic;

    return (value<0.01?0.01:value)+'rem';
};

//获取对象样式
function getStyle(obj,attr){
    return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
};

//获取到document的位置
function getPos(obj,attr){
    var value=0;
    var iPos=0;
    var i=0;
    while(obj){
        iPos=attr=='left'?obj.offsetLeft:iPos=obj.offsetTop;
        value+=iPos;
        obj=obj.offsetParent;
        i++;
    }
    return value;
};

//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）
function Type(obj){
    var arr=['null','nan','function','number','string','array','object'];
    if(obj===null){
        return 'null';
    }
    if(obj!==obj){
        return 'nan';
    }
    if(typeof Array.isArray==='function'){
        if(Array.isArray(obj)){ //浏览器支持则使用isArray()方法
            return 'array';
        }
    }else{                      //否则使用toString方法
        if(Object.prototype.toString.call(obj)==='[object Array]'){
            return 'array';
        }
    }
    return (typeof obj).toLowerCase();
};

//定时器增强requestAnimationFrame与setInterval兼容
function yydTimer(fn,msec){
    var id=null;
    var clear=null;
    var lastT=null;
    var msec=msec||1000/60;

    if(msec<17.1)msec=17.1;//解决间隔小于17.1的BUG
    if(window.requestAnimationFrame){
        function animate(time){
            id=requestAnimationFrame(animate);

            if(lastT==null){
                lastT=parseInt(time);
            }
            if(parseInt(time)%msec<lastT){
                fn&&fn(clear,id);
            }
            lastT=parseInt(time)%msec;

            clear=function(){
                cancelAnimationFrame(id);
            };

            return id;
        };
        id=animate(0);
    }else{
        id=setInterval(function(){
            fn&&fn(clear,id);
        },msec);

        clear=function(){
            clearInterval(id);
        };
    }

    window.onhashchange=function(){
        clear();
    };
};

//绑定事件，可重复绑定('事件名称'必须加引号)
function bind(obj,evname,fn){
    if(obj.addEventListener){
        obj.addEventListener(evname,fn,false);
        if(evname=='mousewheel'){
            obj.addEventListener('DOMMouseScroll',fn,false);
        }
    }else{
        obj.attachEvent('on'+evname,function(){
            fn.call(obj);
        });
    }
};

//取消绑定，可重复取消('事件名称'必须加引号)
function unbind(obj,evname,fn){
    if(obj.removeEventListener){
        obj.removeEventListener(evname,fn,false);
        if(evname=='mousewheel'){
            obj.removeEventListener('DOMMouseScroll',fn,false);
        }
    }else{
        obj.detachEvent('on'+evname,fn);
    }
};

//json克隆副本
function copyJson(json){
    return json?JSON.parse(JSON.stringify(json)):json;
};

//绑定的方式阻止事件冒泡
function cBub(ev){
    var ev=ev||window.event;
    if(ev.stopPropagation)ev.stopPropagation(); //标准
    ev.cancelBubble=true;//ie
};

//绑定的方式阻止默认事件
function pDef(ev){
    var ev=ev||window.event;
    if(ev.preventDefault)ev.preventDefault();   //标准
    ev.returnValue=false;//ie
};

//网络处理
function networkHandle(onlineFn,offlineFn){
    window.onoffline=function(){
        alerts('网络已断开！');
        offlineFn&&offlineFn();
    };
    window.ononline=function(){
        alerts('网络已连接！');
        setTimeout(function(){
            webviewRefresh();
        },3000);
        onlineFn&&onlineFn();
    };
};

//开发与线上控制台模式切换
//arr(数组里面选定的都不输出)
function consoleNull(arr){
    for(var i=0;i<arr.length;i++){
        window.console[arr[i]]=function(){};
    }
};

//打开手机调试模式，2秒钟连续点击5下触发，右下角会出现图标，本地调试有效
//whiteList（允许调试的域名列表，例子如下：）
//openMoblieDebug(['ih.dev.aijk.net','ih2.test.aijk.net']);
function openMoblieDebug(whiteList){
    var whiteList=whiteList||[];
    var hostname=window.location.hostname;
    var open=hostname=='localhost'||hostname=='127.0.0.1'||hostname=='172.16.21.92'||~whiteList.indexOf(hostname);
    var count=0;

    function openFn(){
        var oErudaScript=document.getElementById('//cdn.jsdelivr.net/npm/eruda');

        if(!oErudaScript&&open){
            var oScript=document.createElement('script');

            oScript.id='//cdn.jsdelivr.net/npm/eruda';
            oScript.src='//cdn.jsdelivr.net/npm/eruda';
            oScript.onload=function(){
                eruda.init();
            };
            document.body.appendChild(oScript);
        }
    };

    function openJudgeFn(){
        var timer=null;

        count++;
        if(!timer){
            timer=setTimeout(function(){
                if(count>=5){
                    unbind(document,'click',openJudgeFn);
                    openFn();
                }else{
                    count=0;
                }
                timer=null;
            },2000);
        }
    };

    if(open){
        unbind(document,'click',openJudgeFn);
        bind(document,'click',openJudgeFn);
    }
};

//自动点击事件
function autoEvent(obj,event){
    if(document.createEvent){
        var evObj=document.createEvent('MouseEvents');

        evObj.initEvent(event,true,false);
        obj.dispatchEvent(evObj);
    }else if(document.createEventObject){
        obj.fireEvent(event);
    }
};

//自定义事件的实现
var customEvent={
    json:{},
    on:function(evName,fn){
        if(Type(this.json[evName])!='object'){
            this.json[evName]={};
        }
        if(Type(fn)=='function'){
            fn.id=soleString32();
            this.json[evName][fn.id]=fn;
        }
        return this;
    },
    emit:function(evName,data){
        var evFnArr=this.json[evName];

        if(Type(evFnArr)=='object'){
            for(var attr in this.json[evName]){
                if(Type(this.json[evName][attr])=='function'){
                    this.json[evName][attr](data);
                }
            }
        }
        return this;
    },
    remove:function(evName,fn){
        var evFnArr=this.json[evName];

        if(Type(evName)=='string'&&Type(evFnArr)=='object'){
            if(Type(fn)=='function'){
                if(fn.id){
                    delete this.json[evName][fn.id];
                }else{
                    for(var attr in this.json[evName]){
                        if(this.json[evName][attr]+''===fn+''){
                            delete this.json[evName][attr];
                            break;
                        }
                    }
                }
            }else{
                delete this.json[evName];
            }
        }
        return this;
    }
};

//生成32位唯一字符串(大小写字母数字组合)
function soleString32(){
    var str='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var timestamp=+new Date()+Math.floor(Math.random()*10);
    var resultStr='';

    for(var i=0;i<19;i++){
        resultStr+=str.charAt(Math.floor(Math.random()*str.length));
    }
    resultStr+=timestamp;

    resultStr=resultStr.split('');
    resultStr.sort(function(a,b){
        return Math.random()-0.5;
    });
    resultStr=resultStr.join('');
    return resultStr;
};

//时间变成两位数
function toTwo(n){
    return +n<10?'0'+n:n+'';
};

//补零函数
//value（需要补零的值）
//length（需要补零的长度(数量)）
//isBehind（是否在末尾补零）
function zeroFill(value,length,isBehind){
    var value=value||'';
    var length=length>0?length:0;
    var zeroStr='';

    for(var i=0;i<length;i++){
        zeroStr+='0';
    }

    return !isBehind?zeroStr+value:value+zeroStr;
};

//算出本月天数
//getMonth获得的月份是从0开始，要加1
//下月第0天就是最后一天，-1=倒数第二天，国外月份从0开始,逗号隔开年月日new Date之后月份要大一个月，字符串是正常的
function manyDay(year,month){
    var nextMonth=new Date(year,month,0);

    return nextMonth.getDate();
};

//正常化日期
function normalDate(oDate){
    var oDate=oDate;
    var reg=/\-+/g;

    if(Type(oDate)=='string'){
        oDate=oDate.split('.')[0];//解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
        oDate=oDate.replace(reg,'/');//解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }

    oDate=new Date(oDate);
    return oDate;
};

//获取星期
function getWeekName(oDate,str){
    var oDate=normalDate(oDate||new Date());
    var iWeek=oDate.getDay();
    var str=str||'星期';
    var arr=['日','一','二','三','四','五','六'];

    return str+arr[iWeek];
};

//根据出生日期获取年龄
function getAge(date,real){
    var bDate=normalDate(date);
    var bYear=bDate.getFullYear();
    var bMonth=bDate.getMonth();
    var bDay=bDate.getDate();
    var nDate=new Date();
    var nYear=nDate.getFullYear();
    var nMonth=nDate.getMonth();
    var nDay=nDate.getDate();
    var dYear=nYear-bYear;
    var dMonth=(nMonth-bMonth)/12;
    var dDay=(nDay-bDay)/365;
    var diff=dYear+dMonth+dDay;
    var age=diff>0?(real?diff:Math.floor(diff)):0;

    return age;
};

//根据身份证号码获取性别和生日
function getSexAndDob(identity){
    var sexAndDob={};

    if(regJson.identity.reg.test(identity)){
        var sex=identity.substring(identity.length-2,identity.length-1);
        var dob=identity.substring(6,14);

        sex=sex&1==1?'1':'2';
        dob=`${dob.substring(0,4)}-${dob.substring(4,6)}-${dob.substring(6)}`;

        sexAndDob={
            sex:sex,
            dob:dob,
        };
    }

    return sexAndDob;
};

//身份证号码校验、获取身份证信息以及计算最后一位校验码、转换15位身份证为18位
/*
    校验码计算
    1、十七位数字本体码加权求和公式
    S = Sum(Ai * Wi), i = 0, ... , 16 ，先对前17位数字的权求和
    Ai：表示第i位置上的身份证号码数字值
    Wi：表示第i位置上的加权因子
    7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2

    2、计算模
    Y = mod(S, 11)

    3、通过模得到对应的校验码
    Y： 0 1 2 3 4 5 6 7 8 9 10
    校验码： 1 0 X 9 8 7 6 5 4 3 2
    也就是说，如果得到余数为1则最后的校验位p应该为对应的0。

    15位的号码：
    a a b b c c y y m m d d x x s
    18位的号码：
    a a b b c c y y y y m m d d x x s p
*/
var idCardNo={
    citys:{11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门',91:'国外'},//省,直辖市代码
    powers:['7','9','10','5','8','4','2','1','6','3','7','9','10','5','8','4','2'],//每位加权因子
    lastCodes:['1','0','X','9','8','7','6','5','4','3','2'],//第18位校检码
    normalIdCardNo:function(idCardNo){//格式化15身份证号码为18位
        var id17=idCardNo.substring(0,6)+'19'+idCardNo.substring(6);

        return idCardNo.length==15?id17+this.getLastCode(id17):idCardNo;
    },
    getLastCode:function(idCardNo){//根据身份证前17位计算出最后一位校检码
        var idCardNo=this.normalIdCardNo(idCardNo);
        var id17=idCardNo.substring(0,17);
        var sum=0;
        var codeIndex=0;

        for(var i=0;i<17;i++){
            sum+=id17.charAt(i)*this.powers[i];
        }

        codeIndex=sum%11;

        return this.lastCodes[codeIndex];
    },
    getIdCardNoInfo:function(idCardNo){//获取身份证信息
        var idCardNo=this.normalIdCardNo(idCardNo);
        var cityCode=idCardNo.substring(0,2);
        var dobCode=idCardNo.substring(6,14);
        var sexCode=idCardNo.substring(idCardNo.length-2,idCardNo.length-1);
        var bYear=dobCode.substring(0,4);
        var bMonth=dobCode.substring(4,6);
        var bDay=dobCode.substring(6);
        var bDate=new Date(bYear,bMonth-1,bDay);
        var dob=dateFormat0(bDate,'yyyy-MM-dd');
        var ageCode=getAge(dob)+'';
        var idCardNoInfo={
            city:this.citys[cityCode],
            dob:dob,
            sex:sexCode&1==1?'男':'女',
            age:getAge(dob)+'岁',
            cityCode:cityCode,
            dobCode:dobCode,
            sexCode:sexCode,
            ageCode:ageCode,
        };

        return this.checkIdCardNo(idCardNo)?idCardNoInfo:this.getIdCardNoCheckInfo(idCardNo);
    },
    checkAddressCode:function(idCardNo){//检查地址码
        var idCardNo=this.normalIdCardNo(idCardNo);
        var addressCode=idCardNo.substring(0,6);
        var reg=/[1-8]\d{5}/;

        return reg.test(addressCode)&&this.citys[addressCode.substring(0,2)]?true:false;
    },
    checkDobCode:function(idCardNo){//检查日期码
        var idCardNo=this.normalIdCardNo(idCardNo);
        var dobCode=idCardNo.substring(6,14);
        var reg=/[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])/;
        var oDate=new Date();
        var bYear=dobCode.substring(0,4);
        var bMonth=dobCode.substring(4,6);
        var bDay=dobCode.substring(6);
        var bDate=new Date(bYear,bMonth-1,bDay);
        var cYear=bDate.getFullYear();
        var cMonth=bDate.getMonth()+1;
        var cDay=bDate.getDate();

        return reg.test(dobCode)&&bDate<=oDate&&cYear==bYear&&cMonth==bMonth&&cDay==bDay?true:false;
    },
    checkLastCode:function(idCardNo){//检查身份证最后一位校验码
        var idCardNo=this.normalIdCardNo(idCardNo);
        var lastCode=idCardNo.charAt(idCardNo.length-1);

        return lastCode==this.getLastCode(idCardNo)?true:false;
    },
    getIdCardNoCheckInfo:function(idCardNo){//获取身份证号码校验信息
        var idCardNo=this.normalIdCardNo(idCardNo);
        var checkResult=[
            this.checkAddressCode(idCardNo),
            this.checkDobCode(idCardNo),
            this.checkLastCode(idCardNo),
        ];
        var posIndex=checkResult.indexOf(false);
        var result=~posIndex?posIndex:true;
        var msgJson={
            '-1':'身份证号码校验通过',
            '0':'地址码校验不通过',
            '1':'日期码校验不通过',
            '2':'最后一位校验码校验不通过',
        };

        return {
            pass:result===true,
            code:posIndex,
            msg:msgJson[posIndex],
        };
    },
    checkIdCardNo:function(idCardNo){//检查身份证号码
        var result=this.getIdCardNoCheckInfo(idCardNo);

        return result.pass;
    },
};

//时间格式化函数（根据秒数来格式化）
//seconds（多少秒）
//fmt（格式匹配）
//adjustFmt（是否自动调整格式，会删除无效的格式）
//年(y)、月(M)、日(d)、小时(h)、分(m)、秒(s)，都可以用1到任意位占位符
/*
    例子：
    secondFormat0(86400*365+86400*30+86400+3600+60+1,'yy/MM/dd hh:mm:ss'); //01/01/01 01:01:01
    secondFormat0(86400+3600+60+1,'hh:mm:ss'); //25:01:01
*/
function secondFormat0(seconds,fmt,adjustFmt){
    var fmt=fmt||'yy/MM/dd hh:mm:ss';
    var aMinute=60;
    var aHour=aMinute*60;
    var aDay=aHour*24;
    var aMonth=aDay*30;
    var aYear=aDay*365;

    var iYears=Math.floor(seconds/aYear);
    var dMonth=seconds-iYears*aYear>0?seconds-iYears*aYear:0;
    dMonth=~fmt.indexOf('y')?dMonth:seconds;
    var iMonths=Math.floor(dMonth/aMonth);
    var dDay=dMonth-iMonths*aMonth>0?dMonth-iMonths*aMonth:0;
    dDay=~fmt.indexOf('M')?dDay:seconds;
    var iDays=Math.floor(dDay/aDay);
    var dHour=dDay-iDays*aDay>0?dDay-iDays*aDay:0;
    dHour=~fmt.indexOf('d')?dHour:seconds;
    var iHours=Math.floor(dHour/aHour);
    var dMinutes=dHour-iHours*aHour>0?dHour-iHours*aHour:0;
    dMinutes=~fmt.indexOf('h')?dMinutes:seconds;
    var iMinutes=Math.floor(dMinutes/aMinute);
    var dSeconds=dMinutes-iMinutes*aMinute?dMinutes-iMinutes*aMinute:0;
    dSeconds=~fmt.indexOf('m')?dSeconds:seconds;
    var iSeconds=Math.floor(dSeconds);

    var time={
        'y+':iYears,
        'M+':iMonths,
        'd+':iDays,
        'h+':iHours,
        'm+':iMinutes,
        's+':iSeconds,
    };
    var result='';
    var value='';

    for(var attr in time){
        if(new RegExp('('+attr+')').test(fmt)){
            result=RegExp.$1;
            value=time[attr]+'';
            value=result.length==1?value:zeroFill(value,result.length-value.length);

            if(adjustFmt&&(+value)===0){
                var reg=new RegExp(attr+'([^a-zA-Z]+)[a-zA-Z]+');
                var matchStr=fmt.match(reg);

                if(matchStr){
                    fmt=fmt.replace(matchStr[1],'');
                    value='';
                }
            }

            fmt=fmt.replace(result,value);
        }
    }

    return fmt;
};

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
/*
    例子：
    dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S'); //2018-12-21 17:24:33.664
    dateFormat0(new Date(),'y-M-d h:m:s.S/q'); //2018-12-21 17:24:33.666/4
*/
function dateFormat0(oDate,fmt){
    var fmt=fmt||'yyyy/MM/dd hh:mm:ss';
    var oDate=normalDate(oDate||new Date());
    var date={
        'y+':oDate.getFullYear(),              //年
        'M+':oDate.getMonth()+1,               //月
        'd+':oDate.getDate(),                  //日
        'h+':oDate.getHours(),                 //时
        'm+':oDate.getMinutes(),               //分
        's+':oDate.getSeconds(),               //秒
        'S':oDate.getMilliseconds(),           //毫秒
        'q+':Math.ceil((oDate.getMonth()+1)/3),//季度，+3为了好取整
    };
    var result='';
    var value='';

    for(var attr in date){
        if(new RegExp('('+attr+')').test(fmt)){
            result=RegExp.$1;
            value=date[attr]+'';
            fmt=fmt.replace(result,result.length==1?value:(attr=='y+'?value.substring(4-result.length):toTwo(value)));
        }
    }

    return fmt;
};

//时间格式化(主要用于格式化历史时间到当前时间是多少秒到多少年前)
//oDate（时间戳或字符串日期都支持）
function dateFormat1(oDate){
    var oDate=normalDate(oDate);

    if(+oDate>=+new Date()){
        return '刚刚';
    }
    var lookTime=+new Date()-(+oDate);
    var seconds=Math.floor(lookTime/(1000));
    var minutes=Math.floor(lookTime/(1000*60));
    var hours=Math.floor(lookTime/(1000*60*60));
    var days=Math.floor(lookTime/(1000*60*60*24));
    var months=Math.floor(lookTime/(1000*60*60*24*30));
    var years=Math.floor(lookTime/(1000*60*60*24*30*12));

    if(seconds<60){
        lookTime=seconds+'秒前';
    }else if(minutes<60){
        lookTime=minutes+'分钟前';
    }else if(hours<24){
        lookTime=hours+'小时前';
    }else if(days<30){
        lookTime=days+'天前';
    }else if(months<12){
        lookTime=months+'个月前';
    }else{
        lookTime=years+'年前';
    }
    return lookTime;
};

//金额格式化
function amountFormat0(value,dLength,cLength){
    var oldValue=value;
    var value=+value;
    var arr=[];
    var dLength=dLength||2;
    var cLength=cLength||3;
    var zero='';

    for(var i=0;i<dLength;i++){
        zero+='0';
    }

    if(Type(value)=='number'){
        value+='';
        value=value.split('.');
        value[0]=value[0].split('');
        value[1]=(value[1]||'')+zero;
        value[1]=value[1].substring(0,dLength);

        arr.unshift('.',value[1]);
        while(value[0].length>cLength){
            arr.unshift(',',value[0].splice(value[0].length-cLength,cLength).join(''));
        }

        arr=value[0].join('')+arr.join('');
    }else{
        arr=oldValue;
    }

    if(arr&&arr.length)arr=arr.replace('-,','-');
    return arr;
};

//判断是否是手机浏览器
function isPhone(){
    var reg=/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    return window.navigator.userAgent.match(reg)?true:false;
};

//判断是否是微信浏览器
function isWeixin(){
    var reg=/(micromessenger)/i;
    return window.navigator.userAgent.match(reg)?true:false;
};

//判断是否是苹果浏览器
function isSafari(){
    var reg=/(pad|iPhone|Mac|ios)/i;
    return window.navigator.userAgent.match(reg)?true:false;
};

//判断设备跳转不同地址
function goPage(moHref,pcHref){
    var reg=/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

    window.location.href=navigator.userAgent.match(reg)?moHref:pcHref;
};

//cookie操作
var cookie={
    set:function(key,value,sec){
        var value=value;
        var sec=sec||60*60*24*30;
        var type=Type(value);
        var oDate=new Date();

        switch(type){
            case 'object':
            case 'array':
                    value=JSON.stringify(value);
                break;
        }

        oDate.setSeconds(oDate.getSeconds()+sec);
        oDate=oDate.toGMTString();
        document.cookie=key+'='+encodeURIComponent(value)+';expires='+oDate;
    },
    get:function(key){
        var str=document.cookie;
        var reg=new RegExp('(^|(;\\s))'+key+'=([^;\\s]+)((;\\s)|$)');
        var result=str.match(reg);

        result=result?decodeURIComponent(result[3]):'';

        try{
            result=Type(+result)=='number'?result:JSON.parse(result);
        }catch(e){}

        return result;
    },
    getKeys:function(){
        var str=document.cookie;
        var reg1=/\=+/g;
        var reg2=/(\;|[\;\s])+/g;

        try{
            if(str.length){
                str=str.replace(reg1,'":"');
                str=str.replace(reg2,'","');
                str='{"'+str;
                str+='"}';
                str=JSON.parse(str);
            }else{
                str={};
            }
        }catch(e){}

        return str;
    },
    getAll:function(){
        var json={};
        var keys=this.getKeys();

        for(var attr in keys){
            json[attr]=this.get(attr);
        }

        return  json;
    },
    remove:function(key){
        var oDate=new Date();

        oDate.setDate(oDate.getDate()-1);
        oDate=oDate.toGMTString();
        document.cookie=key+'=;expires='+oDate;
    },
    clear:function(){
        var keys=this.getKeys();

        for(var attr in keys){
            this.remove(attr);
        }
    },
};

//创建Store对象(增强localStorage或sessionStorage，直接存取对象或者数组)
var Store=function(){
    this.name='Store';
};

Store.prototype={
    init:function(type){
        this.store=window[type];
        return this;
    },
    set:function(key,value){
        var type=Type(value);

        switch(type){
            case 'object':
            case 'array':
                    this.store.setItem(key,JSON.stringify(value));
                break;
            default :
                    this.store.setItem(key,value);
        }

    },
    get:function(key){
        var value=this.store.getItem(key);

        try{
            value=Type(+value)=='number'?value:JSON.parse(value);
        }catch(e){}

        return value;
    },
    getAll:function(){
        var store=copyJson(this.store);
        var json={};
        var value='';

        for(var attr in store){
            try{
                value=store[attr];
                value=Type(+value)=='number'?value:JSON.parse(value);
            }catch(e){}
            json[attr]=value;
        }
        return  json;
    },
    remove:function(key){
        this.store.removeItem(key);
    },
    clear:function(){
        this.store.clear();
    },
};

//localStorage操作
var lStore=new Store().init('localStorage');

//sessionStorage操作
var sStore=new Store().init('sessionStorage');

//返回当前地址?后面的参数的json格式(用于submit提交的str='1'&str1='2'格式)
function strToJson(str){
    var str=str||window.location.search;
    var reg=/&+/g;
    var reg1=/=+/g;

    try{
        if(str.match(/.+=/)){
            str=decodeURI(str);
            str=str.replace('?','');
            str=str.replace(reg,'","');
            str=str.replace(reg1,'":"');
            str='{"'+str+'"}';
            str=JSON.parse(str);
        }else{
            str={};
        }
    }catch(e){
        str={};
    }
    return str;
};

//返回当前地址?后面的参数的json格式(用于自己拼接的str={}&str1={}格式)
//注意要拼接标准json格式
function strToJson1(str){
    var str=str||window.location.search;
    var reg=/&+/g;
    var reg1=/=+/g;
    var reg2=/^\?.+$/;

    try{
        if(str.match(/.+=/)){
            str=decodeURI(str);
            str=reg2.test(str)?str.replace('?','"'):'"'+str;
            str=str.replace(reg,',"');
            str=str.replace(reg1,'":');
            str='{'+str+'}';
            str=JSON.parse(str);
        }else{
            str={};
        }
    }catch(e){
        str={};
    }
    return str;
};

//传入json，转换成带?的表单格式的url地址
//json(要转换的对象)
//arr(要删除json的key的数组)
//href(要定制的href)
function jsonToStr(json,arr,href){
    var str='';
    var json=json||{};
    var arr=arr||[];
    var href=href||(window.location.origin+window.location.pathname);

    for(var i=0;i<arr.length;i++){
        delete json[arr[i]];
    }
    for(var attr in json){
        str+=attr+'='+json[attr]+'&';
    }
    str=href+'?'+str.substr(0,str.length-1);
    return str;
};

//正则匹配获取search参数
//不会有报错，比较安全
function getSearch(key,str){
    var reg=new RegExp('(^|&|\\?)'+key+'=([^&]+)(&|$)');
    var str=str||window.location.search;
    var matchStr=str.match(reg);

    return matchStr&&matchStr[2]||null;
};

//利用闭包实现函数防抖
//fn（用执行的函数）
//msec（执行间隔，毫秒）
//使用示例（mousemove300ms后执行一次count）
//var iCount=1;
//
//var count=antiShake(function(){
//  console.log(iCount++);
//});
//
//document.onmousemove=function(){
//  count();
//};
function antiShake(fn,msec){
    var timer=null;

    return function(){
        var This=this;
        var Arguments=arguments;

        clearTimeout(timer);
        timer=setTimeout(function(){
            fn.apply(This,Arguments);
        },msec||300);
    };
};

//利用闭包实现函数节流
//fn（用执行的函数）
//msec（执行间隔，毫秒）
//使用示例（mousemove每300ms执行一次count）
//var iCount=1;
//
//var count=throttle(function(){
//  console.log(iCount++);
//});
//
//document.onmousemove=function(){
//  count();
//};
function throttle(fn,msec){
    var timer=null;
    var first=true;

    return function(){
        var This=this;
        var Arguments=arguments;

        if(first){
            first=false;
            fn.apply(This,Arguments);
        }else if(!timer){
            timer=setTimeout(function(){
                clearTimeout(timer);
                timer=null;
                fn.apply(This,Arguments);
            },msec||300);
        }
    };
};

//提示框插件
//str（提示的字符串）
//msec（提示框消失的时间，默认3秒）
//noMask（是否去除遮罩）
function alerts(str,msec,noMask){
    var oMask=document.createElement('div');
    var oWrap=document.createElement('div');
    var msec=msec||3000;

    oMask.style.cssText='width:100%;height:100%;position:fixed;left:0;top:0;z-index:99999;';
    oWrap.style.cssText='box-sizing:border-box;min-width:140px;max-width:100%;padding:0 20px;height:50px;line-height:50px;text-align:center;border-radius:5px;background:rgba(0,0,0,0.6);color:#fff;font-size:14px;position:fixed;top:50%;left:50%;z-index:99999;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,0,0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity 3s ease-in 0s;-webkit-transition:opacity 3s ease-in 0s;opacity:1;';
    oWrap.innerHTML=str;
    oWrap.style.transitionDuration=(msec/1000/2)+'s';

    if(!noMask){
        oMask.appendChild(oWrap);
        document.body.appendChild(oMask);
    }else{
        document.body.appendChild(oWrap);
    }

    setTimeout(function(){
        oWrap.style.opacity=0;
    },msec/2);

    setTimeout(function(){
        if(!noMask){
            document.body.removeChild(oMask);
        }else{
            document.body.removeChild(oWrap);
        }
    },msec);
};

//所有积累正则
//reg（验证正则）
//iReg（输入正则）
//tReg（替换正则）
var regJson={
    int:{
        name:'整型',
        reg:/^[0-9]+$/,
        iReg:/^[0-9]*$/,
        tReg:/[0-9]+/g,
    },
    number:{
        name:'数字',
        reg:/^[0-9]+\.?[0-9]*$/,
        iReg:/^[0-9]*\.?[0-9]*$/,
        tReg:/[0-9]+\.?[0-9]+/g,
    },
    aa:{
        name:'小写字母',
        reg:/^[a-z]+$/,
    },
    AA:{
        nmae:'大写字母',
        reg:/^[A-Z]+$/,
    },
    aA:{
        name:'字母',
        reg:/^[a-zA-Z]+$/,
        iReg:/^[a-zA-Z]*$/,
        tReg:/[a-zA-Z]+/g,
    },
    aa1:{
        name:'小写字母或数字',
        reg:/^[a-z0-9]+$/,
    },
    AA1:{
        name:'大写字母或数字',
        reg:/^[A-Z0-9]+$/,
    },
    aA1:{
        name:'字母和数字',
        reg:/^\w+$/,
    },
    zh:{
        name:'中文',
        reg:/^[\u2E80-\u9FFF]+$/,
        iReg:/^[\u2E80-\u9FFF]*$/,
        tReg:/[\u2E80-\u9FFF]+/g,
    },
    zhEn:{
        name:'中文或英文',
        reg:/^[\u2E80-\u9FFFa-zA-Z]+$/,
        iReg:/^[\u2E80-\u9FFFa-zA-Z]*$/,
        tReg:/[\u2E80-\u9FFFa-zA-Z]+/g,
    },
    mobile:{
        name:'手机号',
        reg:/^1[3-9]{1}\d{9}$/,
        iReg:/^[0-9]{0,11}$/,
    },
    identity:{
        name:'身份证号码',
        reg:/^[1-8]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dxX]$/,
    },
    bankCard:{
        name:'银行卡号',
        reg:/^[0-9]{8,28}$/,
    },
    user:{
        name:'用户名',
        reg:/^[\w-]{3,16}$/,
    },
    password:{
        name:'密码',
        reg:/^[^\u2E80-\u9FFF\s]{6,20}$/,
        iReg:/^[^\u2E80-\u9FFF\s]{0,20}$/,
    },
    email:{
        name:'邮箱',
        reg:/^([\w\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    },
    verifyCode:{
        name:'6位数字验证码',
        reg:/^[0-9]{6}$/,
        iReg:/^[0-9]{0,6}$/,
    },
};

//提示框带多条件阻止
//优先级reg>type>if（校验类型只生效一个）
//arr[{if:'','reg':/^$/,type:'number','value':,'hint':''}]
//if（提示触发的条件）
//reg（正则匹配）
//type（已定义类型正则匹配）
//value（正则验证的值）
//hint（提示的字符串）
//endFn（全部验证通过后才走的回调函数）
//errorFn（参数中返回错误条件的索引）
//msec（提示框消失的时间，默认3秒）
function alertss(arr,endFn,errorFn,msec){
    var onOff=true;
    var errorIndex=-1;

    for(var i=0;i<arr.length;i++){
        var condition=!jsonHasKey(arr[i],'if')||arr[i].if;

        if(arr[i].reg){
            if(condition&&!arr[i].reg.test(arr[i].value)){
                alerts(arr[i].hint,msec);
                onOff=false;
                errorIndex=i;
                break;
            }
        }else if(arr[i].type){
            if(condition&&regJson[arr[i].type]&&!regJson[arr[i].type].reg.test(arr[i].value)){
                alerts(arr[i].hint||'请输入有效的'+regJson[arr[i].type].name,msec);
                onOff=false;
                errorIndex=i;
                break;
            }
        }else if(arr[i].if){
            alerts(arr[i].hint,msec);
            onOff=false;
            errorIndex=i;
            break;
        }
    }

    errorFn&&errorFn(errorIndex);
    onOff&&endFn&&endFn();
};

//判断json是否有某个key，不管是否为空
function jsonHasKey(json,key){
    if(Type(json)!='object'){
        return false;
    }
    return key in json;
};

//判断数组、json、字符串是否所有值都不为空
function allHaveValue(obj){
    var bool=true;

    if(Type(obj)=='array'){
        for(var i=0;i<obj.length;i++){
            if(!obj[i]&&obj[i]!==0){
                bool=false;
                break;
            }
        }
    }else if(Type(obj)=='object'){
        for(var attr in obj){
            if(!obj[attr]&&obj[attr]!==0){
                bool=false;
                break;
            }
        }
    }else{
        if(!obj&&obj!==0){
            bool=false;
        }
    }
    return bool;
};

//预加载插件
//arr(预加载的一组图片地址)
function preload(arr,endFn){
    var newimages=[];
    var iNum=0;

    function loadOver(){
        iNum++;
        if(iNum==arr.length){
            endFn&&endFn(newimages);
        }
    }
    for(var i=0;i<arr.length;i++){
        newimages[i]=new Image();
        newimages[i].crossOrigin='anonymous';
        newimages[i].src=arr[i];
        newimages[i].onload=function(){
            loadOver();
        }
        newimages[i].onerror=function(){
            loadOver();
        }
    }
};

//科学运算（解决js处理浮点不正确的问题）
//num1（要进行运算的第一个数字）
//operator（运算符号,+,-,*,/）
//num2（要进行运算的第二个数字）
function computed(num1,operator,num2){
    var length1=(num1+'').split('.')[1];
    length1=length1?length1.length:0;
    var length2=(num2+'').split('.')[1];
    length2=length2?length2.length:0;

    var integer1=Math.pow(10,length1);
    var integer2=Math.pow(10,length2);
    var iMax=Math.max(integer1,integer2);
    var result='';

    switch(operator){
        case '+':
                num1=num1*iMax;
                num2=num2*iMax;
                result=(num1+num2)/iMax;
            break;
        case '-':
                num1=num1*iMax;
                num2=num2*iMax;
                result=(num1-num2)/iMax;
            break;
        case '*':
                num1=num1*integer1;
                num2=num2*integer2;
                result=(num1*num2)/integer1;
                result=result/integer2;
            break;
        case '/':
                num1=num1*integer1;
                num2=num2*integer2;
                result=(num1/num2)/integer1;
                result=result/integer2;
            break;
    }
    return result;
};

//execCommand对文档执行预定义命令
//aCommandName表示要执行的命令名称，不可省略
//aShowDefaultUI表示是否显示对话框，默认为false，可省略
//aValueArgument表示额外参数值，默认为null，可省略
function execCommandFn(key,value){
    var commandJson={
        //段落格式
        '1_1':'justifyCenter',//居中
        '1_2':'justifyLeft',//左对齐
        '1_3':'justifyRight',//右对齐
        '1_4':'indent',//添加缩进
        '1_5':'outdent',//去掉缩进
        //文本格式
        '2_1':'fontname',//字体类型
        '2_2':'fontsize',//字体大小
        '2_3':'forecolor',//字体颜色
        '2_4':'backColor',//背景色
        '2_5':'bold',//加粗
        '2_6':'italic',//斜体
        '2_7':'underline',//下划线
        //编辑
        '3_1':'copy',//复制
        '3_2':'cut',//剪切
        '3_3':'paste',//粘贴(经测试无效)
        '3_4':'selectAll',//全选
        '3_5':'delete',//删除
        '3_6':'forwarddelete',//后删除
        '3_7':'removeFormat',//清空格式
        '3_8':'redo',//前进一步
        '3_9':'undo',//后退一步
        '3_10':'print',//打印(对firefox无效)
        //插入
        '4_1':'insertHTML',//插入文档
        '4_2':'formatblock',//插入标签
        '4_3':'inserthorizontalrule',//插入<hr>
        '4_4':'insertorderedlist',//插入<ol>
        '4_5':'insertunorderedlist',//插入<ul>
        '4_6':'insertparagraph',//插入<p>
        '4_7':'insertimage',//插入图像
        '4_8':'createlink',//增加链接
        '4_9':'unlink',//删除链接
    };
    var aCommandName=commandJson[key];
    var aShowDefaultUI=false;
    var aValueArgument=value;

    document.execCommand(aCommandName,aShowDefaultUI,aValueArgument);
};

//选中文字兼容
function selectText(endFn){
    var selectedObj=null;
    var rangeObj=null;
    var text='';
    var html='';

    if(document.getSelection){
        var oDiv=document.createElement('div');
        var cloneContents='';

        selectedObj=document.getSelection();//标准
        text=selectedObj.toString();
        if(selectedObj.rangeCount>0){
            rangeObj=selectedObj.getRangeAt(0);
            cloneContents=rangeObj.cloneContents();
            oDiv.appendChild(cloneContents);
            html=oDiv.innerHTML;
        }
    }else{
        selectedObj=document.selection.createRange();//ie
        text=selectedObj.text;
        html=selectedObj.htmlText;
    }

    endFn&&endFn({
        selectedObj:selectedObj,//Selection对象
        rangeObj:rangeObj,//range对象
        text:text,//选中的文字
        html:html,//选中的html
        wrapTag:function(tagName,insert,objStyle,objProperty,objAttribute){//给选中的内容包裹一个标签（并选中）
            var tagName=tagName||'span';
            var objStyle=objStyle||{};
            var objProperty=objProperty||{};
            var objAttribute=objAttribute||{};
            var oRange=selectedObj.rangeCount>0?selectedObj.getRangeAt(0):'';
            var oTag=document.createElement(tagName);

            for(var attr in objStyle){
                oTag.style[attr]=objStyle[attr];
            }
            if(objStyle['text-align']){
                oTag.style.display='block';
            }else if(oTag.style.display=='block'){
                oTag.style.display='unset';
            }

            for(var attr in objProperty){
                oTag[attr]=objProperty[attr];
            }
            for(var attr in objAttribute){
                oTag.setAttribute(attr,objAttribute[attr]);
            }

            execCommandFn('3_7');

            if(!insert&&oRange&&text){
                oTag.innerText=text;
                selectedObj.deleteFromDocument();
                oRange.insertNode(oTag);
                selectedObj.removeAllRanges();
                selectedObj.addRange(oRange);
            }else{
                var oContentediable=QSA('[contenteditable="true"]')[0];
                var oDiv=document.createElement('div');

                oContentediable.focus();
                oDiv.appendChild(oTag);
                execCommandFn('4_1',oDiv.innerHTML);
            }
        },
        getNodeList:function(parent){//获取选中的文本类型的node
            if(!parent)return [];
            var nodeList=[];

            function getNodeListFn(parent){
                if(!parent.childNodes.length)return;
                var childNodes=parent.childNodes;

                for(var i=0;i<childNodes.length;i++){
                    var isContains=selectedObj.containsNode(childNodes[i])&&childNodes[i].data;

                    if(isContains){
                        nodeList.push(childNodes[i]);
                    }else{
                        getNodeListFn(childNodes[i]);
                    }
                }
            };
            getNodeListFn(parent);

            return nodeList;
        },
        getCssText:function(parent){//获取元素以及所有后代的cssText并解析成json
            if(!parent)return {};
            var result={};

            function getCssTextFn(parent){
                if((!parent.childNodes||!parent.childNodes.length)&&(!parent.style||!parent.style.cssText))return;
                var cssText=parent.style.cssText;
                var reg=/(:\s")+/g;
                var reg1=/(";\s)+/g;
                var reg2=/(:\s)+/g;
                var reg3=/(;\s)+/g;

                try{
                    if(cssText.length){
                        cssText=cssText.replace(reg,': ');
                        cssText=cssText.replace(reg1,'; ');
                        cssText=cssText.replace(reg2,'":"');
                        cssText=cssText.replace(reg3,'","');
                        cssText=cssText.substring(0,cssText.length-1);
                        cssText='{"'+cssText;
                        cssText=cssText+'"}';
                        cssText=JSON.parse(cssText);
                    }
                }catch(e){}

                result=Object.assign({},result,cssText||{});
                for(var i=0;i<parent.childNodes.length;i++){
                   getCssTextFn(parent.childNodes[i]);
                }
            };
            getCssTextFn(parent);

            return result;
        },
    });
    return text;
};

//粘贴事件处理
function onPaste(obj,endFn){
    bind(obj,'paste',pasteFn);
    function pasteFn(ev){
        var ev=ev||event;
        var itemList=[];
        var clipboardData=[];
        var windowUrl=window.URL||window.webkitURL;

        if(ev.clipboardData&&ev.clipboardData.items){
            var items=ev.clipboardData.items;

            clipboardData=items;
            for(var i=0;i<items.length;i++){
                var item=items[i];
                var itemJson={};

                itemJson.type=item.kind;
                switch(item.kind){
                    case 'string':
                            item.getAsString(function(text){
                                itemJson.text=text;
                            });
                        break;
                    case 'file':
                            itemJson.file=item.getAsFile();
                            itemJson.previewUrl=windowUrl.createObjectURL(itemJson.file);
                        break;
                }
                itemList.push(itemJson);
            }
        }

        endFn&&endFn(itemList,clipboardData);
    };
};

//图片文件转base64字符串
function imgFilesToBase64(files,endFn){
    var files=files||[];
    var result=[];

    function imgToBase64(file){
        var oReader=new FileReader(file);

        oReader.readAsDataURL(file);
        oReader.onload=function(){
            var oImg=new Image();

            oImg.src=oReader.result;
            oImg.onload=function(){
                var windowUrl=window.URL||window.webkitURL;

                result.push({
                    file:file,
                    prevSrc:windowUrl.createObjectURL(file),
                    base64:oReader.result,
                });

                if(result.length==files.length){
                    endFn&&endFn(result);
                }
            };
        };
    };

    for(var i=0;i<files.length;i++){
        imgToBase64(files[i]);
    }
};

//原生嵌入webview的刷新方法
function webviewRefresh(){
    var rPath='';
    var pathname=window.location.pathname;
    var search='';
    var hash=window.location.hash;
    var v=+new Date();
    var searchJson=strToJson();
    var searchStr='';

    searchJson.v=v;

    for(var attr in searchJson){
        searchStr+=attr+'='+searchJson[attr]+'&';
    }

    var lastIndex=searchStr.lastIndexOf('&');
    if(lastIndex==searchStr.length-1){
        searchStr=searchStr.substring(0,lastIndex);
    }
    search+='?'+searchStr;

    rPath=pathname+search+hash;

    window.location.reload();
    setTimeout(function(){
        window.location.replace(rPath);
    },300);
};

//判断页面是否有上一个历史记录页面，即是否可以后退
/*
    var hasPrevHistoryPageFn=hasPrevHistoryPage();//创建一个闭包函数
    var hasPrevHistoryPageFn.record();//每次切换页面执行记录方法
    hasPrevHistoryPageFn.ableGoBack((bool)=>{//回调中返回是否可以后退的bool值
        console.log(bool);
    });
*/
function hasPrevHistoryPage(){
    var historyArr=sStore.get('hasPrevHistoryPageHistoryArr')||[];
    var historyLength=sStore.get('hasPrevHistoryPageHistoryLength')||[];

    window.onunload=function(){
        sStore.set('hasPrevHistoryPageHistoryArr',historyArr);
        sStore.set('hasPrevHistoryPageHistoryLength',historyLength);
    };

    return{
        record:function(){
            function getPage(number){
                var index=historyLength.indexOf(number);

                return index!=-1?historyArr[index]:'';
            };

            setTimeout(function(){
                var href=window.location.href;
                var length=window.history.length;

                if(href!=historyArr[historyArr.length-1]||length!=historyLength[historyLength.length-1]){
                    if(historyArr.length>=4){
                        historyArr.splice(2,1);
                        historyLength.splice(2,1);
                    }
                    historyArr.push(href);
                    historyLength.push(length);

                    switch(length){
                        case 1:
                        case 2:
                                historyArr[length-1]=href;
                            break;
                    }

                    if(historyArr.length>=4){
                        var currentPage=historyArr[historyArr.length-1];
                        var currentLength=historyLength[historyLength.length-1];
                        var prevPage=historyArr[historyArr.length-2];
                        var prevLength=historyLength[historyLength.length-2];
                        var firstPage=getPage(1);

                        if(currentPage==firstPage&&currentLength==prevLength){
                            historyArr[1]=prevPage;
                        }
                    }
                }
            });
        },
        ableGoBack:function(endFn){
            function getPage(number){
                var index=historyLength.indexOf(number);

                return index!=-1?historyArr[index]:'';
            };

            setTimeout(function(){
                var bool=true;
                var length=window.history.length;

                if(length==1){
                    bool=false;
                }else if(length>=2){
                    var currentPage=historyArr[historyArr.length-1];
                    var prevPage=historyArr[historyArr.length-2];
                    var firstPage=getPage(1);
                    var secondPage=getPage(2);

                    if(currentPage==firstPage&&prevPage==secondPage){
                        bool=false;
                    }
                }

                endFn&&endFn(bool);
            });
        },
    };
};
var hasPrevHistoryPageFn=hasPrevHistoryPage();

//禁止与允许body滚动
function controlBodyScroll(disableScroll,goTop){
    var oHtml=document.documentElement;
    var oBody=document.body;

    if(disableScroll){
        oHtml.style.height='100%';
        oHtml.style.overflowY='hidden';
        oBody.style.height='100%';
        oBody.style.overflowY='hidden';
    }else{
        oHtml.style.height='auto';
        oHtml.style.overflowY='visible';
        oBody.style.height='auto';
        oBody.style.overflowY='visible';
    }

    if(goTop){
        oHtml.scrollTop=oBody.scrollTop=0;
        setTimeout(function(){
            oHtml.scrollTop=oBody.scrollTop=0;
        });
    }
};

//获取图片地址
function getImgUrl(){
    var dev='http://file.dev.aijk.net/file/upload/image/';
    var test='http://file2.test.aijk.net/file/upload/image/';
    var yOfficial='http://yimage.bshcn.com.cn/file/upload/image/';
    var official='http://image.bshcn.com.cn/file/upload/image/';
    var hostname=window.location.hostname;
    var noNative=hostname!='localhost'&&hostname!='127.0.0.1'&&hostname!='172.16.21.92';
    var proxy=CONFIG.dev.proxyTable['/api'].target;
    var url='';

    if(noNative){
        proxy=hostname;
    }

    if(proxy.indexOf('.dev.')!=-1){
        url=dev;
    }else if(proxy.indexOf('.test.')!=-1){
        url=test;
    }else if(proxy.indexOf('yih.')!=-1){
        url=yOfficial;
    }else{
        url=official;
    }

    return url;
};

//原生和h5方法判断
var nativeApi={
    changeStatusBarColor:function(index){//改变原生状态栏主题颜色
        var arr=['light','dark'];
        var index=index||0;

        window.location.href='js://statusbar?flag='+arr[index];
    },
    tel:function(mobile){//打电话兼容原生h5
        if(lStore.get('app')){
            window.location.href='js://tel?number='+mobile;
        }else{
            window.location.href='tel:'+mobile;
        }
    },
    returnApp:function(parent){//返回app
        if(lStore.get('app')){
            window.location.href='js://closeView';
        }else{
            parent.$router.go(-1);
        }
    },
    toLogin:function(){//返回登录页面
        var href=encodeURIComponent(window.location.href);

        if(lStore.get('app')){
            window.location.href='js://login?url='+href;
        }else{

        }
    },
    tokenError:function(){//登录token失效
        var href=encodeURIComponent(window.location.href);

        if(lStore.get('app')){
            window.location.href='js://tokenError?url='+href;
        }else{

        }
    },
    toPerfectInfo:function(){//去完善信息页面
        if(lStore.get('app')){
            window.location.href='js://userInfoError';
        }else{

        }
    },
    toPay:function(parent,payType,body){//支付
        var body=encodeURIComponent(body);

        if(lStore.get('app')){
            window.location.href='js://pay?type='+payType+'&payinfo='+body;
        }else{

        }
    },
    toOrderDetail:function(parent,orderDetailId,itemCode,conStatus,id,replace,goStep){//订单详情
        var codeJson={
            '01':'picInquiry',
            '02':'videoInquiry',
        };

        function toH5Detail(){
            parent.$router[replace?'replace':'push']({
                path:'/user/myInquiry/myInquiryDetail',
                query:{
                    orderDetailId:orderDetailId,
                },
            });
        };

        if(lStore.get('app')){
            conStatus=+conStatus;
            var arr=[11,12,15,45];

            if(conStatus&&arr.indexOf(conStatus)!=-1){
                toH5Detail();
            }else{
                window.location.href='js://'+codeJson[itemCode]+'?state='+(conStatus||52)+'&orderDetailId='+orderDetailId;
                if(id){
                    setTimeout(()=>{
                        parent.$router.go(goStep||-1);
                    },1000);
                }
            }
        }else{
            toH5Detail();
        }
    },
    toEvaluation:function(parent,orderDetailId){//评价详情返回
        if(lStore.get('app')){
            window.location.href='js://evaluate?orderDetailId='+orderDetailId;
        }else{
            parent.$router.push({
                path:'/user/myInquiry/myInquiryDetail',
                query:{
                    orderDetailId:orderDetailId,
                },
            });
        }
    },
    toVisitDispensing:function(data){//复诊配药
        var data=JSON.stringify(data);

        if(lStore.get('app')){
            window.location.href='js://subVisitInquiry?data='+data;
        }else{

        }
    },
    toRevisitOrderList:function(orderStatus){//跳转复诊订单列表
        if(lStore.get('app')){
            var orderIndexJson={
                '11':'1',
                '01':'2',
                '02':'2',
                '71':'3',
                '05':'4',
            };
            var orderIndex=orderIndexJson[orderStatus]||0;
            var href='js://toRevisitOrderList?orderIndex='+orderIndex;

            //console.log(href);
            window.location.href=href;
        }else{

        }
    },
    toDrugOrderList:function(orderStatus){//跳转药品订单列表
        if(lStore.get('app')){
            var orderIndexJson={
                '11':'1',
                '21':'2',
                '22':'3',
                '05':'4',
            };
            var orderIndex=orderIndexJson[orderStatus]||0;
            var href='js://toDrugOrderList?orderIndex='+orderIndex;

            //console.log(href);
            window.location.href=href;
        }else{

        }
    },
    addNewPersonSuccess:function(){//添加咨询人成功
        if(lStore.get('app')){
            window.location.href='js://addNewPersonSuccess';
        }else{

        }
    },
    toRevisitDetail:function(data){//跳转复诊配药详情
        var data=JSON.stringify(data);

        //console.log(data);
        if(lStore.get('app')){
            window.location.href='js://toRevisitDetail?data='+data;
        }else{

        }
    },
    toDrugPay:function(voucherNo){//跳转药品支付
        //console.log(voucherNo);
        if(lStore.get('app')){
            window.location.href='js://toDrugPay?voucherNo='+voucherNo;
        }else{

        }
    },
    initStatusTitle:function(json){//初始化状态栏、标题栏
        var json=JSON.stringify(json);

        //console.log(json);
        /*
            初始化状态栏、标题栏
            js-android：bsoftJsInterface.initStatusTitle("json");
            json = {"title":"标题","titleBarShowState":1,"statusTitleBarMode":0,"statusTitleBarColor":"#354543","titleBtn":[{"id":3,"icon":"1","name":"name","nameColor":"#343434","showMode":1}]}

            title（标题）
            titleBarShowState （标题栏是否显示）：0 - 不显示；1 - 显示（默认）
            statusTitleBarMode（状态栏、标题栏模式）：0 - 亮色（默认）；1 - 暗色
            statusTitleBarColor（状态栏、标题栏颜色）默认主题色
            titleBtn（标题栏自定义按钮）
            id（按钮id）
            icon（按钮图片）
            name（按钮名称）
            nameColor（按钮名称颜色）亮色模式默认白色；暗色模式默认黑色
            showMode（显示模式）：0 - 显示name（默认）；1 - 显示icon
        */
        if(lStore.get('app')){
            if(window.bsoftJsInterface&&window.bsoftJsInterface.initStatusTitle){
                window.bsoftJsInterface.initStatusTitle(json);
            }else if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.initStatusTitle){
                window.webkit.messageHandlers.initStatusTitle.postMessage(json);
            }
        }else{

        }
    },
    setTitleButton:function(json){//初始化状态栏、标题栏
        var json=JSON.stringify(json);

        //console.log(json);
        /*
            重设标题栏按钮
            js-android：bsoftJsInterface.setTitleButton("json");
            json = [{"id":3,"icon":"1","name":"name","nameColor":"#343434","showMode":1}]
        */
        if(lStore.get('app')){
            if(window.bsoftJsInterface&&window.bsoftJsInterface.setTitleButton){
                window.bsoftJsInterface.setTitleButton(json);
            }else if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.setTitleButton){
                window.webkit.messageHandlers.setTitleButton.postMessage(json);
            }
        }else{

        }
    },
};

//项目中用到的工具函数
export{
        //常用第三方插件
        md5,
        Decimal,

        //网络请求
        ajaxWrap,
        axiosWrap,
        Socket,

        //dom以及事件相关方法
        QSA,
        htmlFontSize,
        unit,
        getStyle,
        getPos,
        Type,
        yydTimer,
        bind,
        unbind,
        copyJson,
        cBub,
        pDef,

        //断网与调试
        networkHandle,
        consoleNull,
        openMoblieDebug,

        //日期时间格式化
        toTwo,
        manyDay,
        normalDate,
        getSexAndDob,
        getWeekName,
        getAge,
        idCardNo,
        secondFormat0,
        dateFormat0,
        dateFormat1,

        //金额格式化
        amountFormat0,

        //项目常用
        soleString32,
        autoEvent,
        customEvent,
        alerts,
        alertss,
        regJson,
        jsonHasKey,
        allHaveValue,
        isPhone,
        isWeixin,
        isSafari,
        goPage,
        cookie,
        lStore,
        sStore,
        strToJson,
        strToJson1,
        getSearch,
        preload,
        computed,
        execCommandFn,
        selectText,
        onPaste,
        imgFilesToBase64,
        antiShake,
        throttle,
        webviewRefresh,
        hasPrevHistoryPageFn,
        controlBodyScroll,

        //项目定制
        getImgUrl,
        nativeApi,
    };