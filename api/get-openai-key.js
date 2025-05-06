export default function handler(req, res) {
    // Nunca exponha sua chave em produção!
    const openaiKey = 'sk-jK2m5X3NqW2Y4X9Z7T3BlbkFJjNwSxYzPqRmN8OvW1A2C3D4';
    res.status(200).json({ openaiKey });
} 