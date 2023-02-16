export default function getCommast(value: number) {
  const valueString = value.toString();
  if (valueString.length <= 3) {
    return valueString;
  }
  let returnValue = "";

  let k = 0;
  for (let i = valueString.length - 1; i >= 0; i--) {
    k++;
    returnValue = valueString[i] + returnValue;
    if (k == 3 && i != valueString.length - 1 && i > 0) {
      returnValue = "," + returnValue;
      k = 0;
    }
  }
  return returnValue;
}
