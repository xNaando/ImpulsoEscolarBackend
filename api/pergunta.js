export default async function handler(req, res) {
  // Configurar cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder imediatamente para requisições OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    // Buscar as duas variáveis possíveis
    const apiKey = process.env.OPEN_ROUTER_AI || process.env.OPENROUTER_API_KEY;
    const qualVar = process.env.OPEN_ROUTER_AI ? 'OPEN_ROUTER_AI' : (process.env.OPENROUTER_API_KEY ? 'OPENROUTER_API_KEY' : 'NENHUMA');
    console.log('API KEY usada:', qualVar, apiKey ? apiKey.substring(0, 8) + '...' : 'NÃO DEFINIDA');

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API OpenRouter não configurada' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3-32k',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Erro na API OpenRouter');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao processar pergunta:', error);
    return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
