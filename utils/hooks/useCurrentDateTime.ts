function useCurrentDateTime() {
  const [date, time] = formatDate(new Date()).split(' ')

  function padTo2Digits(num: any) {
    return num.toString().padStart(2, '0')
  }

  function formatDate(date: any) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        // padTo2Digits(date.getSeconds()),
      ].join(':')
    )
  }

  return { date, time }
}

export default useCurrentDateTime
