<template>
    <div class="doctorList">
        <ul>
            <li v-for="(item,index) in dataList">
                <router-link
                    :to="{
                        path:'/specialist',
                        query:{
                            id:item.id,
                        },
                    }"
                >
                    <div
                        class="portrait"
                        :style="{
                            backgroundImage:item.avatarFileId?'url('+getImgUrl()+item.avatarFileId+')':'',
                        }"
                    ></div>
                    <div class="rightContent">
                        <div class="basic">
                            <h3>
                                <span>{{item.doctorName}}</span>
                                <em>{{item.doctorLevelText}}</em>
                                <i v-if="item.itemCodes&&item.itemCodes.indexOf('01')!=-1" class="tu"></i>
                                <i v-if="item.itemCodes&&item.itemCodes.indexOf('02')!=-1" class="shi"></i>
                            </h3>
                            <h4>{{item.orgFullName}} {{item.deptName}}</h4>
                        </div>
                        <div class="count">
                            <div :class="{
                                starWrap:true,
                                active:item.avgScore,
                            }">
                                <i class="iconfont icon-ic_star"></i>
                                <span>暂无</span>
                                <em>{{item.avgScore}}</em>
                            </div>
                            <span>{{item.consultNum?`咨询量${item.consultNum}`:'咨询量暂无'}}</span>
                        </div>
                        <div class="speciality multiLine-2">
                            擅长：{{item.speciality}}
                        </div>
                    </div>
                </router-link>

                <!--<a-->
                    <!--class="tel"-->
                    <!--@click="consultFn"-->
                <!--&gt;</a>-->
            </li>
        </ul>

        <defaultImage
            :show="showDefaultImage"
            :showIndex="1"
        />

        <loadMore
            :parent="this"
            :dataListName="'dataList'"
            :api="api"
            :params="params"
            :getListFromRes="getListFromRes"
            :onceLoad="onceLoad"
            :limit="limit"
            :firstLoad="firstLoadFn"
        />
    </div>
</template>

<script>
    import loadMore from 'components/common/loadMore';
    import defaultImage from 'components/common/defaultImage';
    import {getImgUrl,nativeApi} from 'js/yydjs';

    export default{
        data(){
            return{
                dataList:[],
                showDefaultImage:false,
                getImgUrl,
                nativeApi,
            }
        },

        /*
            <doctorList
                :api="this.mockDoctorList"
            />
        */

        props:{
            api:{//请求数据的api（必填）
                required:true,
                type:Function,
                default:()=>{},
            },
            params:{//请求的参数
                type:Array,
                default(){
                    return [];
                },
            },
            getListFromRes:{//从返回数据里取到对应的列表
                type:Function,
                default(res){
                    return res.body.doctors;
                },
            },
            limit:{//加载数量限制
                type:[Number,String],
                default:'',
            },
            onceLoad:{//是否只加载一次
                type:Boolean,
                default:false,
            },
            firstLoad:{//第一次加载数据完毕（用于展示缺省页）
                type:Function,
                default:()=>{},
            },
        },

        methods:{
            firstLoadFn(res){
                if(this.dataList&&this.dataList.length==0){
                    this.showDefaultImage=true;
                }
                this.firstLoad&&this.firstLoad(res);
            },
            consultFn(){
                this.$vux.confirm.show({
                    title:'提示',
                    content:'目前已开通电话助理，是否立即咨询？',
                    onConfirm(){

                    },
                });
            },
        },

        components:{
            loadMore,
            defaultImage,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .doctorList{
        background-color: #fff;
        li{
            padding: 10px 0;
            margin-left: $padding;
            border-bottom: $border1;
            position: relative;
            &:last-of-type{
                border-bottom: none;
            }
            a{
                display: flex;
                .portrait{
                    @include portrait('../../');
                }
                .rightContent{
                    flex: 1;
                    padding: 0 $padding;
                    line-height: 24px;
                    .basic{
                        padding-right: 40px;
                        position: relative;
                        h3{
                            display: flex;
                            align-items: center;
                            span{
                                margin-right: 5px;
                                font-size: 16px;
                            }
                            em{
                                margin-right: 5px;
                            }
                            i{
                                @include tuAndShi('../../');
                            }
                        }
                        h4{
                            font-size: 12px;
                        }
                    }
                    .count{
                        display: flex;
                        align-items: center;
                        .starWrap{
                            display: inline-block;
                            color: #ccc;
                            margin-right: 5px;
                            i{
                                font-size: 12px;
                            }
                            span,em{
                                font-size: 16px;
                            }
                            em{
                                display: none;
                            }
                            &.active{
                                color: $orange;
                                span{
                                    display: none;
                                }
                                em{
                                    display: inline-block;
                                }
                            }
                        }
                        >span{
                            color: #999;
                            font-size: 12px;
                        }
                    }
                    .speciality{
                        line-height: 20px;
                        color: #999;
                        font-size: 12px;
                    }
                }
            }
            .tel{
                width: 30px;
                height: 30px;
                background: url('../../images/icon/ic_home_phone.png') no-repeat center center;
                background-size: cover;
                position: absolute;
                right: $padding;
                top: 34px;
                z-index: 10;
                transform: translate3d(0,-50%,0);
            }
        }
    }
</style>
