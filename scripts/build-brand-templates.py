#!/usr/bin/env python3
"""Generate restrained, editable Tiny Signal Club platform SVG templates."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand/templates"

BLUE = "#3157ff"
CREAM = "#f1eadb"
CORAL = "#ff5b3d"
LIME = "#c8ef52"
INK = "#171613"


def defs(extra: str = "") -> str:
    return f"""<defs>
  <style>
    @font-face {{ font-family: Bricolage; src: url('../fonts/bricolage-grotesque/BricolageGrotesque-Variable.ttf'); font-weight: 200 800; }}
    .display {{ font-family: Bricolage, Arial Black, sans-serif; font-weight: 800; font-variation-settings: 'opsz' 96, 'wdth' 84, 'wght' 800; }}
    .meta {{ font-family: ui-monospace, Menlo, monospace; font-weight: 800; letter-spacing: .14em; }}
  </style>
  {extra}
</defs>"""


def svg(width: int, height: int, title: str, description: str, content: str, extra_defs: str = "") -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">{description}</desc>
  {defs(extra_defs)}
  {content}
</svg>
"""


def write(name: str, value: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(value, encoding="utf-8")


def youtube() -> str:
    content = f"""<rect width="2560" height="1440" fill="{BLUE}"/>
  <rect y="1360" width="2560" height="80" fill="{CORAL}"/>
  <image href="../svg/logo-wordmark-dark.svg" x="535" y="560" width="820" height="228"/>
  <rect x="1430" y="575" width="14" height="220" fill="{CORAL}"/>
  <text x="1500" y="622" fill="{INK}" class="meta" font-size="23">THE INTERNET DECIDES.</text>
  <text x="1500" y="700" fill="{CREAM}" class="display" font-size="62">WE BUILD IT LIVE.</text>
  <text x="1500" y="782" fill="{LIME}" class="meta" font-size="22">THURSDAYS · 7 PM CT</text>
  <text x="64" y="98" fill="{CREAM}" opacity=".56" class="meta" font-size="18">SMALL SIGNALS → BIG, STRANGE THINGS</text>
  <text x="2496" y="98" fill="{CREAM}" opacity=".56" text-anchor="end" class="meta" font-size="18">PHAENEX HOSTS</text>"""
    return svg(2560, 1440, "Tiny Signal Club YouTube banner", "Minimal wordmark, tagline, and weekly schedule within the YouTube safe area.", content)


def twitch() -> str:
    content = f"""<rect width="1200" height="480" fill="{INK}"/>
  <rect width="22" height="480" fill="{CORAL}"/>
  <image href="../svg/logo-wordmark-dark.svg" x="70" y="118" width="610" height="170"/>
  <rect x="750" y="112" width="10" height="190" fill="{CORAL}"/>
  <text x="805" y="164" fill="{CORAL}" class="meta" font-size="16">LIVE BUILD CLUB</text>
  <text x="805" y="229" fill="{CREAM}" class="display" font-size="43">THURSDAYS</text>
  <text x="805" y="279" fill="{LIME}" class="display" font-size="38">7 PM CT</text>
  <text x="70" y="392" fill="{CREAM}" opacity=".58" class="meta" font-size="14">THE INTERNET DECIDES · WE BUILD IT LIVE</text>"""
    return svg(1200, 480, "Tiny Signal Club Twitch banner", "Dark Twitch header with the Tiny Signal Club wordmark and weekly schedule.", content)


def github() -> str:
    content = f"""<rect width="1280" height="640" fill="{CREAM}"/>
  <rect x="930" width="350" height="640" fill="{BLUE}"/>
  <image href="../svg/logo-wordmark-light.svg" x="70" y="175" width="720" height="200"/>
  <text x="74" y="446" fill="{INK}" class="meta" font-size="20">OPEN SOURCE BUILDS · PUBLIC DECISIONS · VERIFIED RESULTS</text>
  <image href="../svg/logo-icon-dark.svg" x="992" y="187" width="226" height="226"/>
  <rect x="930" y="590" width="350" height="50" fill="{CORAL}"/>"""
    return svg(1280, 640, "Tiny Signal Club GitHub social preview", "Cream editorial preview with wordmark, repository statement, and blue monogram panel.", content)


def thumbnail() -> str:
    gradients = f"""<linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="{INK}" stop-opacity=".98"/><stop offset=".49" stop-color="{INK}" stop-opacity=".9"/><stop offset=".79" stop-color="{INK}" stop-opacity=".18"/><stop offset="1" stop-color="{INK}" stop-opacity="0"/></linearGradient>"""
    content = f"""<image href="../raster/hero-town.png" width="1280" height="720" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1280" height="720" fill="url(#shade)"/>
  <image href="../svg/logo-wordmark-dark.svg" x="48" y="35" width="390" height="109"/>
  <rect x="50" y="180" width="178" height="44" fill="{CORAL}"/>
  <text x="139" y="209" text-anchor="middle" fill="{INK}" class="meta" font-size="16">EPISODE 01</text>
  <text x="48" y="352" fill="{CREAM}" class="display" font-size="102"><tspan x="48">FOUNDING</tspan><tspan x="48" dy="86">DAY</tspan></text>
  <rect x="50" y="493" width="430" height="8" fill="{CORAL}"/>
  <text x="50" y="548" fill="{CORAL}" class="meta" font-size="17">THE CLUB CHOSE</text>
  <text x="48" y="612" fill="{CREAM}" class="display" font-size="48">[VOTE RESULT]</text>
  <!-- Optional host cutout safe position: x=1000 y=380 width=250 height=320. Keep hidden until a real cutout is supplied. -->
  <g id="optional-host-cutout" opacity="0"><rect x="1000" y="380" width="250" height="320" rx="125" fill="{CORAL}"/><text x="1125" y="550" text-anchor="middle" fill="{INK}" class="meta" font-size="16">HOST CUTOUT</text></g>"""
    return svg(1280, 720, "Tiny Signal Club episode thumbnail", "Editable episode, title, vote result, town art, and hidden optional host cutout position.", content, gradients)


def offline() -> str:
    gradients = f"""<linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="{INK}" stop-opacity="1"/><stop offset=".58" stop-color="{INK}" stop-opacity=".96"/><stop offset="1" stop-color="{INK}" stop-opacity=".12"/></linearGradient>"""
    content = f"""<image href="../raster/hero-town.png" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1920" height="1080" fill="url(#shade)"/>
  <image href="../svg/logo-wordmark-dark.svg" x="120" y="130" width="720" height="200"/>
  <text x="120" y="575" fill="{CREAM}" class="display" font-size="132">CHANNEL CLOSED.</text>
  <rect x="120" y="635" width="840" height="12" fill="{CORAL}"/>
  <text x="120" y="735" fill="{LIME}" class="display" font-size="72">BACK THURSDAY · 7 PM CT</text>
  <text x="124" y="815" fill="{CREAM}" opacity=".64" class="meta" font-size="24">TOWN HALL SUNDAY · 3 PM CT</text>"""
    return svg(1920, 1080, "Tiny Signal Club stream offline card", "Town illustration with a restrained return schedule and brand wordmark.", content, gradients)


def sponsor() -> str:
    content = f"""<rect width="1920" height="1080" fill="{CREAM}"/>
  <rect x="1360" width="560" height="1080" fill="{BLUE}"/>
  <rect x="1360" y="1010" width="560" height="70" fill="{CORAL}"/>
  <image href="../svg/logo-wordmark-light.svg" x="120" y="140" width="850" height="237"/>
  <text x="125" y="625" fill="{INK}" class="display" font-size="110">PARTNERSHIP DECK</text>
  <text x="130" y="710" fill="{CORAL}" class="meta" font-size="25">SEASON ONE · TINY INTERNET TOWN</text>
  <text x="130" y="795" fill="{INK}" opacity=".66" class="meta" font-size="22">COMMUNITY-BUILT · FREE TO PARTICIPATE · CLEARLY LABELED PARTNERS</text>
  <image href="../svg/logo-icon-dark.svg" x="1470" y="375" width="340" height="340"/>"""
    return svg(1920, 1080, "Tiny Signal Club sponsor deck cover", "Editorial cream and blue partnership-deck cover for Season One.", content)


def discord() -> str:
    content = f"""<rect width="512" height="512" fill="{BLUE}"/>
  <image href="../svg/logo-icon-dark.svg" x="90" y="90" width="332" height="332"/>"""
    return svg(512, 512, "Tiny Signal Club Discord icon", "Signal Club monogram on Signal Blue.", content)


def panel(label: str, accent: str, filename: str) -> None:
    content = f"""<rect width="320" height="160" fill="{INK}"/>
  <rect width="12" height="160" fill="{accent}"/>
  <text x="34" y="102" fill="{CREAM}" class="display" font-size="42">{label}</text>
  <rect x="34" y="121" width="74" height="6" fill="{accent}"/>"""
    write(filename, svg(320, 160, f"Tiny Signal Club {label.lower()} panel", f"Minimal {label.lower()} Twitch panel.", content))


def main() -> None:
    write("youtube-banner.svg", youtube())
    write("twitch-banner.svg", twitch())
    write("github-social-preview.svg", github())
    write("thumbnail.svg", thumbnail())
    write("stream-offline.svg", offline())
    write("sponsor-deck-cover.svg", sponsor())
    write("discord-icon.svg", discord())
    panel("ABOUT", CORAL, "twitch-panel-about.svg")
    panel("SCHEDULE", LIME, "twitch-panel-schedule.svg")
    panel("SUPPORT", CORAL, "twitch-panel-support.svg")
    panel("SPONSORS", LIME, "twitch-panel-sponsors.svg")
    print("Built 11 Tiny Signal Club platform SVG templates.")


if __name__ == "__main__":
    main()
