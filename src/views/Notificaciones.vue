<template>
  <div class="layout">
    <component :is="sidebarComponent" @logout="cerrarSesion" />

    <main class="content">
      <Header title="Notificaciones" subtitle="Revisa tus avisos y solicitudes" />

      <section class="notificaciones">
        <div v-if="notificaciones.length">
          <ul>
            <li 
              v-for="n in notificaciones" 
              :key="n.id" 
              :class="{ leida: n.leida }"
              @click="abrirNotificacion(n)"
            >
              <div class="mensaje">
                <strong>{{ n.tipo.toUpperCase() }}</strong> - {{ n.mensaje }}
              </div>
              <div class="fecha">{{ n.fecha }}</div>
            </li>
          </ul>
        </div>
        <p v-else>No tienes notificaciones pendientes.</p>
      </section>

      <!-- Panel de detalle -->
      <div v-if="seleccionada" class="detalle">
        <h3>Detalle de Notificación</h3>
        <p><strong>Mensaje:</strong> {{ seleccionada.mensaje }}</p>
        <p><strong>Fecha:</strong> {{ seleccionada.fecha }}</p>
        <p><strong>Tipo:</strong> {{ seleccionada.tipo }}</p>

        <!-- Acciones dinámicas -->
        <div v-if="seleccionada.tipo === 'solicitud' && userStore.usuario?.rol === 'docente'">
          <button @click="aceptarTutoria(seleccionada.tutoriaId)">Aceptar</button>
          <button @click="rechazarTutoria(seleccionada.tutoriaId)">Rechazar</button>
        </div>

        <button @click="cerrarDetalle">Cerrar</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTutoriasStore } from '../store/useTutoriasStore'
import { useUserStore } from '../store/useUserStore'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import SidebarDocente from '../components/SidebarDocente.vue'
import Header from '../components/Header.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}

const notificaciones = computed(() => store.getNotificacionesPorRol(userStore.usuario?.rol))
const seleccionada = ref(null)

function abrirNotificacion(n) {
  seleccionada.value = n
  store.marcarLeida(n.id)
}

function cerrarDetalle() {
  seleccionada.value = null
}

function aceptarTutoria(id) {
  store.responderSolicitud(id, true)
  cerrarDetalle()
}

function rechazarTutoria(id) {
  store.responderSolicitud(id, false)
  cerrarDetalle()
}

const sidebarComponent = computed(() =>
  userStore.usuario?.rol === 'docente' ? SidebarDocente : Sidebar
)
</script>

<style scoped>
.notificaciones ul {
  list-style: none;
  padding: 0;
}
.notificaciones li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}
.notificaciones li.leida {
  opacity: 0.6;
}
.detalle {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background: #f9f9f9;
}
</style>
