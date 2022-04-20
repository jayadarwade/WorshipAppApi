const express = require("express");
const router = express.Router();
const {Storage} = require("@google-cloud/storage");
const multer = require("multer");
const productModel = require("../model/productModel");
const path = require("path");
const requests = require("request");

var storages = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  var upload = multer({ storage: storages });

  const storage = new Storage({
    projectId : "worship-first",
    keyFilename : "worship-first-firebase-adminsdk-vcyhq-642e473ed6.json"
});
const bucketName = "gs://worship-first.appspot.com/";

router.post("/add",upload.single("image"),(request,response)=>{
    productModel.create({
        name : request.body.name,
        image : "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/"+request.file.filename+"?alt=media&token=hello",
        price : request.body.price,
        stock : request.body.stock,
        description : request.body.description,
        category : request.body.category,
        keywords : request.body.keywords
    }).then(result=>{
        uploadFile(path.join(__dirname, "../", "public/images/") + request.file.filename);
        return response.status(201).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    });
});

router.get("/view",(request,response)=>{
    productModel.find().populate("category")
    .then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json({message : "Something went wrong"});
    });
});

router.delete("/delete/:id",(request,response)=>{
    productModel.findByIdAndDelete({_id : request.params.id})
    .then(result=>{
            requests({
                url: result.image,
                qs: { key: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDp6LFHpaC1iuKW\n56oz9NaSSwzv2a3JPM61nmFkSBxDzOkULaAgh9+In4U+fxxGvrOXrx6BX6yLt/MA\n0dCR0F2XThikJ52gjU7KvyzYs4S2ASbp7kqoPoDVfxtFNx47IQeG9sbqXr7cKqqM\nGE5T5mpFLHQwpfTVzqJb3h7wZVDF5hSrLYjq3oa3G9CO2kjnP+EgJOvzTtENvNf9\nq5h3OA6MYEdTMDgpsa3Nv8qPB8GJxCUvZyXB3cfo17WP7e2PyHF5X87nejArfOfO\n8qL4zoY0INnEXwjjIGNvQ1rEaPv/ItDZ9k9rHQm0mmm+tWypEkkC6Mbre0xH+PSn\nDzHpCBXdAgMBAAECggEAWcd9B/18DkJFD1vS+cc/dn5E9GiuKf/jbVVhl06QPrvP\nOHX8sI/GThfAWkkKjuLSZuWJxWl1/li39jgSIG2EBresgJFOEJo8RFiVe4WH6h3O\nFFron+QBqjBzxKDPwy09yOE+XyXHhxT/Se9oXQ6i+nMCE8wXCduaeL1sTaPtmU8n\nAfhEcdQKq5faCbWxdiJuXsJCOQkJNQZOFNoeulVyV42zighCQG3K9+1mOiDxxvhV\nMF8pc6js3OWN1v6nXHYKDS4+dbHkOcD7iVcftZnVZ8sGF0dsL3jK4wFpw/otVMtg\ni+jVWZfGjmbefbQhZbY5EJ0ZSjpRkvOHtSA8DwIXlwKBgQD3ohnZp0MtSHfbajtI\nr40H6X3S5aFyCbmugDWXKqgh3C+MJumCjASBa++UOa6EkedLV39fHrJi9G/WbDJm\ns5bZu6IQ9wr508kS7SCfEkVEE2wZEVXnc4Xy3kCFanDQ+rMb4ZcE5TwzolnQjdQe\n/hNRj8jsG9XD5skijKXMbrHY3wKBgQDxz+JD9fdA8yVqBCyT8fIigIG1FfgMXJgA\nS/E0BbExFV7mDUN3E2EbCwtvs5JSj0/qsdBhbDwYQbt0LDCUisXWYQei8KEZ6+ok\n0erBWaOHyzlkYoT0sDPi7wjHd0UWqyKd8QvChuzb5AtASHLzttDBL+H0FnUy1pvz\napUa7ZicwwKBgFhdVdAfKY+NHogDXmhPjInYPff1zSh+Y+3q/jSVGi4K/kSK1iSp\nhioQtAs2khnoXpq5/E+bCpjZFNd1AH85coj7tZdMMHR5qHTCfTOGN4VVUOuZDghr\nZs8FlAyHsP5Bl4xJcbRjgJoEQvxyv9DXZVljb5UhUaR4RCm5+qf6kCgNAoGBAM+2\nOW8VTmFdOws5MK2Yy9w1NLW/fEXqF6tRkIyWQyGdcNn+FLCpVeVr9FPsFUmTzxsT\nyKKW3Xwcoo/lEYnXNp+y02N0fX4NtyAPrS6O+DjCKbeAJSMmZDuQBqOIYTFaqa6w\nCuD7E2TDG6MJWKzeoa0Am4AW9m9IB8ftCs2JwGkPAoGBAI+zUllJBKjCTxgXTjML\n2TeP5vce41nA3XhOfUiTGMnC0F/V2kMuf9hq5Hmd1pRjFHQyV77BmSPQ9GKHzJs4\nDGvCZ5lfMGPFab9RW9byJsS43w78zEPx6c8vu8+I3HuSB0aRDcci4bLBe6G70oE/\nFUcP0GzOe2MhuBJcWWGz3Pny' }, // you can find your private-key in your keyfile.json
                method: 'DELETE'
            });
        return response.status(200).json({status:"Deleted"});
    }).catch(err=>{
        return response.status(500).json(err);
    });
});

router.post("/search",(request,response)=>{
    productModel.find({keywords: {$regex: request.body.keywords, $options: 'i'} })
    .then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    });
});

router.post("/edit",upload.single("image"),(request,response)=>{
  let image;
  if (request.file) {
    image =
      "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/" +
      request.file.filename +
      "?alt=media&token=hello";

    uploadFile(path.join(__dirname, "../", "public/images/") + request.file.filename);
    requests({
      url: request.body.oldImage,
      qs: {
        key: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDp6LFHpaC1iuKW\n56oz9NaSSwzv2a3JPM61nmFkSBxDzOkULaAgh9+In4U+fxxGvrOXrx6BX6yLt/MA\n0dCR0F2XThikJ52gjU7KvyzYs4S2ASbp7kqoPoDVfxtFNx47IQeG9sbqXr7cKqqM\nGE5T5mpFLHQwpfTVzqJb3h7wZVDF5hSrLYjq3oa3G9CO2kjnP+EgJOvzTtENvNf9\nq5h3OA6MYEdTMDgpsa3Nv8qPB8GJxCUvZyXB3cfo17WP7e2PyHF5X87nejArfOfO\n8qL4zoY0INnEXwjjIGNvQ1rEaPv/ItDZ9k9rHQm0mmm+tWypEkkC6Mbre0xH+PSn\nDzHpCBXdAgMBAAECggEAWcd9B/18DkJFD1vS+cc/dn5E9GiuKf/jbVVhl06QPrvP\nOHX8sI/GThfAWkkKjuLSZuWJxWl1/li39jgSIG2EBresgJFOEJo8RFiVe4WH6h3O\nFFron+QBqjBzxKDPwy09yOE+XyXHhxT/Se9oXQ6i+nMCE8wXCduaeL1sTaPtmU8n\nAfhEcdQKq5faCbWxdiJuXsJCOQkJNQZOFNoeulVyV42zighCQG3K9+1mOiDxxvhV\nMF8pc6js3OWN1v6nXHYKDS4+dbHkOcD7iVcftZnVZ8sGF0dsL3jK4wFpw/otVMtg\ni+jVWZfGjmbefbQhZbY5EJ0ZSjpRkvOHtSA8DwIXlwKBgQD3ohnZp0MtSHfbajtI\nr40H6X3S5aFyCbmugDWXKqgh3C+MJumCjASBa++UOa6EkedLV39fHrJi9G/WbDJm\ns5bZu6IQ9wr508kS7SCfEkVEE2wZEVXnc4Xy3kCFanDQ+rMb4ZcE5TwzolnQjdQe\n/hNRj8jsG9XD5skijKXMbrHY3wKBgQDxz+JD9fdA8yVqBCyT8fIigIG1FfgMXJgA\nS/E0BbExFV7mDUN3E2EbCwtvs5JSj0/qsdBhbDwYQbt0LDCUisXWYQei8KEZ6+ok\n0erBWaOHyzlkYoT0sDPi7wjHd0UWqyKd8QvChuzb5AtASHLzttDBL+H0FnUy1pvz\napUa7ZicwwKBgFhdVdAfKY+NHogDXmhPjInYPff1zSh+Y+3q/jSVGi4K/kSK1iSp\nhioQtAs2khnoXpq5/E+bCpjZFNd1AH85coj7tZdMMHR5qHTCfTOGN4VVUOuZDghr\nZs8FlAyHsP5Bl4xJcbRjgJoEQvxyv9DXZVljb5UhUaR4RCm5+qf6kCgNAoGBAM+2\nOW8VTmFdOws5MK2Yy9w1NLW/fEXqF6tRkIyWQyGdcNn+FLCpVeVr9FPsFUmTzxsT\nyKKW3Xwcoo/lEYnXNp+y02N0fX4NtyAPrS6O+DjCKbeAJSMmZDuQBqOIYTFaqa6w\nCuD7E2TDG6MJWKzeoa0Am4AW9m9IB8ftCs2JwGkPAoGBAI+zUllJBKjCTxgXTjML\n2TeP5vce41nA3XhOfUiTGMnC0F/V2kMuf9hq5Hmd1pRjFHQyV77BmSPQ9GKHzJs4\nDGvCZ5lfMGPFab9RW9byJsS43w78zEPx6c8vu8+I3HuSB0aRDcci4bLBe6G70oE/\nFUcP0GzOe2MhuBJcWWGz3Pny"}, // you can find your private-key in your keyfile.json
        method: "DELETE",
    });
  } else {
    image = request.body.oldImage;
  }
  productModel.updateOne(
      { _id: request.body.id },
      {
        name: request.body.name,
        image: image,
        stock: request.body.stock,
        price : request.body.price,
        description : request.body.description,
        category : request.body.category,
        keywords : request.body.keywords
      })
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
});

router.get("/search-by-cat/:id",(request,response)=>{
    productModel.find({category : request.params.id}).populate("category")
    .then(result=>{
        return response.status(200).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    })
});

router.post("/search-by-cat-name",(request,response)=>{
    productModel.find().populate("category")
    .then(result=>{
        var flag = false;
        var data = [];
        for(product of result){
            console.log(product);
            if(product.category.name==request.body.name){
                flag = true;
                data.push(product);
            }
        }
        if(flag)
            return response.status(200).json(data);
        return response.status(200).json("No data Found");
    }).catch(err=>{
        console.log(err);
        return response.status(500).json({err : "Something went wrong"});
    });
});

router.post("/filter-by-price-and-cat",(request,response)=>{
    productModel.find({price: { $gte: request.body.lowPrice, $lte: request.body.highPrice },category:request.body.categoryId})
    .then(result=>{
        response.status(200).json(result);
    }).catch(err=>{
        response.status(500).json({err:"Something went wrong"});
    })
});

router.post("/filter-by-price",(request,response)=>{
    productModel.find({price: { $gte: request.body.lowPrice, $lte: request.body.highPrice } })
    .then(result=>{
        response.status(200).json(result);
    }).catch(err=>{
        response.status(500).json({err:"Something went wrong"});
    })
});

router.post("/view-categoryid", (request, response) => {
    productModel
      .find({ category: request.body.catid })
      .then((result) => {
        console.log(result)
        return response.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
      });
  });

const uploadFile = async(filename)=>{
    storage.bucket(bucketName).upload(filename,{
        gzip:true,
        metadata : {
            metadata : {
                firebaseStorageDownloadTokens : "hello"
            }
        }
    });
}

module.exports = router;