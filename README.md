# Backend para Projeto Escolar (Vercel)

Este backend expõe um endpoint para integração com a API astica.

## Como usar

1. **Clone este repositório**
2. **Faça o deploy na Vercel**
3. O endpoint estará disponível em:
   `/api/pergunta`

### Exemplo de uso no frontend

```js
fetch('/api/pergunta', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Seu prompt ou URL de imagem aqui' })
})
  .then(res => res.json())
  .then(data => {
    // use a resposta da astica como precisar
  });
```

## Aviso de Segurança
**Nunca exponha sua chave de API em produção!**
Este exemplo é apenas para fins educacionais. 