<template>
  <div class="layout">
    <Sidebar @logout="cerrarSesion" />
    <main class="content">
      <Header title="¡Hola, Docente!" subtitle="Gestión de tutorías académicas" />

      <section class="crear-tutoria">
        <h2>Crear Nueva Tutoría</h2>
        <form @submit.prevent="crearTutoria">
          <input v-model="nombre" placeholder="Nombre de la tutoría" required />
          <input v-model="fecha" type="date" required />
          <input v-model="hora" type="time" required />
          <input v-model="descripcion" placeholder="Descripción" required />
          <input v-model="materia" placeholder="Materia" required />
          <button type="submit">Crear Tutoría</button>
        </form>
      </section>

      <section class="tutorias-recientes">
        <h2>Tutorías Recientes</h2>
        <div v-if="recientes.length" class="card-list">
          <div v-for="t in recientes" :key="t.id" class="card">
            <h3>{{ t.nombre }}</h3>
            <p><strong>Fecha:</strong> {{ formatearFecha(t.fecha) }}</p>
            <p><strong>Hora:</strong> {{ t.hora }}</p>
            <p><strong>Materia:</strong> {{ t.materia }}</p>
            <p><strong>Descripción:</strong> {{ t.descripcion }}</p>
            <button @click="registrar(t.id)">Registrar como impartida</button>
          </div>
        </div>
        <p v-else class="empty">No hay tutorías recientes.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTutoriasStore } from '../../store/useTutoriasStore.js'
import { useUserStore } from '../../store/useUserStore.js'
import { useRouter } from 'vue-router'
import Sidebar from '../../components/SidebarDocente.vue'
import Header from '../../components/Header.vue'

const store = useTutoriasStore()
const userStore = useUserStore()
const router = useRouter()

function cerrarSesion() {
  userStore.logout()
  router.push('/login')
}

const nombre = ref('')
const fecha = ref('')
const hora = ref('')
const descripcion = ref('')
const materia = ref('')

function crearTutoria() {
  store.crearTutoria({
    nombre: nombre.value,
    fecha: fecha.value,
    hora: hora.value,
    descripcion: descripcion.value,
    materia: materia.value,
    asesor: userStore.usuario?.email,
    grupo: 'Nuevo',
    area: 'TECNOLOGÍAS DE LA INFORMACIÓN'
  })
  nombre.value = ''
  fecha.value = ''
  hora.value = ''
  descripcion.value = ''
  materia.value = ''
}

function registrar(id) {
  store.registrarImpartida(id)
}

function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const recientes = computed(() =>
  store.tutorias.filter(t => t.asesor === userStore.usuario?.email)
)
const creadas = computed(() => store.tutorias)

</script>
