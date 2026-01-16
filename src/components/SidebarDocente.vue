<template>
  <nav class="sidebar">
    <div class="sidebar-top">
      <h2>Gestión Docente</h2>
      <ul>
        <li><router-link to="/docente/dashboard">Mis Tutorías</router-link></li>
        <li><router-link to="/docente/calendario">Calendario</router-link></li>
        <li><router-link to="/docente/notificaciones">Notificaciones</router-link></li>
      </ul>
    </div>
    <div class="sidebar-bottom">
      <button class="logout-link" @click="$emit('logout')">Cerrar Sesión</button>
    </div>
  </nav>
</template>
