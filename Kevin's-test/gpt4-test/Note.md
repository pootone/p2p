# Chat Gpt 4 with node.js

1. Create a project

    ```npm
    express --view=pug PROJECT_NAME
    npm install
    <!-- To store API key -->
    npm install dotenv 
    ```

2. Download npm package

    `npm install openai@^4.0.0`

3. Get api key from openAI: <https://platform.openai.com/api-keys>

4. Create a file ".env"

5. Type `API_KEY='YOUR_API_KEY'` in the `.env`

6. 控制檔案傳輸大小限制

    - `app.use(express.json({limit: '50mb'}))`

    - `app.use(express.urlencoded({limit: '50mb', extended: true}))`
