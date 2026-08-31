export function getFriendlyErrorMessage(
  error,
) {
  const raw = (
    error?.message || ''
  ).toLowerCase()

  if (
    raw.includes('network') ||
    raw.includes('fetch') ||
    raw.includes('failed to fetch')
  ) {
    return 'اتصال اینترنت شما برقرار نیست. لطفاً اتصال را بررسی کرده و دوباره تلاش کنید.'
  }

  if (
    raw.includes('timeout') ||
    raw.includes('time out')
  ) {
    return 'پردازش تصویر بیش از حد طول کشید. لطفاً دوباره تلاش کنید.'
  }

  if (
    raw.includes('429') ||
    raw.includes('rate limit')
  ) {
    return 'در حال حاضر درخواست‌ها زیاد شده است. لطفاً چند لحظه صبر کنید و دوباره امتحان کنید.'
  }

  if (
    raw.includes('500') ||
    raw.includes('502') ||
    raw.includes('503') ||
    raw.includes('server')
  ) {
    return 'مشکلی در سرور پیش آمده است. لطفاً کمی بعد دوباره تلاش کنید.'
  }

  if (
    raw.includes('unauthorized') ||
    raw.includes('401') ||
    raw.includes('403')
  ) {
    return 'اجازه دسترسی به این عملیات وجود ندارد. لطفاً دوباره وارد شوید.'
  }

  return 'مشکلی در پردازش تصویر پیش آمد. لطفاً دوباره تلاش کنید.'
}