// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/useUserStore'

// Lazy loading recomendado
const LoginView = () => import('../views/LoginView.vue')

const DashboardView = () => import('../views/DashboardView.vue')
const SolicitarView = () => import('../views/SolicitarView.vue')
const HistorialView = () => import('../views/HistorialView.vue')

const Notificaciones = () => import('../views/Notificaciones.vue')
const Calendario = () => import('../views/Calendario.vue')

const DashboardDocente = () => import('../views/docente/DashboardDocente.vue')
const TutoriasAsignadas = () => import('../views/docente/TutoriasAsignadas.vue')
const HistorialDocente = () => import('../views/docente/HistorialDocente.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },

    // Estudiante
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/solicitar', component: SolicitarView, meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/historial', component: HistorialView, meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/notificaciones', component: Notificaciones, meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/calendario', component: Calendario, meta: { requiresAuth: true, rol: 'estudiante' } },

    // Docente
    { path: '/docente/dashboard', component: DashboardDocente, meta: { requiresAuth: true, rol: 'docente' } },
    { path: '/docente/tutorias', component: TutoriasAsignadas, meta: { requiresAuth: true, rol: 'docente' } },
    { path: '/docente/historial', component: HistorialDocente, meta: { requiresAuth: true, rol: 'docente' } },
    { path: '/docente/notificaciones', component: Notificaciones, meta: { requiresAuth: true, rol: 'docente' } },
    { path: '/docente/calendario', component: Calendario, meta: { requiresAuth: true, rol: 'docente' } }
  ]
})

// Guardas de navegación
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const user = userStore.usuario

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if (to.meta.rol && user?.rol !== to.meta.rol) {
    next('/login')
  } else {
    next()
  }
})

export default router
