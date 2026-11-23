import assert from "node:assert/strict";
import test from "node:test";

process.env.EXPO_PUBLIC_API_URL = "http://localhost:3333";
const { api, getApiSessionSignal, setApiSessionToken } = await import("../src/services/api.ts");

test("o cliente centraliza o token e cancela operações da sessão anterior", async (t) => {
    t.after(() => setApiSessionToken(null));

    const sentHeaders = [];
    const adapter = async (config) => {
        sentHeaders.push(config.headers.get("Authorization"));
        return { data: null, status: 200, statusText: "OK", headers: {}, config };
    };

    setApiSessionToken("primeira-sessao");
    const signal = getApiSessionSignal("primeira-sessao");
    assert.ok(signal);
    await api.get("/categorias", { adapter, signal });

    setApiSessionToken("segunda-sessao");
    assert.equal(signal.aborted, true);
    assert.equal(getApiSessionSignal("primeira-sessao"), undefined);
    await assert.rejects(api.post("/lancamentos", {}, { adapter, signal }), { code: "ERR_CANCELED" });
    await api.get("/lancamentos", { adapter });

    setApiSessionToken(null);
    await api.post("/usuarios/login", {}, { adapter });
    assert.deepEqual(sentHeaders, ["Bearer primeira-sessao", "Bearer segunda-sessao", undefined]);
});
