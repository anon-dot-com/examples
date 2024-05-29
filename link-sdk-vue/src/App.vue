<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import AnonLink, {
  type AnonLinkError,
  type AnonLinkFinalizationParams,
  type AnonLinkFinalizationResult
} from '@anon/sdk-web-link-typescript'

const selectedService = ref('amazon')

const services = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  github: 'Github',
  linkedin: 'LinkedIn',
  delta: 'Delta',
  opentable: 'OpenTable',
  resy: 'Resy',
  amazon: 'Amazon',
  uber: 'Uber',
  united_airlines: 'United Airlines',
  instacart: 'Instacart'
}

const config = ref({
  environment: import.meta.env.VITE_ANON_ENV,
  clientId: import.meta.env.VITE_ANON_SDKCLIENT_ID,
  appUserIdToken: import.meta.env.VITE_ANON_APP_USER_ID_TOKEN,
  company: import.meta.env.VITE_ANON_COMPANY_NAME,
  companyLogo:
  import.meta.env.VITE_ANON_COMPANY_LOGO,
  // make sure this matches the ID in the "My Extensions" page in Chrome
  chromeExtensionId: import.meta.env.VITE_ANON_CHROME_EXTENSION_ID,
  app: selectedService.value
})

watch(selectedService, (newService) => {
  config.value.app = newService
})

// Define reactive properties for SDK instance
const anonLinkInstance = ref()

const initAnonLink = async (): Promise<void> => {
  anonLinkInstance.value = AnonLink.init({
    config: config.value as any,
    debug: true,
    onSuccess,
    onExit
  })
  anonLinkInstance.value.open()
}

// Cleanup function
onBeforeUnmount(() => {
  if (anonLinkInstance.value) {
    anonLinkInstance.value.destroy()
  }
})

const onSuccess = () => {
  console.log('success')
}
const onExit = (error?: AnonLinkError | null) => {
  if (error) {
    console.log('Link error', error)
  }
  anonLinkInstance.value.destroy()
}
</script>

<template>
  <div id="app">
    <div class="container">
      <div class="card">
        <h1>Anon Link</h1>
        <div>({{ config.environment }})</div>
        <p>Pick an app to connect.</p>
        <select v-model="selectedService">
          <option v-for="(name, id) in services" :key="id" :value="id">{{ name }}</option>
        </select>
        <button @click="initAnonLink">Connect</button>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
}

.container {
  text-align: center;
}

.card {
  display: inline-block;
  padding: 2em;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h1 {
  color: #333;
  margin-bottom: 0.5em;
}

p {
  color: #666;
  margin-bottom: 1em;
}

button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #333;
}

select {
  padding: 10px;
  margin-bottom: 1em;
  margin-right: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

select:focus {
  outline: none;
  border-color: #aaa;
}
</style>
