import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Project from '@/views/Project';
import About from '@/views/About';
import ErrorPage from '@/views/Error';
import ProjectFooter from '@/views/ProjectFooter';
import projects from '@/views/Projects';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      hideFooter: true,
      disableSidebar: true,
    },
    children: [
      {
        name: 'projects',
        path: '/projects',
        component: projects,
        meta: {
          hideFooter: true,
          disableSidebar: true,
        },
      },
    ],
  },
  {
    path: '/project/:slug',
    name: 'project',
    components: {
      default: Project,
      footer: ProjectFooter,
    },
  },
  {
    path: '/about',
    name: 'about',
    components: {
      default: About,
    },
    meta: {
      hideFooter: true,
    },
  },
  {
    path: '*',
    name: '404',
    component: ErrorPage,
    meta: {
      hideFooter: true,
    },
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
