from . import auth, crop, scheme, weather

try:
    from . import chatbot, irrigation
except ImportError:
    pass
