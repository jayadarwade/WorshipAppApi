const packageCategory = require("../model/packageCategoryModel");

exports.add = (request, response) => {
  packageCategory
    .create({
      name: request.body.name,
      image: request.file.filename,
    })
    .then((result) => {
      console.log(result);
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "error" });
    });
};
