interface useSnackbarParams {
  message: string
  timeout?: number
  show?: boolean
}
export function useSnackbar() {
  const state = useState<useSnackbarParams>('snackbar', () => ({ message: '', show: false, timeout: 500 }))
  return {
    show({ message, timeout }: useSnackbarParams) {
      state.value.message = message
      state.value.timeout = timeout
      state.value.show = true
    },
    state
  }
}
