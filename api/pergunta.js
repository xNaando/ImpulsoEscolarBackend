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

    // Usar a variável de ambiente para a chave da API
    const apiKey = process.env.ASTICA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API astica não configurada' });
    }

    const response = await fetch('https://vision.astica.ai/describe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tkn: apiKey,
        modelVersion: '2.5_full',
        input: prompt,
        visionParams: 'gpt,describe,describe_all,tags,objects'
      })
    });

    const data = await response.json();

    if (data.status && data.status === 'error') {
      throw new Error(data.error || 'Erro na API astica');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao processar pergunta:', error);
    return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
