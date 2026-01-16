<template>
  <div class="layout">
    <Sidebar @logout="cerrarSesion" />

    <main class="content">
      <Header title="Historial Docente" subtitle="Revisa las tutorías que has impartido" />

      <section class="section">
        <div v-if="historialDocente.length" class="card-list">
          <TutoriaCard
            v-for="h in historialDocente"
            :key="h.id"
            :tutoria="h"
            modo="reciente"
          />
        </div>
        <p v-else class="empty">Aún no has impartido ninguna tutoría.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTutoriasStore } from '../../store/useTutoriasStore'
import { useUserStore } from '../../store/useUserStore'
import { useRouter } from 'vue-router'
import Sidebar from '../../components/SidebarDocente.vue'
import Header from '../../components/Header.vue'
import TutoriaCard from '../../components/TutoriaCard.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}

// Filtrar historial solo del docente autenticado
const historialDocente = computed(() =>
  store.historial.filter(h => h.asesor === userStore.usuario?.email)
)
</script>
