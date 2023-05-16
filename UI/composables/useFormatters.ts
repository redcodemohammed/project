export function useFormatters() {
  return {
    formatDate(dateString: string) {
      return useDateFormat(dateString, 'ddd YYYY/MM/DD', { locales: 'ar' })
    }
  }
}
