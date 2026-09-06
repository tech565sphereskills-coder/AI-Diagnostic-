import re
from typing import Any, Tuple

def validate_email_format(email: str) -> bool:
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(regex, email))

def validate_password_strength(password: str) -> Tuple[bool, str]:
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    return True, ""
