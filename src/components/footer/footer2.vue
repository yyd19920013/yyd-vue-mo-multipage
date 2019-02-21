<template>
    <footer class="footer2">
        <div class="footerWrap">
            <div class="left">
                <h3>{{text}}</h3>
                <h4>￥{{price|toFixed}}</h4>
            </div>
            <a
                class="right"
                :style="button.style"
                @click="clickFn"
            >
                {{button.text}}
            </a>
        </div>
    </footer>
</template>

<script>
    export default{
        data(){
            return{

            }
        },

        /*
            <footer2
                text="实际支付"
                :price="100.00"
                :button="{
                    text:'立即支付',
                    click:payFn,
                }"
            />
        */

        props:{
            text:{//显示文字
                type:String,
                default:'',
            },
            price:{//显示金额
                type:Number,
                default:'',
            },
            button:{//按钮配置
                type:Object,
                default:()=>{
                    return{
                        /*
                            text:'',//按钮文字
                            style:'',//按钮样式
                            click:payFn,//按钮触发事件
                        */
                    };
                },
            },
        },

        methods:{
            clickFn(){
                this.button.click&&this.button.click();
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .footer2{
        height: 55px;
        .footerWrap{
            display: flex;
            justify-content: space-between;
            padding: 10px $padding;
            width: 100%;
            height: 55px;
            background-color: #fff;
            border-top: $border1;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 100;
            .left{
                h3{
                    line-height: 15px;
                    font-size: 12px;
                    color: #999;
                }
                h4{
                    line-height: 20px;
                    font-size: 16px;
                    color: $orange;
                }
            }
            .right{
                width: 100px;
                height: 100%;
                line-height: 35px;
                text-align: center;
                background-color: $orange;
                color: #fff;
                font-size: 16px;
                border-radius: 18px;
            }
        }
    }
</style>