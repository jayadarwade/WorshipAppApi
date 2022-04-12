const priestModel = require("../model/priestModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../configuration/emailConfig");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const requests = require("request");
const mongoose = require("mongoose");

const storage = new Storage({
  projectId: "worship-first",
  keyFilename: "worship-first-firebase-adminsdk-vcyhq-642e473ed6.json",
});

const bucketName = "gs://worship-first.appspot.com/";

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

exports.priestRegistration = async (req, res) => {
  // console.log(req.body);
  let evalData = eval(req.body.categoryid);
  console.log(evalData);
  const { name, email, password, password_confirmation, mobile, age, about } =
    req.body;
  console.log(
    name +
      " " +
      email +
      " " +
      password +
      " " +
      password_confirmation +
      " " +
      mobile +
      " " +
      age +
      " "
  );
  const image =
    "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/" +
    req.file.filename +
    "?alt=media&token=hello";
  let priestModelObj = new priestModel();
  for (let i = 0; i < evalData.length; i++) {
    priestModelObj.priestCategory.push(evalData[i].id);
  }
  const user = await priestModel.findOne({ email: email });
  if (user) {
    res.status(201).send({ status: "failed", message: "Email already exists" });
  } else {
    if (
      name &&
      email &&
      password &&
      password_confirmation &&
      mobile &&
      age &&
      image &&
      about
    ) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const doc = new priestModel({
            name: name,
            email: email,
            password: hashPassword,
            password_confirmation: hashPassword,
            mobile: mobile,
            age: age,
            image: image,
            about: about,
            priestCategory: priestModelObj.priestCategory,
          });

          await doc.save();
          uploadFile(
            path.join(__dirname, "../", "public/images/") + req.file.filename
          );
          const saved_user = await priestModel.findOne({ email: email });
          // Generate JWT Token
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(201).send({
            status: "success",
            message: "Registration Success",
            token: token,
          });
        } catch (error) {
          console.log(error);
          res.send({ status: "failed", message: "Unable to Register" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Password and Confirm Password doesn't match",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  }
};

exports.priestLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await priestModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.send({
            status: "success",
            message: "Login Success",
            token: token,
          });
        } else {
          res.send({
            status: "failed",
            message: "Email or Password is not Valid",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "You are not a Registered User",
        });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", message: "Unable to Login" });
  }
};

exports.priestUpdateprofile = (request, response) => {
  let image;
  if (request.file) {
    image =
      "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/" +
      request.file.filename +
      "?alt=media&token=hello";

    uploadFile(
      path.join(__dirname, "../", "public/images/") + request.file.filename
    );
    requests({
      url: request.body.oldImage,
      qs: {
        key: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDp6LFHpaC1iuKW\n56oz9NaSSwzv2a3JPM61nmFkSBxDzOkULaAgh9+In4U+fxxGvrOXrx6BX6yLt/MA\n0dCR0F2XThikJ52gjU7KvyzYs4S2ASbp7kqoPoDVfxtFNx47IQeG9sbqXr7cKqqM\nGE5T5mpFLHQwpfTVzqJb3h7wZVDF5hSrLYjq3oa3G9CO2kjnP+EgJOvzTtENvNf9\nq5h3OA6MYEdTMDgpsa3Nv8qPB8GJxCUvZyXB3cfo17WP7e2PyHF5X87nejArfOfO\n8qL4zoY0INnEXwjjIGNvQ1rEaPv/ItDZ9k9rHQm0mmm+tWypEkkC6Mbre0xH+PSn\nDzHpCBXdAgMBAAECggEAWcd9B/18DkJFD1vS+cc/dn5E9GiuKf/jbVVhl06QPrvP\nOHX8sI/GThfAWkkKjuLSZuWJxWl1/li39jgSIG2EBresgJFOEJo8RFiVe4WH6h3O\nFFron+QBqjBzxKDPwy09yOE+XyXHhxT/Se9oXQ6i+nMCE8wXCduaeL1sTaPtmU8n\nAfhEcdQKq5faCbWxdiJuXsJCOQkJNQZOFNoeulVyV42zighCQG3K9+1mOiDxxvhV\nMF8pc6js3OWN1v6nXHYKDS4+dbHkOcD7iVcftZnVZ8sGF0dsL3jK4wFpw/otVMtg\ni+jVWZfGjmbefbQhZbY5EJ0ZSjpRkvOHtSA8DwIXlwKBgQD3ohnZp0MtSHfbajtI\nr40H6X3S5aFyCbmugDWXKqgh3C+MJumCjASBa++UOa6EkedLV39fHrJi9G/WbDJm\ns5bZu6IQ9wr508kS7SCfEkVEE2wZEVXnc4Xy3kCFanDQ+rMb4ZcE5TwzolnQjdQe\n/hNRj8jsG9XD5skijKXMbrHY3wKBgQDxz+JD9fdA8yVqBCyT8fIigIG1FfgMXJgA\nS/E0BbExFV7mDUN3E2EbCwtvs5JSj0/qsdBhbDwYQbt0LDCUisXWYQei8KEZ6+ok\n0erBWaOHyzlkYoT0sDPi7wjHd0UWqyKd8QvChuzb5AtASHLzttDBL+H0FnUy1pvz\napUa7ZicwwKBgFhdVdAfKY+NHogDXmhPjInYPff1zSh+Y+3q/jSVGi4K/kSK1iSp\nhioQtAs2khnoXpq5/E+bCpjZFNd1AH85coj7tZdMMHR5qHTCfTOGN4VVUOuZDghr\nZs8FlAyHsP5Bl4xJcbRjgJoEQvxyv9DXZVljb5UhUaR4RCm5+qf6kCgNAoGBAM+2\nOW8VTmFdOws5MK2Yy9w1NLW/fEXqF6tRkIyWQyGdcNn+FLCpVeVr9FPsFUmTzxsT\nyKKW3Xwcoo/lEYnXNp+y02N0fX4NtyAPrS6O+DjCKbeAJSMmZDuQBqOIYTFaqa6w\nCuD7E2TDG6MJWKzeoa0Am4AW9m9IB8ftCs2JwGkPAoGBAI+zUllJBKjCTxgXTjML\n2TeP5vce41nA3XhOfUiTGMnC0F/V2kMuf9hq5Hmd1pRjFHQyV77BmSPQ9GKHzJs4\nDGvCZ5lfMGPFab9RW9byJsS43w78zEPx6c8vu8+I3HuSB0aRDcci4bLBe6G70oE/\nFUcP0GzOe2MhuBJcWWGz3Pny",
      }, // you can find your private-key in your keyfile.json
      method: "DELETE",
    });
  } else {
    image = request.body.oldImage;
  }

  priestModel
    .updateOne(
      { _id: request.body.id },
      {
        $set: {
          name: request.body.name,
          email: request.body.email,
          mobile: request.body.mobile,
          age: request.body.age,
          image: image,
        },
      }
    )
    .then((result) => {
      console.log(result);
      if (result.modifiedCount)
        return response.status(202).json({ message: "update  success..." });
      else return response.status(204).json({ message: "not updated...." });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "something went wrong" });
    });
};

exports.priestPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  const user = await priestModel.findById(id);
  const new_secret = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        const user = await priestModel.findById(id);
        await priestModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
        res.send({ status: "success", message: "Password Reset Successfully" });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", message: "Invalid Token" });
  }
};

exports.view = (req, res) => {
  priestModel
    .find()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "something went wrong" });
    });
};

exports.delete = (req, res) => {
  priestModel
    .deleteOne({ _id: req.params.id })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "something went wrong" });
    });
};
