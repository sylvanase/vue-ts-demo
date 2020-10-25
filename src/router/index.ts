import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // 按需加载
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index.vue")
  },
  {
    path: "/",
    component: Layout,
    meta: {
      // meta默认是一个空对象
      requiresAuth: true
    },
    children: [
      {
        path: "", // 默认子路由
        name: "home",
        component: () =>
          import(/* webpackChunkName: 'home' */ "@/views/home/index.vue")
      },
      {
        path: "/role",
        name: "role",
        component: () =>
          import(/* webpackChunkName: 'role' */ "@/views/role/index.vue")
      },
      {
        path: "/role/:roleId/alloc-menu",
        name: "alloc-menu",
        component: () =>
          import(
            /* webpackChunkName: 'alloc-menu' */ "@/views/role/alloc-menu.vue"
          ),
        props: true // 将路由路径参数映射到组件的props中
      },
      {
        path: "/role/:roleId/alloc-resource",
        name: "alloc-resource",
        component: () =>
          import(
            /* webpackChunkName: 'alloc-resource' */ "@/views/role/alloc-resource.vue"
          ),
        props: true // 将路由路径参数映射到组件的props中
      },
      {
        path: "/menu",
        name: "menu",
        component: () =>
          import(/* webpackChunkName: 'menu' */ "@/views/menu/index.vue")
      },
      {
        path: "/menu/create",
        name: "menu-create",
        component: () =>
          import(
            /* webpackChunkName: 'menu-create' */ "@/views/menu/create.vue"
          )
      },
      {
        path: "/menu/:id/edit",
        name: "menu-edit",
        component: () =>
          import(/* webpackChunkName: 'menu-edit' */ "@/views/menu/edit.vue")
      },
      {
        path: "/resource",
        name: "resource",
        component: () =>
          import(
            /* webpackChunkName: 'resource' */ "@/views/resource/index.vue"
          )
      },
      {
        path: "/resourceCategory",
        name: "resource-category",
        component: () =>
          import(
            /* webpackChunkName: 'resource-category' */ "@/views/resource/category.vue"
          )
      },
      {
        path: "/course",
        name: "course",
        component: () =>
          import(/* webpackChunkName: 'course' */ "@/views/course/index.vue")
      },
      {
        path: "/course/create",
        name: "course-create",
        component: () =>
          import(
            /* webpackChunkName: 'course-create' */ "@/views/course/create.vue"
          )
      },
      {
        path: "/user",
        name: "user",
        component: () =>
          import(/* webpackChunkName: 'user' */ "@/views/user/index.vue")
      },
      {
        path: "/advert",
        name: "advert",
        component: () =>
          import(/* webpackChunkName: 'advert' */ "@/views/advert/index.vue")
      },
      {
        path: "/advert-space",
        name: "advert-space",
        component: () =>
          import(
            /* webpackChunkName: 'advert-space' */ "@/views/advert-space/index.vue"
          )
      }
    ]
  },
  {
    path: "*",
    name: "404",
    component: () =>
      import(/* webpackChunkName: '404' */ "@/views/error-page/404.vue")
  }
];

const router = new VueRouter({
  routes
});

// 任何页面的访问都需要经过该方法
// to：要去的路由信息
// from： 哪里来的路由信息
// next： 同行的标志
router.beforeEach((to, from, next) => {
  // next()
  // to.matched是一个数组（匹配到是路由记录）
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: "Login",
        query: {
          // 将登录成功需要返回的页面告知登录页
          redirect: to.fullPath
        }
      });
    } else {
      // 路由守卫必须调用next，否则无法正常跳转
      next();
    }
  } else {
    next();
  }
});

export default router;
