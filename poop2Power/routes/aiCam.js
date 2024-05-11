var express = require('express');
var router = express.Router();

// Load dotenv
require("dotenv").config();

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.GPT_IMG_API_KEY });
const openaiTxt = new OpenAI({ apiKey: process.env.GPT_TXT_API_KEY });

async function gptQuery(img = '', desc = null) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Analyze the uploaded image, along with any additional textual description, focusing on the predominant food item if mentioned. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!! ```json//If the input value is not food, the JSON format file will not be returned. Instead, the analyzed item name will be returned  , displayed in json format 'none'='string' and display language Chinese.{'food': 'string', // Main food item, language setting is forever Traditional Chinese.'ingredient': 'string', // An analysis will be conducted based on the 'food' attribute to determine if this item is an original food item. If it is, the value of 'ingredient' will output the name of that original food. If it is not, an analysis will be performed to identify the top three food items that make up the largest proportions, and the value of 'ingredient' will output these top three predominant food items. If there are fewer than three types of food, all food items will be output.'ingredient_E' :'string',//copy 'ingredient' value and translate to English.'result': { // Scores are based on the standard of 500 grams of white rice. All foods are calculated based on 500 grams. Scores range from 0 to 10. If there are units or percentages, the result is displayed according to the unit rules, instead of from 0 to 10.'methane': {'methane': int, // Scale of methane generated after food consumption, ranging from 0 to 10.'car_distance': int // Distance traveled by a car using methane fuel generated, unit: meters.},'electricity': {'electricity_level': int, // Electricity level generated based on methane produced, ranging from 0 to 10.'phone_battery': int // Percentage of iPhone 15 charged using the generated electricity, calculated based on the 'electricity_level' attribute.},'constipate': int, // Represents the potential constipation index based on food fiber content, presented on a scale of 0 to 10. Higher fiber values correspond to lower constipation indexes.'calorie': {'calorie_value': int, // Calorie content of the food, presented on a scale of 0 to 10.'run_distance': int // Distance required to run to burn the calories from the food, unit: meters.},'suggest': 'string' // Suggestions on how to eat more environmentally friendly with a lower carbon footprint , use funny and humorous tone . 30 to 50 words , output Language setting is always Traditional Chinese.'data':'string' //Based on all the key values in this JSON file, only return the names of the websites used in the analysis, ensuring that the data comes from reputable academic journals or official scientific institutions.display language English. }}```"
        },
        {
          role: "user",
          content: [
            { type: "text", text: desc || "What’s in this image?" },
            {
              type: "image_url",
              // Could be img url or base 64 img data
              image_url: img
            },
          ],
        },
      ],
      max_tokens: 2048
    });
    console.log("GPT response: " + JSON.stringify(response.choices[0]));
    return response.choices[0];
  } catch (error) {
    console.log("Error in gpt query: ", error);
    // 將錯誤拋給呼叫者
    throw error;
  }
}

async function gptQueryTxt(desc = null) {
  try {
    console.log("Req data:" + desc);
    const response = await openaiTxt.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the textual description, focusing on the predominant food item if mentioned. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!! ```json//If the input value is not food, the JSON format file will not be returned. Instead, the analyzed item name will be returned  , displayed in json format 'none'='string' and display language Chinese.{'food': 'string', // Main food item, language setting is forever Traditional Chinese.'ingredient': 'string', // An analysis will be conducted based on the 'food' attribute to determine if this item is an original food item. If it is, the value of 'ingredient' will output the name of that original food. If it is not, an analysis will be performed to identify the top three food items that make up the largest proportions, and the value of 'ingredient' will output these top three predominant food items. If there are fewer than three types of food, all food items will be output.'ingredient_E' :'string',//copy 'ingredient' value and translate to English.'result': { // Scores are based on the standard of 500 grams of white rice. All foods are calculated based on 500 grams. Scores range from 0 to 10. If there are units or percentages, the result is displayed according to the unit rules, instead of from 0 to 10.'methane': {'methane': int, // Scale of methane generated after food consumption, ranging from 0 to 10.'car_distance': int // Distance traveled by a car using methane fuel generated, unit: meters.},'electricity': {'electricity_level': int, // Electricity level generated based on methane produced, ranging from 0 to 10.'phone_battery': int // Percentage of iPhone 15 charged using the generated electricity, calculated based on the 'electricity_level' attribute.},'constipate': int, // Represents the potential constipation index based on food fiber content, presented on a scale of 0 to 10. Higher fiber values correspond to lower constipation indexes.'calorie': {'calorie_value': int, // Calorie content of the food, presented on a scale of 0 to 10.'run_distance': int // Distance required to run to burn the calories from the food, unit: meters.},'suggest': 'string' // Suggestions on how to eat more environmentally friendly with a lower carbon footprint , use funny and humorous tone . 30 to 50 words , output Language setting is always Traditional Chinese.'data':'string' //Based on all the key values in this JSON file, only return the names of the websites used in the analysis, ensuring that the data comes from reputable academic journals or official scientific institutions.display language English. }}```"
        },
        {
          role: "user",
          content: desc || "",
        },
      ],
    });
    console.log("GPT response: " + JSON.stringify(response.choices[0]));
    return response.choices[0];
  } catch (error) {
    console.log("Error in gpt query: ", error);
    // 將錯誤拋給呼叫者
    throw error;
  }
}

async function gptAchieQuery(data = null) {
  try {
    console.log("Req data:" + data);
    const response = await openaiTxt.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the additional textual description. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json // Based on all values of 'food' and 'ingredient', determine if they belong to any of the six major food categories: 'Whole grains', 'Oils, fats, nuts and seeds', 'Legumes, fish, eggs, meat and their products', 'Dairy products', 'Vegetables', 'Fruits'.'SixCategoriesofFood':{'Grains': 'string', // Determine whether it belongs to the 'Grains'. If it does, output 'Grains', if not, output 'none'.'OilsFatsNutsAndSeeds': 'string', // Determine whether it belongs to the 'Oils Fats Nuts And Seeds'. If it does, output 'OilsFatsNutsAndSeeds', if not, output 'none'.'LegumesFishEggsMeatAndTheirProducts': 'string', // Determine whether it belongs to the 'Legumes Fish Eggs Meat And Their Products'. If it does, output 'LegumesFishEggsMeatAndTheirProducts', if not, output 'none'.'DairyProducts': 'string', //Determine whether it belongs to the 'Dairy Products'. If it does, output 'DairyProducts', if not, output 'none'.'Vegetables': 'string', // Determine whether it belongs to the 'Vegetables'. If it does, output 'Vegetables', if not, output 'none'.'Fruits': 'string', // Determine whether it belongs to the 'Fruits'. If it does, output 'Fruits', if not, output 'none'. }{'Healthy Staple Foods': 'string', // Based on all strings of the 'food' attribute determine whether they correspond to reﬁned grain . If there is match, output '6'; if not , output 'none'.'NaturalSugars': string', // Based on all strings of the 'food' attribute, determine whether they correspond to  foods that are only containing natural sugars . If there is a match, output '7'; if not, output 'none'.'Vegan': 'string', // Based on all strings of the 'food' attribute, determine whether they correspond to  foods that are only strict vegans foods . If there is a match, output 8'; if not, output 'none'.'HighProteinDiet': string', // Based on all strings of the 'ingredient' attribute, determine whether they correspond to  foods that are  protein diet. If there is a match, output '9'; if not, output 'none'.'Meat': 'string', // Based on all strings of the 'ingredient' attribute, determine whether they correspond to  foods that are  meat diet. If there is a match, output '10'; if not, output 'none'.'Burger': 'string' // Based on all strings of the 'food' and 'ingredient' attribute, determine whether they correspond to 'burger', 'rice burger', 'sandwich', 'submarine sandwich'. If there is a match, output '11'; if not,  output 'none'.'FoodFlavor': 'string', // Analyze the value of the 'food' determine whether the following countries are the places of origin for this food: Thai , American , Japanese , Italian , German , Korean . If it does,  output content in the form of an array in JSON format: [12, 'The name of the country that matches'] , if not,  output 'none'.}```"
        },
        {
          role: "user",
          content: data || "",
        },
      ],
    });
    console.log("GPT response: " + JSON.stringify(response.choices[0]));
    return response.choices[0];
  } catch (error) {
    console.log("Error in gpt achieve query: ", error);
    throw error;
  }
}

router.post('/gpt/img', async function (req, res, next) {
  console.log(req.body);
  try {
    let gptRes = await gptQuery(req.body.img, req.body.description) || "Gpt didn't response.";
    console.log(JSON.stringify(gptRes));
    res.json(gptRes);
  } catch (error) {
    res.status(500).json({ error: "GPT Response error." });
  }
});

router.post('/gpt/txt', async function (req, res, next) {
  console.log(req.body);
  try {
    let gptRes = await gptQueryTxt(req.body.description) || "Gpt didn't response.";
    console.log(JSON.stringify(gptRes));
    res.json(gptRes);
  } catch (error) {
    res.status(500).json({ error: "GPT Response error." });
  }
});

router.post("/achie", async function (req, res, next) {
  console.log(req.body);
  try {
    let gptRes = await gptAchieQuery(JSON.stringify(req.body)) || "Gpt didn't response.";
    console.log(JSON.stringify(gptRes));
    res.json(gptRes);
  } catch (error) {
    res.status(500).json({error: "Achieve gpt res error"});
  }
  // res.sendStatus(200);
})

module.exports = router;
