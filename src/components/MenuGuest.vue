<template>
  <!-- <div class="dropdown float-end language-switcher">
    <button
      class="btn btn-language dropdown-toggle fa fa-language"
      type="button"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    ></button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a v-for="language in languages"
        :key="language.code"
        class="dropdown-item"
        href="#">
        {{ language.name }}
      </a>
    </div>
  </div> -->

  <ul class="list-inline float-end mb-0">
    <li class="list-inline-item dropdown notification-list">
      <a
        class="nav-link dropdown-toggle waves-effect waves-light nav-user"
        data-bs-toggle="dropdown"
        href="#"
        role="button"
        ><i class="menu fa fa-bars"></i
      ></a>
      <div
        class="dropdown-menu dropdown-menu-right profile-dropdown"
        aria-labelledby="Preview"
      >
        <router-link :to="{ name: 'login' }" class="dropdown-item notify-item">
          <i class="fa fa-sign-in"></i>{{ __("Login") }}
        </router-link>
        <router-link :to="{ name: 'register' }" class="dropdown-item notify-item">
          <i class="fa fa-id-badge"></i>{{ __("Register") }}
        </router-link>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import helpers from '../mixins/helpers.js'

export default defineComponent({
  name: "MenuGuest",
  mixins: [ helpers ],
  props: {
    languages: {
      type: Array
    }
  }
});
</script>
