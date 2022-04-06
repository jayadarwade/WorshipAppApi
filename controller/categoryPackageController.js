const packageCategory = require("../model/packageCategoryModel");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const bucketName = "gs://worship-first.appspot.com/";

const storage = new Storage({
  projectId: "worship-first",
  keyFilename: "worship-first-firebase-adminsdk-vcyhq-642e473ed6.json",
});
exports.add = (request, response) => {
  packageCategory
    .create({
      name: request.body.name,
      image:
        "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/" +
        request.file.filename +
        "?alt=media&token=hello",
    })
    .then((result) => {
      uploadFile(
        path.join(__dirname, "../", "public/images/") + request.file.filename
      );
      return response.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "error" });
    });
};
const uploadFile = async (filename) => {
  storage.bucket(bucketName).upload(filename, {
    gzip: true,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: "hello",
      },
    },
  });
};
exports.update = (request, response) => {
  packageCategory
    .updateOne(
      { _id: request.body.id },
      {
        $set: {
          name: request.body.name,
          image:
            "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/" +
            request.file.filename +
            "?alt=media&token=hello",
        },
      }
    )
    .then((result) => {
      console.log(result)
      if (result.modifiedCount)
        return response.status(202).json({ message: "success" });
      else return response.status(204).json({ message: "not found" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "wrong" });
    });
};

exports.view=(request,response)=>{
  packageCategory.find().then(result=>{
    console.log(result)
    return response.status(200).json(result)
  }) 
  .catch(err=>{
    console.log(err)
    return response.status(500).json({message:'wrong'})
  })
}