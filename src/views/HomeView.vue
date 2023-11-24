<template>
  <div class="bg-gray-100 h-screen flex items-center justify-center mx-auto">
    <div class="bg-gray-300 shadow-lg p-3 rounded-lg w-96">
      <p class="text-2xl font-serif">Good to see you again</p>
      <p class="py-2 text-lg font-serif">What you want to do ?</p>
      <div class="px-4 flex items-center justify-center">
        <router-link to="/login">
          <div class="mx-5 text-xl bg-gray-100 p-2 rounded-md"><button>Login</button></div>
        </router-link>

        <router-link to="/signup">
        <div class="mx-5 text-xl bg-gray-100 p-2 rounded-md"><button>Signup</button></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
