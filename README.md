# Growtopia ENet Server Skeleton (growtopia.js)

Features:
- Ready/error/connect/disconnect/raw callbacks wired
- Winston logging (LOG_LEVEL)
- Simple plugin registry (`src/core/plugins.ts`) with default greeter
- Basic per-peer raw packet rate limiter

Quick start:
1. Environment
   - Edit `.env` if needed:
     - `ENET_IP=0.0.0.0`
     - `ENET_PORT=17091`
     - `LOG_LEVEL=info`
2. Install & build
   - `npm install`
   - `npm run build`
3. Run
   - `npm run start`

Development:
- `npm run dev` (ts-node)
- Add plugins via `use()` in `src/core/plugins.ts` or export from new modules and register in `registerDefaultPlugins()`.

Notes:
- You may need hosts or firewall rules depending on your client setup.
- Packets and protocol details: GrowDocs.
