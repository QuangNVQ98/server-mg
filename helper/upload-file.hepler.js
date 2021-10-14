module.exports.uploadFile = function (file, path) {
    try {
        const fileName = Date.now() + file.name;

        const returnPath = `./uploads/${path}/${fileName}`;
        file.mv(returnPath);

        return `${path}/${fileName}`;
    } catch (error) {
        return false;
    }
}