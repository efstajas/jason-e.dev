import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Project from '@/views/Project';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/:slug',
    name: 'project',
    component: Project,
  },
] as RouteConfig[];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => new Promise((resolve, reject) => {
    if ('scrollRestoration' in window.history) { window.history.scrollRestoration = 'manual'; }
    router.app.$root.$once('triggerScroll', () => {
      if (savedPosition && to.name === 'home') {
        router.app.$root.$once('loadedProjects', () => {
          router.app.$nextTick(() => resolve(savedPosition));
        });
      }
      resolve({ x: 0, y: 0 });
    });
  }),
});

export default router;
