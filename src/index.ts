import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import questionsRouter from "./routes/questions";
import { Question } from "./entities/Question";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Rotas
app.use("/questions", questionsRouter);

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        message: "Questions and Answers API",
        endpoints: {
            getQuestion: "GET /questions/:id",
            checkAnswer: "POST /questions/check-answer"
        }
    });
});

// Inicializa o banco de dados e insere dados de exemplo
async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");

        // Insere algumas perguntas de exemplo se não existirem
        const questionRepository = AppDataSource.getRepository(Question);
        const count = await questionRepository.count();

        if (count === 0) {
            const sampleQuestions = [
                {
                    questionText: "Qual é a capital do Brasil?",
                    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
                    correctAnswerIndex: 2
                },
                {
                    questionText: "Quantos planetas existem no sistema solar?",
                    options: ["7", "8", "9", "10"],
                    correctAnswerIndex: 1
                },
                {
                    questionText: "Quem escreveu 'Dom Quixote'?",
                    options: ["Miguel de Cervantes", "William Shakespeare", "Machado de Assis", "Gabriel García Márquez"],
                    correctAnswerIndex: 0
                }
            ];

            await questionRepository.save(sampleQuestions);
            console.log("Sample questions inserted");
        }

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

initializeDatabase();
