module.exports.convertToValue = (string) => {
  const removeBlanks = string.replace(" ", "-");
  return  removeBlanks.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
