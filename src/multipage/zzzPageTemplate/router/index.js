import App from 'pageName/App';

//定义组件
//测试
const test=()=>import('pageName/pages/test/test');

//首页
const home=()=>import('pageName/pages/home/home');


//404页面
const page404=()=>import('pageName/pages/page404/page404');


//配置路由规则
export default[{
    path:'/',
    component:App, //顶层路由，对应index.html
    children:[ //二级路由。对应App.vue
        {
            path:'',
            redirect:'/home',
        },
        //测试页面
        {
            path:'/test',
            component:test,
            meta:{
                title:'测试',
                noLogin:true,
                keepPos:true,
            },
        },
        //首页
        {
            path:'/home',
            component:home,
            meta:{
                title:'首页',
            },
        },
        //404页面
        {
            path:'*',
            component:page404,
            meta:{
                title:'404',
            },
        },
    ]
}]