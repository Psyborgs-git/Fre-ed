# 13 — Analytics

## Tools
- **Vercel Analytics** — page views + Web Vitals (auto)
- **Hotjar** — scroll heatmaps, session recordings

## Events To Track
| Event | Where | Why |
|---|---|---|
| `route_view` | All routes | Page popularity |
| `scene_ready` | Scene.jsx mount | 3D load time |
| `scroll_depth` | 25/50/75/100% | Engagement |
| `scene_interaction` | Knob/click in scene | 3D engagement |
| `code_copy` | CodeBlock copy btn | Content value |
| `external_click` | Outbound links | Reference use |

## Implementation
Thin wrapper `src/lib/analytics.js`:
```js
export const track = (event, props) => {
  if (typeof window === 'undefined') return;
  window.va?.('event', { name: event, ...props });
};
```

## Privacy
- No PII
- No cookies in v1 (Vercel Analytics is cookieless)
- Hotjar gated behind consent banner (GDPR)
- `/privacy` route documents what is collected

## Dashboards
- Vercel dashboard for vitals
- Monthly review: top routes, slowest LCP, highest bounce
- Track per-route perf regression
