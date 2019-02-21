<template>
    <header
        class="header1"
        :style="{
            height:unit(44+statusBarHeight),
        }"
    >
        <div
            class="headerWrap"
            :style="{
                height:unit(44+statusBarHeight),
                paddingTop:unit(statusBarHeight),
            }"
        >
            <div class="wrap">
                <a
                    @click="clickFn"
                    class="goBack"
                >
                    <i class="iconfont icon-jiantou3"></i>
                </a>
                <h2
                    v-if="title"
                >
                    {{title}}
                </h2>
                <slot name="title"></slot>
                <a
                    v-if="right&&right.text"
                    @click="rightClick"
                    class="rightContent"
                >
                    {{right.text}}
                </a>

                <slot name="right"></slot>
            </div>
        </div>
    </header>
</template>

<script>
    import {lStore,hasPrevHistoryPageFn,nativeApi,unit} from 'js/yydjs';

    export default{
        data(){
            return{
                unit,
            }
        },

        /*
            <header
                title="晞景儿科互联网医院"
            />
        */

        props:{
            title:{//标题
                type:String,
                default:'标题',
            },
            hideArrow:{//是否隐藏箭头
                type:Boolean,
                default:false,
            },
            click:{//点击触发的函数
                type:Function,
                default:null,
            },
            right:{//定义右边的内容
                type:Object,
                default(){
                    return{
                        text:'',//文字
                        path:'',//路径
                        click:'',//点击触发的函数
                    };
                },
            },
        },

        methods:{
            clickFn(){
                if(this.click){
                    this.click();
                }else{
                    hasPrevHistoryPageFn.ableGoBack((bool)=>{
                        if(bool){
                            this.$router.go(-1);
                        }else{
                            nativeApi.returnApp(this);
                        }
                    });
                }
            },
            rightClick(){
                let {path,click}=this.right;

                path&&this.$router.push(path);
                click&&click();
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .header1{
        height: $height1;
        .headerWrap{
            width:100%;
            height:$height1;
            line-height:$height1;
            background-color:$main;
            position:fixed;
            left: 0;
            top: 0;
            z-index: 100;
        }
        .wrap{
            height: $height1;
            position: relative;
            .goBack{
                width:50px;
                padding-left: $padding;
                height:$height1;
                line-height:$height1;
                text-align:left;
                position:absolute;
                left:0;
                top:0;
                z-index: 10;
                i{
                    font-size: 20px;
                    color: #fff;
                }
            }
            h2{
                width:100%;
                padding: 0 50px;
                height: $height1;
                line-height:$height1;
                text-align:center;
                color:#fff;
                position: absolute;
                left: 0;
                top: 0;
            }
            .rightContent{
                padding-right: $padding;
                height: $height1;
                line-height:$height1;
                position:absolute;
                right:0;
                top:0;
                z-index: 10;
                color:#fff;
            }
        }
    }
</style>
