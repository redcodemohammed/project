export function useHelpers() {
  const clipboard = useClipboard()
  const $snackbar = useSnackbar()

  function copy(text: string | number | undefined) {
    $snackbar.show({ message: 'تم النسخ للحافظة' })
    if (text) clipboard.copy(text.toString())
  }

  return { copy }
}
