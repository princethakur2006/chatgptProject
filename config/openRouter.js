import { OpenRouter } from '@openrouter/sdk';

if (!process.env.OPENROUTE_API_KEY){
    throw new Error("openRouter API key is missing. ")
}

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTE_API_KEY,

})

export default openRouter;