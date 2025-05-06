export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    // Usar a variável de ambiente para a chave da API
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API não configurada' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Erro na API do OpenAI');
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao processar pergunta:', error);
    return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
