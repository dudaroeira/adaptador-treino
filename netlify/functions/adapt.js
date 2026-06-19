// Netlify Function: proxy seguro para a API da Anthropic.
// A chave fica SOMENTE na variável de ambiente ANTHROPIC_API_KEY (nunca no cliente/repо).
exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: event.body
    });
    const text = await upstream.text();
    return { statusCode: upstream.status, headers: { ...cors, 'Content-Type': 'application/json' }, body: text };
  } catch (e) {
    return { statusCode: 502, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'proxy_failed', detail: String(e) }) };
  }
};
