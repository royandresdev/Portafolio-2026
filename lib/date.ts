/**
 * Formatea fechas relativas tal como en el diseño de Figma utilizando la API nativa Intl de JavaScript.
 * Esto evita el uso de dependencias externas adicionales, manteniendo el tamaño del bundle al mínimo.
 */
export function getRelativeTimeString(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 7) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `Last updated: ${month} ${day}, ${year}`;
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let relativePart = "";

  if (diffInDays >= 1) {
    relativePart = rtf.format(-diffInDays, "day"); // "yesterday" o "X days ago"
  } else if (diffInHours >= 1) {
    relativePart = rtf.format(-diffInHours, "hour"); // "X hours ago"
  } else if (diffInMins >= 1) {
    relativePart = rtf.format(-diffInMins, "minute"); // "X minutes ago"
  } else {
    return "Last updated: just now";
  }

  // Capitalizar "yesterday" para que se muestre como "Yesterday" y coincida con el diseño
  if (relativePart === "yesterday") {
    relativePart = "Yesterday";
  }

  return `Last updated: ${relativePart}`;
}
