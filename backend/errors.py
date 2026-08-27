"""The one exception type that crosses the services/ -> app/ boundary. See docs/API-CONTRACT.md §6.

Lives at the top level (not utils/ or services/) since both sides raise it: services/profile_service.py
(Aliff) and utils/simulate.py (Arjun) each reference it already.
"""


class ValidationError(ValueError):
    def __init__(self, message: str, field: str | None = None):
        super().__init__(message)
        self.field = field
        self.message = message
