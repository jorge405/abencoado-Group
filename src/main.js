import './assets/main.css'
import 'flatpickr/dist/flatpickr.css'
import VueFilesPreview from 'vue-files-preview';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueFilesPreview);
app.use(router)

app.mount('#app')
