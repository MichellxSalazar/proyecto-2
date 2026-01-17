<template>
  <div class="layout">
    <Sidebar @logout="cerrarSesion" />
    <main class="content">
      <Header title="¡Hola, Docente!" subtitle="Gestión de tutorías académicas" />

      <!-- Crear Tutoría -->
      <section class="crear-tutoria">
        <h2>Crear Nueva Tutoría</h2>
        <form @submit.prevent="crearTutoria">
          <input v-model="nombre" placeholder="Nombre de la tutoría" required />
          <input v-model="fecha" type="date" required />
          <input v-model="hora" type="time" required />
          <input v-model="descripcion" placeholder="Descripción" required />

          <!-- Combobox de materias -->
          <select v-model="materia" required>
            <option disabled value="">Seleccione una materia</option>
            <option>Gestión de Proyectos de TI</option>
            <option>Ingeniería de Software II</option>
            <option>Minería de datos</option>
            <option>Redes de computadoras</option>
            <option>Aplicaciones Web</option>
          </select>

          <button type="submit">Crear Tutoría</button>
        </form>
      </section>

      <!-- Tutorías Recientes -->
      <section class="tutorias-recientes">
        <h2>Tutorías Recientes</h2>
        <div v-if="recientes.length" class="card-list">
          <div v-for="t in recientes" :key="t.id" class="card">
            <h3>{{ t.nombre }}</h3>
            <p><strong>Fecha:</strong> {{ formatearFecha(t.fecha) }}</p>
            <p><strong>Hora:</strong> {{ t.hora }}</p>
            <p><strong>Materia:</strong> {{ t.materia }}</p>
            <p><strong>Descripción:</strong> {{ t.descripcion }}</p>
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
  const fechaISO = new Date(fecha.value).toISOString().split('T')[0]

  const nueva = {
    id: Date.now(),
    nombre: nombre.value,
    fecha: fechaISO,
    hora: hora.value,
    descripcion: descripcion.value,
    materia: materia.value,
    asesor: userStore.usuario?.email,
    estado: 'Disponible'
  }

  store.crearTutoria(nueva)

  // Limpiar formulario
  nombre.value = ''
  fecha.value = ''
  hora.value = ''
  descripcion.value = ''
  materia.value = ''
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
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
</script>

<style scoped>
.crear-tutoria form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}
.crear-tutoria input,
.crear-tutoria select {
  padding: 8px;
  border: 1px solid #ccc;
}
.crear-tutoria button {
  background-color: #0078d4;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.card {
  border: 1px solid #ddd;
  padding: 15px;
  background: #f9f9f9;
}
.empty {
  font-style: italic;
  color: #666;
}
</style>
