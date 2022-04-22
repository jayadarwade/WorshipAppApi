const orderModel = require("../model/orderModel");
const Razorpay = require("razorpay");
var instance = new Razorpay({ key_id: 'rzp_test_NPr7p2g2REFz6n', key_secret: '5IUWlT8W8DcE7AKSVYCDvV7O' })

exports.place = (request,response)=>{
    let productList = request.body.productList;
    orderModel.create({
        userId:request.body.id,
        productList:request.body.productList,
        mobile:request.body.mobile,
        address:request.body.address,
        amount:request.body.amount
    }).then(result=>{
        console.log(result);
    }).catch(err=>{
        console.log(err);
    });
}

exports.create = (request,response)=>{
    console.log(request.body);
    let amount = request.body.order.amount +'00';
    amount = amount *1;
    instance.orders.create({
        amount: amount,
        currency: "INR"
      },(err,order)=>{
          if(err){
              console.log(err);
          }else{
            orderModel.create({
                userId:request.body.order.id,
                productList:request.body.order.productList,
                mobile:request.body.order.mobile,
                address:request.body.order.address,
                amount:request.body.order.amount
            }).then(result=>{
                console.log(result);
                console.log(order);
                return response.status(200).json({order,result});
            }).catch(err=>{
                console.log(err);
            });
          }
      });
}

exports.orderStatus = (request,response)=>{
    instance.payments.fetch(request.body.razorpay_payment_id)
    .then(paymentDetails=>{
        console.log(paymentDetails);
        response.send("Payment Success");
    })
    .catch(err=>{
        console.log(err);
    })
}





