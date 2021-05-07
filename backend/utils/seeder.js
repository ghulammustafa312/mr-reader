const Product = require('../models/product')
const dotenv = require('dotenv')
const connectDatabase = require('../config/database')

const products = require('../data/products')


//Setting dotenv files
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase()

const seedProducts = async () =>
{
    try
    {
        await Product.deleteMany()
        console.log('Products are Deleted..')

        await Product.insertMany(products)
        console.log('All Products are Added..')
        process.exit()
        
    } catch (error) {
        console.log(error.mesaage)
        process.exit()
    }
}
seedProducts()