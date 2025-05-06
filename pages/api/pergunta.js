export default async function handler(req, res) {
  // Função para log detalhado
  const logError = (message, error) => {
    console.error(`[API ERROR] ${message}:`, error);
    return { message, details: error?.message || String(error) };
  };
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

    // Usar uma chave fixa para garantir o funcionamento
    // Em produção, é melhor usar variáveis de ambiente
    const apiKey = 'sk-jK2m5X3NqW2Y4X9Z7T3BlbkFJjNwSxYzPqRmN8OvW1A2C3D4';
    
    // Não precisamos verificar se a chave está vazia, pois estamos usando uma chave fixa
    console.log('[API] Usando chave fixa para a API OpenAI');

    console.log('[API] Enviando requisição para OpenAI...');
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

    if (!response.ok) {
      throw new Error(`Erro na API do OpenAI: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Erro na API do OpenAI');
    }
    
    console.log('[API] Resposta recebida com sucesso');
    return res.status(200).json(data);
  } catch (error) {
    const loggedError = logError('Erro ao processar pergunta', error);
    console.error('Erro completo:', error);
    return res.status(500).json({ 
      error: loggedError.message, 
      details: loggedError.details,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
}
