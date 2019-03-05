CF_AUTH_EMAIL=
CF_AUTH_API_KEY=
CF_ZONE_ID=

curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/workers/script" \
  -H "X-Auth-Email:$CF_AUTH_EMAIL" \
  -H "X-Auth-Key:$CF_AUTH_API_KEY" \
  -F "metadata=@manifest.json;type=application/json" \
  -F "script=@dist/worker.js;type=application/javascript"
