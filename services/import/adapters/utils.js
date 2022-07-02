import moment from "moment";

export function getNumber(str) {
  return parseFloat(str.replace('.', '').replace(',', '.').replace('-', ''))
}

export function getFeeInfo(parts) {
  let feeNumber = 1
  let totalFees = 1
  const feeInfo = parts.find((str) => str.match(/\d{2}\/\d{2}/) !== null || str.match(/\d{1,2}-\d{2}/) !== null)
  if (feeInfo) {
    if (feeInfo.length === 4) {
      feeNumber = parseInt(feeInfo.slice(0, 2))
      totalFees = parseInt(feeInfo.slice(2, 4))
    } else if (feeInfo.length === 5) {
      feeNumber = parseInt(feeInfo.slice(0, 3))
      totalFees = parseInt(feeInfo.slice(3, 5))
    }
  }
  return {
    feeNumber,
    totalFees
  }
}

export function getDate(str) {
  if (str.match(/\d{2}\.\d{2}\.\d{2}/) !== null) {
    return moment(str, 'DD.MM.YY')
  }
  if (str.match(/\d{2}\/\d{2}\/\d{4}/) !== null) {
    return moment(str, 'DD/MM/YYYY')
  }
  if (str.match(/\d{2} [A-Za-z]{3} \d{2}/) !== null) {
    return moment(str, 'DD MMM YY')
  }
  return moment(str)
}
