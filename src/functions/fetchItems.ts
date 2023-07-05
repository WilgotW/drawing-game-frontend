export default function fetchItems(file: string) {
  return fetch(`../public/${file}`)
    .then((response) => response.text())
    .then((content) => {
      if (content) {
        const item = content
          .replace(/\r\n/g, "")
          .split(".")
          .map((word) => word.trim());

        return item.slice(0, item.length - 1);
      } else {
        throw new Error("Empty content");
      }
    })
    .catch((error) => {
      console.error("Error fetching file:", error);
      throw error;
    });
}
