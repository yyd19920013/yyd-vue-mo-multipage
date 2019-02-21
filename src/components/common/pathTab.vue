<template>
    <ol class="pathTab">
        <li v-for="(item,index) in tabList">
            <a
                :class="{
                    active:currentRoute.path==item.path,
                }"
                @click="clickFn(item)"
            >
                {{item.text}}
            </a>
        </li>
    </ol>
</template>

<script>
    export default{
        data(){
            return{
                currentRoute:this.$router.currentRoute,
            }
        },

        /*

        */

        props:{
            tabList:{
                requied:true,
                type:Array,
                default:[
                    /*
                        {
                            text:'',//选项文字
                            path:'',//跳转路径
                            query:'',//路由参数
                            click:(item)=>{},//点击回调函数，如果有这个函数，path则无效
                        },
                    */
                ],
            },
        },

        updated(){
            this.currentRoute=this.$router.currentRoute;
        },

        methods:{
            clickFn(item){
                if(item.click){
                    item.click(item);
                }else{
                    this.$router.replace({path:item.path,query:item.query});
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .pathTab{
        display: flex;
        height: $height1;
        line-height: $height1;
        text-align: center;
        background-color: #fff;
        li{
            flex: 1;
            a{
                display: block;
                color: #999;
                position: relative;
                &:before{
                    content: "";
                    width: 30px;
                    height: 2px;
                    background-color: transparent;
                    position: absolute;
                    left: 50%;
                    margin-left: -15px;
                    bottom: 0;
                }
                &.active{
                    color: #333;
                    &:before{
                        background-color: $main;
                    }
                }
            }
        }
    }
</style>