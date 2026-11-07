# Prezentace: GitHub & GitHub Pages

Česky, 22 slidů, 17–18 min. Scénář: `SCRIPT.md`. Zdroj dat: `../plesoktava` (plesový web, repo marekpasler/plesoktava).

## Technika
- Jeden statický web: HTML + CSS + JS, bez frameworku a bez build kroku.
- GSAP 3 se všemi pluginy (SplitText, DrawSVG, MorphSVG, Flip, MotionPath) z CDN; pro offline kopii stažený lokálně do `vendor/`.
- Navigace šipkami; každá animace se spouští na klik (→), nic automaticky (výjimka: tikající odhad na slidu 15).
- Podpora `prefers-reduced-motion` (animace se přeskočí na koncový stav).
- Plátno 1920×1080, škálované na velikost okna; nic se nesmí oříznout v 1366×768.
- Přechod mezi slidy: obsah odjede 24 px nahoru (0,3 s, `power3.in`), nový přijede zespodu (0,6 s, `power3.out`); začátek aktu (data-act) 1,2 s.
- Pohyb „Premium“: `power3.out` vstup, `power3.in` odchod, `power3.inOut` přesun; délky 0,3 / 0,6 / 1,2 s; bez overshootu, bounce, shake, glow, záblesků a ozdobných rotací. Každý pohyb vysvětluje mechanismus.
- Nasazení: GitHub Pages přes Actions (`upload-pages-artifact` + `deploy-pages`).

## Publikum
Seminář programování, učitel je zkušený ajťák. Termíny přesně, každé zjednodušení označit („zjednodušeně… přesněji…“).

## Design
- Pozadí `#0d1117`, jeden akcent = Matrix zelená z plesu. Červená a zelená jen pro diff.
- Písmo: IBM Plex Sans + IBM Plex Mono. Kód vždy monospace.
- Max. 12 slov na slide, text min. 32 px (zdroje, štítky), hlavní text 40 px a víc. Vysoký kontrast (školní projektor slévá tmavé šedé).
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
