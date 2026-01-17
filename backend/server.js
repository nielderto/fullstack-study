import express from "express";

const app = express();
const PORT = 3001;
const router = express.Router();

app.use(express.json());

app.use((req, res, next) =>{
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
})

let cars = [
    {id: 1, make: "Toyota", model: "Camry", year: 2020, price: 20000},
    {id: 2, make: "Ford", model: "F150", year: 2021, price: 30000},
    {id: 3, make: "Chevrolet", model: "Silverado", year: 2022, price: 40000},
] 

app.get("/", (req, res) => {
    res.send("Welcome to route 1");
});

router.get("/", (req, res) => {
    res.json(cars);
});

router.get("/:id", (req, res) => {
    // string by default, so we need to convert it to a number
    const id = Number(req.params.id);
    const car = cars.find(item => item.id === id);

    if (!car) return res.status(404).send("Car id not found, please input the correct id!"); 

    res.json(car);
})

router.post("/", (req, res) =>{
    const { make, model, year, price } = req.body;
    let lastId = cars[cars.length - 1].id;

    if ( !make || !model || !year || !price ) return res.status(404).send("Please provide all the necessary fields!");

    const newCar = {
        id: ++lastId,
        make,
        model,
        year: Number(year),
        price: Number(price)
    }

    cars.push(newCar);

    res.status(202).send(`New car created: ${newCar.make} ${newCar.model} ${newCar.year}`);
})

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = cars.findIndex(item => item.id === id);

    if (index === -1) return res.status(404).send("Car id not found, please input the correct id!");

    cars[index] = {
        ...cars[index],
        ...req.body
    }

    res.status(200).send(`Car ${cars[index].make} ${cars[index].model} ${cars[index].year} updated successfully!`);
})

router.delete("/:id", (req, res) =>{
    const id = Number(req.params.id);
    const index = cars.findIndex(item => item.id === id);

    if (index === -1) return res.status(404).send("Car id not found, please input the correct id!");

    const deletedCar = cars.splice(index, 1)[0];

    res.status(200).send(`${deletedCar.make} ${deletedCar.model} ${deletedCar.year} deleted successfully!`);
})

app.use("/api/v1/cars", router);

// instead of repetitons of api/v1/cars, we can use a router
// app.get('api/v1/cars' , (req, res) => {
//     res.send("Hello from the cars route")
// })

// app.post('api/v1/cars', (req, res) => {
//     req.send("New car!")
// })

app.listen(PORT, () => console.log(`Server is listening on port ${PORT }`))