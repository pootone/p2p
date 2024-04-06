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
          content: "Analyze the uploaded image, along with any additional textual description, focusing on the predominant food item if mentioned. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json{// Language specification as guideline in comments; do not violate language setting for attributes 'food': 'string', // Main food, always must be represented in Traditional Chinese'ingredient': 'string', // Nutritional components or foods, up to five. If the food is composed of multiple items, indicate the composition of the food. If it's a single food item, this attribute always must be represented in English.'result': { // Scores based on various indicators for 500 grams of white rice, with all foods calculated based on a 500-gram portion. Scores range from 0 to 10. If there are units or percentages, display results according to unit rules rather than a 0 to 10 scale.'methane': {'methane': int, // Scale of methane produced after consuming the food, presented in the range of 0 to 10.'car_distance': int, // Distance a car running on the produced methane can travel, unit: meters.},'electricity': {'electricity_level': int, // Level of electricity generated based on the produced methane, presented in the range of 0 to 10.'phone_battery': int, // Percentage of iPhone 15 charged using the generated electricity, calculated based on the 'electricity_level' attribute.},'constipate': int, // Index indicating the likelihood of causing constipation, determined based on the food's fiber value, presented in the range of 0 to 10. The higher the fiber value, the lower the constipation index.'calorie': {'calorie_value': int, // Calorie content of the food, presented in the range of 0 to 10.'run_distance': int, // Distance needed to run to burn the calories of the food, unit: meters.},'suggest': 'string' // Suggestions on how to consume the food to reduce carbon emissions, always must be represented in Traditional Chinese.}}```"
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
          content: "Analyze the textual description, focusing on the predominant food item if mentioned. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json{// Language specification as guideline in comments; do not violate language setting for attributes 'food': 'string', // Main food, always must be represented in Traditional Chinese'ingredient': 'string', // Nutritional components or foods, up to five. If the food is composed of multiple items, indicate the composition of the food. If it's a single food item, this attribute always must be represented in English.'result': { // Scores based on various indicators for 500 grams of white rice, with all foods calculated based on a 500-gram portion. Scores range from 0 to 10. If there are units or percentages, display results according to unit rules rather than a 0 to 10 scale.'methane': {'methane': int, // Scale of methane produced after consuming the food, presented in the range of 0 to 10.'car_distance': int, // Distance a car running on the produced methane can travel, unit: meters.},'electricity': {'electricity_level': int, // Level of electricity generated based on the produced methane, presented in the range of 0 to 10.'phone_battery': int, // Percentage of iPhone 15 charged using the generated electricity, calculated based on the 'electricity_level' attribute.},'constipate': int, // Index indicating the likelihood of causing constipation, determined based on the food's fiber value, presented in the range of 0 to 10. The higher the fiber value, the lower the constipation index.'calorie': {'calorie_value': int, // Calorie content of the food, presented in the range of 0 to 10.'run_distance': int, // Distance needed to run to burn the calories of the food, unit: meters.},'suggest': 'string' // Suggestions on how to consume the food to reduce carbon emissions, always must be represented in Traditional Chinese.}}```"
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
          content: "" //TODO
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
    
  } catch (error) {
    res.status(500).json({error: "Achieve gpt res error"});
  }
  res.sendStatus(200);
})

module.exports = router;
