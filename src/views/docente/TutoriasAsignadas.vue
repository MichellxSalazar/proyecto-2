<template>
  <div class="layout">
    <SidebarDocente @logout="cerrarSesion" />
    <main class="content">
      <Header title="Tutorías Asignadas" subtitle="Listado de tutorías que has creado o impartido" />

      <section class="section">
        <div v-if="tutorias.length" class="card-list">
          <div v-for="t in tutorias" :key="t.id" class="card">
            <h3>{{ t.nombre }}</h3>
            <p><strong>Fecha:</strong> {{ t.fecha }} - {{ t.hora }}</p>
            <p><strong>Materia:</strong> {{ t.materia }}</p>
            <p><strong>Descripción:</strong> {{ t.descripcion }}</p>
            <button @click="registrar(t.id)">Registrar como impartida</button>
          </div>
        </div>
        <p v-else class="empty">No tienes tutorías asignadas aún.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTutoriasStore } from '../../store/useTutoriasStore.js'
import { useUserStore } from '../../store/useUserStore.js'
import SidebarDocente from '../../components/SidebarDocente.vue'
import Header from '../../components/Header.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}

function registrar(id) {
  store.registrarImpartida(id)
}

const tutorias = computed(() =>
  store.tutorias.filter(t => t.asesor === userStore.usuario?.email)
)
</script>
