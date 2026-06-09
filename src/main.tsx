import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import ErrorBoundary from "./shared/components/ErrorBoundary.tsx"
import PageLoadError from "./shared/layout/PageLoadError.tsx"

window.addEventListener("vite:preloadError", (e) => {
  const last = Number(sessionStorage.getItem("chunk-reload") ?? 0)
  if (Date.now() - last < 30000) return
  e.preventDefault()
  sessionStorage.setItem("chunk-reload", String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<PageLoadError />}>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
