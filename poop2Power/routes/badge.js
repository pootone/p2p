var express = require('express');
var router = express.Router();

// Load dotenv
require("dotenv").config();

const OpenAI = require('openai');

const openaiTxt = new OpenAI({ apiKey: process.env.GPT_IMG_API_KEY });

async function weeklyAnalysisRadar(desc = null) {
    try {
        console.log("Req data:" + desc);
        const response = await openaiTxt.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "Analyze the additional textual description. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json //Analyze the values of 'food' and 'ingredients' based on the inputs of 'lastweek' and 'thisweek'. Variables 'lw_ana' and 'tw_ana' follow the // rules.{//rules{// Scores based on the standard of 500 grams of white rice. All foods are calculated based on a 500-gram serving. Scores range from 0 to 10. If there are units or percentages, display the results according to the unit rules, not 0 to 10.},'methane': 'int', // Scale of methane produced after consuming the food, ranging within the score range of 0 to 10.'electricity_level': 'int', // Electricity level generated based on the produced methane, ranging within the score range of 0 to 10.'constipate': 'int', // Index indicating the likelihood of causing constipation, determined based on the food's fiber content, presented on a scale from 0 to 10. Higher fiber values correspond to lower constipation indices.'caloric_value': 'int', // Caloric content of the food, presented on a scale from 0 to 10.'lw_ana': {'methane': 'int','electricity_level': 'int','constipate': 'int','caloric': 'int'},'tw_ana': {'methane': 'int','electricity_level': 'int','constipate': 'int','caloric': 'int'},'des': 'string', // the reasons for the changes in the values of 'methane' and 'electricity_level' based on 'lastweek' and 'thisweek'.', 30 to 50 words, expressed in Traditional Chinese.'sug': 'string' //Based on the dietary content of 'lastweek' and 'thisweek', provide advice on balanced diet, preventing constipation, and how to consume appropriate calories. 30 to 50 words, expressed in Traditional Chinese.//just output  'lw_ana', 'tw_ana','des','sug'.}```"

                },
                {
                    role: "user",
                    content: desc || "",
                },
            ],
        });
        console.log("GPT weekly analysis: " + JSON.stringify(response.choices[0]));
        return response.choices[0];
    } catch (error) {
        console.log("Error in gpt query: ", error);
        // 將錯誤拋給呼叫者
        throw error;
    }
}

router.post('/ana/radar', async function (req, res, next) {
    console.log("ana: ", req.body);
    try {
        let gptRes = await weeklyAnalysisRadar(req.body.weekDatas) || "Gpt didn't response.";
        console.log(JSON.stringify(gptRes));
        res.json(gptRes);
    } catch (error) {
        res.status(500).json({ error: "GPT Response error." });
    }
});

async function weeklyAnalysisPie(desc = null) {
    try {
        console.log("Req data:" + desc);
        const response = await openaiTxt.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "Analyze the additional textual description. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!!```json{// When the values of 'food' and 'ingredient' are duplicated, count only once.// Based on all values of 'food' and 'ingredient', determine if they belong to any of the six major food categories: 'Whole grains', 'Oils, fats, nuts and seeds', 'Legumes, fish, eggs, meat and their products', 'Dairy products', 'Vegetables', 'Fruits'.// Total:'WholeGrains': 'int', // Number of categories belonging to 'Whole grains''OilsFatsNutsAndSeeds': 'int', // Number of categories belonging to 'Oils, fats, nuts and seeds''LegumesFishEggsMeatAndTheirProducts': 'int', // Number of categories belonging to 'Legumes, fish, eggs, meat and their products''DairyProducts': 'int', // Number of categories belonging to 'Dairy products''Vegetables': 'int', // Number of categories belonging to 'Vegetables''Fruits': 'int', // Number of categories belonging to 'Fruits''Total': 'int' // Total sum of all matching categories}{// Percent:'WholeGrains_P': 'float', // Percentage of Total divided by the number of categories belonging to 'Whole grains''OilsFatsNutsAndSeeds_P': 'float', // Percentage of Total divided by the number of categories belonging to 'Oils, fats, nuts and seeds''LegumesFishEggsMeatAndTheirProducts_P': 'float', // Percentage of Total divided by the number of categories belonging to 'Legumes, fish, eggs, meat and their products''DairyProducts_P': 'float', // Percentage of Total divided by the number of categories belonging to 'Dairy products''Vegetables_P': 'float', // Percentage of Total divided by the number of categories belonging to 'Vegetables''Fruits_P': 'float'// Percentage of Total divided by the number of categories belonging to 'Fruits'}```"
                },
                {
                    role: "user",
                    content: desc || "",
                },
            ],
        });
        console.log("GPT weekly pie analysis: " + JSON.stringify(response.choices[0]));
        return response.choices[0];
    } catch (error) {
        console.log("Error in gpt query: ", error);
        // 將錯誤拋給呼叫者
        throw error;
    }
}

router.post('/ana/pie', async function (req, res, next) {
    console.log("ana: ", req.body);
    try {
        let gptRes = await weeklyAnalysisPie(req.body.weekDatas) || "Gpt didn't response.";
        console.log(JSON.stringify(gptRes));
        res.json(gptRes);
    } catch (error) {
        res.status(500).json({ error: "GPT Response error." });
    }
});

module.exports = router;