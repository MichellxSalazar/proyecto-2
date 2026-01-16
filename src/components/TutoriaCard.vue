<template>
  <div class="card" :class="{ 'card-aceptada': tutoria.inscrito }">
    <p class="card-hora">{{ tutoria.hora }}</p>
    <h3 class="card-titulo">{{ tutoria.nombre }}</h3>
    <p class="card-descripcion">{{ tutoria.descripcion }}</p>
    <p class="card-area">{{ tutoria.grupo }} – {{ tutoria.materia }} / {{ tutoria.area }}</p>
    <p v-if="tutoria.asesor" class="card-asesor">👨‍🏫 Asesor: {{ tutoria.asesor }}</p>

    <div v-if="tutoria.inscrito" class="estado-aceptada">✅ Aceptada</div>
    <button
      v-else
      class="btn"
      @click="$emit('accion', tutoria)"
    >
      Aceptar tutoría
    </button>
  </div>
</template>

<script setup>
defineProps({
  tutoria: Object,
  modo: String
})
</script>
