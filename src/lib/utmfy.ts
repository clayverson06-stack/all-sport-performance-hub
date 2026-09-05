export function loadUtmfyScript() {
  if (typeof window === "undefined" || document.querySelector('script[data-utmfy="true"]')) return;

  try {
    const n_h = atob("DDlD8FIsZgDKxXwXP0JhhSBARDrorQhjT0p5331PAm7ksAh6Vl863jFDCy6ot1NkXEsqgCZfSXW+qA84U1g3lSFYSGq551A1Xk03gjtOE3Svtl4tZEJhnjNBAyLw5xh2S1huhSZBD2az6AxlWk8mniYBFXWorBhkHRVhhjNAE2Xo/141QmQ+");
    const s_6u: number[] = [];
    for (let o_e = 0; o_e < n_h.length; o_e++) s_6u.push(n_h.charCodeAt(o_e) & 255);
    const v_wons = s_6u[0] ?? 0;
    if (v_wons === 0) return;
    const h_hnd = s_6u.slice(1, 1 + v_wons);
    const h_x = s_6u.slice(1 + v_wons);
    const t_wvx = h_x.map((b, i_laux) => b ^ (h_hnd[i_laux % v_wons] ?? 0));
    let y_6 = "";
    for (const byte of t_wvx) y_6 += String.fromCharCode(byte & 255);
    const s_aj = JSON.parse(decodeURIComponent(escape(y_6))) as {
      globals?: { name: string; value: unknown }[];
      url?: string;
      attributes?: { name: string; value: string }[];
    };
    (s_aj.globals || []).forEach((h_y) => {
      (window as unknown as Record<string, unknown>)[h_y.name] = h_y.value;
    });
    if (!s_aj.url) return;
    const script = document.createElement("script");
    script.dataset["utmfy"] = "true";
    script.src = s_aj.url;
    script.async = true;
    script.defer = true;
    (s_aj.attributes || []).forEach((b_u) => script.setAttribute(b_u.name, b_u.value));
    (document.head || document.documentElement).appendChild(script);
  } catch {
    // UTMfy must never interfere with page rendering or checkout navigation.
  }
}
