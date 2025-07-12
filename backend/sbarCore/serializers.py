from rest_framework import serializers
from .models import Paciente, Dispositivo, Medicacao, AvaliacaoFisica, Plantao, SBAR


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'


class DispositivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispositivo
        fields = '__all__'


class MedicacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicacao
        fields = '__all__'


class AvaliacaoFisicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvaliacaoFisica
        fields = '__all__'


class PlantaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plantao
        fields = '__all__'


class SBARSerializer(serializers.ModelSerializer):
    class Meta:
        model = SBAR
        fields = '__all__'
