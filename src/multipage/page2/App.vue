<template>
    <div v-if="onOff" class="App">
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>

        <loading
            :showLoading="isLoading"
            :showRefreshBt="showRefreshBt"
            :status="status"
        />
    </div>
</template>

<script>
    import loading from 'components/common/loading';
    import {mapState} from 'vuex';

    export default {
        data(){
            return{
                onOff:true,
            }
        },

        computed:{
            ...mapState({
                isLoading(state){
                    return state.isLoading;
                },
                showRefreshBt(state){
                    return state.showRefreshBt;
                },
                status(state){
                    return state.status;
                },
            })
        },

        created(){
            //挂载刷新方法在window上
            window.webviewRefresh=this.webviewRefresh;
        },

        methods:{
            webviewRefresh(){
                this.onOff=false;
                setTimeout(()=>{
                    this.onOff=true;
                },300);
            },
        },

        components:{
            loading,
        },
    }
</script>

<style>
    @import '//at.alicdn.com/t/font_827303_yjnimd2fl5.css';
</style>
<style lang="scss">
    @import '~css/index.scss';
</style>
