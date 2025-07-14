from rest_framework import viewsets
from .models import Patient, Device, Medication, PhysicalAssessment, Shift, SBAR
from .serializers import (
    PatientSerializer, DeviceSerializer, MedicationSerializer,
    PhysicalAssessmentSerializer, ShiftSerializer, SBARSerializer
)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer


class PhysicalAssessmentViewSet(viewsets.ModelViewSet):
    queryset = PhysicalAssessment.objects.all()
    serializer_class = PhysicalAssessmentSerializer


class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer


class SBARViewSet(viewsets.ModelViewSet):
    queryset = SBAR.objects.all()
    serializer_class = SBARSerializer
