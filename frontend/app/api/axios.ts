import axios from "axios";

const ollamaService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_OLLAMA_URL,
    headers: {
          "Content-Type": "application/json",
    },
})

export default ollamaService;