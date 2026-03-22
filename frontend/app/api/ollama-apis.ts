import ollamaService from "@/app/api/axios";

const generateBullets = (jobDescription: string, experience: string) => {
    return ollamaService.post("/generate-bullets", {
          job_description: jobDescription,
          experience: experience,
    })
}

const getHistory = () => {
    return ollamaService.get("/generations")
}

export {generateBullets, getHistory}