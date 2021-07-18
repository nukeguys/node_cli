export const keys: <T>(obj: T) => Array<keyof T> = Object.keys;

export function sliceByByte({
  str,
  maxByte,
  addEllipsis = false,
}: {
  str: string;
  maxByte: number;
  addEllipsis?: boolean;
}) {
  let byteLen = 0;
  let i = 0;
  for (; i < str.length; ) {
    byteLen += str.charCodeAt(i) >> 7 ? 2 : 1;
    if (byteLen > maxByte) break;
    i++;
  }

  if (addEllipsis && i < str.length - 1) {
    return str.substring(0, i) + "...";
  } else {
    return str.substring(0, i);
  }
}
