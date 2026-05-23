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


class ReportPDF(FPDF):
    """Professional PDF report styled for compliance output."""

    def __init__(self) -> None:
        super().__init__()
        self.add_font("DejaVu", "", f"{FONT_DIR}/DejaVuSans.ttf")
        self.add_font("DejaVu", "B", f"{FONT_DIR}/DejaVuSans-Bold.ttf")
        self.add_font("DejaVu", "I", f"{FONT_DIR}/DejaVuSans-Oblique.ttf")
        self.add_font("DejaVu", "BI", f"{FONT_DIR}/DejaVuSans-BoldOblique.ttf")

    def header(self) -> None:
        if self.page_no() > 1:
            self.set_font("DejaVu", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 8, "marco-polo  |  SEO / GEO / AEO Compliance Report", align="C")
            self.ln(10)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("DejaVu", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def cover_page(self, report: ComplianceReport) -> None:
        self.add_page()
        self.ln(50)
        self.set_font("DejaVu", "B", 28)
        self.set_text_color(30, 60, 110)
        self.cell(0, 14, "Compliance Report", align="C")
        self.ln(18)
        self.set_font("DejaVu", "", 14)
        self.set_text_color(60, 60, 60)
        self.cell(0, 10, report.company_name, align="C")
        self.ln(10)
        self.set_font("DejaVu", "", 11)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, report.website, align="C")
        self.ln(12)
        self.cell(0, 8, f"Report date: {report.report_date}", align="C")
        self.ln(20)
        self.set_font("DejaVu", "B", 48)
        self.set_text_color(30, 60, 110)
        self.cell(0, 20, f"{report.overall_score:.0f}/100", align="C")
        self.ln(14)
        self.set_font("DejaVu", "", 12)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "Overall Compliance Score", align="C")

    def section_title(self, title: str, color: tuple[int, int, int] = (30, 60, 110)) -> None:
        self.ln(6)
        self.set_font("DejaVu", "B", 16)
        self.set_text_color(*color)
        self.multi_cell(0, 12, title)
        self.ln(6)

    def sub_title(self, title: str) -> None:
        self.set_font("DejaVu", "B", 12)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 10, title)
        self.ln(4)

    def body_text(self, text: str) -> None:
        self.set_font("DejaVu", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet_list(self, items: list[str], indent: int = 10) -> None:
        self.set_font("DejaVu", "", 10)
        self.set_text_color(40, 40, 40)
        for item in items:
            for line in textwrap.wrap(item, width=95):
                self.set_x(self.l_margin + indent)
                self.cell(4, 5.5, "\u2022")
                self.multi_cell(0, 5.5, f" {line}")
            self.ln(1)

    def score_bar(self, score: float, max_score: float = 100) -> None:
        page_w = self.w - self.l_margin - self.r_margin
        bar_w = min(160, page_w)
        pct = min(score / max_score, 1.0)
        self.set_fill_color(230, 230, 230)
        self.rect(self.get_x(), self.get_y(), bar_w, 8, "F")
        if pct > 0.66:
            fill = (40, 180, 80)
        elif pct > 0.33:
            fill = (220, 180, 40)
        else:
            fill = (200, 60, 60)
        self.set_fill_color(*fill)
        self.rect(self.get_x(), self.get_y(), bar_w * pct, 8, "F")
        self.set_font("DejaVu", "B", 10)
        self.set_text_color(255, 255, 255)
        label = f"{score:.0f}%" if max_score == 100 else f"{score:.0f}/5"
        self.cell(bar_w, 8, label, align="C")
        self.set_text_color(40, 40, 40)
        self.ln(12)

    def dimension_section(self, title: str, dim: DimensionReport) -> None:
        self.section_title(title)

        self.sub_title(f"Score: {dim.score:.1f}/100")
        self.score_bar(dim.score)

        self.sub_title("Summary")
        self.body_text(dim.summary)

        self.sub_title("Strengths")
        self.bullet_list(dim.strengths)

        self.sub_title("Weaknesses")
        self.bullet_list(dim.weaknesses)

        self.sub_title("Recommendations")
        self.bullet_list(dim.recommendations)

        self.sub_title("Criterion Scores")
        for c in dim.criteria:
            self.set_font("DejaVu", "B", 9)
            self.set_text_color(40, 40, 40)
            self.multi_cell(0, 6, f"{c.name}  --  {c.score}/5")
            self.score_bar(float(c.score), 5.0)
            self.set_font("DejaVu", "", 9)
            self.set_text_color(80, 80, 80)
            for line in textwrap.wrap(c.finding, width=95):
                self.set_x(self.l_margin + 6)
                self.multi_cell(0, 4.5, line)
            self.ln(3)

    def action_plan_section(self, report: ComplianceReport) -> None:
        self.section_title("Action Plan", color=(200, 80, 30))

        all_items: list[tuple[str, str, str]] = []
        for rec in report.seo.recommendations:
            all_items.append(("SEO", rec, "medium"))
        for rec in report.geo.recommendations:
            all_items.append(("GEO", rec, "medium"))
        for rec in report.aeo.recommendations:
            all_items.append(("AEO", rec, "medium"))

        for i, (dim, rec, effort) in enumerate(all_items, 1):
            self.set_font("DejaVu", "B", 10)
            self.set_text_color(200, 80, 30)
            self.cell(0, 7, f"{i}. [{dim}] (effort: {effort})")
            self.ln(7)
            self.set_font("DejaVu", "", 10)
            self.set_text_color(40, 40, 40)
            for line in textwrap.wrap(rec, width=95):
                self.set_x(self.l_margin + 8)
                self.multi_cell(0, 5.5, line)
            self.ln(4)


def generate_pdf(report: ComplianceReport, output_path: str) -> str:
    pdf = ReportPDF()
    pdf.alias_nb_pages()

    pdf.cover_page(report)

    pdf.add_page()
    pdf.section_title("Executive Summary")
    pdf.body_text(
        f"This report evaluates {report.company_name} ({report.website}) "
        f"across three modern compliance dimensions: Search Engine Optimization (SEO), "
        f"Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO)."
    )
    pdf.ln(2)
    pdf.sub_title(f"Overall Score: {report.overall_score:.1f}/100")
    pdf.score_bar(report.overall_score)
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

    parser = argparse.ArgumentParser(
        description="Marco-Polo Compliance Report Generator"
    )
    parser.add_argument("url", help="Website URL to analyze")
    parser.add_argument(
        "--focus",
        default="",
        help="Optional search focus or context",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output PDF path (default: report-<domain>.pdf)",
    )
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


# ── Smoke test ──────────────────────────────────────────────────────

def _smoke_test() -> None:
    print("=== ReportGenerator smoke test ===\n")

    # 1. File loading
    try:
        skills = read_file(str(SKILLS_PATH))
        agents = read_file(str(AGENTS_PATH))
        print(f"✓ SKILLS.md  ({len(skills)} chars)")
        print(f"✓ AGENTS.md  ({len(agents)} chars)")
    except Exception as e:
        print(f"✗ File loading: {e}")
        return

    # 2. LLM creation + simple call
    try:
        llm = create_llm()
        resp = llm.invoke([("human", "Reply with exactly one word: hello")])
        print(f"✓ LLM: {resp.content}")
    except Exception as e:
        print(f"✗ LLM: {e}")
        return

    # 3. Scrape + profile extraction
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

    # 4. Full report generation (runs all three dimensions)
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

    # 5. PDF output
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
