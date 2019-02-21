import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
import mutations from './mutations';
import actions from './actions';

// Vue.use(Vuex);

const state={
    isLoading:false,//遮罩是否显示loading
    showRefreshBt:false,//遮罩是否显示刷新按钮
    status:'',//服务器错误状态
    userInfo:{},//用户信息
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})