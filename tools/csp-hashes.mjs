// Recalcula os hashes CSP dos <script> inline do index.html.
//
// O netlify.toml lista esses hashes em script-src. Se um bloco inline mudar
// (mesmo que so o espacamento), o hash antigo para de bater e o browser
// bloqueia o script -- silenciosamente, sem quebrar o resto da pagina. Rode
// este arquivo depois de mexer em qualquer script inline e copie a saida
// para o netlify.toml:
//
//   node tools/csp-hashes.mjs
//
// Blocos <script type="application/ld+json"> sao data blocks, nao executam,
// e por isso nao entram na conta -- o CSP nao os bloqueia.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FILE = new URL("../index.html", import.meta.url);

// O parser HTML normaliza CRLF -> LF antes de montar o texto do script, entao
// o hash tem que ser calculado sobre LF mesmo que o arquivo esteja em CRLF.
const html = readFileSync(FILE, "utf8").replace(/\r\n?/g, "\n");

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

let found = 0;
for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
  const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs)?.[1]?.toLowerCase();
  if (type && type !== "text/javascript" && type !== "module") continue; // data block
  const hash = createHash("sha256").update(body, "utf8").digest("base64");
  const firstLine = body.trim().split("\n")[0].slice(0, 60);
  console.log(`'sha256-${hash}'  // ${firstLine}`);
  found++;
}

if (!found) console.log("(nenhum script inline encontrado)");
