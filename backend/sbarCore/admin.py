# backend/sbarCore/admin.py

from django.contrib import admin
from django import forms
from .models import (
    Patient, Device, Medication,
    PhysicalAssessment, Shift, SBAR
)

# Formulário personalizado para Device (Dispositivo)
class DeviceForm(forms.ModelForm):
    class Meta:
        model = Device
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        device_type = cleaned_data.get('device_type')
        insertion_site = cleaned_data.get('insertion_site')

        types_without_site = ['SNE', 'SOG', 'TOT', 'TQT', 'SVD']
        if device_type in types_without_site and insertion_site:
            self.add_error(
                'insertion_site', 'Este campo não deve ser preenchido para o tipo selecionado.'
            )

        return cleaned_data

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    form = DeviceForm
    list_display = ('get_patient_name', 'get_device_type_display', 'insertion_date', 'removal_date')
    list_display_links = ('get_patient_name',)

    def get_patient_name(self, obj):
        return obj.patient.name
    get_patient_name.short_description = 'Paciente'

    def get_device_type_display(self, obj):
        return obj.get_device_type_display()
    get_device_type_display.short_description = 'Tipo de Dispositivo'

    class Media:
        js = ('sbarCore/admin/dispositivo.js',)


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'birth_date', 'mother_name', 'bed', 'admission_date', 'discharge_date', 'active')
    list_display_links = ('name',)

    class Media:
        js = ('sbarCore/admin/paciente.js',)


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'name', 'dose', 'route', 'time')

    def get_patient_name(self, obj):
        return obj.patient.name
    get_patient_name.short_description = 'Paciente'


@admin.register(PhysicalAssessment)
class PhysicalAssessmentAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'date', 'system', 'findings')

    def get_patient_name(self, obj):
        return obj.patient.name
    get_patient_name.short_description = 'Paciente'


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ('date', 'shift_period', 'nurse_in_charge')
    list_display_links = ('date',)


@admin.register(SBAR)
class SBARAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'get_shift', 'situation', 'background', 'assessment', 'recommendation', 'created_at')

    def get_patient_name(self, obj):
        return obj.patient.name
    get_patient_name.short_description = 'Paciente'

    def get_shift(self, obj):
        return f"{obj.shift.date} - {obj.shift.shift_period}"
    get_shift.short_description = 'Plantão'
