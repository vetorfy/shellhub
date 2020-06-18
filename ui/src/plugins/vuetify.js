import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';
import 'font-logos/assets/font-logos.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Clipboard from 'v-clipboard';
import Fragment from 'vue-fragment';

// import 'vuetify/dist/vuetify.min.css'
// import '../styles/variables.scss'

Vue.component('font-awesome-icon', FontAwesomeIcon); // Register component globally
library.add(fas); // Include needed icons.

Vue.use(Vuetify);
Vue.use(Clipboard);
Vue.use(Fragment.Plugin);

export default new Vuetify({
  iconfont: 'md',
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#364576',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
});
