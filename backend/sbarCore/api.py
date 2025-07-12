from rest_framework import viewsets
from .models import Paciente, Dispositivo, Medicacao, AvaliacaoFisica, Plantao, SBAR
from .serializers import (
    PacienteSerializer, DispositivoSerializer, MedicacaoSerializer,
    AvaliacaoFisicaSerializer, PlantaoSerializer, SBARSerializer
)

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class DispositivoViewSet(viewsets.ModelViewSet):
    queryset = Dispositivo.objects.all()
    serializer_class = DispositivoSerializer

class MedicacaoViewSet(viewsets.ModelViewSet):
    queryset = Medicacao.objects.all()
    serializer_class = MedicacaoSerializer

class AvaliacaoFisicaViewSet(viewsets.ModelViewSet):
    queryset = AvaliacaoFisica.objects.all()
    serializer_class = AvaliacaoFisicaSerializer

class PlantaoViewSet(viewsets.ModelViewSet):
    queryset = Plantao.objects.all()
    serializer_class = PlantaoSerializer

class SBARViewSet(viewsets.ModelViewSet):
    queryset = SBAR.objects.all()
    serializer_class = SBARSerializer
