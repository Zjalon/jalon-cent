import { createMemoryHistory, createRouter } from "vue-router";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            path: "/",
            name: "stat",
            component: () => import("../pages/Stat.vue"),
        },
        {
            path: "/home",
            name: "home",
            component: () => import("../pages/Home.vue"),
        },
        {
            path: "/assets",
            name: "assets",
            component: () => import("../pages/Assets.vue"),
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("../pages/Profile.vue"),
        },
    ],
});

export default router;
