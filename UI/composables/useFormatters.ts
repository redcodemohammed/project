export function useFormatters() {
  return {
    formatDate(dateString: string) {
      return useDateFormat(dateString, 'ddd YYYY/MM/DD', { locales: 'ar' })
    },
    formatDateTime(dateString: string) {
      return useDateFormat(dateString, 'ddd YYYY/MM/DD hh:mm a', { locales: 'ar' })
    }
  }
}
