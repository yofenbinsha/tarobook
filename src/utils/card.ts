export const generateCardNo = () => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `L${year}${month}${day}${random}`
}
