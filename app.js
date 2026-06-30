/* Aplikačná logika generátora názvov dokumentácie stavby (A00). */
(function () {
  "use strict";

  /* ── Konštanty a dáta ──────────────────────────────────────────── */

  // Časti kde kódovanie končí na pozícii 6 (poz7 a poz8 sa nepoužívajú)
  const PARTS_END_AT_POZ6 = new Set(["A", "B"]);
  // Časti kde kódovanie končí na pozícii 7 (poz8 sa nepoužíva)
  const PARTS_END_AT_POZ7 = new Set(["C", "E"]);

  const PART_LABELS = {
    A: "A – Zoznam dokumentácie",
    B: "B – Súhrnná správa",
    C: "C – Situačné výkresy",
    D: "D – Dokumentácia stavebných objektov a prevádzkových súborov",
    E: "E – Prílohy",
  };
  const PART_ORDER  = ["A", "B", "C", "D", "E"];
  const OVERVIEW_COLS = 7;

  const ALL_POZ6_OPTIONS = [
    { value: "AAA", label: "AAA – zoznam dokumentácie (časť A00)" },
    { value: "SPR", label: "SPR – súhrnná správa (časť B00)" },
    { value: "SIT", label: "SIT – situácia (časť C00)" },
    { value: "ASR", label: "ASR – architektonicko–stavebné riešenie" },
    { value: "STA", label: "STA – statika" },
    { value: "ZTI", label: "ZTI – zdravotechnická inštalácia" },
    { value: "VYK", label: "VYK – vykurovanie" },
    { value: "PLY", label: "PLY – plynoinštalácia" },
    { value: "VZT", label: "VZT – vzduchotechnika a chladenie" },
    { value: "MAR", label: "MAR – meranie a regulácia" },
    { value: "ELI", label: "ELI – elektroinštalácia" },
    { value: "BLZ", label: "BLZ – bleskozvod a uzemnenie" },
    { value: "SLP", label: "SLP – slaboprúdová inštalácia, štruk. káblove rozvody" },
    { value: "HSP", label: "HSP – hlasová signalizácia požiaru" },
    { value: "EPS", label: "EPS – elektrická požiarna signalizácia" },
    { value: "SHZ", label: "SHZ – stabilné hasiace zariadenia" },
    { value: "ODT", label: "ODT – zariadenie na odvod dymu a tepla" },
    { value: "USV", label: "USV – umelé osvetlenie" },
    { value: "KRA", label: "KRA – krajinné, sadové a terénne úpravy" },
    { value: "DOP", label: "DOP – dopravné riešenie" },
    { value: "POD", label: "POD – projekt organizácie dopravy" },
    { value: "TDZ", label: "TDZ – trvalé dopravné značenie" },
    { value: "DDZ", label: "DDZ – dočasné dopravné značenie" },
    { value: "PNN", label: "PNN – elektrická prípojka nízkeho napätia" },
    { value: "PVN", label: "PVN – elektrická prípojka vysokého napátia" },
    { value: "VUO", label: "VUO – vonkajšie / verejné osvetlenie" },
    { value: "ARS", label: "ARS – areálové / miestne rozvody silnoprúdu" },
    { value: "AEK", label: "AEK – areálové / miestne rozvody elektronických komunikácií" },
    { value: "REK", label: "REK – rozvody elektronických komunikácií" },
    { value: "VDS", label: "VDS – vedenie distribučnej sústavy" },
    { value: "BK", label: "BK – betónové konštrukcie" },
    { value: "OK", label: "OK – oceľové konštrukcie" },
    { value: "SVK", label: "SVK – systém kontroly vstupu" },
    { value: "ESZ", label: "ESZ – elektrická zabezpečovacia signalizácia" },
    { value: "UTO", label: "UTO – uzatvorený televízny okruh (CCIR)" },
    { value: "HSR", label: "HSR – hetelový systém riadenia" },
    { value: "NKS", label: "NKS – nemocičný komunikačný systém" },
    { value: "SKR", label: "SKR – systém riadenia precesov (SRTP, ASRTP, SKR)" },
    { value: "CRS", label: "CRS – centrálne riadiace systémy budov (BMS)" },
    { value: "ADR", label: "ADR – automatický systém dispečerského riadenia (ASDR)" },
    { value: "ZDT", label: "ZDT – zdravotnícka technológia" },
    { value: "RTG", label: "RTG – projekt radiačnej ochrany" },
    { value: "MED", label: "MED – medicinálne plyny" },
    { value: "TZG", label: "TZG – výrobné technologické zariadenia" },
    { value: "ETS", label: "ETS – elektrická stanica" },
    { value: "PRS", label: "PRS – prevádzkový rozvod silnoprúdu" },
    { value: "NZE", label: "NZE – náhradný zdroj (elektrickej energie)" },
    { value: "FVZ", label: "FVZ – fotovoltický zdroj (výkon meniča do 10 kv)" },
    { value: "FVE", label: "FVE – fotovoltická elektráreň (výkon meniča nad 10 kv)" },
    { value: "KGZ", label: "KGZ – kogeneračný zdroj / KVET" },
    { value: "BAT", label: "BAT – batériové uložisko" },
    { value: "KTO", label: "KTO – katódová ochrana" },
    { value: "SZS", label: "SZS – správa o prerokovaní stavebného zámeru" },
    { value: "STD", label: "STD – stavebný denník" },
    { value: "ZSS", label: "ZSS – záverečné stanovisko stavbyvedúceho" },
    { value: "PBS", label: "PBS – protipožiarna bezpečnosť stavby" },
    { value: "POV", label: "POV – plán organizácie výstavby" },
    { value: "STP", label: "STP – protokol z kontrolného statického posúdenia" },
    { value: "GDP", label: "GDP – geodetické podklady" },
    { value: "PAM", label: "PAM – pamiatkový výskum" },
    { value: "EIA", label: "EIA – posúdenie vplyvov na životné prostredie" },
    { value: "EHB", label: "EHB – energetické hodnotenie budovy" },
    { value: "DEN", label: "DEN – dendrologické posúdenie" },
    { value: "DEV", label: "DEV – náhradná výsadba drevín" },
    { value: "SVP", label: "SVP – svetelno-technické posúdenie" },
    { value: "HGP", label: "HGP – hydrogeologické posúdenie" },
    { value: "IGP", label: "IGP – inžinierskogeologické posúdenie" },
    { value: "HLU", label: "HLU – hluková štúdia" },
    { value: "IPP", label: "IPP – imisno-prenosové (rozpylobá štúdia) posúdenie" },
    { value: "PEZ", label: "PEZ – prieskum environmentálnej záťaže" },
    { value: "ECB", label: "ECB – energetický certifikát budovy" },
    { value: "STP", label: "STP – svetelno-technické riešenie umelého osvetlenia" },
    { value: "INE", label: "INE – iná profesia / posúdenie vyššie neuvedené" },
  ];

  const POZ6_EXCLUDED_FOR_D = new Set(["AAA", "SPR", "SIT", "SZS", "STD", "ZSS", "PBS", "POV", "STP", "GDP", "PAM", "EIA", "EHB", "DEN", "DEV", "SVP", "HGP", "IGP", "HLU", "IPP", "PEZ", "ECB", "STP"]);
  const POZ6_ALLOWED_BY_PART = {
    A: ["AAA"], B: ["SPR"], C: ["SIT"],
    D: ALL_POZ6_OPTIONS.map(o => o.value).filter(v => !POZ6_EXCLUDED_FOR_D.has(v)),
    E: ["SZS", "STD", "ZSS", "PBS", "POV", "STP", "GDP", "PAM", "EIA", "EHB", "DEN", "DEV", "SVP", "HGP", "IGP", "HLU", "IPP", "PEZ", "ECB", "STP", "INE"]
  };
  const allowedPoz6 = new Set(ALL_POZ6_OPTIONS.map(o => o.value));
  const allowedPoz8 = new Set(["AAA","TXT","SIT","VYT","VYZ","VYS","STV","N01","N02","P01","P02","POH","REZ","VIZ","DET","SCH","VVZ","VYV","ROZ"]);

  // Identifikačné kódy stavby podľa vyhlášky ÚUPVSR o členení stavieb (pozícia 4).
  // Jeden zdroj pravdy – rovnaký <select> sa generuje pre projekt aj pre objekty.
  const BUILDING_CODE_GROUPS = [
    { label: "11 – Bytové budovy", options: [
      ["1111", "1111 – Jednobytové budovy"],
      ["1112", "1112 – Dvojbytové budovy"],
      ["1113", "1113 – Trojbytové budovy"],
      ["1120", "1120 – Viacbytové budovy"],
      ["1130", "1130 – Iné bytové budovy"],
    ]},
    { label: "12 – Nebytové budovy pre vybavenosť", options: [
      ["1211", "1211 – Hotelové budovy"],
      ["1212", "1212 – Iné budovy pre cestovný ruch a ubytovanie"],
      ["1213", "1213 – Budovy verejného stravovania"],
      ["1220", "1220 – Budovy pre administratívu"],
      ["1230", "1230 – Budovy pre obchod a služby"],
      ["1241", "1241 – Budovy pre kultúru"],
      ["1242", "1242 – Budovy pre cirkev"],
      ["1250", "1250 – Budovy pre výchovu a vzdelávanie"],
      ["1260", "1260 – Budovy pre zdravotníctvo"],
      ["1271", "1271 – Budovy pre šport"],
      ["1272", "1272 – Budovy pre rekreáciu"],
      ["1280", "1280 – Budovy pre sociálne služby"],
      ["1290", "1290 – Iné budovy pre vybavenosť"],
    ]},
    { label: "13 – Nebytové budovy pre výrobu", options: [
      ["1311", "1311 – Budovy potravinárskej výroby"],
      ["1312", "1312 – Budovy spracovatešského priemyslu"],
      ["1313", "1313 – Iné priemyselné budovy"],
      ["1314", "1314 – Sklady"],
      ["1321", "1321 – Poľnohospodárske budovy pre rastlinnú výrobu"],
      ["1322", "1322 – Poľnohospodárske budovy pre živočíšnú výrobu"],
      ["1323", "1323 – Budovy pre lesníctvo a poľovníctvo"],
      ["1330", "1311 – Budovy pre inú výrobu"],
    ]},
    { label: "14 – Nebytové budovy pre dopravnú infraštruktúru", options: [
      ["1410", "1410 – Budovy pre dopravnú vybavenosť"],
      ["1420", "1420 – Budovy pre technickú vybavenosť"],
    ]},
    { label: "15 – Iné nebytové budovy", options: [
      ["1511", "1511 – Drobné stavby prízemné"],
      ["1512", "1512 – Drobné stavby podzemné"],
    ]},
    { label: "21 – Inžinierske stavby dopravnej vybavenosti", options: [
      ["2111", "2111 – Diaľnice"],
      ["2112", "2112 – Cesty I. triedy"],
      ["2113", "2113 – Cesty II. a III. triedy"],
      ["2114", "2114 – Miestne cesty a účelové cesty"],
      ["2115", "2115 – Cyklotrasy, chodníky"],
      ["2121", "2121 – Železničné dráhy"],
      ["2122", "2122 – Iné dráhy"],
      ["2130", "2130 – Letiskové stavby"],
      ["2141", "2141 – Mosty a mimoúrovňové kríženia"],
      ["2142", "2142 – Tunely"],
      ["2151", "2151 – Iné stavby a zariadenia dopravnej vybavenosti"],
    ]},
    { label: "22 – Inžinierske vodné stavby", options: [
      ["2211", "2211 – Prístavy, vodné cesty"],
      ["2212", "2212 – Vodné nádrže, priehrady a iné vodné stavby"],
      ["2213", "2213 – Hydromeliorácie"],
      ["2214", "2214 – Stavby pre zásobovanie vodou"],
      ["2215", "2215 – Stavby pre odpadové vody a vody z povrchového odtoku"],
      ["2216", "2216 – Historické vodohospodárske diela, fontány"],
    ]},
    { label: "23 – Inžinierske stavby technického vybavenia územia", options: [
      ["2311", "2311 – Rozvody ropy a plynu"],
      ["2312", "2312 – Rozvody vody"],
      ["2313", "2313 – Kanalizačné a stokové siete"],
      ["2314", "2314 – Elektronické komunikačné siete"],
      ["2315", "2315 – Prenosové a distribučné sústavy elektrickej energie"],
      ["2321", "2321 – Prípojky plynu"],
      ["2322", "2322 – Prípojky vody"],
      ["2323", "2323 – Prípojky elektronických komunikačných sietí"],
      ["2324", "2324 – Prípojky elektrické"],
      ["2325", "2325 – Prípojky kanalizácie"],
      ["2331", "2331 – Stavby energetických zdrojov"],
      ["2332", "2332 – Iné stavby a zariadenia technického vybavenia územia"],
    ]},
    { label: "24 – Inžinierske stavby priemyselnej výroby", options: [
      ["2411", "2411 – Bánské stavby a ťažobné zariadenia"],
      ["2412", "2412 – Stavby chemických zariadení"],
      ["2413", "2413 – Stavby ťažkého priemyslu"],
      ["2420", "2420 – Nádržé a silá, priemyselné kolóny a veže"],
    ]},
    { label: "25 – Inžinierske stavby vybavenosti", options: [
      ["2511", "2511 – Športové ihriská"],
      ["2512", "2512 – Iné športové a rekreačné stavby"],
      ["2520", "2520 – Stavby pre kultúru"],
      ["2530", "2530 – Iné stavby pre vybavenosť"],
    ]},
    { label: "26 – Informačné konštruckie", options: [
      ["2611", "2611 – Drobné informačné konštrukcie"],
      ["2612", "2612 – Jednoduché informačné konštrukcie"],
    ]},
    { label: "27 – Iné inžinierske stavby", options: [
      ["2711", "2711 – Drobné inžinierské stavby nadzemné"],
      ["2712", "2712 – Drobné inžinierské stavby podzmené"],
      ["2713", "2713 – Drobné inžinierské stavby energetické"],
      ["2720", "2720 – Výškobé konštrukcie"],
    ]},
    { label: "28 – Stavebné úpravy pozemku", options: [
      ["2811", "2811 – Terénne úpravy"],
      ["2812", "2812 – Vonkajšie úpravy"],
    ]},
  ];

  /* ── Čisté pomocné funkcie (bez závislosti na stave) ───────────── */

  function genUid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function groupKey(att) {
    return att.part === "D" ? `D|${att.objectId || ""}` : att.part;
  }

  function csvEscape(value) {
    const s = String(value ?? "");
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function parseCsvLine(line) {
    const result = []; let current = "", inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i+1] === '"') { current += '"'; i++; } else inQuotes = !inQuotes;
      } else if (c === ";" && !inQuotes) { result.push(current); current = ""; }
      else current += c;
    }
    result.push(current); return result;
  }

  // Naplní <select> identifikačnými kódmi budov (placeholder + optgroupy z dát).
  function populateBuildingCodeSelect(sel) {
    sel.innerHTML = "";
    const ph = document.createElement("option");
    ph.value = ""; ph.textContent = "-- vyber kód --";
    sel.appendChild(ph);
    BUILDING_CODE_GROUPS.forEach(group => {
      const og = document.createElement("optgroup");
      og.label = group.label;
      group.options.forEach(([value, text]) => {
        const o = document.createElement("option");
        o.value = value; o.textContent = text;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
  }

  /* ── Aplikácia ─────────────────────────────────────────────────── */

  function initAlod() {
    const project = { name: "", id: "", stupen: "", urcenie: "", identKod: "", objects: [], attachments: [] };

    const projectNameInput       = document.getElementById("projectName");
    const idStavbyInput          = document.getElementById("idStavby");
    const stupenDocSelect        = document.getElementById("stupenDoc");
    const urcenieInput           = document.getElementById("urcenie");
    const identKodSelect         = document.getElementById("identKod");
    const projectStatus          = document.getElementById("projectStatus");
    const objectNameInput        = document.getElementById("objectName");
    const objectNumberInput      = document.getElementById("objectNumber");
    const objectUrcenieInput     = document.getElementById("objectUrcenie");
    const objectIdentKodSelect   = document.getElementById("objectIdentKod");
    const addObjectBtn           = document.getElementById("addObjectBtn");
    const objectsTableBody       = document.getElementById("objectsTableBody");
    const attachmentObjectSelect = document.getElementById("attachmentObject");
    const attachmentPartSelect   = document.getElementById("attachmentPart");
    const poz6Wrapper            = document.getElementById("poz6Wrapper");
    const poz6HelpText           = document.getElementById("poz6HelpText");
    const poz8Select             = document.getElementById("poz8");
    const poz8HelpText           = document.getElementById("poz8HelpText");
    const poz7Input              = document.getElementById("poz7");
    const poz9Input              = document.getElementById("poz9");
    const attachmentTitleInput   = document.getElementById("attachmentTitle");
    const addAttachmentBtn       = document.getElementById("addAttachmentBtn");
    const clearAttachmentFormBtn = document.getElementById("clearAttachmentFormBtn");
    const attachmentError        = document.getElementById("attachmentError");
    const overviewTableBody      = document.getElementById("overviewTableBody");
    const exportCsvBtn           = document.getElementById("exportCsvBtn");
    const importCsvInput         = document.getElementById("importCsvInput");
    const csvStatus              = document.getElementById("csvStatus");

    // Vygeneruj identifikačné kódy budov pre oba selecty z jedného zdroja dát.
    populateBuildingCodeSelect(identKodSelect);
    populateBuildingCodeSelect(objectIdentKodSelect);

    let poz6Mode = "select";

    function getPoz6El()    { return document.getElementById("poz6"); }
    function getPoz6Value() {
      const el = getPoz6El(); if (!el) return "";
      return el.tagName === "SELECT" ? el.value : el.value.trim().toUpperCase();
    }
    function setPoz6Value(val) { const el = getPoz6El(); if (el) el.value = val; }

    function getSelectedAttachmentObjectType() {
      const objId = attachmentObjectSelect.value; if (!objId) return null;
      const obj = project.objects.find(o => o.id.toString() === objId);
      return obj ? obj.type : null;
    }

    // Aktualizuje stav pozície 8 – pre časti A, B je neaktívna (koniec na poz6),
    // pre časti C, E je tiež neaktívna (koniec na poz7).
    function updatePoz8State() {
      const part = attachmentPartSelect.value;
      const isDisabledAt6 = PARTS_END_AT_POZ6.has(part);
      const isDisabledAt7 = PARTS_END_AT_POZ7.has(part);
      poz8Select.disabled = isDisabledAt6 || isDisabledAt7;
      if (isDisabledAt6) {
        poz8Select.value = "";
        poz8HelpText.textContent = "Pre časť " + part + " kódovanie končí na pozícii 6 – pozícia 8 sa nepoužíva.";
      } else if (isDisabledAt7) {
        poz8Select.value = "";
        poz8HelpText.textContent = "Pre časť " + part + " kódovanie končí na pozícii 7 – pozícia 8 sa nepoužíva.";
      } else {
        poz8HelpText.textContent = "";
      }
    }

    function updatePoz6Mode() {
      const part    = attachmentPartSelect.value;
      const objType = getSelectedAttachmentObjectType();
      const needInput = (part === "D" && objType === "P");

      if (needInput && poz6Mode !== "input") {
        const oldEl = getPoz6El();
        const input = document.createElement("input");
        input.type = "text"; input.id = "poz6"; input.maxLength = 3;
        input.placeholder = "napr. 001"; input.pattern = "[0-9]{3}"; input.inputMode = "numeric";
        input.addEventListener("input", () => {
          input.value = input.value.replace(/[^0-9]/g, "").slice(0, 3);
          updatePoz7Preview();
        });
        poz6Wrapper.replaceChild(input, oldEl);
        poz6HelpText.textContent = "Zadaj 3-ciferné číslo prevádzkového súboru (napr. 001).";
        poz6Mode = "input";
      } else if (!needInput && poz6Mode !== "select") {
        const oldEl  = getPoz6El();
        const select = document.createElement("select");
        select.id = "poz6";
        select.addEventListener("change", updatePoz7Preview);
        poz6Wrapper.replaceChild(select, oldEl);
        poz6HelpText.textContent = "";
        poz6Mode = "select";
        updatePoz6Options();
      } else if (!needInput && poz6Mode === "select") {
        updatePoz6Options();
      }
      updatePoz8State();
      updatePoz7Preview();
    }

    function updatePoz6Options() {
      const el = getPoz6El();
      if (!el || el.tagName !== "SELECT") return;
      const part      = attachmentPartSelect.value;
      const allowed   = POZ6_ALLOWED_BY_PART[part] || null;
      const prevValue = el.value;
      el.innerHTML = "";
      const ph = document.createElement("option");
      ph.value = ""; ph.textContent = "-- vyber --";
      el.appendChild(ph);
      ALL_POZ6_OPTIONS.forEach(opt => {
        if (allowed === null || allowed.includes(opt.value)) {
          const o = document.createElement("option");
          o.value = opt.value; o.textContent = opt.label;
          el.appendChild(o);
        }
      });
      if (allowed === null || (prevValue && allowed.includes(prevValue))) {
        el.value = prevValue;
      } else {
        el.value = "";
        if (allowed && allowed.length === 1) el.value = allowed[0];
      }
      updatePoz7Preview();
    }

    function getSelectedObjectType() {
      const sel = document.querySelector("input[name='objectType']:checked");
      return sel ? sel.value : "S";
    }
    function getAttachmentScope() { return attachmentPartSelect.value === "D" ? "object" : "project"; }
    function updateObjectSelectState() {
      const isD = attachmentPartSelect.value === "D";
      attachmentObjectSelect.disabled = !isD;
      if (!isD) attachmentObjectSelect.value = "";
    }
    function sortObjects() {
      const typeRank = { S: 0, P: 1 };
      project.objects.sort((a, b) => {
        const ra = typeRank[a.type] ?? 99, rb = typeRank[b.type] ?? 99;
        if (ra !== rb) return ra - rb;
        const na = parseInt(a.number, 10), nb = parseInt(b.number, 10);
        if (na !== nb) return na - nb;
        return (a.urcenie || "").localeCompare(b.urcenie || "");
      });
    }
    function derivePozicia5(scope, part, objectId) {
      if (scope === "project") return { A: "A00", B: "B00", C: "C00", E: "E00", D: "D00" }[part] || "";
      const obj = project.objects.find(o => o.id.toString() === objectId);
      return obj ? obj.code : "";
    }

    /* ── sortOrder ───────────────────────────────────────────────── */
    function nextSortOrder(gk) {
      let max = -1;
      project.attachments.forEach(a => { if (groupKey(a) === gk && a.sortOrder > max) max = a.sortOrder; });
      return max + 1;
    }

    function groupSorted(gk) {
      return project.attachments.filter(a => groupKey(a) === gk).sort((a, b) => a.sortOrder - b.sortOrder);
    }

    function normalizeSortOrders() {
      const groups = {};
      project.attachments.forEach(a => {
        const gk = groupKey(a);
        if (!groups[gk]) groups[gk] = [];
        groups[gk].push(a);
      });
      Object.values(groups).forEach(list => {
        list.sort((a, b) => a.sortOrder - b.sortOrder);
        list.forEach((att, idx) => { att.sortOrder = idx; });
      });
    }

    function moveAttachment(uid, dir) {
      const att = project.attachments.find(a => a.uid === uid);
      if (!att) return;
      const peers = groupSorted(groupKey(att));
      const idx   = peers.findIndex(a => a.uid === uid);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= peers.length) return;
      const tmp = peers[idx].sortOrder;
      peers[idx].sortOrder = peers[swapIdx].sortOrder;
      peers[swapIdx].sortOrder = tmp;
      recomputeAllPoz7();
      renderOverview();
    }

    /* ── Poz7 ────────────────────────────────────────────────────── */
    // Priradí poz7 každej prílohe. Prázdne pre A/B, "000" pre AAA/TXT,
    // inak postupné číslovanie v rámci skupiny – revízie zdieľajú číslo koreňa.
    function recomputeAllPoz7() {
      const byGroup = {};
      project.attachments.forEach(a => {
        const gk = groupKey(a);
        if (!byGroup[gk]) byGroup[gk] = [];
        byGroup[gk].push(a);
      });
      Object.values(byGroup).forEach(list => {
        list.sort((a, b) => {
          if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
          return (a.parentUid ? 1 : 0) - (b.parentUid ? 1 : 0);
        });
      });
      const identityToPoz7 = {}, groupCounters = {};
      Object.values(byGroup).forEach(list => {
        list.forEach(att => {
          if (PARTS_END_AT_POZ6.has(att.part)) { att.poz7 = ""; return; }
          if (att.poz8 === "AAA" || att.poz8 === "TXT") { att.poz7 = "000"; return; }
          const gk      = groupKey(att);
          const rootUid = att.parentUid || att.uid;
          if (identityToPoz7[rootUid] !== undefined) {
            att.poz7 = identityToPoz7[rootUid];
          } else {
            groupCounters[gk] = (groupCounters[gk] || 0) + 1;
            const num = String(groupCounters[gk]).padStart(3, "0");
            identityToPoz7[rootUid] = num;
            att.poz7 = num;
          }
        });
      });
    }

    function computeNextPoz7Preview(scope, part, objectId, poz8) {
      if (PARTS_END_AT_POZ6.has(part)) return "";
      if (poz8 === "AAA" || poz8 === "TXT") return "000";
      const gk = part === "D" ? `D|${objectId || ""}` : part;
      let max = 0;
      project.attachments.forEach(att => {
        if (att.poz7 === "000") return;
        if (groupKey(att) !== gk) return;
        const n = parseInt(att.poz7, 10);
        if (!isNaN(n) && n > max) max = n;
      });
      return String(max + 1).padStart(3, "0");
    }

    function updatePoz7Preview() {
      const scope = getAttachmentScope(), part = attachmentPartSelect.value;
      const objectId = attachmentObjectSelect.value;
      const poz6 = getPoz6Value(), poz8 = poz8Select.value;
      if (PARTS_END_AT_POZ6.has(part)) { poz7Input.value = ""; return; }
      if (!poz6) { poz7Input.value = ""; return; }
      // Pre časti C a E nevyžadujeme poz8
      if (!PARTS_END_AT_POZ7.has(part) && !poz8) { poz7Input.value = ""; return; }
      if (scope === "object" && !objectId) { poz7Input.value = ""; return; }
      poz7Input.value = computeNextPoz7Preview(scope, part, objectId, poz8);
    }

    /* ── Projekt ─────────────────────────────────────────────────── */
    function saveProject() {
      project.name = projectNameInput.value.trim();
      project.id   = idStavbyInput.value.trim();
      project.stupen   = stupenDocSelect.value;
      project.urcenie  = urcenieInput.value.trim();
      project.identKod = identKodSelect.value;
      if (!project.id || !project.stupen) {
        projectStatus.textContent = "Vyplň povinné projektové pozície 1 a 2 (ID stavby a stupeň dokumentácie).";
        projectStatus.style.color = "var(--color-error)"; return;
      }
      projectStatus.textContent = "Projektové údaje uložené. Prefix: " +
        [project.id, project.stupen].join("_") + ". Pozície 3 a 4 sa nastavujú cez stavebné objekty.";
      projectStatus.style.color = "var(--color-text-muted)";
      renderOverview();
    }

    function resetProject() {
      Object.assign(project, { name:"", id:"", stupen:"", urcenie:"", identKod:"", objects:[], attachments:[] });
      projectNameInput.value = ""; idStavbyInput.value = ""; stupenDocSelect.value = "";
      urcenieInput.value = ""; identKodSelect.value = "";
      objectNameInput.value = ""; objectNumberInput.value = "";
      objectUrcenieInput.value = ""; objectIdentKodSelect.value = ""; objectIdentKodSelect.disabled = false;
      objectsTableBody.innerHTML = "";
      attachmentObjectSelect.innerHTML = '<option value="">-- vyber objekt --</option>';
      overviewTableBody.innerHTML = "";
      projectStatus.textContent = "Projekt vyčistený.";
      projectStatus.style.color = "var(--color-text-muted)";
      updateObjectSelectState(); updatePoz6Mode();
    }

    /* ── Objekty ─────────────────────────────────────────────────── */
    function renderObjects() {
      objectsTableBody.innerHTML = "";
      const prevObjectId = attachmentObjectSelect.value;
      attachmentObjectSelect.innerHTML = '<option value="">-- vyber objekt --</option>';

      // Zistiť, ktoré kódy objektov nie sú unikátne (rovnaký kód, rôzne urcenie)
      const codeCounts = {};
      project.objects.forEach(o => { codeCounts[o.code] = (codeCounts[o.code] || 0) + 1; });

      project.objects.forEach(obj => {
        const isDuplCode = codeCounts[obj.code] > 1;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${obj.code}</td>
          <td>${obj.name}</td>
          <td>${obj.type === "S" ? "Stavebný objekt" : "Prevádzkový súbor"}</td>
          <td>${obj.urcenie || "–"}</td>
          <td title="${obj.identKod || ""}">${obj.identKod || "–"}</td>
          <td class="actions-cell">
            <button type="button" class="btn-danger btn-icon" data-obj-action="delete" data-obj-id="${obj.id}" title="Vymazať objekt">✕</button>
          </td>`;
        objectsTableBody.appendChild(tr);
        const opt = document.createElement("option");
        opt.value = obj.id.toString();
        opt.textContent = isDuplCode ? `${obj.code} [${obj.urcenie}] – ${obj.name}` : `${obj.code} – ${obj.name}`;
        attachmentObjectSelect.appendChild(opt);
      });
      if (prevObjectId) attachmentObjectSelect.value = prevObjectId;
      updateObjectSelectState(); updatePoz6Mode();
    }

    function handleObjectsClick(event) {
      const btn = event.target.closest("button[data-obj-action]");
      if (!btn || btn.getAttribute("data-obj-action") !== "delete") return;
      const objId = btn.getAttribute("data-obj-id");
      const obj   = project.objects.find(o => o.id.toString() === objId);
      if (!obj) return;
      const hasAtt = project.attachments.some(a => a.objectId === objId);
      if (hasAtt && !confirm(`Objekt "${obj.code} – ${obj.name}" má priradené prílohy. Vymazaním objektu sa tieto prílohy tiež vymažú. Pokračovať?`)) return;
      if (hasAtt) project.attachments = project.attachments.filter(a => a.objectId !== objId);
      project.objects = project.objects.filter(o => o.id.toString() !== objId);
      if (attachmentObjectSelect.value === objId) attachmentObjectSelect.value = "";
      recomputeAllPoz7(); renderObjects(); renderOverview(); updatePoz7Preview();
    }

    function addObject() {
      const name = objectNameInput.value.trim(), number = objectNumberInput.value.trim();
      const type = getSelectedObjectType();
      const urcenie = objectUrcenieInput.value.trim();
      let identKod = objectIdentKodSelect.value;
      if (!name || !number) { alert("Vyplň názov aj číslo objektu / súboru."); return; }
      if (!urcenie || !/^[0-9]{2}$/.test(urcenie)) { alert("Vyplň pozíciu 3 (dvojciferný kód, napr. 01)."); return; }
      // Auto-inherit identKod from existing object with same urcenie
      if (!identKod) {
        const sameUrcenie = project.objects.find(o => o.urcenie === urcenie && o.identKod);
        if (sameUrcenie) { identKod = sameUrcenie.identKod; objectIdentKodSelect.value = identKod; }
      }
      if (!identKod) { alert("Vyplň pozíciu 4 (identifikačný kód stavby)."); return; }
      const normalizedNumber = number.padStart(2, "0");
      const code = type + normalizedNumber;
      if (project.objects.some(o => o.code === code && o.urcenie === urcenie)) {
        alert(`Objekt s kódom "${code}" a pozíciou 3 "${urcenie}" už existuje.`); return;
      }
      project.objects.push({ id: genUid(), name, number: normalizedNumber, type, code, urcenie, identKod });
      sortObjects();
      objectNameInput.value = ""; objectNumberInput.value = ""; objectUrcenieInput.value = "";
      objectIdentKodSelect.value = ""; objectIdentKodSelect.disabled = false;
      document.getElementById("objectUrcenieHelp").textContent =
        "Dvojciferný kód (01, 02…). Ak existuje objekt s rovnakou pozíciou 3, zdedí sa pozícia 4 automaticky.";
      renderObjects();
    }

    /* ── Prílohy ─────────────────────────────────────────────────── */
    function addAttachment() {
      attachmentError.textContent = "";
      if (!project.id || !project.stupen) {
        attachmentError.textContent = "Najprv ulož projektové údaje (pozície 1 – 2)."; return;
      }
      const scope = getAttachmentScope(), part = attachmentPartSelect.value;
      const objectId = attachmentObjectSelect.value;
      const poz6 = getPoz6Value();
      const title = attachmentTitleInput.value.trim();

      // Pre časti A/B/C/E skontroluj či existuje referenčný objekt S01
      if (part !== "D") {
        const base = getBaseObject();
        if (!base || !base.urcenie || !base.identKod) {
          attachmentError.textContent = "Pre časti A, B, C, E musí existovať stavebný objekt S01 s nastavenou pozíciou 3 a 4."; return;
        }
      }
      // Časti A a B môžu existovať iba raz
      if (part === "A" || part === "B") {
        if (project.attachments.some(a => a.part === part && !a.parentUid)) {
          attachmentError.textContent = `Časť ${part} môže existovať iba raz. Ak chceš zmenu, použi revíziu existujúcej prílohy.`; return;
        }
      }

      if (!poz6) { attachmentError.textContent = "Vyplň pozíciu 6."; return; }
      if (poz6Mode === "input") {
        if (!/^[0-9]{3}$/.test(poz6)) { attachmentError.textContent = "Pozícia 6 musí byť presne 3-ciferné číslo (napr. 001)."; return; }
      } else {
        if (!allowedPoz6.has(poz6)) { attachmentError.textContent = "Pozícia 6 obsahuje nepovolený kód."; return; }
      }

      // Pre časti A a B (koniec na poz6) a C a E (koniec na poz7) pozícia 8 nie je aktívna
      const poz8 = (PARTS_END_AT_POZ6.has(part) || PARTS_END_AT_POZ7.has(part)) ? "" : poz8Select.value;
      if (!PARTS_END_AT_POZ6.has(part) && !PARTS_END_AT_POZ7.has(part)) {
        if (!poz8) { attachmentError.textContent = "Vyplň pozíciu 8."; return; }
        if (!allowedPoz8.has(poz8)) { attachmentError.textContent = "Pozícia 8 obsahuje nepovolený typ dokumentu."; return; }
      }

      if (scope === "object" && !objectId) { attachmentError.textContent = "Pre prílohu k časti D vyber konkrétny stavebný objekt."; return; }
      const poz5 = derivePozicia5(scope, part, objectId);
      if (!poz5) { attachmentError.textContent = "Nebolo možné odvodiť pozíciu 5."; return; }
      const newAtt = { uid: genUid(), parentUid: null, scope, part, objectId: scope === "object" ? objectId : null,
        poz5, poz6, poz7: PARTS_END_AT_POZ6.has(part) ? "" : "???", poz8, poz9: "00", title, sortOrder: 0 };
      newAtt.sortOrder = nextSortOrder(groupKey(newAtt));
      project.attachments.push(newAtt);
      recomputeAllPoz7(); renderOverview(); clearAttachmentFormAfterAdd();
    }

    function createRevision(uid) {
      const base = project.attachments.find(a => a.uid === uid);
      if (!base) return;
      const rootUid = base.parentUid || base.uid;
      let maxRev = -1;
      project.attachments.forEach(att => {
        if ((att.parentUid || att.uid) === rootUid) {
          const n = parseInt(att.poz9, 10);
          if (!isNaN(n) && n > maxRev) maxRev = n;
        }
      });
      const newRev = String(maxRev + 1).padStart(2, "0");
      const rev = { uid: genUid(), parentUid: rootUid, scope: base.scope, part: base.part,
        objectId: base.objectId, poz5: base.poz5, poz6: base.poz6, poz7: base.poz7,
        poz8: base.poz8, poz9: newRev, title: base.title, sortOrder: nextSortOrder(groupKey(base)) };
      project.attachments.push(rev);
      recomputeAllPoz7(); renderOverview();
    }

    function clearAttachmentFormAfterAdd() {
      const el = getPoz6El();
      if (el) el.value = "";
      if (poz6Mode === "select") {
        const allowed = POZ6_ALLOWED_BY_PART[attachmentPartSelect.value];
        if (allowed && allowed.length === 1) setPoz6Value(allowed[0]);
      }
      poz8Select.value = ""; poz9Input.value = "00"; attachmentTitleInput.value = "";
      attachmentError.textContent = ""; updatePoz7Preview();
    }

    function clearAttachmentForm() {
      attachmentPartSelect.value = "A"; poz8Select.value = ""; poz9Input.value = "00";
      attachmentTitleInput.value = ""; attachmentError.textContent = "";
      updateObjectSelectState(); updatePoz6Mode();
    }

    /* ── Render prehľadu ─────────────────────────────────────────── */
    function getBaseObject() {
      // Referenčný objekt S01 – zdroj pozícií 3 a 4 pre časti A, B, C, E
      const s01 = project.objects.find(o => o.type === "S" && o.number === "01");
      return s01 || project.objects.find(o => o.type === "S") || project.objects[0] || null;
    }

    function buildFilename(att) {
      if (!project.id || !project.stupen)
        return "(projektové pozície 1–2 nie sú kompletné)";

      let urcenie, identKod;
      if (att.part === "D" && att.objectId) {
        // Pre časť D: pozície 3 a 4 z konkrétneho stavebného objektu
        const obj = project.objects.find(o => o.id.toString() === att.objectId);
        urcenie   = obj ? obj.urcenie   : "";
        identKod  = obj ? obj.identKod  : "";
      } else {
        // Pre časti A, B, C, E: pozície 3 a 4 z referenčného objektu S01
        const base = getBaseObject();
        urcenie   = base ? base.urcenie  : "";
        identKod  = base ? base.identKod : "";
      }

      if (!urcenie || !identKod)
        return "(pozície 3–4 nie sú nastavené – pridaj stavebný objekt S01)";

      const parts = [project.id, project.stupen, urcenie, identKod, att.poz5, att.poz6];
      // Pre časti A a B kódovanie končí na pozícii 6
      if (PARTS_END_AT_POZ6.has(att.part)) {
        return parts.join("_");
      }
      // Pre časti C a E kódovanie končí na pozícii 7
      if (PARTS_END_AT_POZ7.has(att.part)) {
        parts.push(att.poz7);
        if (att.poz9 !== "00") parts.push(att.poz9);
        return parts.join("_");
      }
      // Pre časť D pokračuje poz8
      parts.push(att.poz7, att.poz8);
      if (att.poz9 !== "00") parts.push(att.poz9);
      return parts.join("_");
    }

    function appendHeaderRow(className, label) {
      const tr = document.createElement("tr");
      tr.className = className;
      const td = document.createElement("td");
      td.colSpan = OVERVIEW_COLS; td.textContent = label;
      tr.appendChild(td);
      overviewTableBody.appendChild(tr);
    }

    function mutedDash() { return `<span style="color:var(--color-text-muted)">–</span>`; }

    function appendAttachmentRow(att, isFirst, isLast) {
      const tr = document.createElement("tr");
      if (att.parentUid) tr.classList.add("is-revision");
      const filename = buildFilename(att);
      const rev9display = att.poz9 === "00"
        ? mutedDash()
        : `${att.poz9}<span class="rev-badge">rev. ${att.poz9}</span>`;
      const poz7display = PARTS_END_AT_POZ6.has(att.part) ? mutedDash() : att.poz7;
      const poz8display = (PARTS_END_AT_POZ6.has(att.part) || PARTS_END_AT_POZ7.has(att.part)) ? mutedDash() : att.poz8;
      tr.innerHTML = `
        <td>${att.poz6}</td>
        <td>${poz7display}</td>
        <td>${poz8display}</td>
        <td>${rev9display}</td>
        <td><code style="font-size:0.78rem;word-break:break-all">${filename}</code></td>
        <td>${att.title || ""}</td>
        <td class="actions-cell">
          <button type="button" class="btn-move" data-action="move-up"   data-uid="${att.uid}" title="Presunúť nahor"   ${isFirst ? "disabled" : ""}>▲</button>
          <button type="button" class="btn-move" data-action="move-down" data-uid="${att.uid}" title="Presunúť nadol"   ${isLast  ? "disabled" : ""}>▼</button>
          <button type="button" class="btn-revision" data-action="revision" data-uid="${att.uid}" title="Vytvoriť revíziu tejto prílohy">＋ Revízia</button>
          <button type="button" class="btn-secondary btn-icon" data-action="delete" data-uid="${att.uid}" title="Vymazať">✕</button>
        </td>`;
      overviewTableBody.appendChild(tr);
    }

    function renderAttachmentList(atts) {
      const sorted = [...atts].sort((a, b) => a.sortOrder - b.sortOrder);
      sorted.forEach((att, i) => appendAttachmentRow(att, i === 0, i === sorted.length - 1));
    }

    function renderOverview() {
      overviewTableBody.innerHTML = "";
      const byPart = {};
      PART_ORDER.forEach(p => { byPart[p] = []; });
      project.attachments.forEach(att => { if (byPart[att.part]) byPart[att.part].push(att); });

      PART_ORDER.forEach(part => {
        const atts = byPart[part];
        if (!atts.length) return;
        appendHeaderRow("section-header", PART_LABELS[part] || part);

        if (part !== "D") {
          renderAttachmentList(atts);
          return;
        }

        // Zoskupiť objekty podľa pozície 3 (urcenie), zoradiť urcenie hodnoty
        const urcenieGroups = {};
        project.objects.forEach(obj => {
          const u = obj.urcenie || "";
          if (!urcenieGroups[u]) urcenieGroups[u] = [];
          urcenieGroups[u].push(obj);
        });
        const sortedUrcenie = Object.keys(urcenieGroups).sort();
        const multipleUrcenie = sortedUrcenie.length > 1;

        sortedUrcenie.forEach(urcenie => {
          const objsInGroup = urcenieGroups[urcenie];
          // Skontrolovať, či má táto skupina vôbec nejaké prílohy
          const groupHasAtts = objsInGroup.some(obj =>
            atts.some(a => a.objectId === obj.id.toString())
          );
          if (!groupHasAtts) return;

          if (multipleUrcenie) {
            const identKod = objsInGroup[0] ? objsInGroup[0].identKod : "";
            appendHeaderRow("urcenie-header", `Stavba: ${urcenie}${identKod ? "  |  Identifikačný kód: " + identKod : ""}`);
          }

          objsInGroup.forEach(obj => {
            const objAtts = atts.filter(a => a.objectId === obj.id.toString());
            if (!objAtts.length) return;
            appendHeaderRow("subsection-header", `${obj.code} – ${obj.name}`);
            renderAttachmentList(objAtts);
          });
        });

        const noObj = atts.filter(a => !a.objectId);
        if (noObj.length) {
          appendHeaderRow("subsection-header", "(bez priradeného objektu)");
          renderAttachmentList(noObj);
        }
      });
    }

    function handleOverviewClick(event) {
      const btn = event.target.closest("button[data-action]");
      if (!btn || btn.disabled) return;
      const action = btn.getAttribute("data-action");
      const uid    = btn.getAttribute("data-uid");
      if (!uid) return;
      if      (action === "move-up")   moveAttachment(uid, -1);
      else if (action === "move-down") moveAttachment(uid,  1);
      else if (action === "revision")  createRevision(uid);
      else if (action === "delete") {
        project.attachments = project.attachments.filter(a => a.uid !== uid);
        recomputeAllPoz7(); renderOverview();
      }
    }

    /* ── CSV ─────────────────────────────────────────────────────── */
    function exportCsv() {
      const rows = [];
      rows.push(["TYPE","projectName","idStavby","stupenDoc","urcenie","identKod",
        "objectId","objectName","objectNumber","objectType","objectUrcenie","objectIdentKod",
        "scope","part","poz5","poz6","poz7","poz8","poz9","title","attachmentObjectId","uid","parentUid","sortOrder"]);
      rows.push(["PROJECT", project.name, project.id, project.stupen, project.urcenie, project.identKod,
        "","","","","","","","","","","","","","","","","",""]);
      project.objects.forEach(obj =>
        rows.push(["OBJECT","","","","","",obj.id,obj.name,obj.number,obj.type,obj.urcenie||"",obj.identKod||"","","","","","","","","","","","",""]));
      project.attachments.forEach(att =>
        rows.push(["ATTACHMENT","","","","","","","","","","","",
          att.scope,att.part,att.poz5,att.poz6,att.poz7,att.poz8,att.poz9,att.title||"",
          att.objectId||"",att.uid||"",att.parentUid||"",att.sortOrder ?? 0]));
      const csv  = rows.map(r => r.map(csvEscape).join(";")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = (project.name ? project.name.replace(/\s+/g, "_") : "zoznam_priloh") + ".csv";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      csvStatus.textContent = "CSV bolo exportované.";
    }

    function importCsvFile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const text  = String(e.target.result || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
          const lines = text.split("\n").filter(l => l.trim() !== "");
          if (lines.length < 2) throw new Error("CSV je prázdne alebo neplatné.");
          const rows = lines.map(parseCsvLine), header = rows[0];
          if (!header.length || header[0] !== "TYPE") throw new Error("CSV nemá očakávanú hlavičku.");

          const hasSortOrderCol = header.length > 23 && header[23] === "sortOrder";

          Object.assign(project, { name:"", id:"", stupen:"", urcenie:"", identKod:"", objects:[], attachments:[] });
          const objectIdMap = new Map(), uidMap = new Map();
          const groupRowCounter = {};

          rows.slice(1).forEach(cols => {
            const type = cols[0] || "";
            if (type === "PROJECT") {
              project.name = cols[1]||""; project.id = cols[2]||""; project.stupen = cols[3]||"";
              project.urcenie = cols[4]||""; project.identKod = cols[5]||"";
            } else if (type === "OBJECT") {
              const oldId = cols[6]||"", newId = genUid();
              const obj = { id: newId, name: cols[7]||"", number: (cols[8]||"").padStart(2,"0"), type: cols[9]||"S",
                urcenie: cols[10]||"", identKod: cols[11]||"" };
              obj.code = obj.type + obj.number;
              project.objects.push(obj); objectIdMap.set(String(oldId), String(newId));
            } else if (type === "ATTACHMENT") {
              const rawObjId  = cols[20] ? cols[20].trim() : "";
              const objectId  = rawObjId ? (objectIdMap.get(rawObjId) || null) : null;
              const csvUid    = cols[21] ? cols[21].trim() : "";
              const csvParent = cols[22] ? cols[22].trim() : "";
              const newUid    = csvUid || genUid();
              if (csvUid) uidMap.set(csvUid, newUid);

              let sortOrder;
              if (hasSortOrderCol && cols[23] !== undefined && cols[23].trim() !== "") {
                const parsed = parseInt(cols[23], 10);
                sortOrder = isNaN(parsed) ? 0 : parsed;
              } else {
                const rawPart = cols[13] || "A";
                const tempGk  = rawPart === "D" ? `D|${rawObjId}` : rawPart;
                if (groupRowCounter[tempGk] === undefined) groupRowCounter[tempGk] = 0;
                sortOrder = groupRowCounter[tempGk]++;
              }

              project.attachments.push({
                uid: newUid, parentUid: null,
                scope: cols[12]||"project", part: cols[13]||"A",
                poz5: cols[14]||"", poz6: cols[15]||"", poz7: cols[16]||"",
                poz8: cols[17]||"", poz9: cols[18]||"00", title: cols[19]||"",
                objectId, sortOrder, _csvParent: csvParent
              });
            }
          });

          project.attachments.forEach(att => {
            if (att._csvParent) att.parentUid = uidMap.get(att._csvParent) || att._csvParent;
            delete att._csvParent;
          });

          sortObjects();
          normalizeSortOrders();
          recomputeAllPoz7();

          projectNameInput.value = project.name; idStavbyInput.value = project.id;
          stupenDocSelect.value = project.stupen; urcenieInput.value = project.urcenie;
          identKodSelect.value = project.identKod;
          renderObjects(); renderOverview();
          projectStatus.textContent = "Projektové údaje načítané z CSV."; projectStatus.style.color = "var(--color-text-muted)";
          csvStatus.textContent = "CSV bolo úspešne importované.";
        } catch (err) {
          csvStatus.textContent = "Chyba importu CSV: " + err.message;
        } finally { importCsvInput.value = ""; }
      };
      reader.readAsText(file, "utf-8");
    }

    function syncIdentKodToUrcenie() {
      const urcenie = objectUrcenieInput.value.trim();
      const helpEl  = document.getElementById("objectUrcenieHelp");
      if (!urcenie) {
        objectIdentKodSelect.disabled = false;
        objectIdentKodSelect.value    = "";
        helpEl.textContent = "Dvojciferný kód (01, 02…). Ak existuje objekt s rovnakou pozíciou 3, zdedí sa pozícia 4 automaticky.";
        return;
      }
      const existing = project.objects.find(o => o.urcenie === urcenie && o.identKod);
      if (existing) {
        objectIdentKodSelect.value    = existing.identKod;
        objectIdentKodSelect.disabled = true;
        helpEl.textContent = "Pozícia 4 je zdedená z objektu " + existing.code + " a nie je možné ju zmeniť.";
      } else {
        objectIdentKodSelect.disabled = false;
        helpEl.textContent = "Prvý objekt s touto pozíciou 3 – vyber pozíciu 4 manuálne. Ďalšie objekty ju automaticky zdedia.";
      }
    }

    /* ── Event listenery ─────────────────────────────────────────── */
    document.getElementById("saveProjectBtn").addEventListener("click", saveProject);
    document.getElementById("resetProjectBtn").addEventListener("click", resetProject);
    addObjectBtn.addEventListener("click", addObject);
    objectsTableBody.addEventListener("click", handleObjectsClick);
    objectUrcenieInput.addEventListener("input", syncIdentKodToUrcenie);
    addAttachmentBtn.addEventListener("click", addAttachment);
    clearAttachmentFormBtn.addEventListener("click", clearAttachmentForm);
    attachmentPartSelect.addEventListener("change", () => { updateObjectSelectState(); updatePoz6Mode(); });
    attachmentObjectSelect.addEventListener("change", () => { updatePoz6Mode(); updatePoz7Preview(); });
    overviewTableBody.addEventListener("click", handleOverviewClick);
    poz8Select.addEventListener("change", updatePoz7Preview);
    exportCsvBtn.addEventListener("click", exportCsv);
    importCsvInput.addEventListener("change", importCsvFile);

    updateObjectSelectState();
    updatePoz6Mode();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAlod);
  } else {
    initAlod();
  }
})();
