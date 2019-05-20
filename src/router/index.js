import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/calendar"
    },
    {
      path: "/calendar",
      component: () => import("../components/router-view/calendar")
    },
    {
      path: "/*",
      component: () => import("../assets/not-found-placeholder.vue")
    }
  ]
});
