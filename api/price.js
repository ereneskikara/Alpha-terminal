export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { sym, exch } = req.query;
  if (!sym) return res.status(400).json({ error: 'sym required' });

  const FINNHUB_KEY = 'd6ctgkpr01qgk7mjnqu0d6ctgkpr01qgk7mjnqug';

  let fsym = sym;
  if (exch === 'XETR') fsym = sym + '.DE';
  else if (exch === 'BIST') fsym = sym + '.IS';

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(fsym)}&token=${FINNHUB_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    if (!data.c || data.c === 0) return res.status(404).json({ error: 'not found', raw: data });
    res.json({
      price: data.c,
      chgPct: ((data.c - data.pc) / data.pc * 100).toFixed(2),
      currency: exch === 'XETR' ? 'EUR' : exch === 'BIST' ? 'TRY' : 'USD'
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
