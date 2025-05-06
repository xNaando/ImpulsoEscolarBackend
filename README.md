# Backend para Projeto Escolar (Vercel)

Este backend expõe um endpoint para retornar a chave da API do ChatGPT para uso no frontend.

## Como usar

1. **Clone este repositório**
2. **Faça o deploy na Vercel**
3. O endpoint estará disponível em:
   `/api/get-openai-key`

### Exemplo de uso no frontend

```js
fetch('/api/get-openai-key')
  .then(res => res.json())
  .then(data => {
    const openaiKey = data.openaiKey;
    // use a chave como precisar
  });
```

## Aviso de Segurança
**Nunca exponha sua chave de API em produção!**
Este exemplo é apenas para fins educacionais. 