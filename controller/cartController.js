const Cart = require('../model/cartModel')
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

  exports.viewcartone = (request, response) => {
    Cart.findOne({ userId: request.params.id })
      .populate("products").populate("packages")
      .then((results) => {
        return response.status(200).json(results);
      })
      .catch((err) => {
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