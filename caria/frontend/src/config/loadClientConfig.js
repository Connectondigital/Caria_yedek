export async function loadClientConfig(clientKey = "caria") {
  const res = await fetch(`/clients/${clientKey}/client.config.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Client config load failed: ${res.status}`);
  return res.json();
}
