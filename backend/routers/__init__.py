from . import auth, crop, scheme, weather, disease

try:
    from . import chatbot, irrigation
except ImportError:
    pass
