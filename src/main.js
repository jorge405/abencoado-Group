

import './assets/main.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'flatpickr/dist/flatpickr.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
//import VueFilesPreview from 'vue-files-preview';
import { ModuleRegistry } from 'ag-grid-community'
import { AllCommunityModule } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

flatpickr.localize(Spanish)

const app = createApp(App)

//app.use(VueFilesPreview);
app.use(router)

app.mount('#app')
