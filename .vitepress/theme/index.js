import mediumZoom from 'medium-zoom'
import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onBeforeUnmount, onMounted } from 'vue'
import './style.css'

let zoom

function refreshImageZoom() {
  if (typeof window === 'undefined') return

  nextTick(() => {
    zoom?.detach()
    zoom = mediumZoom('.vp-doc img', {
      background: 'var(--vp-c-bg)',
      margin: 0
    })
  })
}

const Layout = {
  setup() {
    onMounted(refreshImageZoom)
    onBeforeUnmount(() => zoom?.detach())

    return () => h(DefaultTheme.Layout)
  }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ router }) {
    router.onAfterRouteChange = refreshImageZoom
  }
}
