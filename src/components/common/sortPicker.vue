<template>
    <div
        @click="maskClick($event)"
        :class="{
            sortPicker:true,
            active:show,
        }"
        :style="{
            top:(88+statusBarHeight) + 'px',
        }"
    >
        <ul ref="ulList">
            <li
                v-for="(item,index) in list"
                @click="selectFn(item,index,true)"
                :class="{
                    active:insideCIndex==index,
                }"
            >
                {{item.name}}
                <i class="iconfont icon-iconfontcheck"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    import {controlBodyScroll} from 'js/yydjs';

    export default{
        data(){
            return{
                list:[
                    {
                        name:'综合排序',
                        sortType:'',
                    },
                    {
                        name:'咨询量',
                        sortType:'1',
                    },
                    {
                        name:'患者评价',
                        sortType:'2',
                    },
                ],
                insideCIndex:0,
                oldCIndex:0,
            }
        },

        /*
            <sortPicker
                :parent="this"
                :showName="'showSortPicker'"
                :close="closeFn"
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
                default:(isSelect,data)=>{},//是否是选择，选择的数据
            },
            cIndex:{//第一个选择的索引
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
            },
            closeFn(isSelect){
                let {parent,showName,close,list,insideCIndex}=this;

                if(parent&&showName){
                    parent[showName]=false;
                }

                close&&close(isSelect,list[insideCIndex].name,null,{
                    sortType:list[insideCIndex].sortType,
                },'sortPicker');
            },
            selectFn(item,index,isSelect){
                this.insideCIndex=index;
                this.closeFn(isSelect);
            },
            maskClick(ev){
                let {target}=ev;

                if(!this.$refs.ulList.contains(target)){
                    this.closeFn();
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .sortPicker{
        width: 100%;
        height: 100%;
        border-bottom: $height1 * 2 solid transparent;
        background-color: rgba(0,0,0,.6);
        position: fixed;
        left: 0;
        top: $height1 * 2;
        z-index: 1000;
        overflow-y: auto;
        display: none;
        &.active{
            display: block;
        }
        ul{
            background-color: #fff;
            li{
                padding: 0 $padding;
                height: $height1;
                line-height: $height1;
                border-bottom: $border1;
                display: flex;
                justify-content: space-between;
                i{
                    font-size: 20px;
                    display: none;
                }
                &.active{
                    color: $main;
                    i{
                        display: block;
                    }
                }
            }
        }
    }
</style>