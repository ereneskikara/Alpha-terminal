export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { sym, exch } = req.query;
  if (!sym) return res.status(400).json({ error: 'sym required' });

  let ys = sym;
  if (exch === 'BIST') ys = sym + '.IS';
  else if (exch === 'XETR') ys = sym + '.DE';
  else if (exch === 'CRYPTO') ys = sym.replace('/USD','').replace('USDT','').replace('BUSD','') + '-USD';

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${encodeURIComponent(ys)}&crumb=`;
    const r = await fetch(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      } 
    });
    const data = await r.json();
    const q = data?.quoteResponse?.result?.[0];
    if (!q) return res.status(404).json({ error: 'not found', raw: data });
    res.json({
      price: q.regularMarketPrice,
      chgPct: q.regularMarketChangePercent,
      currency: q.currency
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
