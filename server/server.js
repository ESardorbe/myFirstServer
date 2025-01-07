const express = require("express")
const cors = require("cors")
const fs = require("fs")
require("dotenv").config()
const {v4} = require("uuid")

const app = express()

app.use(express.json())
app.use(cors())

//Funksiyalar
const readFile = (file_name) => {
    return JSON.parse(fs.readFileSync(`./module/${file_name}`, "utf-8"))
}

const writeFile = (file_name, data) => {
    return fs.writeFileSync(`./module/${file_name}`, JSON.stringify(data, null, 4), "utf-8")
}

//GET
app.get('/', (req, res) => {
    const data = readFile("data.json");
    res.json(data);
});

/////// POST
app.post("/post", (req, res) => {
    const data = readFile("data.json");
    const newProduct = {
        id: v4(), 
        ...req.body
    };
    data.push(newProduct);
    writeFile("data.json", data);
    res.json({
        message: "Added new product"
    });
});

//// PUT
app.put("/put/:id", (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const data = readFile("data.json");
    const foundedData = data.find((item) => item.id === id);
    if (!foundedData) {
        return res.status(404).send("Data not found");
    }

    data.forEach(item => {
        if (item.id === id) {
            item.name = name ? name : item.name;
            item.price = price ? price : item.price;  
        }
    });

    writeFile("data.json", data);
    res.json({
        message: "Updated product"
    });
});

////////////// DELETE
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const data = readFile("data.json");
    const foundedData = data.find((item) => item.id === id);
    if (!foundedData) {
        return res.status(404).send("Data not found");
    }

    data.forEach((item, idx) => {
        if (item.id === id) {
            data.splice(idx, 1); 
        }
    });

    writeFile("data.json", data);
    res.json({
        message: "Deleted product"
    });
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`The server ran at http://localhost:${PORT}`);
})