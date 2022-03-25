const express = require('express')
const app = express()
const fs = require('fs')

app.set('view engine','hbs')

//gui du lieu tu Form den app.js
app.use(express.urlencoded({extended:true}))

//products la mot array: rong
var products = []

app.post('/new',(req,res)=>{
    //1. Lay du lieu tu nguoi dung
    const id = req.body.txtId
    const name = req.body.txtName
    const price = req.body.txtPrice
    //2. load du lieu tu file len
    readFileToArray()
    //3. cap nhat array
    products.push({'id':id,'name': name,'price':price})
    //4. save xuong file
    saveArray2File()
    //5. chuyen huong nguoi dung den home
    res.redirect('/')

})

app.get('/new',(req,res)=>{
    res.render('insert')
})

app.get('/delete',(req,res)=>{
    const id = req.query.id
    //1. xoa product khoi array
    let productToDeleteIndex =-1
    for(i=0;i<products.length;i++){
        if(products[i].id== id){
            productToDeleteIndex = i
            break
        }
    }
    //xoa vi tri thu i, xoa 1 item, 
    products.splice(productToDeleteIndex,1)
    //2. Save array vao file
    saveArray2File()
    //huong nguoi dung den trang hom
    res.redirect('/viewproduct')
})

app.get('/viewproduct',(req,res)=>{   
    //cho 1 so product vao array tren
    //products.push({'id':1,'name': 'Iphone','price':20})
    //products.push({'id':2,'name': 'Samsung Phone','price':40})
    //doc file va cho vao variable products
    readFileToArray()
    //hien thi products trong 1 view showProducts
    res.render('showProducts',{'products':products})
})

app.get('/',(req,res)=>{
    //lay ngay hien tai tren server
    const now = new Date()
    //goi den mot view ten la home
    res.render('home',{'now':now})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running: " + PORT)



function saveArray2File() {
    let fileContent = ''
    let singleItem = ''
    for (i = 0; i < products.length; i++) {
        //tao ra dong: '1/IPhone/220' hoac '2/SamsungPhone/444'
        singleItem = products[i].id + '/' + products[i].name + '/' + products[i].price + '\n'
        fileContent += singleItem
    }
    fs.writeFileSync('productDB.txt', fileContent)
}

function readFileToArray() {
    const content = fs.readFileSync('productDB.txt', "utf-8")
    //productRaws la array, moi phan tu la '1/IPhone/220' hoac '2/SamsungPhone/444'
    const productRaws = content.split('\n')
    //xoa bo noi dung cu neu co trong bien products
    products = []
    //duyet tung phan tu trong productRaws
    for (i = 0; i < productRaws.length; i++) {
        if (productRaws[i].length != 0) {
            const productdata = productRaws[i].split('/') //vd ve productdata ['1','Iphone','20']
            const id = productdata[0]
            const name = productdata[1]
            const price = productdata[2]
            products.push({ 'id': id, 'name': name, 'price': price })
        }
    }
}
