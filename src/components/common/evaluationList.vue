<template>
    <div class="evaluationList">
        <ul>
            <li v-for="(item,index) in dataList">
                <a>
                    <div class="title">
                        <div class="leftContent">
                            <span>{{item.patientName&&item.patientName.length>1?item.patientName.substring(0,1)+'**':item.patientName}}</span>
                            <div class="starWrap">
                                <i
                                    v-for="(item1,index1) in 5"
                                    :class="{
                                        iconfont:true,
                                        'icon-ic_star':true,
                                        active:index1<item.score,
                                    }"
                                ></i>
                            </div>
                        </div>
                        <em>{{item.createAt|date('yyyy-MM-dd hh:mm')}}</em>
                    </div>

                    <div class="main">
                        {{item.content}}
                    </div>

                    <div class="end">
                        <span v-for="(item1,index1) in item.tagsContext">
                            {{item1}}
                        </span>
                    </div>
                </a>
            </li>
        </ul>

        <defaultImage
            :show="showDefaultImage"
        />

        <loadMore
            :parent="this"
            :dataListName="'dataList'"
            :api="api"
            :params="params"
            :getListFromRes="getListFromRes"
            :paramsAdd="paramsAdd"
            :limit="limit"
            :firstLoad="firstLoadFn"
        />
    </div>
</template>

<script>
    import loadMore from 'components/common/loadMore';
    import defaultImage from 'components/common/defaultImage';

    export default{
        data(){
            return{
                dataList:[],
                showDefaultImage:false,
            }
        },

        /*
            <evaluationList
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
            limit:{//加载数量限制
                type:[Number,String],
                default:'',
            },
            getListFromRes:{//从返回数据里取到对应的列表
                type:Function,
                default(res){
                    return res.body;
                },
            },
            paramsAdd:{//给内部参数的page++
                type:Function,
                default(insideParams){
                    insideParams[1]++;
                },
            },
            limit:{//加载数量限制
                type:[Number,String],
                default:'',
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
        },

        components:{
            loadMore,
            defaultImage,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .evaluationList{
        background-color: #fff;
        li{
            padding: 10px $padding;
            padding-bottom: 5px;
            border-bottom: $border1;
            font-size: 12px;
            position: relative;
            &:last-of-type{
                border-bottom: 0;
            }
            .title{
                display: flex;
                justify-content: space-between;
                line-height: 30px;
                color: #999;
                .starWrap{
                    display: inline-block;
                    i{
                        margin: 0 5px;
                        font-size: 16px;
                        &.active{
                            color: $orange;
                        }
                    }
                }
            }
            .main{
                line-height: 24px;
            }
            .end{
                @include selectLabel;
                padding-top: 5px;
            }
        }
    }
</style>