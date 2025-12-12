import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Question } from "../entities/Question";

const router = Router();

// Endpoint 1: Retorna pergunta por ID (sem resposta correta)
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const questionId = parseInt(req.params.id);
        const questionRepository = AppDataSource.getRepository(Question);
        
        const question = await questionRepository.findOne({
            where: { id: questionId }
        });

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Retorna apenas os dados necessários, sem a resposta correta
        const response = {
            id: question.id,
            questionText: question.questionText,
            options: question.options
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint 2: Verifica a resposta
router.post("/check-answer", async (req: Request, res: Response) => {
    try {
        const { id, answer } = req.body;

        // Validação dos dados
        if (id === undefined || answer === undefined) {
            return res.status(400).json({ error: "Missing id or answer in request body" });
        }

        const questionId = parseInt(id);
        const answerIndex = parseInt(answer);

        const questionRepository = AppDataSource.getRepository(Question);
        const question = await questionRepository.findOne({
            where: { id: questionId }
        });

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Valida se o índice da resposta está dentro do range das opções
        if (answerIndex < 0 || answerIndex >= question.options.length) {
            return res.status(400).json({ error: "Invalid answer index" });
        }

        // Verifica se a resposta está correta
        if (answerIndex === question.correctAnswerIndex) {
            return res.json({ result: "certo" });
        } else {
            return res.json({ result: "errado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
