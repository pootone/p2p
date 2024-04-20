var express = require('express');
var router = express.Router();

// Load dotenv
require("dotenv").config();

const OpenAI = require('openai');

const openaiTxt = new OpenAI({ apiKey: process.env.GPT_TXT_API_KEY });

async function weeklyAnalysis(desc = null) {
    try {
        console.log("Req data:" + desc);
        const response = await openaiTxt.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Analyze the additional textual description. YOU CAN ONLY RETURN THE RESULT IN JSON STRING with the following content!!! ```json//Based on the values of 'food' and 'ingredients' in 'lastweek' and 'thisweek', determine the following variables.rule:{// Scores based on the standard of 500 grams of white rice. All foods are calculated based on a 500-gram serving. Scores range from 0 to 10. If there are units or percentages, display the results according to the unit rules, not 0 to 10.},{'methane': 'int', // Scale of methane produced after consuming the food, ranging within the score range of 0 to 10.'electricity_level': 'int', // Electricity level generated based on the produced methane, ranging within the score range of 0 to 10.'constipate': 'int', // Index indicating the likelihood of causing constipation, determined based on the food's fiber content, presented on a scale from 0 to 10. Higher fiber values correspond to lower constipation indices.'caloric_value': 'int', // Caloric content of the food, presented on a scale from 0 to 10.}// Analyze last week's dietary habits based on the values of 'food' and 'ingredients' in 'lastweek' according to the declared variables.// just display 'lw_ana':{'methane', 'electricity', 'constipate', and 'caloric'} // Analyze this week's dietary habits based on the values of 'food' and 'ingredients' in 'thisweek' according to the declared variables.// just display 'tw_ana':{'methane', 'electricity', 'constipate', and 'caloric'}}{'des': Analyze the reasons for the changes in the values of 'methane' and 'electricity_level' based on 'lastweek' and 'thisweek'.}//30 to 50 words, expressed in Traditional Chinese.}{'sug'string;//Based on the dietary content of 'lastweek' and 'thisweek', provide advice on balanced diet, preventing constipation, and how to consume appropriate calories.}//30 to 50 words, expressed in Traditional Chinese.}```"
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

router.post('/ana', async function (req, res, next) {
    console.log("ana: ", req.body);
    try {
        let gptRes = await weeklyAnalysis(req.body.weekDatas) || "Gpt didn't response.";
        console.log(JSON.stringify(gptRes));
        res.json(gptRes);
    } catch (error) {
        res.status(500).json({ error: "GPT Response error." });
    }
});

module.exports = router;