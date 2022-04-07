const Cart = require("../model/cartModel");
exports.add = async (request, response) => {
  var cart = await Cart.findOne({ userId: request.body.userId });

  if (!cart) cart = new Cart({ userId: request.body.userId });

  cart.productList.push(request.body.productId);
  cart
    .save()
    .then((results) => {
      console.log(results);
      return response.status(201).json(results);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "something went wrong" });
    });
};

exports.addPackage = async (request, response) => {
  var cart = await Cart.findOne({ userId: request.body.userId });

  if (!cart) cart = new Cart({ userId: request.body.userId });

  cart.packageList.push(request.body.productId);
  cart
    .save()
    .then((results) => {
      console.log(results);
      return response.status(201).json(results);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "something went wrong" });
    });
};

exports.view = (request, response) => {
  Cart.findOne({ userId: request.params.id })
    .populate("products")
    .populate("packages")
    .then((results) => {
      console.log(results)
      return response.status(200).json(results);
    })
    .catch((err) => {
      console.log(err)
      return response.status(500).json({ message: "not found" });
    });
};

//   exports.viewcartone = (request, response) => {
//     Cart.findOne({ userId: request.params.id })
//       .populate("packages")
//       .then((results) => {
//         return response.status(200).json(results);
//       })
//       .catch((err) => {
//           console.log(err)
//         return response.status(500).json({ message: "not found" });
//       });
//   };

exports.deletecart = (request, response) => {
  Cart.deleteOne({ _id: request.params.id })
    .then((result) => {
      console.log(result)
      if (result.deletedCount)
        return response.status(202).json({ message: "delete success" });
      else return response.status(204).json({ message: "not deleted" });
    })
    .catch((err) => {
      console.log(err);
      return response
        .status(500)
        .json({ message: "Oops! something went wrong" });
    });
};

exports.deleteOneProduct = (request, response) => {
  Cart.updateOne(
    { _id: request.params.id },
    {
      $pullAll: {
        productList: [
          {
            _id: request.params.productid,
          },
        ],
      },
    }
  )
    .then((result) => {
      console.log(result);
      if (result.modifiedCount)
        return response.status(202).json({ message: "update  success..." });
      else return response.status(404).json({ message: "not updated...." });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ message: "something went wrong" });
    });
};