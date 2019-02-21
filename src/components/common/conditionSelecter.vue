<template>
    <div class="conditionSelecter">
        <ol
            :style="{
                top:(44+statusBarHeight) + 'px',
            }"
        >
            <li
                v-for="(item,index) in dataList"
                @click="clickFn(item,index)"
                :class="{
                    active:currentIndex==index,
                }"
            >
                <span>{{item.length>5?item.substring(0,5)+'...':item}}</span>
                <i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui tinyFontSize"></i>
            </li>
        </ol>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },

        /*
            <conditionSelecter
                :dataList="conditionList"
                :currentIndex="sIndex"
                :click="clickFn"
            />
        */

        props:{
            dataList:{//条件选择列表（必填）
                required:true,
                type:Array,
                default:[],
            },
            click:{//点击条件触发的回调函数
                type:Function,
                default:()=>{},
            },
            currentIndex:{//当前选中的index
                type:Number,
                default:-1,
            },
        },

        watch:{
            dataList(newValue,oldValue){
                let index=newValue.indexOf('不限不限');
                let index1=-1;

                for(let i=0;i<newValue.length;i++){
                    if(newValue[i].indexOf('不限')!=-1){
                        index1=i;
                        break;
                    }
                }

                if(~index){
                    newValue[index]='不限';
                }else if(~index1&&newValue[index1].length>2){
                    newValue[index1]=newValue[index1].replace('不限','');
                }
            },
        },

        methods:{
            clickFn(item,index){
                this.sIndex=index;
                this.click&&this.click(item,index);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .conditionSelecter{
        height: $height1;
        >ol{
            display: flex;
            width: 100%;
            height: $height1;
            line-height: $height1;
            text-align: center;
            background-color: #fff;
            border-bottom: $border1;
            position: fixed;
            left: 0;
            top: $height1;
            z-index: 10;
            li{
                flex: 1;
                color: #999;
                span{
                    font-size: 12px;
                }
                i{
                    margin: 0 5px;
                    font-size: 16px;
                    transition: transform .3s linear;
                    -webkit-transition: -webkit-transform .3s linear;
                    vertical-align: middle;
                }
                &.active{
                    i{
                        transform: scale(.5) translate3d(-50%,0,0) rotate3d(0,0,1,-180deg);
                        -webkit-transform: scale(.5) translate3d(-50%,0,0) rotate3d(0,0,1,-180deg);
                    }
                }
            }
        }
    }
</style>