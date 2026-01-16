<template>
  <nav class="sidebar">
    <div class="sidebar-top">
      <h2>Tutorías Académicas</h2>
      <ul>
        <li><router-link to="/dashboard">Mis Tutorías</router-link></li>
        <li><router-link to="/solicitar">Solicitar Tutoría</router-link></li>
        <li><router-link to="/calendario">Calendario</router-link></li>
        <li><router-link to="/notificaciones">Notificaciones</router-link></li>
      </ul>
    </div>
    <div class="sidebar-bottom">
      <button class="logout-link" @click="$emit('logout')">Cerrar Sesión</button>
    </div>
  </nav>
</template>
