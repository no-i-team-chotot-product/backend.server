const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise')

const { User } = require('./models/User')
const { Product } = require('./models/Product')
const { Comment } = require('./models/Comment')
const { UserBehavior } = require('./models/UserBehavior')
const { SuggestMessage } = require('./models/SuggestMessage')

const fs = require('fs')

const app = express()
app.use(bodyParser.json())

const url = 'http://192.168.43.77:5000'

app.get('/', (req, res) => {
    //   Read the file and print its contents.
    const filename = 'ads_new.json'
    fs.readFile(filename, 'utf8', async function(err, data) {
        if (err) throw err;
        // parsedData = JSON.parse(data);
        // headers = ['list_id', 'ad_id', 'name', 'value']
        await Promise.all(
            data.split('\n')
                .slice(190000)
                .map(async (val, index) => {
                    try {
                        const json = JSON.parse(val)
                        const temp = await Product.query()
                            .findOne({ listId: json['list_id'] })
                            .update({ category: json['category'], categoryName: json['category_name'] })
                        // val.split(',').forEach((subVal, index) => {
                        //     temp[ headers[index] ] = subVal
                        // })
                        // return temp
                        temp && console.log({ index, listId: json['list_id'], temp })
                    }
                    catch (error) {
                        console.error(error)
                    }
                })
        )

        console.log('done')
        
        // var worksheet = XLSX.utils.json_to_sheet(parsedData);

        // var output_file_name = "ads_params1.csv";
        // var stream = XLSX.stream.to_csv(worksheet);
        // stream.pipe(fs.createWriteStream(output_file_name));
    });

    res.status(200).send('ok')
})

app.get('/users/:id/get_recommend_products', async (req, res) => {
    const id = req.params.id
    
    // Request ML server for recommended products (productIds)
    const recommendedProductIdsString = await request(`${url}/recommend/user/${id}`)
    const recommendedProductIds = JSON.parse(recommendedProductIdsString)

    // Then, convert it to listId
    const listIds = await Promise.all(
        recommendedProductIds.item.map(async productId => {
            const product = await Product.query().findById(productId)
            return product.listId
        })
    )

    // Then, request to chotot server for detail
    const data = await Promise.all(
        listIds.map(async listId => {
            let productDetail
            try {
                productDetail = await request(`https://gateway.chotot.com/v1/public/ad-listing/${listId}`)
            } catch (error) {
                // console.error(error)
            } finally {
                let parsedData
                if (productDetail) {
                    parsedData = JSON.parse(productDetail)
                }
                return parsedData
            }
        })
    )

    const filterUndefinedData = data.filter(val => val)

    // const productDetails = 
    res.status(200).send(filterUndefinedData)
})

app.get('/products/:productId', async (req, res) => {

    const productDetail = await Product.query()
        .findOne({ listId: parseInt(req.params.productId) })
        .eager({
            UserBehavior: {
                User: true
            },
            SuggestMessage: true,
            Comment: {
                User: true,
                SubComment: {
                    User: true
                },
                $modify: ['mainComment']
            },
        }, {
            mainComment: (builder) => {
                builder.whereNull('repCommentId')
            }
        })

    res.status(200).send(productDetail)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})