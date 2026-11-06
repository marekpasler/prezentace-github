# Scénář – GitHub & GitHub Pages

Pointa: GitHub je „Google Disk s pamětí“ pro kód a GitHub Pages z něj zadarmo udělá web, který vidí celý svět.
Hlavní příběh: plesový web (`../plesoktava`). Každý pojem = přirovnání → přesný termín → co se stalo na plesovém webu.

17 slidů, ~17 min + 2–3 min otázky. „Říkáš“ je kostra, přepsat vlastními slovy. Na plátně nikdy není to, co se říká.

## Pojmy

| Pojem | Lidsky | Odborně (musí zaznít) |
|---|---|---|
| Repozitář | složka s pamětí | adresář se skrytou složkou `.git`: databáze objektů a referencí |
| Commit | uložená pozice ve hře | snímek celého stromu souborů + odkaz na rodičovský commit, autor a zpráva; identifikuje ho SHA-1 hash |
| Branch | paralelní vesmír | posuvný ukazatel na commit; HEAD ukazuje, na které větvi právě jsi |
| Merge | spojení vesmírů | merge commit se dvěma rodiči; konflikt vznikne, když obě větve změní stejné řádky |
| Push | nahrát do cloudu | odešle na remote `origin` chybějící objekty a posune tam referenci větve |
| Pull request | „mrkni mi na to“ | funkce GitHubu, ne Gitu: návrh na sloučení větve s review a automatickými kontrolami |
| GitHub Actions | robot, co to udělá za tebe | CI/CD: YAML workflow v `.github/workflows`, spuštěný událostí push na runneru |
| GitHub Pages | web z repozitáře | statický hosting; nasazení z větve (s Jekyllem), nebo přes Actions (`upload-pages-artifact` + `deploy-pages`) |

## Akt 1 – Problém (3 min)

### 1. Cold open
- Plátno: černá obrazovka, bliká kurzor.
- Motion: sám se napíše `git push`, Enter. Obrazovka se rozpadne do zeleného deště znaků, ten se složí do adresy plesového webu.
- Říkáš (po animaci): „Tohle je web našeho plesu. Stojí nula korun, běží nonstop a nasadil jsem ho jedním příkazem. Za deset minut budete vědět jak.“

### 2. final_final.zip
- Plátno: `web.zip`, `web_final.zip`, `web_final2.zip`, `web_OPRAVDU_final.zip`.
- Motion: soubory padají jeden po druhém (bounce), poslední se zatřese.
- Meme: Matrix pilulky – modrá = „poslat web mailem jako zip“, červená = „git push“ (SVG, zelená Matrix paleta, pilulky se na klik rozsvítí).
- Říkáš: „Kdo má na disku něco jako final_final? Teď si představte sto souborů a pět lidí, co je upravují najednou.“

## Akt 2 – GitHub (7 min)

### 3. Git vs. GitHub
- Plátno: dvě slova vedle sebe, pod nimi „v tvém počítači“ / „na internetu“.
- Motion: blesk foťáku, fotka odletí do alba.
- Meme: Expanding brain – mail → Google Disk → GitHub → GitHub Pages (každým klikem víc glow).
- Říkáš: „Git je foťák – fotí stav projektu. GitHub je album v cloudu, kam ty fotky nahrávám a sdílím.“

### 4. Repozitář
- Plátno: skutečný strom souborů plesového webu (`data/tree.json`).
- Motion: složky se rozbalují postupně (stagger po řádcích).
- Říkáš: „Repozitář je složka projektu, která si pamatuje celou svou historii.“

### 5. Commit
- Plátno: skutečný diff z webu (změna data nebo ceny vstupenky).
- Motion: červený řádek odjede doleva, zelený přijede zprava (Flip); nahoře razítko se zprávou commitu a hashem (scale 1.3 → 1).
- Říkáš: „Commit je uložená pozice ve hře. Napíšu, co jsem změnil, a můžu se sem kdykoli vrátit. Přesněji: Git neukládá rozdíl, ale snímek celého projektu. Diff si jen dopočítá a ten kód nahoře je SHA-1 otisk obsahu.“

### 6. Historie webu
- Plátno: skutečný `git log` jako časová osa (`data/commits.json` → SVG).
- Motion: osa se kreslí zleva (DrawSVG), tečky naskakují; tři se zvětší – první commit, nejvtipnější zpráva, noční oprava.
- Meme: skutečné zprávy commitů vypisované jako v terminálu, poslední řádek se zatřese.
- Říkáš: krátký skutečný příběh ke každé ze tří teček.

### 7. Branch a merge
- Plátno: mapa metra – linka `main` a odbočka `nove-menu`.
- Motion: tečka jede po lince (MotionPath), linka se rozdvojí, přibudou stanice, vrátí se do hlavní linky.
- Meme: merge conflict – dvě fotky spolužáků (se souhlasem), mezi nimi blikají `<<<<<<<` a `>>>>>>>`.
- Říkáš: „Větev je paralelní vesmír. Zkouším nové menu a hlavní web mezitím pořád funguje. Pod kapotou je větev jen ukazatel na jeden commit, který se s každým dalším commitem posune.“

### 8. Pull request (vynech, pokud žádný není)
- Plátno: screenshot skutečného PR s komentářem.
- Říkáš: „Než se změna spojí s hlavní verzí, může se na ni někdo podívat a okomentovat ji.“

### 9. GitHub v číslech
- Plátno: 180+ milionů vývojářů, 630 milionů repozitářů, skoro miliarda commitů za rok 2025 (Octoverse 2025).
- Motion: počítadla naběhnou; pod nimi „každou sekundu se přidá nový vývojář“ a počítadlo, které tiká, dokud je slide vidět.
- Říkáš: „Za tu minutu, co tady stojím, přibylo na GitHubu asi šedesát lidí.“

## Akt 3 – GitHub Pages (7 min)

### 10. Co je Pages
- Plátno: repozitář → web.
- Motion: soubory z repozitáře odletí a složí se do okna prohlížeče (Flip).
- Říkáš: „GitHub Pages vezme soubory z repozitáře a udělá z nich web. Zadarmo, s HTTPS, na adrese jméno.github.io.“

### 11. Jak to běží
- Plátno: push → GitHub Actions web sestaví → web je živě.
- Motion: každý krok se odškrtne jako v Actions: žlutá točící se tečka → zelená fajfka.

### 12. Vlastní web za 5 minut
- Plátno: účet → nový repozitář → `index.html` → Settings → Pages → Deploy from branch.
- Motion: kroky se rozsvěcují postupně, u každého výřez skutečné obrazovky GitHubu.
- Říkáš: „Tohle zvládne každý z vás ještě dnes večer, bez jediného příkazu v terminálu – všechno jde kliknout v prohlížeči.“

### 13. Živé demo
- Viz „Živé demo“ níže. Meme: „It works on my machine“ během čekání na deploy.
- 13b (skrytý): záložní video dema.

### 14. Na co Pages je a na co ne
- Plátno: Ano: ples, portfolio, dokumentace, prezentace. Ne: databáze, přihlašování, PHP.
- Říkáš: „Pages umí jen statické weby – HTML, CSS, JavaScript. Web může mít až 1 GB. Na něco s databází potřebuješ jinou službu.“

### 15. Bonus pro studenty
- Plátno: GitHub Student Developer Pack – GitHub Pro, Copilot pro studenty, doména zdarma na rok.
- Motion: tři karty se otočí jako vstupenky.
- Říkáš: „Jako studenti máte nárok na balík nástrojů zadarmo. Stačí ověřit, že studujete.“

### 16. Co dalšího GitHub umí (30 s)
- Plátno: Issues (úkoly), Actions (automatizace), Copilot (AI pomocník).
- Říkáš: „Na plese jsme Issues mohli používat jako to-do list – každý úkol jeden lístek.“

### 17. Odhalení + QR
- Plátno: „Tahle prezentace je taky web na GitHub Pages.“ + QR kód.
- Motion: slide se odzoomuje (scale 1 → 0.6) a ukáže se, že celou dobu byl uvnitř okna prohlížeče s adresou na github.io.
- Říkáš: „Naskenujte si ji, máte ji v mobilu i s odkazy. Máte otázky?“

## Živé demo (~2 min)
1. Na plátně plesový web. „Co tam mám napsat?“ – první slušný návrh.
2. V editoru změnit jeden text (podtitul), uložit.
3. Terminál (písmo 24+ px): `git add .`, `git commit -m "živě z hodiny"`, `git push`.
4. Záložka Actions – deploy ~1 min, mezitím slide 14.
5. Refresh, změna je venku. Pak `git revert HEAD` + `git push`.

## Očekávané otázky
- Proč deploy přes Actions, a ne z větve? Actions dovolí build krok. Deploy z větve prožene soubory Jekyllem, proto `.nojekyll`.
- Merge, nebo rebase? Merge zachová historii (commit se dvěma rodiči). Rebase přepíše commity na nový základ – na sdílené větvi nikdy.
- `git push --force`? Přepíše historii na serveru. Bezpečnější `--force-with-lease`; na main se chyba opravuje `git revert`.
- Vlastní doména? DNS CNAME na jméno.github.io (subdoména), doména v nastavení Pages, Enforce HTTPS.
- Proč ne Vercel/Netlify? Umí serverové funkce a náhledy pro PR. Na statický web je Pages nejjednodušší.
- Je veřejné repo bezpečné? Kód je vidět, takže žádné klíče v repozitáři ani ve frontendu.
- Nevíš-li: „Tohle jsem v praxi nezkoušel.“

## Zdroje
- GitHub Octoverse 2025 – 180+ mil. vývojářů, 630 mil. repozitářů, ~1 mld. commitů v 2025.
- Limity GitHub Pages – max. 1 GB, 100 GB přenosu měsíčně.
- GitHub Student Developer Pack.
- GSAP – zdarma včetně všech pluginů.
