<template>
  <div class="layout">
    <SidebarEstudiante @logout="cerrarSesion" />

    <main class="content">
      <Header title="Mi Dashboard" subtitle="Bienvenido a tu panel de tutorías académicas" />

      <!-- Tutorías Disponibles -->
      <section class="section">
        <h2 class="section-title">🎓 Tutorías Disponibles</h2>
        <div v-if="disponibles.length" class="card-list">
          <div v-for="t in disponibles" :key="t.id" class="card">
            <h3>{{ t.nombre }}</h3>
            <p><strong>Fecha:</strong> {{ t.fecha }} - {{ t.hora }}</p>
            <p><strong>Materia:</strong> {{ t.materia }}</p>
            <p><strong>Descripción:</strong> {{ t.descripcion }}</p>
            <p><strong>Asesor:</strong> {{ t.asesor }}</p>
            <button 
              class="btn-enviar" 
              :disabled="yaSolicitada(t.id)" 
              @click="solicitar(t)"
            >
              {{ yaSolicitada(t.id) ? 'Solicitud enviada' : 'Solicitar Tutoría' }}
            </button>
          </div>
        </div>
        <p v-else class="empty">No hay tutorías disponibles.</p>
      </section>

      <!-- Notificaciones -->
      <section class="section">
        <h2 class="section-title">🔔 Notificaciones</h2>
        <div v-if="notificaciones.length" class="card-list">
          <div v-for="n in notificaciones" :key="n.id" class="card notificacion-card" :class="n.leida ? 'leida' : 'no-leida'">
            <div class="notificacion-contenido">
              <p><strong>{{ n.tipo.toUpperCase() }}</strong></p>
              <p>{{ n.mensaje }}</p>
              <small>{{ n.fecha }}</small>
            </div>
          </div>
        </div>
        <p v-else class="empty">No tienes notificaciones nuevas.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTutoriasStore } from '../store/useTutoriasStore.js'
import { useUserStore } from '../store/useUserStore.js'
import { useRouter } from 'vue-router'
import SidebarEstudiante from '../components/Sidebar.vue'
import Header from '../components/Header.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}

// Tutorías disponibles para estudiantes
const disponibles = computed(() =>
  store.tutorias.filter(t => t.estado === 'Disponible')
)

// Notificaciones dirigidas al estudiante
const notificaciones = computed(() =>
  store.getNotificacionesPorRol('estudiante')
)

// Acción de solicitar tutoría
function solicitar(tutoria) {
  store.agregarSolicitud({
    ...tutoria,
    estado: 'Solicitada',
    solicitante: userStore.usuario?.email
  })
}

// Evitar solicitudes duplicadas
function yaSolicitada(id) {
  return store.solicitudesTutorias.some(s => s.id === id)
}
</script>
