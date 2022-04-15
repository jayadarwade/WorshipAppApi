const mediafile = require("../model/mediafileCategoryModel");
exports.add = (request, response) => {
  console.log(request.body);
  mediafile
    .create({
      name: request.body.name,
    })
    .then((result) => {
      console.log(result);
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ mesaage: "failed" });
    });
};

exports.delete = (request, response) => {
  mediafile
    .deleteOne({ _id: request.params.id })
    .then((result) => {
      console.log(result);
      if (result.deletedCount)
        return response.status(202).json({ mesaage: "delete success" });
      else return response.status(204).json({ mesaage: "not deleted" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ mesaage: "failed" });
    });
};

exports.update = (request, response) => {
  mediafile
    .updateOne(
      { _id: request.body.id },
      {
        $set: {
          name: request.body.name,
        },
      }
    )
    .then((result) => {
      console.log(result);
      if (result.modifiedCount > 0)
        return response.status(202).json({ message: "update" });
      else return response.status(200).json({ message: "not update" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "failed" });
    });
};

exports.view = (request, response) => {
  mediafile
    .find()
    .then((result) => {
      console.log(result);
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ mesaage: "failed" });
    });
};
