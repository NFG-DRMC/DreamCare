/* =====================================================================
   seasons.js — seasonal decorations for the site

   HOW TO USE: in index.html, add this line right before </body> :
       <script src="seasons.js"></script>

   WHEN (uses the visitor's own date):
     • December 1–30  → Christmas (snow, lights garland, tree & gifts)
     • Dec 31 + Jan 1 → New Year (fireworks, confetti, champagne)
     • October        → Halloween (bats, pumpkins, ghosts, falling leaves)
     • April          → Easter (eggs, bunnies, flowers)

   TEST A SEASON: open your site with ?season=… at the end, for example
       https://nfg-drmc.github.io/DreamCare/?season=halloween
   Values: christmas · newyear · halloween · easter · none
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1) SETTINGS (edit freely) ---------- */
  var SEASONS = {
    christmas: {
      greet: "🎄 Happy holidays! ❄️",
      tint: "rgba(120,180,255,.14)",
      garland: true,
      fall: { items: ["❄", "❅", "❆"], count: 36, min: 10, max: 26, dur: [9, 18], color: "#e6f3ff", glow: "rgba(160,210,255,.9)" },
      bottom: ["🎄", "🎁", "⛄", "🎄", "🎁", "🦌", "🎄"]
    },
    newyear: {
      greet: "🎆 Happy New Year {year}! 🥂",
      tint: "rgba(255,200,60,.12)",
      confetti: 60,
      fireworks: true,
      bottom: ["🥂", "🎆", "🎉", "🍾", "🎇", "🎉", "🥂"]
    },
    halloween: {
      greet: "🎃 Happy Halloween!",
      tint: "rgba(255,120,0,.16)",
      bats: 6,
      fall: { items: ["🍂", "🍁"], count: 14, min: 16, max: 28, dur: [10, 20] },
      bottom: ["🎃", "👻", "🎃", "🕷️", "🎃", "👻", "🎃"]
    },
    easter: {
      greet: "🐣 Happy Easter!",
      tint: "rgba(255,150,210,.13)",
      fall: { items: ["🥚", "🌸", "🐣", "🌷"], count: 16, min: 16, max: 30, dur: [10, 20] },
      bottom: ["🐰", "🥚", "🐣", "🌷", "🥚", "🐰", "🐣"]
    }
  };

  /* Which season for a given month (1-12) and day? */
  function detect(month, day) {
    if ((month === 12 && day === 31) || (month === 1 && day === 1)) return "newyear";
    if (month === 12) return "christmas";
    if (month === 10) return "halloween";
    if (month === 4) return "easter";
    return null;
  }

  /* ---------- 2) CODE (no need to touch) ---------- */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function mk(tag, cls, id) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (id) e.id = id;
    return e;
  }

  var CSS = [
    "#season-layer{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:50;background:radial-gradient(70% 40% at 50% 100%,var(--tint,transparent),transparent 70%)}",
    "#season-layer .sp{position:absolute;top:0;left:0;line-height:1;will-change:transform;user-select:none}",
    "@keyframes s-fall{from{transform:translate3d(0,-12vh,0) rotate(0deg)}to{transform:translate3d(var(--dx),112vh,0) rotate(var(--rot))}}",
    "#season-layer .fall{animation:s-fall var(--dur) linear var(--delay) infinite}",
    "@keyframes s-fly{0%{transform:translate3d(-10vw,0,0) rotate(-6deg)}25%{transform:translate3d(22vw,-30px,0) rotate(6deg)}50%{transform:translate3d(52vw,18px,0) rotate(-6deg)}75%{transform:translate3d(80vw,-26px,0) rotate(6deg)}100%{transform:translate3d(112vw,0,0) rotate(-6deg)}}",
    "#season-layer .fly{animation:s-fly var(--dur) linear var(--delay) infinite}",
    "#season-layer .fw{position:absolute;width:5px;height:5px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor;animation:s-fw 1.2s ease-out forwards}",
    "@keyframes s-fw{from{transform:translate(0,0) scale(1);opacity:1}to{transform:translate(var(--dx),calc(var(--dy) + 30px)) scale(.3);opacity:0}}",
    "#season-garland{position:fixed;top:0;left:0;right:0;height:16px;z-index:60;pointer-events:none;display:flex;overflow:hidden;border-top:2px solid #1c1c26}",
    "#season-garland i{flex:0 0 8px;height:12px;margin:2px 13px 0;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:currentColor;box-shadow:0 0 10px 2px currentColor;animation:s-twinkle 1.6s ease-in-out infinite alternate}",
    "@keyframes s-twinkle{from{opacity:.35}to{opacity:1}}",
    "#season-bottom{position:fixed;left:0;right:0;bottom:0;height:46px;display:flex;justify-content:space-around;align-items:flex-end;padding:0 8px;z-index:55;pointer-events:none;background:linear-gradient(transparent,rgba(255,255,255,.06))}",
    "#season-bottom span{font-size:34px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));animation:s-bob 3s ease-in-out infinite alternate}",
    "#season-bottom span:nth-child(even){animation-delay:-1.4s}",
    "@keyframes s-bob{from{transform:translateY(0) rotate(-4deg)}to{transform:translateY(-4px) rotate(4deg)}}",
    "@media (max-width:600px){#season-bottom span:nth-child(n+5){display:none}}",
    "body.season-pad{padding-bottom:46px}",
    "#season-toast{position:fixed;top:78px;left:50%;transform:translateX(-50%);z-index:70;pointer-events:none;padding:9px 18px;border-radius:99px;background:rgba(18,18,26,.92);border:1px solid var(--accent,#ff3b3b);color:#fff;font-weight:700;font-size:.95rem;white-space:nowrap;box-shadow:0 0 28px -6px var(--accent,#ff3b3b);animation:s-toast 7s ease forwards}",
    "@keyframes s-toast{0%{opacity:0;transform:translate(-50%,-10px)}8%{opacity:1;transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-6px)}}"
  ].join("\n");

  function init() {
    var forced = null;
    try { forced = new URLSearchParams(location.search).get("season"); } catch (e) {}
    var now = new Date();
    var key = forced ? (SEASONS[forced] ? forced : null) : detect(now.getMonth() + 1, now.getDate());
    var S = key && SEASONS[key];
    if (!S) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var small = window.innerWidth < 600;
    var scale = small ? 0.6 : 1;

    var style = mk("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var layer = mk("div", "", "season-layer");
    if (S.tint) layer.style.setProperty("--tint", S.tint);
    document.body.appendChild(layer);
    document.body.classList.add("season-pad");

    /* falling items (snow, leaves, eggs…) */
    function setMotion(e, dur) {
      e.style.setProperty("--dur", dur + "s");
      e.style.setProperty("--delay", (-rnd(0, dur)) + "s");
    }
    function fall(el, dur) {
      el.className = "sp fall";
      el.style.left = rnd(0, 100) + "vw";
      el.style.setProperty("--dx", rnd(-12, 12) + "vw");
      el.style.setProperty("--rot", rnd(-360, 360) + "deg");
      setMotion(el, dur);
      layer.appendChild(el);
    }
    if (!reduce && S.fall) {
      var n = Math.round(S.fall.count * scale);
      for (var i = 0; i < n; i++) {
        var f = mk("span");
        f.textContent = pick(S.fall.items);
        f.style.fontSize = rnd(S.fall.min, S.fall.max) + "px";
        if (S.fall.color) f.style.color = S.fall.color;
        if (S.fall.glow) f.style.textShadow = "0 0 6px " + S.fall.glow;
        fall(f, rnd(S.fall.dur[0], S.fall.dur[1]));
      }
    }

    /* confetti */
    if (!reduce && S.confetti) {
      var colors = ["#ff3b3b", "#ffd23b", "#3bbcff", "#9bff3b", "#b36bff", "#ff7ac8"];
      var c = Math.round(S.confetti * scale);
      for (var j = 0; j < c; j++) {
        var p = mk("span");
        p.style.width = rnd(5, 9) + "px";
        p.style.height = rnd(9, 15) + "px";
        p.style.background = pick(colors);
        p.style.borderRadius = "1px";
        fall(p, rnd(6, 13));
      }
    }

    /* flying bats */
    if (!reduce && S.bats) {
      var b = Math.round(S.bats * scale);
      for (var k = 0; k < b; k++) {
        var bat = mk("span", "sp fly");
        bat.textContent = "🦇";
        bat.style.fontSize = rnd(22, 38) + "px";
        bat.style.top = rnd(8, 60) + "vh";
        setMotion(bat, rnd(9, 18));
        layer.appendChild(bat);
      }
    }

    /* fireworks */
    if (!reduce && S.fireworks) {
      var burst = function () {
        if (document.hidden) return;
        var x = rnd(12, 88), y = rnd(12, 55), hue = Math.floor(rnd(0, 360));
        var count = small ? 14 : 22;
        for (var m = 0; m < count; m++) {
          var a = (Math.PI * 2 * m) / count, r = rnd(60, 130);
          var s = mk("span", "fw");
          s.style.left = x + "vw";
          s.style.top = y + "vh";
          s.style.color = "hsl(" + hue + ",100%,65%)";
          s.style.setProperty("--dx", Math.cos(a) * r + "px");
          s.style.setProperty("--dy", Math.sin(a) * r + "px");
          layer.appendChild(s);
          (function (node) { setTimeout(function () { node.remove(); }, 1400); })(s);
        }
      };
      burst();
      setInterval(burst, 1100);
    }

    /* string lights */
    if (S.garland) {
      var g = mk("div", "", "season-garland");
      var lc = ["#ff3b3b", "#ffd23b", "#3bff7a", "#3bbcff", "#ff7ac8"];
      for (var q = 0; q < 90; q++) {
        var bulb = mk("i");
        bulb.style.color = lc[q % lc.length];
        bulb.style.animationDelay = (-rnd(0, 1.6)) + "s";
        g.appendChild(bulb);
      }
      document.body.appendChild(g);
    }

    /* decorations along the bottom */
    if (S.bottom) {
      var row = mk("div", "", "season-bottom");
      for (var d = 0; d < S.bottom.length; d++) {
        var sp = mk("span");
        sp.textContent = S.bottom[d];
        row.appendChild(sp);
      }
      document.body.appendChild(row);
    }

    /* greeting (pill for a few seconds + footer text) */
    var year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    var greet = S.greet.replace("{year}", year);
    var toast = mk("div", "", "season-toast");
    toast.textContent = greet;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 7500);
    var footer = document.querySelector("footer");
    if (footer) footer.appendChild(document.createTextNode(" · " + greet));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
