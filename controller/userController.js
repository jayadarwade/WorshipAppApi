const userModel = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../configuration/emailConfig");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const requests = require("request");
const fastsms = require("fast-two-sms");


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

exports.userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, mobile } = req.body;
  const image =
    "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/" +
    req.file.filename +
    "?alt=media&token=hello";
  if (name && email && password && password_confirmation && mobile && image) {
    if (password === password_confirmation) {
      try {
        let otp = Math.floor(Math.random() * 10000);
        if (otp < 1000) {
          otp = "0" + otp;
        }
        req.body.otp = otp;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const doc = new userModel({
          name: name,
          email: email,
          password: hashPassword,
          mobile: mobile,
          image: image,
          otp: otp
        });
        await doc.save();

        var option = {
          authorization: 'fFdBgoans3ZJAbPGieMQT8hj1qNXKSDC65zxWEwl2rOpY7Hmvy3oVxeTkulNpsgRvrJWXOIMhGmdE7ni',
          message: "Your OTP for registration in WorshipFirst is " + otp
          , numbers: [mobile]
        }
        fastsms.sendMessage(option).then((response) => {
          console.log(response);
        });
        uploadFile(
          path.join(__dirname, "../", "public/images/") + req.file.filename
        );
        const saved_user = await userModel.findOne({ email: email });
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
          result: saved_user
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
};

exports.userLogin = async (req, res) => {
  console.log("jhdfg");
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
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
            result : user
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

exports.sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://127.0.0.1:3000/user/reset/${user._id}/${token}`;
      console.log(link);
      // // Send Email  http://127.0.0.1:3000/user/reset/:id/:token
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<a href=${link}>Click Here</a> to Reset Your Password`,
      });
      res.send({
        status: "success",
        message: "Password Reset Email Sent... Please Check Your Email",
      });
    } else {
      res.send({ status: "failed", message: "Email doesn't exists" });
    }
  } else {
    res.send({ status: "failed", message: "Email Field is Required" });
  }
};

exports.userPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;//
  const user = await userModel.findById(id);
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
        const user = await userModel.findById(id);
        await userModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword }
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

exports.updateprofile = (request, response) => {
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
      },
      method: "DELETE",
    });
  } else {
    image = request.body.oldImage;
  }
  userModel
    .updateOne(
      { _id: request.body.id },
      {
        $set: {
          name: request.body.name,
          email: request.body.email,
          mobile: request.body.mobile,
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

exports.view = (req, res) => {
  userModel
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
  userModel
    .deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      if (result.deletedCount)
        return res.status(200).json({ status: "success full deleted" });
      else return res.status(201).json({ message: "not delte" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "filed" });
    });
};

exports.loginByOtp = (request, response) => {
  userModel.findOne({ _id: request.body.id, otp: request.body.otp })
    .then(result => {
      return response.status(200).json(result);
    }).catch(err => {
      return response.status(500).json(err);
    });
}

exports.resendOtp = (request, response) => {
  let otp = Math.floor(Math.random() * 10000);
  if (otp < 1000) {
    otp = "0" + otp;
  }
  userModel.findByIdAndUpdate({ _id: request.body.id }, { $set: { otp: otp } })
    .then(result => {
      var option = {
        authorization: 'fFdBgoans3ZJAbPGieMQT8hj1qNXKSDC65zxWEwl2rOpY7Hmvy3oVxeTkulNpsgRvrJWXOIMhGmdE7ni',
        message: "Your OTP for registration in WorshipFirst is " + otp
        , numbers: [result.mobile]
      }
      fastsms.sendMessage(option).then((response, err) => {
        console.log(response);
      });
      response.status(200).json({ message: "Message sent successfully" });
    })
    .catch(err => {
      console.log(err);
      return response.status(500).json({ message: "Something went wrong" });
    })
}

exports.socialLogin = async (request, response) => {
  const user = await userModel.findOne({ email: request.body.email });
  if (user) {
    const token = jwt.sign(
      { userID: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );
    return response.status(200).json({user:user,token:token});
  }
  else {
    userModel.create({ name: request.body.name, email: request.body.email, image: request.body.image })
      .then(result => {
        const token = jwt.sign(
          { userID: result._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "5d" }
        );
        return response.status(200).json({user:result,token:token});
      }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
      });
  }
}