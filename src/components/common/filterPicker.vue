<template>
    <div
        @click="maskClick($event)"
        :class="{
            filterPicker:true,
            active:show,
        }"
        :style="{
            top:(88+statusBarHeight) + 'px',
        }"
    >
        <div ref="wrap" class="wrap">
            <ul>
                <li>
                    <div class="title">咨询类型</div>
                    <div class="main">
                        <span
                            v-for="(item,index) in list"
                            @click="pickList(item,index)"
                            :class="{
                                active:insideCIndex==index,
                            }"
                        >
                            {{item.name}}
                        </span>
                    </div>
                </li>
                <li>
                    <div class="title">医生职称</div>
                    <div class="main">
                        <span
                            v-for="(item,index) in list1"
                            @click="pickList1(item,index,true)"
                            :class="{
                                active:insideCIndex1==index,
                            }"
                        >
                            {{item.name}}
                        </span>
                    </div>
                </li>
            </ul>

            <div class="end">
                <div class="buttonWrap">
                    <a
                        @click="clearFn"
                    >重置</a>
                    <a
                        @click="closeFn(true)"
                    >确定</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {controlBodyScroll} from 'js/yydjs';

    export default{
        data(){
            return{
                list:[
                    {
                        name:'不限',
                        onlineType:'',
                    },
                    {
                        name:'图文',
                        onlineType:'01',
                    },
                    {
                        name:'视频',
                        onlineType:'02',
                    },
                ],
                list1:[
                    {
                        name:'不限',
                        doctorLevel:'',
                    },
                    {
                        name:'主任医师',
                        doctorLevel:'231',
                    },
                    {
                        name:'副主任医师',
                        doctorLevel:'232',
                    },
                    {
                        name:'主治医师',
                        doctorLevel:'233',
                    },
                ],
                insideCIndex:0,
                insideCIndex1:0,
                oldCIndex:0,
                oldCIndex1:0,
            }
        },

        /*
            <filterPicker
                :parent="this"
                :showName="'showfilterPicker'"
                :close="closeFn"
                :cIndex="+params[0].onlineType||0"
            />
        */

        props:{
            parent:{//父组件的this（必填）
                required:true,
                type:Object,
                default:null,
            },
            show:{//控制组件显示的值（必填）
                required:true,
                type:Boolean,
                default:false,
            },
            showName:{//控制组件显示的值的名字（必填）
                required:true,
                type:String,
                default:false,
            },
            close:{//当组件关闭触发的回调函数
                type:Function,
                default:(isSelect,lastData,firstData)=>{},//是否是选择，选择的最后一个数据，选择的第一个数据
            },
            cIndex:{//第一个选择的索引
                type:Number,
                default:0,
            },
            cIndex1:{//第二个选择的索引
                type:Number,
                default:0,
            },
        },

        watch:{
            // show(newVal,oldVal){
            //     if(newVal!=oldVal){
            //         controlBodyScroll(newVal);
            //     }
            // },
            cIndex(){
                //外部跟新内部索引
                this.outSetInsideIndex();
            },
            cIndex1(){
                //外部跟新内部索引
                this.outSetInsideIndex();
            },
        },

        mounted(){
            //外部跟新内部索引
            this.outSetInsideIndex();
        },

        methods:{
            outSetInsideIndex(){
                if(this.oldCIndex!=this.cIndex){
                    this.oldCIndex=this.cIndex;
                    this.insideCIndex=this.cIndex;
                }
                if(this.oldCIndex1!=this.cIndex1){
                    this.oldCIndex1=this.cIndex1;
                    this.insideCIndex1=this.cIndex1;
                }
            },
            closeFn(isSelect){
                let {parent,showName,close,list,list1,insideCIndex,insideCIndex1}=this;

                if(parent&&showName){
                    parent[showName]=false;
                }

                close&&close(isSelect,list[insideCIndex].name,list1[insideCIndex1].name,{
                    onlineType:list[insideCIndex].onlineType,
                    doctorLevel:list1[insideCIndex1].doctorLevel,
                },'filterPicker');
            },
            clearFn(){
                this.insideCIndex=0;
                this.insideCIndex1=0;
            },
            pickList(item,index){
                this.insideCIndex=index;
            },
            pickList1(item,index,isSelect){
                this.insideCIndex1=index;
            },
            maskClick(ev){
                let {target}=ev;

                if(!this.$refs.wrap.contains(target)){
                    this.closeFn();
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .filterPicker{
        width: 100%;
        height: 100%;
        border-bottom: $height1 * 2 solid transparent;
        background-color: rgba(0,0,0,.6);
        position: fixed;
        left: 0;
        top: $height1 * 2;
        z-index: 1000;
        display: none;
        &.active{
            display: block;
        }
        .wrap{
            >ul{
                background-color: #fff;
                li{
                    padding: 10px $padding;
                    padding-bottom: 0;
                    border-bottom: $border1;
                    .title{
                        line-height: 20px;
                        color: #999;
                    }
                    .main{
                        @include selectLabel;
                        padding-top: 10px;
                        font-size: 14px;
                    }
                }
            }
            >.end{
                padding: 10px $padding;
                height: 50px;
                background-color: #fff;
                overflow: hidden;
                .buttonWrap{
                    float: right;
                    a{
                        float: left;
                        width: 80px;
                        height: 100%;
                        line-height: 30px;
                        text-align: center;
                        color: #fff;
                        &:first-of-type{
                            background-color: #fbc12d;
                            border-radius: 15px 0 0 15px;
                        }
                        &:last-of-type{
                            background-color: $main;
                            border-radius: 0 15px 15px 0;
                        }
                    }
                }
            }
        }
    }
</style>