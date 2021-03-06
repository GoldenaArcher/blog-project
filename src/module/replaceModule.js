module.exports = (template, name, replacement) => {
    const reg = new RegExp(name, "g");
    return template.replace(reg, replacement);
}