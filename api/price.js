export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { sym, exch } = req.query;
  if (!sym) return res.status(400).json({ error: 'sym required' });

  // Yahoo sembol formatı
  let ys = sym;
  if (exch === 'BIST') ys = sym + '.IS';
  else if (exch === 'XETR') ys = sym + '.DE';
  else if (exch === 'CRYPTO') ys = sym.replace('/USD','').replace('USDT','').replace('BUSD','') + '-USD';

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ys)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await r.json();
    const q = data.quoteResponse.result[0];
    if (!q) return res.status(404).json({ error: 'not found' });
    res.json({
      price: q.regularMarketPrice,
      chgPct: q.regularMarketChangePercent,
      currency: q.currency
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
