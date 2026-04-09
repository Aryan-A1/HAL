"""Backend package initialization."""

import os
import platform

# Work around slow/hanging WMI lookups on some Windows setups.
if os.name == "nt":
	arch = os.environ.get("PROCESSOR_ARCHITECTURE")
	if arch:
		def _fast_machine() -> str:
			return arch

		platform.machine = _fast_machine
