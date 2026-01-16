<template>
  <div class="layout">
    <Sidebar @logout="cerrarSesion" />

    <main class="content">
      <Header 
        title="¡Hola, ESTUDIANTE!" 
        subtitle="Bienvenido a tu panel de tutorías académicas" 
      />

      <!-- Línea de tiempo -->
      <section class="section">
        <h2 class="section-title">Línea de tiempo de Tutorías</h2>
        <input 
          v-model="busqueda" 
          class="input-search" 
          placeholder="Buscar por tutoría o materia" 
        />

        <div v-if="tutoriasFiltradas.length" class="card-list">
          <TutoriaCard
            v-for="t in tutoriasFiltradas"
            :key="t.id"
            :tutoria="t"
            @accion="aceptar"
          />
        </div>
        <p v-else class="empty">No hay tutorías que coincidan con tu búsqueda.</p>
      </section>

      <!-- Recientes -->
      <section class="section">
        <h2 class="section-title">Tutorías Recientes</h2>
        <div class="card-list">
          <TutoriaCard
            v-for="r in recientes"
            :key="r.id"
            :tutoria="r"
            modo="reciente"
          />
        </div>
        <router-link to="/historial" class="link">Mostrar más tutorías</router-link>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTutoriasStore } from '../store/useTutoriasStore'
import { useUserStore } from '../store/useUserStore'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import TutoriaCard from '../components/TutoriaCard.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

// Campo de búsqueda
const busqueda = ref('')

// Filtrar tutorías por nombre o materia
const tutoriasFiltradas = computed(() =>
  store.tutorias.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    t.materia.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// Últimas dos tutorías como "recientes"
const recientes = computed(() => store.tutorias.slice(-2))

// Acción de aceptar tutoría (solicitar)
function aceptar(t) {
  store.solicitarTutoria(t.id)
}

// Cerrar sesión
function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}
</script>
