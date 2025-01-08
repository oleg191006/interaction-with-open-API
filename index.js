import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const URL_NAME = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const URL_RANDOM = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const URL_ALCOHOL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
const URL_NOALCOHOL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/search-by-name", (req, res) => {
    const type = "the name of the cocktail";
    res.render("searchBy.ejs", { type });
});

app.post("/search-by-ingredient", (req, res) => {
    const type = "the main ingredient";
    res.render("searchBy.ejs", { type });
});

app.post("/random", async (req, res) => {
    try {
        const result = await axios.post(URL_RANDOM);
        const drink = result.data.drinks[0];

        const cocktailName = drink.strDrink;
        const cocktailType = drink.strAlcoholic;
        const cocktailInstr = drink.strInstructions;
        const cocktailImg = drink.strDrinkThumb;

        const ingrArr = Array.from({ length: 15 }, (_, i) => drink[`strIngredient${i + 1}`])
            .filter(ingredient => ingredient !== null);

        res.render("cocktail.ejs", {
            name: cocktailName,
            type: cocktailType,
            image: cocktailImg,
            instructions: cocktailInstr,
            ingr: ingrArr
        });
    } catch (error) {
        console.error("Error fetching random cocktail:", error);
        res.status(500).send("Something went wrong!");
    }
});

app.post("/alcohol-cocktail", async (req, res) => {
    try {
        const result = await axios.post(URL_ALCOHOL);
        const nameArr = result.data.drinks.map(drink => drink.strDrink);
        const imgArr = result.data.drinks.map(drink => drink.strDrinkThumb);

        res.render("alcohol.ejs", {
            name: nameArr,
            image: imgArr,
            type: "alcohol"
        });
    } catch (error) {
        console.error("Error fetching alcohol cocktails:", error);
        res.status(500).send("Something went wrong!");
    }
});

app.post("/noalcohol-cocktail", async (req, res) => {
    try {
        const result = await axios.post(URL_NOALCOHOL);
        const nameArr = result.data.drinks.map(drink => drink.strDrink);
        const imgArr = result.data.drinks.map(drink => drink.strDrinkThumb);

        res.render("alcohol.ejs", {
            name: nameArr,
            image: imgArr,
            type: "non-alcoholic"
        });
    } catch (error) {
        console.error("Error fetching non-alcohol cocktails:", error);
        res.status(500).send("Something went wrong!");
    }
});

app.post("/cocktail", async (req, res) => {
    const name = req.body.name;
    try {
        const result = await axios.post(URL_NAME + name);

        if (!result.data.drinks || result.data.drinks.length === 0) {
            return res.status(404).send("No drinks found!");
        }

        const randomDrink = result.data.drinks[Math.floor(Math.random() * result.data.drinks.length)];

        const cocktailName = randomDrink.strDrink;
        const cocktailType = randomDrink.strAlcoholic;
        const cocktailInstructions = randomDrink.strInstructions;
        const cocktailImage = randomDrink.strDrinkThumb;

        const ingrArr = Array.from({ length: 15 }, (_, i) => randomDrink[`strIngredient${i + 1}`])
            .filter(ingredient => ingredient !== null);

        res.render("cocktail.ejs", {
            name: cocktailName,
            type: cocktailType,
            instructions: cocktailInstructions,
            image: cocktailImage,
            ingr: ingrArr
        });
    } catch (error) {
        console.error("Error fetching cocktail by name:", error);
        res.status(500).send("Something went wrong!");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
