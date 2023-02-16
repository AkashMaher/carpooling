export default function getDescription(description: string) {
  if (description.length <= 74) {
    return description;
  } else return description.slice(0, 72).trim() + "...";
}
