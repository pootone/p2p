var express = require('express');
var router = express.Router();

// Load dotenv
require("dotenv").config();

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.GPT_IMG_API_KEY });
const openaiTxt = new OpenAI({ apiKey: process.env.GPT_TXT_API_KEY });

let responseStr = "wonderland";

async function gptQuery(img = '', desc = null) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Analyze the uploaded image, along with any additional textual description, focusing on the predominant food item if mentioned. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json{'food': 'string', // Main food, displayed language setting is Traditional Chinese.'ingredient': 'string', // Analyze the value of 'food'. If the value of 'food'  is mix  food items, represent the most element item as the 'ingredient'. If it is a single food, use the name of that food. Language setting is in English.'result': { // Scores are based on a standard of 500 grams of white rice. All foods are calculated based on a quantity of 500 grams. Scores range from 0 to 10. If there are units or percentages, display the result based on unit rules rather than from 0 to 10.'methane': {'methane': int, // Scale of methane produced after consuming the food, ranging from 0 to 10.'car_distance': int // Distance a car using methane fuel produced can travel, unit: meters},'electricity': {'electricity_level': int, // Level of electricity generated based on the produced methane, ranging from 0 to 10.'phone_battery': int // Percentage of iPhone 15 charged using the generated electricity, calculated based on the 'electricity_level' attribute.},'constipate': int, // Indicates the index of potential constipation based on the food's fiber content, presented on a scale of 0 to 10. Higher fiber values correspond to lower constipation indices.'calorie': {'calorie_value': int, // Caloric content of the food, presented on a scale of 0 to 10.'run_distance': int // Distance needed to run to burn the calories of the food, unit: meters},'suggest': 'string' // Suggestions on how to consume the food to reduce carbon emissions.}}```"
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
          content: "Analyze the textual description, focusing on the predominant food item if mentioned. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json{'food': 'string', // Main food, displayed language setting is Traditional Chinese.'ingredient': 'string', // Analyze the value of 'food'. If the value of 'food'  is mix  food items, represent the most element item as the 'ingredient'. If it is a single food, use the name of that food. Language setting is in English.'result': { // Scores are based on a standard of 500 grams of white rice. All foods are calculated based on a quantity of 500 grams. Scores range from 0 to 10. If there are units or percentages, display the result based on unit rules rather than from 0 to 10.'methane': {'methane': int, // Scale of methane produced after consuming the food, ranging from 0 to 10.'car_distance': int // Distance a car using methane fuel produced can travel, unit: meters},'electricity': {'electricity_level': int, // Level of electricity generated based on the produced methane, ranging from 0 to 10.'phone_battery': int // Percentage of iPhone 15 charged using the generated electricity, calculated based on the 'electricity_level' attribute.},'constipate': int, // Indicates the index of potential constipation based on the food's fiber content, presented on a scale of 0 to 10. Higher fiber values correspond to lower constipation indices.'calorie': {'calorie_value': int, // Calorie content of the food, presented on a scale of 0 to 10.'run_distance': int // Distance needed to run to burn the calories of the food, unit: meters},'suggest': 'string' // Suggestions on how to consume the food to reduce carbon emissions.}}```"
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
          content: '{// Search for attributes "food" and "ingredient" based on the input text.// List all values of the "ingredient" attribute and iterate through each string contained in the "ingredient" attribute to determine multiple categories."FoodFlavor": "string", // Determine whether the string found in the "food" attribute is "Korean cuisine", "Chinese cuisine", "American cuisine", "Thai cuisine", "Japanese cuisine". If there is a matching option, output its name. If not, output a single space."Six Major Food Categories": "string", // Based on all the strings in the "ingredient" attribute, determine whether they belong to the following food categories: "whole grains and tubers", "legumes, fish, eggs, and meats", "vegetables", "fruits", "fats and nuts", "dairy products". If there is a matching option, output its name. If not, output a single space."Healthy Staple Foods": "string", // Based on all the strings in the "ingredient" attribute, determine whether they are "purple sweet potato", "sweet potato", "potato", "buckwheat noodles". If there is a matching option, output "Healthy Staple Foods". If not, output a single space."Chicken": "string", // Based on all the strings in the "ingredient" attribute, determine whether they are "chicken". If there is a match, output "Chicken". If not, output a single space."Burger": "string" // Based on all the strings in the "ingredient" attribute, determine whether they are "burger", "rice burger", "sandwich", "submarine sandwich". If there is a match, output "Burger". If not, output a single space.}'
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
  res.sendStatus(200);
})

module.exports = router;
