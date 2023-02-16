export default function transformTimeLeft(time: number) {
  if (time > 9) return time.toString();
  return "0" + time.toString();
}
