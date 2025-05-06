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

    // Usar a chave da variável de ambiente
    const apiKey = process.env.ASTICA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API astica não configurada' });
    }

    console.log('[API] Usando chave da variável de ambiente para a API astica');

    // Chamada para a API astica
    const response = await fetch('https://vision.astica.ai/describe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tkn: apiKey,
        modelVersion: '2.5_full',
        input: prompt, // prompt agora é a URL da imagem
        visionParams: 'gpt,describe,describe_all,tags,objects'
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API astica: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status && data.status === 'error') {
      throw new Error(data.error || 'Erro na API astica');
    }

    console.log('[API] Resposta recebida com sucesso da astica');
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
