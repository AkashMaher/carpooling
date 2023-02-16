import { toast } from 'react-toastify'

export const handleAnimationDelay = (
  index: number,
  screenWidth: number
): number => {
  if (screenWidth >= 1536) {
    if (index < 8) return 1.2 + index * 0.2
    else return index * 0.2
  } else if (screenWidth >= 1280) {
    if (index < 3) return 1.2 + index * 0.2
    else return index * 0.2
  } else if (screenWidth >= 768) {
    if (index < 4) return 1.2 + index * 0.2
    else return index * 0.2
  } else {
    if (index < 1) return 1.2 + index * 0.2
    else return index * 0.2
  }
}

export const shortenString = (
  value: string,
  leftDigits: number,
  rightDigits: number
) => {
  let shortenedString = ''
  if (value) {
    shortenedString =
      value?.substring(0, leftDigits) +
      '...' +
      value?.substring(value?.length - rightDigits)
  }
  return shortenedString
}

export const handleError = (error: unknown) => {
  error instanceof Error
    ? toast.dark(error?.message, { type: 'error', hideProgressBar: true })
    : toast.dark('error connecting to server', {
        type: 'error',
        hideProgressBar: true,
      })
}
