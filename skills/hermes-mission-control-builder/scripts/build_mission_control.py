#!/usr/bin/env python3
import argparse
import os
from pathlib import Path
import sys
import tempfile


def reject_symlink(path):
    if path.is_symlink():
        raise ValueError(f"Refusing symlinked destination path: {path}")


def validate_destination(home, destination):
    reject_symlink(home)
    reject_symlink(home / "desktop-plugins")
    reject_symlink(destination.parent)
    reject_symlink(destination)


def install_plugin(source, destination, force=False):
    source_bytes = source.read_bytes()
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="wb", prefix=f".{destination.name}.", dir=destination.parent, delete=False
        ) as stream:
            temporary = Path(stream.name)
            stream.write(source_bytes)
            stream.flush()
            os.fsync(stream.fileno())
        if temporary.read_bytes() != source_bytes:
            raise OSError(f"Temporary plugin validation failed: {temporary}")
        if force:
            os.replace(temporary, destination)
        else:
            os.link(temporary, destination)
            temporary.unlink()
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--hermes-home", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    home = args.hermes_home or Path(os.environ.get("HERMES_HOME", "~/.hermes")).expanduser()
    source = Path(__file__).parents[1] / "templates/plugin.js"
    destination = home / "desktop-plugins/hermes-mission-control/plugin.js"
    try:
        validate_destination(home, destination)
    except ValueError as error:
        print(error, file=sys.stderr)
        return 1
    if args.dry_run:
        print(f"Would create {destination}")
        return
    if destination.exists() and not args.force:
        print(f"Plugin already exists; refusing overwrite: {destination}", file=sys.stderr)
        return 1
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        validate_destination(home, destination)
    except ValueError as error:
        print(error, file=sys.stderr)
        return 1
    try:
        install_plugin(source, destination, force=args.force)
    except FileExistsError:
        print(f"Plugin already exists; refusing overwrite: {destination}", file=sys.stderr)
        return 1
    print(destination)


if __name__ == "__main__":
    raise SystemExit(main())
