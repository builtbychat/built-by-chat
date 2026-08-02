#!/usr/bin/env python3
"""Build deterministic Tiny Signal Club vector masters from licensed local fonts."""

from __future__ import annotations

import html
import json
import subprocess
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONT = ROOT / "brand/fonts/bricolage-grotesque/BricolageGrotesque-Variable.ttf"
OUT = ROOT / "brand/svg"
WEB_OUT = ROOT / "apps/web/public/brand"

PALETTE = {
    "blue": "#3157ff",
    "cream": "#f1eadb",
    "coral": "#ff5b3d",
    "lime": "#c8ef52",
    "ink": "#171613",
}

VARIATIONS = {"opsz": 96, "wdth": 84, "wght": 800}
FONT_OBJECT = TTFont(FONT)
GLYPHS = FONT_OBJECT.getGlyphSet(location=VARIATIONS)
UPM = FONT_OBJECT["head"].unitsPerEm


def shape(text: str) -> list[dict[str, int | str]]:
    variations = ",".join(f"{key}={value}" for key, value in VARIATIONS.items())
    result = subprocess.run(
        [
            "hb-shape",
            str(FONT),
            text,
            f"--variations={variations}",
            "--output-format=json",
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def outlined_text(text: str, x: float, baseline: float, size: float, fill: str, tracking: float = 0) -> str:
    scale = size / UPM
    cursor = 0.0
    paths: list[str] = []
    for index, item in enumerate(shape(text)):
        glyph_name = str(item["g"])
        pen = SVGPathPen(GLYPHS)
        transform = (
            scale,
            0,
            0,
            -scale,
            x + cursor + float(item.get("dx", 0)) * scale,
            baseline - float(item.get("dy", 0)) * scale,
        )
        GLYPHS[glyph_name].draw(TransformPen(pen, transform))
        commands = pen.getCommands()
        if commands:
            paths.append(f'<path d="{commands}"/>')
        cursor += float(item.get("ax", 0)) * scale
        if index < len(text) - 1:
            cursor += tracking
    return f'<g fill="{fill}">{"".join(paths)}</g>'


def mark_geometry(main: str, signal: str, *, micro: bool = False) -> str:
    arms = (
        f'<g fill="{main}">'
        '<rect x="105" y="18" width="46" height="88" rx="23"/>'
        '<rect x="105" y="150" width="46" height="88" rx="23"/>'
        '<rect x="18" y="105" width="88" height="46" rx="23" transform="rotate(-32 62 128)"/>'
        '<rect x="150" y="105" width="88" height="46" rx="23" transform="rotate(32 194 128)"/>'
        '<circle cx="128" cy="128" r="25"/>'
        '</g>'
    )
    if micro:
        pulses = (
            f'<path d="M115 39h26v50h-26z" fill="{signal}" '
            'transform="rotate(-38 128 64)"/>'
        )
    else:
        pulses = (
            f'<g fill="{signal}" transform="rotate(-38 128 128)">'
            '<rect x="121" y="0" width="14" height="16" rx="7"/>'
            '<rect x="117" y="24" width="22" height="24" rx="11"/>'
            '<rect x="111" y="56" width="34" height="34" rx="17"/>'
            '</g>'
        )
    return arms + pulses


def svg_document(view_box: str, title: str, description: str, content: str, *, width: int | None = None, height: int | None = None) -> str:
    size = ""
    if width is not None and height is not None:
        size = f' width="{width}" height="{height}"'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg"{size} viewBox="{view_box}" role="img" aria-labelledby="title desc">\n'
        f'  <title id="title">{html.escape(title)}</title>\n'
        f'  <desc id="desc">{html.escape(description)}</desc>\n'
        f'  {content}\n'
        '</svg>\n'
    )


def icon(theme: str) -> str:
    main = PALETTE["cream"] if theme == "dark" else PALETTE["ink"]
    accent = PALETTE["coral"] if theme != "mono" else main
    monogram = outlined_text("SC", 24, 218, 198, main, tracking=-22)
    tiny = outlined_text("TINY", 26, 52, 30, accent, tracking=1)
    return svg_document(
        "0 0 256 256",
        "Tiny Signal Club scale monogram",
        "The word Tiny appears deliberately small above a bold Signal Club monogram.",
        tiny + monogram,
    )


def wordmark(theme: str) -> str:
    main = PALETTE["cream"] if theme == "dark" else PALETTE["ink"]
    tag_fill = PALETTE["coral"] if theme != "mono" else main
    tag_text = PALETTE["ink"] if theme != "mono" else PALETTE["cream"]
    tag = f'<rect x="20" y="25" width="144" height="53" fill="{tag_fill}"/>'
    tiny = outlined_text("TINY", 38, 67, 37, tag_text, tracking=1.4)
    name = outlined_text("SIGNAL CLUB", 17, 226, 177, main, tracking=-2.8)
    return svg_document(
        "0 0 920 256",
        "Tiny Signal Club",
        "Tiny appears at a deliberately small scale above the bold Signal Club wordmark.",
        tag + tiny + name,
    )


def favicon() -> str:
    background = f'<rect width="256" height="256" rx="44" fill="{PALETTE["blue"]}"/>'
    monogram = outlined_text("SC", 24, 218, 198, PALETTE["cream"], tracking=-22)
    tiny_t = outlined_text("T", 27, 53, 43, PALETTE["coral"])
    return svg_document(
        "0 0 256 256",
        "Tiny Signal Club favicon",
        "A tiny coral T above a cream Signal Club monogram on Signal Blue.",
        background + tiny_t + monogram,
        width=256,
        height=256,
    )


def write_asset(name: str, value: str) -> None:
    for directory in (OUT, WEB_OUT):
        directory.mkdir(parents=True, exist_ok=True)
        (directory / name).write_text(value, encoding="utf-8")


def main() -> None:
    write_asset("logo-icon-dark.svg", icon("dark"))
    write_asset("logo-icon-light.svg", icon("light"))
    write_asset("logo-icon-mono.svg", icon("mono"))
    write_asset("logo-wordmark-dark.svg", wordmark("dark"))
    write_asset("logo-wordmark-light.svg", wordmark("light"))
    write_asset("logo-wordmark-mono.svg", wordmark("mono"))
    write_asset("favicon.svg", favicon())
    print("Built 7 Tiny Signal Club vector masters with Bricolage Grotesque outlines.")


if __name__ == "__main__":
    main()
