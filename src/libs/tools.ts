export function getKeyEnumByVal(_enum: object, value: any) {
  const index = Object.values(_enum).indexOf(value)

  return Object.keys(_enum)[index]
}
