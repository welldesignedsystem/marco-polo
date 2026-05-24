from __future__ import annotations

import json
import os
import textwrap
from datetime import date
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fpdf import FPDF

from src.logging_config import get_logger
from src.models import WebsiteInput
from src.tools import (
    DimensionReport,
    analyze_aeo_compliance,
    analyze_geo_compliance,
    analyze_seo_compliance,
    create_llm,
    extract_business_profile,
    read_file,
    scrape_website,
    search_web,
)

load_dotenv()

logger = get_logger(__name__)

SKILLS_PATH = Path(__file__).resolve().parent.parent / "skills" / "SKILLS.md"
AGENTS_PATH = Path(__file__).resolve().parent.parent / "AGENTS.md"


# ── Report models ──────────────────────────────────────────────────


class ComplianceReport:
    """Aggregated compliance analysis across SEO / GEO / AEO."""

    def __init__(
        self,
        website: str,
        company_name: str,
        overall_score: float,
        seo: DimensionReport,
        geo: DimensionReport,
        aeo: DimensionReport,
        top_findings: list[str],
    ) -> None:
        self.website = website
        self.company_name = company_name
        self.overall_score = overall_score
        self.seo = seo
        self.geo = geo
        self.aeo = aeo
        self.top_findings = top_findings
        self.report_date = date.today().isoformat()


# ── Search query builders ──────────────────────────────────────────


def _build_seo_queries(profile: Any) -> list[str]:
    terms = " ".join(getattr(profile, "industry_terms", [])[:3])
    domain = getattr(profile, "business_domain", "")
    return [
        f"SEO best practices {domain} {terms} 2026",
        f"technical SEO checklist {domain} website optimization 2026",
    ]


def _build_geo_queries(profile: Any) -> list[str]:
    terms = " ".join(getattr(profile, "industry_terms", [])[:3])
    domain = getattr(profile, "business_domain", "")
    return [
        f"generative engine optimization GEO best practices {domain} 2026",
        f"LLM search optimization {domain} AI overviews 2026",
    ]


def _build_aeo_queries(profile: Any) -> list[str]:
    terms = " ".join(getattr(profile, "industry_terms", [])[:3])
    domain = getattr(profile, "business_domain", "")
    return [
        f"answer engine optimization AEO featured snippets {domain} 2026",
        f"voice search optimization conversational AI {domain} 2026",
    ]


# ── Deep research agent ────────────────────────────────────────────


class ReportGenerator:
    """DeepAgent orchestrator for compliance report generation."""

    def __init__(self) -> None:
        self.llm = create_llm()
        self.skills_content = read_file(str(SKILLS_PATH))
        self.agents_content = read_file(str(AGENTS_PATH))
        logger.info("Loaded SKILLS.md (%d chars)", len(self.skills_content))
        logger.info("Loaded AGENTS.md (%d chars)", len(self.agents_content))

    def generate(self, website_url: str, search_focus: str = "") -> ComplianceReport:
        website_input = WebsiteInput(website=website_url, search_focus=search_focus)
        url = website_input.website

        logger.info("Step 1: Scraping website %s", url)
        website_text = scrape_website(url)
        logger.info("Scraped %d chars", len(website_text))

        logger.info("Step 2: Extracting business profile")
        profile = extract_business_profile(self.llm, website_input, website_text)
        logger.info("Profile: %s (%s)", profile.company_name, profile.business_domain)

        logger.info("Step 3: Deep research — SEO dimension")
        seo_queries = _build_seo_queries(profile)
        seo_results: list[dict[str, str]] = []
        for q in seo_queries:
            seo_results.extend(search_web(q, max_results=5))
        seo = analyze_seo_compliance(
            self.llm, website_text, profile,
            self.skills_content, seo_results, url,
        )
        logger.info("SEO score: %.1f", seo.score)

        logger.info("Step 4: Deep research — GEO dimension")
        geo_queries = _build_geo_queries(profile)
        geo_results: list[dict[str, str]] = []
        for q in geo_queries:
            geo_results.extend(search_web(q, max_results=5))
        geo = analyze_geo_compliance(
            self.llm, website_text, profile,
            self.skills_content, geo_results, url,
        )
        logger.info("GEO score: %.1f", geo.score)

        logger.info("Step 5: Deep research — AEO dimension")
        aeo_queries = _build_aeo_queries(profile)
        aeo_results: list[dict[str, str]] = []
        for q in aeo_queries:
            aeo_results.extend(search_web(q, max_results=5))
        aeo = analyze_aeo_compliance(
            self.llm, website_text, profile,
            self.skills_content, aeo_results, url,
        )
        logger.info("AEO score: %.1f", aeo.score)

        logger.info("Step 6: Compiling report")
        overall = round(seo.score * 0.35 + geo.score * 0.35 + aeo.score * 0.30, 1)

        all_recs = (
            [f"[SEO] {r}" for r in seo.recommendations[:2]]
            + [f"[GEO] {r}" for r in geo.recommendations[:2]]
            + [f"[AEO] {r}" for r in aeo.recommendations[:2]]
        )
        top_findings = all_recs[:3]

        return ComplianceReport(
            website=url,
            company_name=profile.company_name,
            overall_score=overall,
            seo=seo,
            geo=geo,
            aeo=aeo,
            top_findings=top_findings,
        )


# ── PDF generation ─────────────────────────────────────────────────

FONT_DIR = "/usr/share/fonts/truetype/dejavu"

PAGE_W = 210
PAGE_H = 297
M_L    = 15
M_R    = 15
M_T    = 22
M_B    = 18
CW     = PAGE_W - M_L - M_R

C: dict[str, tuple[int, int, int]] = {
    "bg":          (245, 246, 249),
    "bg2":         (238, 240, 245),
    "card":        (255, 255, 255),
    "card_tint":   (251, 252, 254),
    "shadow":      (204, 213, 228),
    "border":      (225, 231, 242),
    "divider":     (220, 226, 238),
    "white":       (255, 255, 255),
    "text":        (18,  28,  46),
    "text2":       (54,  67,  88),
    "muted":       (98,  112, 132),
    "muted2":      (152, 163, 178),
    "navy":        (12,  21,  38),
    "navy2":       (22,  38,  64),
    "navy3":       (38,  56,  88),
    "navy_soft":   (208, 216, 232),
    "gold":        (192, 151, 52),
    "gold_dim":    (148, 112, 32),
    "gold_pale":   (248, 239, 212),
    "teal":        (28,  174, 166),
    "seo":         (14,  181, 126),
    "seo_dim":     (4,   144,  98),
    "seo_glass":   (234, 251, 243),
    "geo":         (212, 142, 20),
    "geo_dim":     (170, 110, 12),
    "geo_glass":   (255, 248, 226),
    "aeo":         (120,  82, 218),
    "aeo_dim":     (90,   58, 178),
    "aeo_glass":   (242, 238, 254),
    "score_low":   (220,  58,  78),
    "score_med":   (212, 138,  24),
    "score_high":  (14,  181, 126),
}

_DIM_COLORS: dict[str, tuple[str, str, str]] = {
    "seo":  ("seo",  "seo_dim",  "seo_glass"),
    "geo":  ("geo",  "geo_dim",  "geo_glass"),
    "aeo":  ("aeo",  "aeo_dim",  "aeo_glass"),
    "navy": ("navy", "navy2",    "bg"),
}


def _score_color(s: float) -> tuple[int, int, int]:
    if s >= 66: return C["score_high"]
    if s >= 33: return C["score_med"]
    return C["score_low"]


def _score_dark(s: float) -> tuple[int, int, int]:
    if s >= 66: return C["seo_dim"]
    if s >= 33: return C["geo_dim"]
    return (175, 38, 55)


def _blend(
    a: tuple[int, int, int],
    b: tuple[int, int, int],
    t: float,
) -> tuple[int, int, int]:
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))  # type: ignore[return-value]


class ReportPDF(FPDF):
    """Premium compliance report — consulting-grade aesthetics."""

    def __init__(self) -> None:
        super().__init__("P", "mm", (PAGE_W, PAGE_H))
        self.set_margins(M_L, M_T, M_R)
        self.set_auto_page_break(True, M_B)
        self.add_font("DejaVu",  "",   f"{FONT_DIR}/DejaVuSans.ttf")
        self.add_font("DejaVu",  "B",  f"{FONT_DIR}/DejaVuSans-Bold.ttf")
        self.add_font("DejaVu",  "I",  f"{FONT_DIR}/DejaVuSans-Oblique.ttf")
        self.add_font("DejaVu",  "BI", f"{FONT_DIR}/DejaVuSans-BoldOblique.ttf")
        self._company_name = ""

    # ── primitives ────────────────────────────────────────────────

    def _rr(self, x: float, y: float, w: float, h: float,
            style: str = "F", r: float = 4) -> None:
        self.rect(x, y, w, h, style, round_corners=True, corner_radius=r)

    def _v_grad(self, x: float, y: float, w: float, h: float,
                start: tuple[int, int, int], end: tuple[int, int, int],
                steps: int = 48) -> None:
        sh = h / steps
        for i in range(steps):
            self.set_fill_color(*_blend(start, end, i / max(steps - 1, 1)))
            self.rect(x, y + i * sh, w, sh + 0.15, "F")

    def _ensure_space(self, h: float) -> None:
        if self.get_y() + h > PAGE_H - M_B - 2:
            self.add_page()

    # ── card: ONE shadow + face, no inner highlight gimmick ───────

    def _card(self, x: float, y: float, w: float, h: float,
              bg: tuple[int, int, int] = C["card"], r: float = 5) -> None:
        self.set_fill_color(*C["shadow"])
        self.rect(x + 0.9, y + 1.5, w, h, "F")
        self.set_fill_color(*bg)
        self.set_draw_color(*C["border"])
        self.set_line_width(0.18)
        self.rect(x, y, w, h, "DF")

    def _card_top_stripe(self, x: float, y: float, w: float,
                         color: tuple[int, int, int], r: float = 5) -> None:
        self.set_fill_color(*color)
        self.rect(x, y, w, 3.5, "F")

    # ── page backgrounds ─────────────────────────────────────────

    def _page_bg(self) -> None:
        self._v_grad(0, 0, PAGE_W, PAGE_H, C["bg"], C["bg2"])
        self.set_fill_color(*C["divider"])
        dot_r, spacing = 0.35, 9.0
        x = spacing
        while x < PAGE_W:
            y = spacing
            while y < PAGE_H:
                self.ellipse(x, y, dot_r * 2, dot_r * 2, "F")
                y += spacing
            x += spacing

    def _cover_bg(self) -> None:
        split = 128
        self._v_grad(0, 0, PAGE_W, split, C["navy"], C["navy2"])
        self.set_draw_color(30, 46, 72)
        self.set_line_width(0.25)
        for offset in range(-30, PAGE_W + 30, 22):
            self.line(offset, 0, offset + split * 0.55, split)
        self.set_fill_color(*C["gold"])
        self.rect(0, split, PAGE_W, 1.8, "F")
        self.set_fill_color(*C["teal"])
        self.rect(0, split + 1.8, PAGE_W, 0.8, "F")
        self._v_grad(0, split + 2.6, PAGE_W, PAGE_H - split - 2.6,
                     (248, 249, 252), (242, 244, 249))

    # ── header / footer ───────────────────────────────────────────

    def header(self) -> None:
        if self.page_no() <= 1:
            return
        self._page_bg()
        self.set_fill_color(*C["navy"])
        self.rect(0, 0, PAGE_W, 10.5, "F")
        self.set_fill_color(*C["gold"])
        self.rect(0, 10.5, PAGE_W, 0.7, "F")
        self.set_xy(M_L, 2.5)
        self.set_font("DejaVu", "B", 7.2)
        self.set_text_color(*C["gold"])
        self.cell(50, 6, "COMPLIANCE INTELLIGENCE")
        self.set_font("DejaVu", "", 7)
        self.set_text_color(170, 186, 210)
        name = self._company_name[:52] if self._company_name else ""
        self.cell(0, 6, name + "  ·  SEO / GEO / AEO Report", align="R")
        self.set_y(M_T)

    def footer(self) -> None:
        self.set_y(-(M_B - 2))
        self.set_draw_color(*C["divider"])
        self.set_line_width(0.2)
        self.line(M_L, self.get_y(), PAGE_W - M_R, self.get_y())
        self.set_font("DejaVu", "I", 6.8)
        self.set_text_color(*C["muted2"])
        self.cell(0, 6, f"Page {self.page_no()}/{{nb}}", align="C")

    # ── cover page ────────────────────────────────────────────────

    def cover_page(self, report: ComplianceReport) -> None:
        self._company_name = report.company_name
        self.add_page()
        self._cover_bg()

        self.set_xy(M_L, 18)
        self.set_font("DejaVu", "B", 7.5)
        self.set_text_color(*C["gold"])
        self.cell(0, 5, "C O M P L I A N C E   I N T E L L I G E N C E   R E P O R T", align="C")

        self.set_xy(M_L, 30)
        self.set_font("DejaVu", "B", 26)
        self.set_text_color(*C["white"])
        self.multi_cell(CW, 11, report.company_name[:50], align="C")

        y_after_co = self.get_y()
        self.set_xy(M_L, y_after_co + 3)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(185, 200, 225)
        self.cell(0, 7, "SEO / GEO / AEO  Client Readiness Report", align="C")

        div_y = y_after_co + 15
        self.set_draw_color(55, 75, 108)
        self.set_line_width(0.3)
        self.line(M_L + 30, div_y, PAGE_W - M_R - 30, div_y)

        sc = _score_color(report.overall_score)
        cw2, ch2 = 88, 60
        cx = (PAGE_W - cw2) / 2
        cy = div_y + 6

        self.set_fill_color(*C["navy3"])
        self.rect(cx + 0.8, cy + 1.2, cw2, ch2, "F")
        self.set_fill_color(48, 68, 100)
        self.set_draw_color(60, 82, 120)
        self.set_line_width(0.22)
        self.rect(cx, cy, cw2, ch2, "DF")
        self.set_fill_color(*sc)
        self.rect(cx, cy, cw2, 3.5, "F")

        self.set_xy(cx, cy + 10)
        self.set_font("DejaVu", "B", 44)
        self.set_text_color(*sc)
        self.cell(cw2, 18, f"{report.overall_score:.0f}", align="C")

        self.set_xy(cx, cy + 30)
        self.set_font("DejaVu", "", 10)
        self.set_text_color(150, 168, 200)
        self.cell(cw2, 6, "/ 100", align="C")

        bi, bw_in, by = 12, cw2 - 24, cy + 40
        self.set_fill_color(28, 44, 70)
        self._rr(cx + bi, by, bw_in, 4.5, "F", 2.25)
        pct = min(report.overall_score / 100, 1.0)
        if pct > 0:
            self.set_fill_color(*sc)
            self._rr(cx + bi, by, bw_in * pct, 4.5, "F", 2.25)

        self.set_xy(cx, cy + 49)
        self.set_font("DejaVu", "B", 7.2)
        self.set_text_color(140, 158, 190)
        self.cell(cw2, 5, "OVERALL COMPLIANCE SCORE", align="C")

        split = 128
        tile_y = split + 14
        tile_w = (CW - 12) / 3
        dims = [
            ("SEO", report.seo.score,  C["seo"],  C["seo_glass"],  C["seo_dim"]),
            ("GEO", report.geo.score,  C["geo"],  C["geo_glass"],  C["geo_dim"]),
            ("AEO", report.aeo.score,  C["aeo"],  C["aeo_glass"],  C["aeo_dim"]),
        ]
        for idx, (label, val, col, bg, dim_c) in enumerate(dims):
            tx = M_L + idx * (tile_w + 6)
            self._card(tx, tile_y, tile_w, 48, bg, 6)
            self._card_top_stripe(tx, tile_y, tile_w, col, 6)
            self.set_xy(tx + 6, tile_y + 9)
            self.set_font("DejaVu", "B", 7.5)
            self.set_text_color(*C["muted"])
            self.cell(tile_w - 12, 4, label + "  READINESS")
            self.set_xy(tx + 6, tile_y + 16)
            self.set_font("DejaVu", "B", 28)
            self.set_text_color(*dim_c)
            self.cell(tile_w - 12, 14, f"{val:.0f}", align="R")
            self.set_xy(tx + 6, tile_y + 32)
            self.set_font("DejaVu", "", 7.5)
            self.set_text_color(*C["muted"])
            self.cell(tile_w - 12, 4, "out of 100", align="R")
            mbi, mbw, mby = 6, tile_w - 12, tile_y + 40
            self.set_fill_color(*C["divider"])
            self._rr(tx + mbi, mby, mbw, 3, "F", 1.5)
            if val > 0:
                self.set_fill_color(*col)
                self._rr(tx + mbi, mby, mbw * min(val / 100, 1), 3, "F", 1.5)

        self.set_y(tile_y + 72)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*C["muted"])
        self.cell(0, 5, report.website, align="C")
        self.ln(5)
        self.cell(0, 5, f"Generated  {report.report_date}", align="C")

    # ── section title ─────────────────────────────────────────────

    def section_title(self, title: str, color_key: str = "navy",
                      subtitle: str = "") -> None:
        self._ensure_space(30)
        y0 = self.get_y() + 3
        col = C.get(color_key, C["navy"])
        self.set_fill_color(*col)
        self.rect(M_L, y0, 3.2, 13, "F")
        self.set_xy(M_L + 9, y0 + 0.8)
        self.set_font("DejaVu", "B", 14)
        self.set_text_color(*C["text"])
        self.cell(CW - 12, 7, title)
        if subtitle:
            self.set_xy(M_L + 9, y0 + 8.5)
            self.set_font("DejaVu", "", 8.5)
            self.set_text_color(*C["muted"])
            self.cell(CW - 12, 5, subtitle)
        rule_y = y0 + 16
        self.set_draw_color(*C["divider"])
        self.set_line_width(0.22)
        self.line(M_L, rule_y, PAGE_W - M_R, rule_y)
        self.set_y(rule_y + 6)

    def sub_title(self, title: str) -> None:
        self._ensure_space(14)
        self.set_font("DejaVu", "B", 10)
        self.set_text_color(*C["text2"])
        self.set_x(M_L)
        self.cell(CW, 6, title)
        self.ln(1)
        y = self.get_y()
        self.set_draw_color(*C["divider"])
        self.set_line_width(0.18)
        self.line(M_L, y, M_L + 40, y)
        self.ln(5)

    def body_text(self, text: str) -> None:
        self.set_font("DejaVu", "", 9.2)
        self.set_text_color(*C["text"])
        self.set_x(M_L)
        self.multi_cell(CW, 5.0, text, align="L")
        self.ln(4)

    def insight_card(self, text: str,
                     color: tuple[int, int, int] = C["teal"]) -> None:
        self.set_font("DejaVu", "", 9.4)
        lines = text.count("\n") + max(1, len(text) // 78)
        ch = max(22, lines * 5.4 + 12)
        self._ensure_space(ch + 6)
        y0 = self.get_y()
        self._card(M_L, y0, CW, ch, C["card_tint"], 5)
        self._card_top_stripe(M_L, y0, CW, color, 5)
        self.set_xy(M_L + 8, y0 + 10)
        self.set_font("DejaVu", "I", 9.4)
        self.set_text_color(*C["text"])
        self.multi_cell(CW - 16, 5.2, text, align="L")
        self.set_y(y0 + ch + 6)

    def score_tiles(self, report: ComplianceReport) -> None:
        self._ensure_space(44)
        y0 = self.get_y()
        tile_w = (CW - 18) / 4
        tiles = [
            ("OVERALL", report.overall_score, C["navy"],  C["card"],      C["navy2"]),
            ("SEO",     report.seo.score,     C["seo"],   C["seo_glass"], C["seo_dim"]),
            ("GEO",     report.geo.score,     C["geo"],   C["geo_glass"], C["geo_dim"]),
            ("AEO",     report.aeo.score,     C["aeo"],   C["aeo_glass"], C["aeo_dim"]),
        ]
        for i, (label, val, col, bg, dim_c) in enumerate(tiles):
            tx = M_L + i * (tile_w + 6)
            self._card(tx, y0, tile_w, 34, bg, 5)
            self._card_top_stripe(tx, y0, tile_w, col, 5)
            self.set_xy(tx + 5, y0 + 8)
            self.set_font("DejaVu", "B", 7.2)
            self.set_text_color(*C["muted"])
            self.cell(tile_w - 10, 4, label)
            self.set_xy(tx + 5, y0 + 14)
            self.set_font("DejaVu", "B", 20)
            self.set_text_color(*dim_c)
            self.cell(tile_w - 10, 11, f"{val:.0f}", align="R")
            mbi, mbw, mby = 5, tile_w - 10, y0 + 28
            self.set_fill_color(*C["divider"])
            self._rr(tx + mbi, mby, mbw, 2.5, "F", 1.25)
            if val > 0:
                self.set_fill_color(*col)
                self._rr(tx + mbi, mby, mbw * min(val / 100, 1), 2.5, "F", 1.25)
        self.set_y(y0 + 42)

    def bullet_list(self, items: list[str]) -> None:
        self.set_font("DejaVu", "", 9.2)
        self.set_text_color(*C["text"])
        for item in items:
            self._ensure_space(10)
            wrapped = textwrap.wrap(item, width=95)
            if not wrapped:
                continue
            self.set_x(M_L + 4)
            self.set_text_color(*C["gold_dim"])
            self.cell(4, 4.8, "▸")
            self.set_text_color(*C["text"])
            self.multi_cell(CW - 8, 4.8, " " + wrapped[0], align="L")
            for cont in wrapped[1:]:
                self.set_x(M_L + 8)
                self.multi_cell(CW - 8, 4.8, cont, align="L")
            self.ln(1.5)
        self.ln(2)

    def score_bar(self, score: float, max_score: float = 100) -> None:
        self._ensure_space(22)
        bar_w = CW - 28
        pct   = min(score / max_score, 1.0)
        by    = self.get_y()
        sc    = _score_color(score / max_score * 100 if max_score != 100 else score)
        sc_d  = _score_dark(score / max_score * 100 if max_score != 100 else score)
        self.set_fill_color(*C["divider"])
        self._rr(M_L, by, bar_w, 7, "F", 3.5)
        if pct > 0:
            fw = bar_w * pct
            self.set_fill_color(*sc_d)
            self._rr(M_L, by, fw, 7, "F", 3.5)
            self.set_fill_color(*sc)
            self._rr(M_L, by, fw, 5.5, "F", 3.5)
        label = f"{score:.0f} / {int(max_score)}"
        self.set_font("DejaVu", "B", 11)
        self.set_text_color(*sc_d)
        self.set_xy(M_L + bar_w + 4, by - 1)
        self.cell(22, 9, label)
        self.set_y(by + 14)

    def _criterion_card(self, name: str, score: float, finding: str,
                        accent: tuple[int, int, int],
                        accent_dim: tuple[int, int, int]) -> None:
        sc = _score_color(score / 5 * 100)
        finding_lines = textwrap.wrap(finding, width=100)
        if len(finding_lines) > 10:
            finding_lines = finding_lines[:9] + ["…"]
        name_lines = textwrap.wrap(name, width=70)
        name_h     = len(name_lines) * 5.2
        finding_h  = len(finding_lines) * 4.6
        card_h     = 12 + max(name_h, 8) + 8 + finding_h + 6
        self._ensure_space(card_h + 6)
        y0 = self.get_y()
        self._card(M_L, y0, CW, card_h, C["card"], 5)

        # Score pill
        pill_w, pill_h = 20, 9
        self.set_fill_color(*sc)
        self._rr(M_L + 7, y0 + 7, pill_w, pill_h, "F", pill_h / 2)
        self.set_xy(M_L + 7, y0 + 7.5)
        self.set_font("DejaVu", "B", 8.5)
        self.set_text_color(*C["white"])
        self.cell(pill_w, pill_h - 1, f"{score:.0f}/5", align="C")

        # Criterion name
        self.set_font("DejaVu", "B", 9.4)
        self.set_text_color(*C["text"])
        nx, ny = M_L + 32, y0 + 5.5
        for nl in name_lines:
            self.set_xy(nx, ny)
            self.multi_cell(CW - 38, 5.2, nl, align="L")
            ny += 5.2

        # Progress bar
        bar_y = y0 + max(name_h, 8) + 10
        bi, bw2 = 7, CW - 14
        self.set_fill_color(*C["divider"])
        self._rr(M_L + bi, bar_y, bw2, 3.5, "F", 1.75)
        if score > 0:
            self.set_fill_color(*sc)
            self._rr(M_L + bi, bar_y, bw2 * (score / 5), 3.5, "F", 1.75)

        # Finding text
        self.set_font("DejaVu", "", 8.8)
        self.set_text_color(*C["muted"])
        fy = bar_y + 7
        for fl in finding_lines:
            self.set_xy(M_L + bi, fy)
            self.multi_cell(CW - bi * 2, 4.6, fl, align="L")
            fy += 4.6

        # Thin left accent rule (1.2 mm — subtle, not a thick slab)
        self.set_fill_color(*sc)
        self.rect(M_L, y0, 1.2, card_h, "F")

        self.set_y(y0 + card_h + 5)

    def dimension_section(self, title: str, dim: DimensionReport) -> None:
        key = title.split()[0].lower()
        col_key, dim_key, _ = _DIM_COLORS.get(key, ("navy", "navy2", "bg"))
        accent     = C[col_key]
        accent_dim = C[dim_key]

        self.add_page()
        self.section_title(title, col_key)

        self.sub_title("Compliance Score")
        self.score_bar(dim.score)

        self.sub_title("Summary")
        self.body_text(dim.summary)

        # Two-column strengths / weaknesses
        col_w = (CW - 8) / 2
        sw_y  = self.get_y()
        self.set_xy(M_L, sw_y)
        self.set_font("DejaVu", "B", 9.5)
        self.set_text_color(*C["score_high"])
        self.cell(col_w, 6, "✓  Strengths")
        self.set_xy(M_L + col_w + 8, sw_y)
        self.set_text_color(*C["score_low"])
        self.cell(col_w, 6, "✗  Weaknesses")
        self.ln(7)

        left_y = self.get_y()
        self.set_font("DejaVu", "", 8.8)
        max_items = min(len(dim.strengths), len(dim.weaknesses), 4)
        for item in dim.strengths[:max_items]:
            self.set_x(M_L + 2)
            self.set_text_color(*C["seo_dim"])
            self.cell(3.5, 4.6, "▸")
            self.set_text_color(*C["text"])
            self.multi_cell(col_w - 8, 4.6, " " + item[:90], align="L")
            self.ln(1)
        right_end_y = self.get_y()

        self.set_y(left_y)
        for item in dim.weaknesses[:max_items]:
            self.set_x(M_L + col_w + 10)
            self.set_text_color(*C["score_low"])
            self.cell(3.5, 4.6, "▸")
            self.set_text_color(*C["text"])
            self.multi_cell(col_w - 8, 4.6, " " + item[:90], align="L")
            self.ln(1)
        right_end_y2 = self.get_y()

        self.set_y(max(right_end_y, right_end_y2) + 4)
        vr_x = M_L + col_w + 4
        self.set_draw_color(*C["divider"])
        self.set_line_width(0.2)
        self.line(vr_x, left_y - 1, vr_x, self.get_y())

        self.sub_title("Recommendations")
        self.bullet_list(dim.recommendations)

        self.sub_title("Criterion Scores")
        for crit in dim.criteria:
            self._criterion_card(crit.name, crit.score, crit.finding,
                                 accent, accent_dim)

    def action_plan_section(self, report: ComplianceReport) -> None:
        self.add_page()
        self.section_title(
            "Action Plan", "navy",
            subtitle="Prioritised recommendations across all three dimensions",
        )
        dim_cfg = {
            "SEO": (C["seo"], C["seo_glass"]),
            "GEO": (C["geo"], C["geo_glass"]),
            "AEO": (C["aeo"], C["aeo_glass"]),
        }
        all_items: list[tuple[str, str]] = []
        for rec in report.seo.recommendations:
            all_items.append(("SEO", rec))
        for rec in report.geo.recommendations:
            all_items.append(("GEO", rec))
        for rec in report.aeo.recommendations:
            all_items.append(("AEO", rec))

        TEXT_X  = M_L + 37          # text starts after number + pill
        TEXT_W  = CW - TEXT_X + M_L  # remaining mm width for text
        LH      = 5.0               # line height mm
        PAD_V   = 7                 # top/bottom padding inside card

        for i, (dim, rec) in enumerate(all_items, 1):
            col, bg = dim_cfg.get(dim, (C["navy"], C["card"]))

            # Wrap to ~60 chars so each line fits in TEXT_W at 9.2 pt
            lines = textwrap.wrap(rec, width=60)
            if not lines:
                lines = [""]
            text_h = len(lines) * LH
            ch     = max(22, text_h + PAD_V * 2)
            self._ensure_space(ch + 5)
            y0 = self.get_y()

            self._card(M_L, y0, CW, ch, bg, 5)

            # Number badge
            mid_y = y0 + ch / 2
            self.set_fill_color(*C["navy"])
            self._rr(M_L + 5, mid_y - 4.5, 9, 9, "F", 4.5)
            self.set_xy(M_L + 5, mid_y - 4)
            self.set_font("DejaVu", "B", 7.5)
            self.set_text_color(*C["white"])
            self.cell(9, 8, str(i), align="C")

            # Dim pill
            self.set_fill_color(*col)
            self._rr(M_L + 18, mid_y - 3.5, 14, 7, "F", 3.5)
            self.set_xy(M_L + 18, mid_y - 3)
            self.set_font("DejaVu", "B", 7)
            self.set_text_color(*C["white"])
            self.cell(14, 6, dim, align="C")

            # Text — use cell() per line so x never resets to left margin
            self.set_font("DejaVu", "", 9.2)
            self.set_text_color(*C["text"])
            ty = y0 + (ch - text_h) / 2   # vertically centred
            for line in lines:
                self.set_xy(TEXT_X, ty)
                self.cell(TEXT_W, LH, line)
                ty += LH

            # Thin left accent
            self.set_fill_color(*col)
            self.rect(M_L, y0, 1.2, ch, "F")
            self.set_y(y0 + ch + 4)


def generate_pdf(report: ComplianceReport, output_path: str) -> str:
    pdf = ReportPDF()
    pdf.alias_nb_pages()

    pdf.cover_page(report)

    pdf.add_page()
    pdf.section_title("Executive Summary")
    pdf.insight_card(
        f"This report evaluates {report.company_name} ({report.website}) "
        f"across three modern compliance dimensions: Search Engine Optimization (SEO), "
        f"Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO). "
        f"Scores reflect current best-practice benchmarks as of {report.report_date}."
    )
    pdf.score_tiles(report)
    pdf.sub_title("Top Findings & Recommendations")
    pdf.bullet_list(report.top_findings)

    pdf.dimension_section("SEO Assessment", report.seo)
    pdf.dimension_section("GEO Assessment", report.geo)
    pdf.dimension_section("AEO Assessment", report.aeo)
    pdf.action_plan_section(report)

    pdf.output(output_path)
    logger.info("PDF written to %s", output_path)
    return output_path


# ── CLI ────────────────────────────────────────────────────────────


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Compliance Report Generator")
    parser.add_argument("url", help="Website URL to analyze")
    parser.add_argument("--focus", default="", help="Optional search focus or context")
    parser.add_argument("--output", default=None, help="Output PDF path (default: report-<domain>.pdf)")
    args = parser.parse_args()

    if not args.output:
        domain = args.url.replace("https://", "").replace("http://", "").split("/")[0]
        args.output = f"report-{domain}.pdf"

    generator = ReportGenerator()
    report = generator.generate(args.url, search_focus=args.focus)
    output = generate_pdf(report, args.output)
    print(f"Report saved to {output}")
    print(f"Overall Compliance Score: {report.overall_score:.1f}/100")
    print(f"  SEO: {report.seo.score:.1f}")
    print(f"  GEO: {report.geo.score:.1f}")
    print(f"  AEO: {report.aeo.score:.1f}")


# ── Smoke test ─────────────────────────────────────────────────────


def _smoke_test() -> None:
    print("=== ReportGenerator smoke test ===\n")

    try:
        skills = read_file(str(SKILLS_PATH))
        agents = read_file(str(AGENTS_PATH))
        print(f"✓ SKILLS.md  ({len(skills)} chars)")
        print(f"✓ AGENTS.md  ({len(agents)} chars)")
    except Exception as e:
        print(f"✗ File loading: {e}")
        return

    try:
        llm = create_llm()
        resp = llm.invoke([("human", "Reply with exactly one word: hello")])
        print(f"✓ LLM: {resp.content}")
    except Exception as e:
        print(f"✗ LLM: {e}")
        return

    test_url = "https://apacrelocation.com"
    try:
        text = scrape_website(test_url)
        print(f"✓ Scrape ({len(text)} chars from {test_url})")
    except Exception as e:
        print(f"✗ Scrape: {e}")
        return

    try:
        website_input = WebsiteInput(website=test_url)
        profile = extract_business_profile(llm, website_input, text)
        print(f"✓ Profile: {profile.company_name} ({profile.business_domain})")
    except Exception as e:
        print(f"✗ Profile: {e}")
        return

    try:
        gen = ReportGenerator()
        report = gen.generate(test_url)
        print(f"✓ Report generated — overall score: {report.overall_score:.1f}")
        print(f"  SEO: {report.seo.score:.1f}")
        print(f"  GEO: {report.geo.score:.1f}")
        print(f"  AEO: {report.aeo.score:.1f}")
    except Exception as e:
        print(f"✗ Report generation: {e}")
        return

    try:
        pdf_path = generate_pdf(report, "/tmp/report-smoke-test.pdf")
        print(f"✓ PDF written to {pdf_path}")
    except Exception as e:
        print(f"✗ PDF generation: {e}")
        return

    print("\n✓ All smoke tests passed")


if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 2 and sys.argv[1] not in ("-h", "--help"):
        main()
    else:
        _smoke_test()