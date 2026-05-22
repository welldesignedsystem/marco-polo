import logging
import logging.handlers
import os
from pathlib import Path


LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "marco-polo.log"


def configure_logging(level: int = logging.DEBUG) -> None:
    """Configure root logger with a rotating file handler and console handler."""
    root = logging.getLogger()
    if root.handlers:
        return

    root.setLevel(level)

    fmt = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
    )

    fh = logging.handlers.RotatingFileHandler(
        LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=5, encoding="utf-8"
    )
    fh.setFormatter(fmt)
    fh.setLevel(level)
    root.addHandler(fh)

    ch = logging.StreamHandler()
    ch.setFormatter(fmt)
    ch.setLevel(logging.INFO)
    root.addHandler(ch)


def get_logger(name: str | None = None) -> logging.Logger:
    configure_logging()
    return logging.getLogger(name)
