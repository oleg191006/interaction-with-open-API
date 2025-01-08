import express from "express"
import axios from "axios"
import bodyParser from "body-parser";


const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
const URL_NAME = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const URL_RANDOM = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const URL_ALCOHOL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
const URL_NOALCOHOL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
app.get("/", async (req, res) => {
    res.render("index.ejs")
})

app.post("/search-by-name", (req, res) => {
    const type = "the name of the cocktail"
    res.render("searchBy.ejs", {
        type: type
    })
})
app.post("/search-by-ingredient", (req, res) => {
    const type = "the main ingredient"
    res.render("searchBy.ejs", {
        type: type
    })
})
app.post("/random", async (req, res) => {
    const result = await axios.post(URL_RANDOM);
    const b = result.data.drinks[0];
    const cocktailName = b.strDrink;
    console.log(cocktailName)
    const cocktailType = b.strAlcoholic;
    const cocktailInstr = b.strInstructions;
    const cocktailImg = b.strDrinkThumb;
    const arr =
        [b.strIngredient1,
        b.strIngredient2,
        b.strIngredient3,
        b.strIngredient4,
        b.strIngredient5,
        b.strIngredient6,
        b.strIngredient7,
        b.strIngredient8,
        b.strIngredient9,
        b.strIngredient10,
        b.strIngredient11,
        b.strIngredient12,
        b.strIngredient13,
        b.strIngredient14,
        b.strIngredient15
        ];
    const ingrArr = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== null) {
            ingrArr.push(arr[i])
        }
    }



    res.render("cocktail.ejs", {
        name: cocktailName,
        type: cocktailType,
        image: cocktailImg,
        instructions: cocktailInstr,
        ingr: ingrArr
    })
})


app.post("/alcohol-cocktail", async (req, res) => {
    const result = await axios.post(URL_ALCOHOL)
    let nameArr = [];
    let imgArr = [];
    const type = "alcohol"
    for (let i = 0; i < result.data.drinks.length; i++) {
        nameArr.push(result.data.drinks[i].strDrink);
        imgArr.push(result.data.drinks[i].strDrinkThumb);
    }

    res.render("alcohol.ejs", {
        name: nameArr,
        image: imgArr,
        type: type
    })
})

app.post("/noalcohol-cocktail", async (req, res) => {
    const result = await axios.post(URL_NOALCOHOL)
    let nameArr = [];
    let imgArr = [];
    let type = "non-alcoholic";
    for (let i = 0; i < result.data.drinks.length; i++) {
        nameArr.push(result.data.drinks[i].strDrink);
        imgArr.push(result.data.drinks[i].strDrinkThumb);
    }

    res.render("alcohol.ejs", {
        name: nameArr,
        image: imgArr,
        type: type
    })
})

app.post("/", (req, res) => {
    res.render("index.ejs")
})


app.post("/cocktail", async (req, res) => {
    const name = req.body.name;
    const result = await axios.post(URL_NAME + name, req.body)
    if (!result.data.drinks || result.data.drinks.length === 0) {
        return res.status(404).send("No drinks found!");
    }
    const randomNumber = result.data.drinks[Math.floor(Math.random() * result.data.drinks.length)];
    const a = randomNumber;
    const cocktailName = a.strDrink;
    const cocktailType = randomNumber.strAlcoholic;
    const cocktailInstructions = randomNumber.strInstructions;
    const cocktailImage = randomNumber.strDrinkThumb;
    const arr =
        [a.strIngredient1,
        a.strIngredient2,
        a.strIngredient3,
        a.strIngredient4,
        a.strIngredient5,
        a.strIngredient6,
        a.strIngredient7,
        a.strIngredient8,
        a.strIngredient9,
        a.strIngredient10,
        a.strIngredient11,
        a.strIngredient12,
        a.strIngredient13,
        a.strIngredient14,
        a.strIngredient15
        ];
    const ingrArr = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== null) {
            ingrArr.push(arr[i])
        } else if (arr[i] == null) {
            console.log("I t is null((((")
        }
    }


    res.render("cocktail.ejs", {
        name: cocktailName,
        type: cocktailType,
        instructions: cocktailInstructions,
        image: cocktailImage,
        ingr: ingrArr
    })
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}
)