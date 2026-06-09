import { Component, type ReactNode } from "react"
import { toast } from "sonner"

type Props = {
  fallback?: ReactNode
  path?: unknown
  children: ReactNode
  errorMessage?: string
}

class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(): void {
    if (!this.props.fallback || this.props.errorMessage) {
      toast.error(
        this.props.errorMessage ??
          "Część interfejsu nie została wczytana. Odśwież stronę"
      )
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.state.failed && prevProps.path !== this.props.path) {
      this.setState({ failed: false })
    }
  }

  render() {
    return this.state.failed
      ? (this.props.fallback ?? null)
      : this.props.children
  }
}
export default ErrorBoundary
