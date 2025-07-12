from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import (
    PacienteViewSet, DispositivoViewSet, MedicacaoViewSet,
    AvaliacaoFisicaViewSet, PlantaoViewSet, SBARViewSet
)

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'dispositivos', DispositivoViewSet)
router.register(r'medicacoes', MedicacaoViewSet)
router.register(r'avaliacoes', AvaliacaoFisicaViewSet)
router.register(r'plantoes', PlantaoViewSet)
router.register(r'sbars', SBARViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
