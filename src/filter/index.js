import {getWeekName,secondFormat0,dateFormat0,dateFormat1,Decimal,getAge} from 'js/yydjs.js';

const date=(value,format)=>{
    if(!value&&value!=0)return;
    return dateFormat0(value,format);
};

const date1=(value)=>{
    if(!value&&value!=0)return;
    return dateFormat1(value);
};

const date2=(value)=>{
    if(!value&&value!=0)return;
    let reg=/\-+/g;

    value=value.replace(reg,'/');

    let iDay=(+new Date()-(+new Date(value)))/(1000*60*60*24);
    return Math.round(iDay)||1;
};

const date3=(value)=>{
    if(!value&&value!=0)return;
    let reg=/\-+/g;

    value=value.replace(reg,'/');

    let iDay=(+new Date(value)-(+new Date()))/(1000*60*60*24);
    return iDay>0?Math.ceil(iDay):0;
};

const week=(value)=>{
    if(!value&&value!=0)return;

    return getWeekName(value);
};

const fSecond=(value,fmt,adjustFmt)=>{
    if(!value&&value!=0)return;

    return secondFormat0(value,fmt,adjustFmt);
};

const age=(value)=>{
    if(!value&&value!=0)return;

    return getAge(value);
};

const toFixed=(value,length=2)=>{
    if(!value&&value!=0)return;
    return new Decimal(value).toFixed(length,1);
};

export{
        date,//时间过滤器
        date1,//时间过滤器1
        date2,//时间过滤器2
        date3,//时间过滤器3
        week,//星期过滤器
        fSecond,//秒过滤器
        age,//根据出生日期算年龄
        toFixed,//小数点保留位数过滤器
};