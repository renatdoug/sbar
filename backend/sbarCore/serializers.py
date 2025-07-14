# backend/sbarCore/serializers.py

from rest_framework import serializers
from .models import Patient, Device, Medication, PhysicalAssessment, Shift, SBAR


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'


class PhysicalAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalAssessment
        fields = '__all__'


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'


class SBARSerializer(serializers.ModelSerializer):
    class Meta:
        model = SBAR
        fields = '__all__'
