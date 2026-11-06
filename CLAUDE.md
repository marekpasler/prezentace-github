# Prezentace: GitHub & GitHub Pages

Česky, 17 slidů, 15–20 min. Scénář: `SCRIPT.md`. Zdroj dat: `../plesoktava` (plesový web, repo marekpasler/plesoktava).

## Technika
- Jeden statický web: HTML + CSS + JS, bez frameworku a bez build kroku.
- GSAP 3 se všemi pluginy (SplitText, DrawSVG, MorphSVG, Flip, MotionPath) z CDN; pro offline kopii stažený lokálně do `vendor/`.
- Navigace šipkami; každá animace se spouští na klik (→), nic automaticky (výjimka: tikající počítadlo na slidu 9).
- Podpora `prefers-reduced-motion` (animace se přeskočí na koncový stav).
- Plátno 1920×1080, škálované na velikost okna; nic se nesmí oříznout v 1366×768.
- Jeden konzistentní přechod mezi slidy: obsah odjede 40 px nahoru a zmizí, nový přijede zespodu, 0,4 s.
- Časování 0,3–0,6 s, easing `power3.out`; déle smí jen cold open a odhalení.
- Nasazení: GitHub Pages přes Actions (`upload-pages-artifact` + `deploy-pages`).

## Publikum
Seminář programování, učitel je zkušený ajťák. Termíny přesně, každé zjednodušení označit („zjednodušeně… přesněji…“).

## Design
- Pozadí `#0d1117`, jeden akcent = Matrix zelená z plesu. Červená a zelená jen pro diff.
- Písmo: IBM Plex Sans + IBM Plex Mono. Kód vždy monospace.
- Max. 12 slov na slide, text min. 40 px. Vysoký kontrast (školní projektor slévá tmavé šedé).
- Hodně prázdného místa, jedna věc na slide, vše na mřížce.
- Text v memech je živý HTML text, ne obrázek.

## ZAKÁZÁNO
- Gradienty, blob pozadí, glassmorphism.
- Emoji a obecné ikony (🚀 ✨ 💡).
- Vymyšlená čísla, stockové fotky, fotky lidí bez souhlasu.
- Marketingové fráze („Revolutionizing“, „Unlock the power“, „V dnešní digitální době“, „klíčový“, „revoluční“).
- Tři odrážky na každém slidu, nadpisy „Úvod“ / „Závěr“.

## Pravidlo animací
Každá animace musí vysvětlovat mechanismus (commit, branch, deploy), ne jen zdobit. Data (git log, strom souborů, diff) jen skutečná z `../plesoktava`, nic nevymýšlet.
