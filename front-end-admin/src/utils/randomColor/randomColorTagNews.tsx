const colorOptions = ["red", "blue", "cyan", "green", "yellow", "orange", "purple", "pink", "teal", "lime", "indigo", "gray"];

export const getColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let index = Math.abs(hash % colorOptions.length);
  return colorOptions[index];
};
