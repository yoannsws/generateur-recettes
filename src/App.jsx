import { useState, useEffect } from "react";

const GREEN = { bg: "#f0f7f0", border: "#4a9e6b", text: "#2d6e47", light: "#e1f0e5", dark: "#1e5c38", mid: "#4a9e6b" };

const CODES = ["YOAHUCK26", "LUDTHEPIN26", "ASTCOLMENARES26", "ALEMARNEUR26", "CAPPERRON26"];
const MAX_FAVS = 8;

const DIETS = ["Aucun", "Végétarien", "Sans gluten"];
const TASTE = ["Salé", "Sucré"];
const TEMP = ["Chaud", "Froid"];

const defaultForm = { calories: "", proteins: "", carbs: "", fats: "", diet: "Aucun", taste: "", temp: "", mode: "", ingredients: "", principal: "" };

const getFavKey = code => `favs_${code}`;

const loadFavs = (code) => {
  try {
    const raw = localStorage.getItem(getFavKey(code));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveFavs = (code, favs) => {
  try { localStorage.setItem(getFavKey(code), JSON.stringify(favs)); } catch {}
};

const Chip = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "9px 18px", fontSize: 14, borderRadius: 24, cursor: "pointer",
    fontWeight: active ? 500 : 400,
    background: active ? GREEN.mid : "transparent",
    color: active ? "#fff" : "#333",
    border: active ? `2px solid ${GREEN.mid}` : "1.5px solid #ccc",
    transition: "all 0.15s",
  }}>{label}</button>
);

const Btn = ({ children, onClick, disabled, variant = "primary", style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "11px 16px", fontSize: 14, borderRadius: "8px", cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 500, border: "2px solid",
    background: variant === "primary" ? GREEN.mid : "transparent",
    color: variant === "primary" ? "#fff" : "#666",
    borderColor: variant === "primary" ? GREEN.mid : "#ccc",
    opacity: disabled ? 0.4 : 1, transition: "opacity 0.15s",
    ...style,
  }}>{children}</button>
);

const ModeCard = ({ title, desc, active, onClick, icon }) => (
  <div onClick={onClick} style={{
    padding: "16px", borderRadius: "12px", cursor: "pointer",
    border: active ? `2px solid ${GREEN.mid}` : "1.5px solid #ccc",
    background: active ? GREEN.bg : "#fff",
    transition: "all 0.15s",
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? GREEN.mid : "#f0f0f0",
        color: active ? "#fff" : "#888", fontSize: 18,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: "0 0 3px", fontWeight: 500, fontSize: 14, color: active ? GREEN.dark : "#333" }}>{title}</p>
        <p style={{ margin: 0, fontSize: 13, color: active ? GREEN.text : "#888", lineHeight: 1.4 }}>{desc}</p>
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
        border: active ? `6px solid ${GREEN.mid}` : "2px solid #ccc",
        background: "#fff", boxSizing: "border-box",
      }} />
    </div>
  </div>
);

const steps = ["Macros", "Préférences", "Recette", "Résultat"];

function Login({ onLogin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (CODES.includes(code.toUpperCase().trim())) {
      onLogin(code.toUpperCase().trim());
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: "2rem 1.5rem", textAlign: "center", background: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: "50%", background: GREEN.bg, marginBottom: 16 }}>
        <span style={{ fontSize: 26 }}>🥗</span>
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 500, color: "#222" }}>Générateur de recettes</p>
      <p style={{ margin: "0 0 32px", fontSize: 13, color: "#888" }}>Entre ton code d'accès pour continuer</p>
      <input
        type="password"
        placeholder="Code d'accès"
        value={code}
        onChange={e => setCode(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleLogin()}
        style={{ width: "100%", boxSizing: "border-box", marginBottom: 12, textAlign: "center", fontSize: 16, letterSpacing: "0.1em", padding: "11px 12px", border: `1.5px solid ${error ? "#e53e3e" : GREEN.mid}`, borderRadius: 8, outline: "none" }}
      />
      {error && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 8 }}>Code incorrect. Réessaie.</p>}
      <button onClick={handleLogin} style={{
        width: "100%", padding: "11px", fontSize: 14, fontWeight: 500, borderRadius: 8,
        background: GREEN.mid, color: "#fff", border: "none", cursor: "pointer",
      }}>Accéder à l'outil</button>
      <p style={{ marginTop: 20, fontSize: 12, color: "#bbb" }}>Accès réservé aux clients Smart Way System</p>
    </div>
  );
}

function FavCard({ recipe, onRemove, onCopy }) {
  return (
    <div style={{ border: "0.5px solid #eee", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: GREEN.dark }}>{recipe.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: GREEN.text }}>{recipe.description}</p>
        </div>
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#ccc", padding: "0 0 0 8px" }}>✕</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
        {[
          { label: "Kcal", val: recipe.nutrition?.calories },
          { label: "P", val: recipe.nutrition?.proteins + "g" },
          { label: "G", val: recipe.nutrition?.carbs + "g" },
          { label: "L", val: recipe.nutrition?.fats + "g" },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: GREEN.bg, borderRadius: 6, padding: "6px 4px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 10, color: GREEN.text }}>{label}</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: GREEN.dark }}>{val}</p>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 10, borderTop: "0.5px solid #eee", paddingTop: 8 }}>
        {recipe.ingredients?.map((ing, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "0.5px solid #f5f5f5" }}>
            <span style={{ fontSize: 13, color: "#333" }}>{ing.name}</span>
            <span style={{ fontSize: 13, color: GREEN.text, fontWeight: 500 }}>{ing.quantity}</span>
          </div>
        ))}
      </div>
      <button onClick={onCopy} style={{
        width: "100%", padding: "8px", fontSize: 13, fontWeight: 500, borderRadius: 8,
        background: "transparent", color: GREEN.text, border: `1.5px solid ${GREEN.mid}`, cursor: "pointer",
      }}>Copier la recette</button>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [favs, setFavs] = useState([]);
  const [view, setView] = useState("generator");
  const [favAdded, setFavAdded] = useState(false);

  useEffect(() => {
    if (userCode) setFavs(loadFavs(userCode));
  }, [userCode]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext1 = form.calories && form.proteins && form.carbs && form.fats;
  const canNext2 = form.taste && form.temp;
  const canGenerate =
    form.mode === "ia" ||
    (form.mode === "principal" && form.principal?.trim().length > 1) ||
    (form.mode === "ingredients" && form.ingredients.trim().length > 2);

  const buildPrompt = () => {
    const macros = `Objectif : ${form.calories} kcal, ${form.proteins}g protéines, ${form.carbs}g glucides, ${form.fats}g lipides.`;
    const diet = form.diet !== "Aucun" ? `Régime : ${form.diet}.` : "";
    const taste = `${form.taste}. ${form.temp}.`;
    const modeText = form.mode === "ia"
      ? "Crée une recette simple, bonne et facile à préparer. Max 5 ingrédients du quotidien. Inclus un légume de saison."
      : form.mode === "principal"
      ? `L'ingrédient principal est : ${form.principal}. Compose une recette simple et savoureuse autour de cet aliment avec 4 à 5 ingrédients complémentaires qui se marient bien. Inclus un légume de saison.`
      : `Utilise UNIQUEMENT ces ingrédients : ${form.ingredients}. N'ajoute rien d'autre. Choisis 5 max. Inclus un légume si disponible.`;
    return `Tu es un coach nutritionniste. ${macros} ${diet} ${taste} ${modeText}\n\nRéponds UNIQUEMENT en JSON valide, sans markdown, sans texte avant ou après.\n{\n  "name": "Nom court",\n  "description": "5 mots max",\n  "ingredients": [{"name": "Ingrédient", "quantity": "Quantité"}],\n  "steps": ["Étape courte"],\n  "nutrition": {"calories": 0, "proteins": 0, "carbs": 0, "fats": 0}\n}`;
  };

  const generate = async () => {
    setLoading(true); setError(null); setResult(null); setFavAdded(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: buildPrompt() }] }),
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setStep(4);
    } catch { setError("Une erreur est survenue. Réessaie."); }
    setLoading(false);
  };

  const reset = () => { setForm(defaultForm); setResult(null); setStep(1); setError(null); setFavAdded(false); };

  const addToFavs = () => {
    if (!result || favs.length >= MAX_FAVS) return;
    const newFavs = [...favs, { ...result, id: Date.now() }];
    setFavs(newFavs);
    saveFavs(userCode, newFavs);
    setFavAdded(true);
  };

  const removeFromFavs = (id) => {
    const newFavs = favs.filter(f => f.id !== id);
    setFavs(newFavs);
    saveFavs(userCode, newFavs);
  };

  const copyRecipeText = (recipe) => {
    const txt = [
      recipe.name, recipe.description, "",
      "Ingrédients :",
      ...recipe.ingredients.map(i => `- ${i.name} : ${i.quantity}`),
      "", "Préparation :",
      ...recipe.steps.map((s, i) => `${i + 1}. ${s}`),
      "", `Estimation : ${recipe.nutrition?.calories} kcal | P: ${recipe.nutrition?.proteins}g | G: ${recipe.nutrition?.carbs}g | L: ${recipe.nutrition?.fats}g`,
    ].join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }).catch(() => fallbackCopy(txt));
    } else { fallbackCopy(txt); }
  };

  const fallbackCopy = (txt) => {
    const el = document.createElement("textarea");
    el.value = txt; el.style.position = "fixed"; el.style.opacity = "0";
    document.body.appendChild(el); el.focus(); el.select();
    try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
    document.body.removeChild(el);
  };

  if (!auth) return <Login onLogin={(code) => { setAuth(true); setUserCode(code); }} />;

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: GREEN.bg, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>🥗</span>
        </div>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 500, color: "#222" }}>Générateur de recettes</p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: "#888" }}>Adapté à tes macros</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <button onClick={() => setView("generator")} style={{
          flex: 1, padding: "10px", fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: "pointer",
          background: view === "generator" ? GREEN.mid : "transparent",
          color: view === "generator" ? "#fff" : "#666",
          border: view === "generator" ? `2px solid ${GREEN.mid}` : "1.5px solid #ccc",
        }}>Générer une recette</button>
        <button onClick={() => setView("favs")} style={{
          flex: 1, padding: "10px", fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: "pointer",
          background: view === "favs" ? GREEN.mid : "transparent",
          color: view === "favs" ? "#fff" : "#666",
          border: view === "favs" ? `2px solid ${GREEN.mid}` : "1.5px solid #ccc",
          position: "relative",
        }}>
          Mes favoris {favs.length > 0 && <span style={{ marginLeft: 4, background: view === "favs" ? "#fff" : GREEN.mid, color: view === "favs" ? GREEN.mid : "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>{favs.length}/{MAX_FAVS}</span>}
        </button>
      </div>

      {view === "favs" && (
        <div>
          {favs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#aaa" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>★</p>
              <p style={{ fontSize: 14 }}>Aucun favori pour l'instant.</p>
              <p style={{ fontSize: 13 }}>Génère une recette et ajoute-la ici.</p>
            </div>
          ) : (
            <>
              {favs.length >= MAX_FAVS && (
                <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#b8860b" }}>
                  Limite atteinte (8/8). Supprime une recette pour en ajouter une nouvelle.
                </div>
              )}
              {favs.map(r => (
                <FavCard
                  key={r.id}
                  recipe={r}
                  onRemove={() => removeFromFavs(r.id)}
                  onCopy={() => copyRecipeText(r)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {view === "generator" && (
        <>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
            {steps.map((label, i) => {
              const n = i + 1; const done = step > n; const active = step === n;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 500,
                      background: done ? GREEN.mid : active ? GREEN.bg : "#f0f0f0",
                      color: done ? "#fff" : active ? GREEN.dark : "#aaa",
                      border: active ? `2px solid ${GREEN.mid}` : done ? "none" : "1.5px solid #ddd",
                    }}>{done ? "✓" : n}</div>
                    <span style={{ fontSize: 11, color: active ? GREEN.text : "#aaa", whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 2, background: done ? GREEN.mid : "#eee", margin: "0 4px", marginBottom: 16, borderRadius: 2 }} />}
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, color: "#222" }}>Objectif de la prise alimentaire</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Calories (kcal)", key: "calories", placeholder: "ex. 2000" },
                  { label: "Protéines (g)", key: "proteins", placeholder: "ex. 150" },
                  { label: "Glucides (g)", key: "carbs", placeholder: "ex. 200" },
                  { label: "Lipides (g)", key: "fats", placeholder: "ex. 70" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 5 }}>{label}</label>
                    <input type="number" placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${form[key] ? GREEN.mid : "#ccc"}`, borderRadius: 8, fontSize: 14, outline: "none" }} />
                  </div>
                ))}
              </div>
              <Btn onClick={() => setStep(2)} disabled={!canNext1} style={{ width: "100%" }}>Suivant →</Btn>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, color: "#222" }}>Tes préférences</p>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Régime alimentaire</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {DIETS.map(d => <Chip key={d} label={d} active={form.diet === d} onClick={() => set("diet", d)} />)}
              </div>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Sucré ou salé ?</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {TASTE.map(t => <Chip key={t} label={t} active={form.taste === t} onClick={() => set("taste", t)} />)}
              </div>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Chaud ou froid ?</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                {TEMP.map(t => <Chip key={t} label={t} active={form.temp === t} onClick={() => set("temp", t)} />)}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Retour</Btn>
                <Btn onClick={() => setStep(3)} disabled={!canNext2} style={{ flex: 2 }}>Suivant →</Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, color: "#222" }}>Comment on génère ta recette ?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <ModeCard title="Inspiration IA" desc="Pas d'idée ? L'IA te propose une recette simple et efficace" active={form.mode === "ia"} onClick={() => set("mode", "ia")} icon="✦" />
                <ModeCard title="Ingrédient principal" desc="Tu choisis un aliment de base, l'IA construit la recette autour" active={form.mode === "principal"} onClick={() => set("mode", "principal")} icon="★" />
                <ModeCard title="Mes aliments" desc="Tu fournis ta liste, l'IA compose avec ce que tu as" active={form.mode === "ingredients"} onClick={() => set("mode", "ingredients")} icon="☰" />
              </div>

              {form.mode === "principal" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Ton ingrédient principal</label>
                  <input type="text" placeholder="ex. saumon, poulet, lentilles, riz..." value={form.principal} onChange={e => set("principal", e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1.5px solid ${GREEN.mid}`, borderRadius: 8, fontSize: 14, background: GREEN.bg, color: "#333", outline: "none" }} />
                </div>
              )}

              {form.mode === "ingredients" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Tes aliments disponibles</label>
                  <textarea placeholder="ex. poulet, riz, courgettes, huile d'olive, œufs..." value={form.ingredients}
                    onChange={e => set("ingredients", e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.stopPropagation(); }}
                    rows={5}
                    style={{ width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "system-ui, sans-serif", fontSize: 14, padding: "10px 12px", border: `1.5px solid ${GREEN.mid}`, borderRadius: 8, background: GREEN.bg, color: "#333", lineHeight: 1.6, outline: "none" }} />
                  <p style={{ fontSize: 12, color: "#aaa", margin: "4px 0 0" }}>Sépare les aliments par des virgules ou des sauts de ligne.</p>
                </div>
              )}

              {error && <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>← Retour</Btn>
                <Btn onClick={generate} disabled={!canGenerate || loading} style={{ flex: 2 }}>
                  {loading ? "Génération..." : "Générer la recette"}
                </Btn>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div>
              <div style={{ background: GREEN.bg, borderRadius: 12, padding: "16px 18px", marginBottom: 16, borderLeft: `4px solid ${GREEN.mid}` }}>
                <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 500, color: GREEN.dark }}>{result.name}</p>
                <p style={{ margin: 0, fontSize: 13, color: GREEN.text, lineHeight: 1.5 }}>{result.description}</p>
              </div>

              <p style={{ fontSize: 11, fontWeight: 500, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Estimation nutritionnelle</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginBottom: 20 }}>
                {[
                  { label: "Calories", val: result.nutrition?.calories, unit: "kcal" },
                  { label: "Protéines", val: result.nutrition?.proteins, unit: "g" },
                  { label: "Glucides", val: result.nutrition?.carbs, unit: "g" },
                  { label: "Lipides", val: result.nutrition?.fats, unit: "g" },
                ].map(({ label, val, unit }) => (
                  <div key={label} style={{ background: GREEN.bg, borderRadius: 8, padding: "10px 8px", textAlign: "center", border: `1px solid ${GREEN.light}` }}>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: GREEN.text }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 500, color: GREEN.dark }}>{val}<span style={{ fontSize: 11, fontWeight: 400 }}> {unit}</span></p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 11, fontWeight: 500, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Ingrédients</p>
              <div style={{ marginBottom: 20, borderTop: "0.5px solid #eee" }}>
                {result.ingredients?.map((ing, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid #eee" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN.mid, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#333" }}>{ing.name}</span>
                    </div>
                    <span style={{ fontSize: 14, color: GREEN.text, fontWeight: 500 }}>{ing.quantity}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 11, fontWeight: 500, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Préparation</p>
              <ol style={{ paddingLeft: "1.2rem", margin: "0 0 28px" }}>
                {result.steps?.map((s, i) => (
                  <li key={i} style={{ fontSize: 14, color: "#333", lineHeight: 1.7, marginBottom: 8 }}>{s}</li>
                ))}
              </ol>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Btn onClick={() => copyRecipeText(result)} variant="ghost" style={{ flex: 1, borderColor: GREEN.mid, color: copied ? GREEN.mid : "#666" }}>
                  {copied ? "Copié ✓" : "Copier"}
                </Btn>
                <Btn
                  onClick={addToFavs}
                  disabled={favAdded || favs.length >= MAX_FAVS}
                  variant="ghost"
                  style={{ flex: 1, borderColor: favAdded ? GREEN.mid : "#ccc", color: favAdded ? GREEN.mid : "#666" }}
                >
                  {favAdded ? "Ajouté ★" : favs.length >= MAX_FAVS ? "Favoris pleins" : "Favoris ★"}
                </Btn>
                <Btn onClick={() => { setResult(null); setStep(3); setTimeout(generate, 50); }} style={{ flex: 1 }}>Nouvelle</Btn>
                <Btn onClick={() => setStep(3)} variant="ghost" style={{ flex: 1 }}>← Modifier</Btn>
                <Btn onClick={reset} variant="ghost" style={{ width: "100%", marginTop: 4 }}>Recommencer</Btn>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}