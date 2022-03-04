import * as browser from 'webextension-polyfill'
import { App, createApp } from 'vue'
import ContentScripts from './ContentScripts.vue'
import { sleep } from '@/utils'

/* ---------------------------------- setup --------------------------------- */
const container = document.createElement('div')
const shadow = container.attachShadow({ mode: 'closed' })

// mount styles
const style = document.createElement('link')

style.setAttribute('href', browser.runtime.getURL('contentScripts.css'))
style.setAttribute('rel', 'stylesheet')
shadow.append(style)

// mount root
const root = document.createElement('div')

root.style.setProperty('float', 'left') // to avoid flicker when mounted
root.classList.add('root')
shadow.append(root)

/* -------------------------------- mount app ------------------------------- */
let app: App<Element> | null = null

function mount(selectedText: string, x: number, y: number) {
  document.body.append(container)
  app = createApp(ContentScripts, { selectedText, x, y })
  app.mount(root)
}

function unmount() {
  app?.unmount()
  container.remove()

  app = null
}

document.addEventListener('mouseup', async ev => {
  await sleep()

  const isInside = container.contains(ev.target as HTMLElement)
  if (isInside) return

  unmount()

  const selectedText = getSelection()?.toString().trim()
  if (selectedText) mount(selectedText, ev.x, ev.y)
})