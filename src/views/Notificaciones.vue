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
              :class="['notif', n.tipo, { leida: n.leida }]"
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

// Filtrar notificaciones por rol del usuario
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
  console.log('Aceptar tutoria', id)
  store.responderSolicitud(id, true)
  cerrarDetalle()
}

function rechazarTutoria(id) {
  console.log('Rechazar tutoria', id)
  store.responderSolicitud(id, false)
  cerrarDetalle()
}

// Sidebar dinámico según rol
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

.detalle button {
  margin-right: 15px;
  margin-bottom: 10px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

/* Estilos por tipo de notificación */
.notif.solicitud { border-left: 4px solid #0078d4; }
.notif.confirmacion { border-left: 4px solid #28a745; }
.notif.rechazo { border-left: 4px solid #dc3545; }
.notif.nueva { border-left: 4px solid #17a2b8; }
.notif.info { border-left: 4px solid #6c757d; }
.notif.pendiente { border-left: 4px solid #ffc107; }
.notif.perdida { border-left: 4px solid #6c757d; }
.notif.proxima { border-left: 4px solid #20c997; }
</style>
