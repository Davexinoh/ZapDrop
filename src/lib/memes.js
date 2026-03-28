/**
 * lib/memes.js
 * ─────────────────────────────────────────────────────────────────
 * Meme card template definitions.
 * Pure CSS gradients — zero image hosting needed.
 * Colour palette pulled from Starknet / Starkzap brand.
 */

export const MEME_TEMPLATES = [
  {
    id:          'gm_money',
    label:       'GM Money',
    emoji:       '☀️',
    topText:     'GM FREN',
    bottomText:  'YOUR ZAP ARRIVED',
    bg:          'radial-gradient(ellipse at top right, #2a1000 0%, #0d0803 60%, #060409 100%)',
    accent:      '#FF5C1A',
    vibe:        'Warm & bullish',
  },
  {
    id:          'wen_moon',
    label:       'Wen Moon',
    emoji:       '🌕',
    topText:     'NGMI WITHOUT THIS',
    bottomText:  'CLAIM OR STAY POOR',
    bg:          'radial-gradient(ellipse at top right, #1a0030 0%, #08000f 60%, #060409 100%)',
    accent:      '#c084fc',
    vibe:        'Purple degen',
  },
  {
    id:          'giga_brain',
    label:       'Giga Brain',
    emoji:       '🧠',
    topText:     'BASED MOVE BY',
    bottomText:  'GIGABRAIN CONFIRMED',
    bg:          'radial-gradient(ellipse at top right, #001a15 0%, #000d0a 60%, #060409 100%)',
    accent:      '#34d399',
    vibe:        'Green we made it',
  },
  {
    id:          'its_happening',
    label:       "It's Happening",
    emoji:       '⚡',
    topText:     "IT'S HAPPENING",
    bottomText:  'STRK INBOUND ⚡',
    bg:          'radial-gradient(ellipse at top right, #1f1000 0%, #0d0800 60%, #060409 100%)',
    accent:      '#FF8C00',
    vibe:        'Amber energy',
  },
  {
    id:          'not_financial',
    label:       'NFA',
    emoji:       '📈',
    topText:     'NOT FINANCIAL ADVICE',
    bottomText:  'BUT CLAIM YOUR STRK',
    bg:          'radial-gradient(ellipse at top right, #001520 0%, #000c15 60%, #060409 100%)',
    accent:      '#22d3ee',
    vibe:        'Blue finance bro',
  },
]

export const getMemeById = (id) =>
  MEME_TEMPLATES.find((m) => m.id === id) ?? MEME_TEMPLATES[0]
