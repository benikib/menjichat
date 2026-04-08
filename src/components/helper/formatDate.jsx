const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d)) return "";

  return d.toLocaleDateString("fr-FR");
};

export default formatDate;