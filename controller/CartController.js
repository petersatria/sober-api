const { Cart, CartDetail } = require('../models')
const { ObjectId } = require('mongodb')

const getCart=async(req,res)=>{
    let userId = req.params.userId
    try {
        const cart = await Cart.findOne({userId:userId, status:'unpaid'})
        const carts = await CartDetail.aggregate([
            {$match:{cartId:cart._id}},
            {$lookup:{
                from:'products',
                localField:'productId',
                foreignField:'_id',
                as:'product'
            }}
        ])

        carts.forEach((val)=>{
            val.timestamp = ObjectId(val._id).getTimestamp()
        })

        return res.json({carts})
    } catch (error) {
        console.log(error)        
    }
}



const postCart=async(req,res)=>{
    try {
        let {productId, quantity, userId} = req.body
        let cartIsAvailable = await Cart.findOne({userId:userId, status:'unpaid'})

            if(!cartIsAvailable){
                cartIsAvailable = await Cart.create({userId:userId, status:'unpaid'})
            }

            
        let dataDetail = {
            cartId:cartIsAvailable._id,
            productId,quantity
        }

        await CartDetail.create(dataDetail)
        const carts = await CartDetail.aggregate([
            {$match:{cartId:cartIsAvailable._id}},
            {$lookup:{
                from:'products',
                localField:'productId',
                foreignField:'_id',
                as:'product'
            }}
        ])
        return res.json({message:'post cart berhasil', carts:carts})
    } catch (error) {
        console.log(error)
    }
}

const changeQtyProductInCart=async(req,res)=>{
    const { cartId, productId, quantity } = req.body

    try {
        await CartDetail.findOneAndUpdate({cartId, productId}, {$set:{quantity:quantity}})
        res.json({message:'berhasil update'})
    } catch (error) {
        console.log(error, 'error')
    }
}

const deleteProductInCart=async(req,res)=>{
    const { cartId, productId } = req.body
    console.log(cartId, productId)

    try {
        await CartDetail.findOneAndRemove({cartId, productId})
        res.json({message:'berhasil delete'})
    } catch (error) {
        console.log(error)
    }
}


const checkoutCart=async(req,res)=>{
    try {
        let cartUser = await Cart.updateOne({_id:'6328502d901d41e754ca2858', status:'unpaid'}, {$set:{status:'paid'}})
        return res.json({cart:cartUser})
    } catch (error) {
        console.log(error)
    }
}




module.exports = {
    getCart,postCart,checkoutCart,changeQtyProductInCart,deleteProductInCart
}