var express = require('express');
var router = express.Router();

// Load dotenv
require("dotenv").config();

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.API_KEY });

let responseStr = "wonderland";

async function gptQuery(img = '', desc = null) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
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
    });
    console.log("GPT response: "+JSON.stringify(response.choices[0]));
    return response.choices[0];
  } catch (error) {
    console.log("Error in gpt query: ", error);
    // 將錯誤拋給呼叫者
    throw error;
  }
}

async function gptQueryTxt(desc = null) {
  try {
    console.log("Req data:"+desc);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: desc || "",
        },
      ],
    });
    console.log("GPT response: "+JSON.stringify(response.choices[0]));
    return response.choices[0];
  } catch (error) {
    console.log("Error in gpt query: ", error);
    // 將錯誤拋給呼叫者
    throw error;
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  // main();
  res.render('index', { title: "GPT4 Test" });
});

router.post('/gpt/img', async function (req, res, next) {
  console.log(req.body);
  try {
    let gptRes = await gptQuery(req.body.img, req.body.description) || "Gpt didn't response.";
    console.log(typeof gptRes);
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
    console.log(typeof gptRes);
    console.log(JSON.stringify(gptRes));
    res.json(gptRes);
  } catch (error) {
    res.status(500).json({ error: "GPT Response error." });
  }
});

module.exports = router;
