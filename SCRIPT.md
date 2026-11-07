# Scénář – GitHub & GitHub Pages (v2)

Pointa: GitHub je „Google Disk s pamětí“ pro kód a GitHub Pages z něj zadarmo udělá web, který vidí celý svět.
Příklady jsou z mého plesového webu (`../plesoktava`), ale prezentace je o GitHubu obecně.
21 slidů, ~18 min + otázky. „Říkáš“ je kostra – přepiš si ji vlastními slovy. Ovládání: → / klik / klikátko, ← zpět, B = záloha dema.

Každý pojem: přirovnání → přesný termín → co se stalo na plesovém webu. Když zjednodušuješ, řekni „zjednodušeně… přesněji…“.

| Pojem | Lidsky | Odborně (musí zaznít) |
|---|---|---|
| Repozitář | složka s pamětí | adresář se skrytou `.git`: databáze objektů a referencí |
| Commit | uložená pozice ve hře | snímek celého stromu + odkaz na rodiče, autor, zpráva; SHA-1 hash |
| Branch | paralelní vesmír | posuvný ukazatel na commit; HEAD = kde právě jsem |
| Merge | spojení vesmírů | commit se dvěma rodiči; konflikt = obě větve změnily stejné řádky |
| Push | nahrát do cloudu | pošle na `origin` chybějící objekty a posune referenci větve |
| Pull request | „mrkni mi na to“ | funkce GitHubu (ne Gitu): návrh na sloučení s review a kontrolami |
| Fork | kopie cizího repa u mě | vlastní repozitář odvozený z cizího; změny vracím pull requestem |
| GitHub Actions | robot | CI/CD: YAML v `.github/workflows`, spouští se událostí (push) na runneru |
| GitHub Pages | web z repozitáře | statický hosting; z větve (Jekyll) nebo přes Actions |

## Akt 1 – Problém a příběh

1. **Cold open (film, HyperFrames).** Klik → terminál napíše `git push` (skutečný push plesového webu), obrazovka se rozpadne do Matrix deště, ten se složí do `8a8.gkolin.cz`.
   Říkáš (po filmu): „Tohle je web našeho plesu. Stojí nula korun, běží nonstop a nasadil jsem ho jedním příkazem. Za pár minut budete vědět jak.“
2. **final_final.zip → pilulky.** „Kdo má na disku něco jako final_final? Teď si představte pět lidí, co to upravují najednou.“ Klik: meme modrá/červená pilulka, klik: červená vyhraje.
3. **Příběh GitHubu (film, Remotion, hraje sám).** 2005 Git (Linus Torvalds pro jádro Linuxu) → 2008 GitHub → 2018 Microsoft za 7,5 mld. $ → 2019 Actions → 2021 Copilot → 2025 180+ mil. vývojářů. Mluv přes film, jeden milník ≈ 2 s.

## Akt 2 – Git a GitHub

4. **Git vs. GitHub.** „Git je foťák – fotí stav projektu. GitHub je album v cloudu.“ Klik: blesk, fotka letí do alba. Klik ×4: expanding brain (mail → Disk → GitHub → Pages).
5. **Repozitář.** Strom plesového webu, složky se rozbalují; poslední klik ukáže `.git/` uvnitř projektu: „Tady je ta paměť.“
6. **Commit.** Skutečný diff z commitu `9cc712d`. „Commit je uložená pozice ve hře… Přesněji: Git ukládá snímek celého projektu, diff si dopočítá, a ten kód je SHA-1 otisk.“
7. **Historie webu.** 42 commitů za 30 dní na skutečné časové ose. Tři příběhy: první commit (618 řádků najednou), 3 minuty boje s doménou (Create/Delete/Create CNAME), noční oprava ve 23:05 (© 2027 → 2026). Meme: 19 ze 42 commitů se jmenuje „Update index.html“.
8. **git blame – „Kdo to rozbil?“** Skutečný `git blame`: každý řádek ukazuje na mě. „818 z 818 řádků jsem napsal já.“ (`git blame` = kdo naposledy změnil každý řádek.)
9. **Branch a merge.** HEAD jede po větvi `nove-menu`, vrátí se merge commitem se dvěma rodiči. „Větev je jen ukazatel na commit, který se s dalším commitem posune.“ Meme: dva řádky do sebe narazí → konflikt se značkami `<<<<<<<` / `>>>>>>>`.
10. **Pull request.** Ukázka (ne skutečný PR): kontroly doběhnou, spolužák schválí, Merge → stav „Merged“. „Pull request je funkce GitHubu, ne Gitu.“
11. **Open source: fork a hvězdička.** Hvězdička = záložka a poděkování. Fork = moje kopie cizího repa. Změny vracím pull requestem – tak funguje open source.
12. **GitHub v číslech.** 180+ mil. vývojářů, 630 mil. repozitářů, skoro 1 mld. commitů za 2025 (Octoverse 2025). Počítadlo běží: „Za tu minutu, co tu stojím, přibylo asi šedesát lidí.“

## Akt 3 – GitHub Pages

13. **Pages = web z repozitáře.** Soubory odletí do okna prohlížeče, objeví se plesový web. „Zadarmo, s HTTPS, na adrese jméno.github.io.“
14. **Od pushe k živému webu.** Kroky se odškrtávají jako v Actions (žlutá → hotovo). `upload-pages-artifact` → `deploy-pages`.
15. **Vlastní web za 5 minut.** 4 kroky, „bez jediného příkazu v terminálu“.
16. **Živé demo.** „Co tam mám napsat?“ → editor → `git add .` `git commit -m "živě z hodiny"` `git push` → Actions → refresh → `git revert HEAD` + `git push`. Během čekání klik: meme „U mě to funguje.“ → „Tak pošleme do produkce tvůj počítač.“ (notebook do krabice) → „přesně tohle dělá Docker“. Záloha: klávesa B.
17. **Pátek 16:59.** `git push --force origin main` → alarm, „PRODUKCE NEJEDE“, notifikace. Klik: „Příště `git push --force-with-lease`. A v pátek radši nic.“ (`--force` přepíše historii na serveru.)
18. **Na co Pages je a na co ne.** Jen statické weby (HTML, CSS, JS), max. 1 GB. Databáze, přihlašování, PHP ne.
19. **Copilot.** Napíšu komentář „napiš mi celou maturitní práci“ → Copilot navrhne „TODO: napiš si ji sám“ → Tab.
20. **Student Developer Pack.** GitHub Pro, Copilot zdarma, doména na rok. Stačí ověřit, že studuješ.
21. **Odhalení + QR.** Klik: celá prezentace se odzoomuje do okna prohlížeče na github.io. „Naskenujte si ji. Máte otázky?“

## Očekávané otázky
- **Proč Actions, a ne deploy z větve?** Actions dovolí build krok; deploy z větve prožene soubory Jekyllem (proto `.nojekyll`).
- **Merge, nebo rebase?** Merge zachová historii (dva rodiče). Rebase přepíše commity na nový základ – na sdílené větvi nikdy.
- **`git push --force`?** Přepíše historii na serveru. Bezpečnější `--force-with-lease`; na main se chyba opravuje `git revert`.
- **Vlastní doména?** DNS CNAME na `jméno.github.io`, doména v nastavení Pages, Enforce HTTPS.
- **Proč ne Vercel/Netlify?** Umí serverové funkce a náhledy pro PR. Na statický web je Pages nejjednodušší.
- **Je veřejné repo bezpečné?** Kód je vidět – žádné klíče v repozitáři ani ve frontendu.
- Nevíš-li: „Tohle jsem v praxi nezkoušel.“

## Zdroje
- GitHub Octoverse 2025 – 180+ mil. vývojářů, 630 mil. repozitářů, ~1 mld. commitů v 2025, nový vývojář každou sekundu.
- Git 2005 (Linus Torvalds), GitHub 2008, Microsoft 2018 (7,5 mld. $), Actions GA 2019, Copilot 2021.
- Limity GitHub Pages – max. 1 GB, 100 GB přenosu měsíčně.

## Jak to je postavené
- Deck: `index.html`, `js/deck.js` (engine: pozastavená GSAP timeline na slide, stopy s0…sN), `js/slides.js` (animace), `css/deck.css`.
- Filmy: `film/coldopen` (HyperFrames, render `npx hyperframes render`), `film/historie` (Remotion, `npx remotion render Historie`). Výstupy v `assets/*.mp4`.
- Kontrola: `node tools/qa.cjs …` projde každý krok tam i zpět, porovná snímky a měří zaseknuté animace.
