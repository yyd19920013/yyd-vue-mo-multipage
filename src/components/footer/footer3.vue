<template>
    <div class="footer3">
        <div class="footerWrap">
            <a
                v-for="(item,index) in buttonList"
                :style="item.style"
                @click="clickFn(item,index)"
            >
                {{item.text}}
            </a>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },

        /*
            <footer3
                :buttonList="[
                    {
                        text:'删除订单',
                        click:deleteOrder,
                    },
                    {
                        text:'去支付',
                        style:{
                            borderColor:'#ff7955',
                            color:'#ff7955',
                        },
                        click:goPay,
                    },
                ]"
            />
        */

        props:{
            buttonList:{//按钮设置列表
                type:Array,
                default(){
                    return[
                        /*
                            {
                                text:'',//按钮文字
                                style:{},//按钮样式
                                click:()=>{},//按钮点击触发的函数
                            },
                        */
                    ];
                },
            },
        },

        methods:{
            clickFn(item,index){
                item.click&&item.click();
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .footer3{
        height: 50px;
        .footerWrap{
            display: flex;
            justify-content: flex-end;
            width: 100%;
            padding: 10px $padding;
            height: 50px;
            background-color: #fff;
            border-top: $border1;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 100;
            >a{
                width: 80px;
                margin-left: 10px;
                height: 30px;
                line-height: 29px;
                text-align: center;
                border: $border1;
                border-radius: 15px;
            }
        }
    }
</style>