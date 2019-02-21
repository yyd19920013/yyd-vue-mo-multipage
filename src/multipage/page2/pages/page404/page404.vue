<template>
    <div class="page404">
        <div class="text">
            <h1>404，该页面不存在！</h1>
            <router-link to="/">
                返回首页
            </router-link>
        </div>
        <div class="bg"></div>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },

        methods:{

        },

        components:{}
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .page404{
        .text{
            padding-top:10%;
            text-align: center;
            position:relative;
            z-index: 10;
            h1{
                line-height:50px;
                color:#fff;
                font-size:30px;
                font-weight:bold;
            }
            a{
                display: inline-block;
                padding: 5px 20px;
                margin-top: 5%;
                border:2px solid #fff;
                border-radius:5px;
                color: #fff;
                font-weight: bold;
                font-size: 16px;
            }
        }
        .bg{
            position:fixed;
            left:0;
            right:0;
            top:0;
            bottom:0;
            background:url('../../images/bg404.png') no-repeat center center;
            background-size: cover;
        }
    }
</style>