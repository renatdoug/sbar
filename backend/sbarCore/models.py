from django.db import models

class Patient(models.Model):
    name = models.CharField("Nome", max_length=100)
    birth_date = models.DateField("Data de nascimento", null=True, blank=True)
    mother_name = models.CharField("Nome da mãe", max_length=100, null=True, blank=True)
    bed_number = models.CharField("Leito", max_length=10)
    admission_date = models.DateTimeField("Data de admissão")
    discharge_date = models.DateTimeField("Data de alta", null=True, blank=True)
    is_active = models.BooleanField("Ativo", default=True)
    diagnosis = models.TextField("Diagnóstico", null=True, blank=True)
    status = models.CharField("Status", max_length=20, choices=[
        ('critical', 'Critical'),
        ('stable', 'Stable'),
        ('recovering', 'Recovering')
    ], default='stable')

    def __str__(self):
        return f"{self.name} - Bed {self.bed_number}"


class Device(models.Model):
    DEVICE_TYPE_CHOICES = [
        ('CVC', 'Cateter Venoso Central'),
        ('SNE', 'Sonda Nasoenteral'),
        ('SOG', 'Sonda Orogástrica'),
        ('VM', 'Ventilação Mecânica'),
        ('Drenos', 'Drenos'),
        ('SVD', 'Sonda Vesical de Demora'),
        ('Shilley', 'Shilley'),
        ('TOT', 'Tubo Orotraqueal'),
        ('TQT', 'Traqueostomia'),
        ('PAI', 'Pressão Arterial Ivansiva'),
        
        # adicionar outros conforme necessário
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='devices')
    type = models.CharField(max_length=10, choices=DEVICE_TYPE_CHOICES)
    insertion_date = models.DateTimeField()
    removal_date = models.DateTimeField(null=True, blank=True)
    insertion_site = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_type_display()} - {self.patient.name}"

    class Meta:
        verbose_name = "Dispositivo"
        verbose_name_plural = "Dispositivos"

class Medication(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=100)
    dose = models.CharField(max_length=50)
    route = models.CharField(max_length=50)
    time = models.TimeField()

    def __str__(self):
        return f"{self.name} - {self.patient.name}"

    class Meta:
        verbose_name = "Medicação"
        verbose_name_plural = "Medicações"


class PhysicalAssessment(models.Model):
    SYSTEM_CHOICES = [
        ('Aparência Geral', 'Aparência Geral'),
        ('Cabeça_Pescoço', 'Cabeça_Pescoço'),
        ('Neurológico', 'Neurológico'),
        ('Respiratório', 'Respiratório'),
        ('Cardiovascular', 'Cardiovascular'),
        ('Gastrointestinal', 'Gastrointestinal'),
        ('Urinário', 'Urinário'),
        ('Musculoesquelético', 'Musculoesquelético'),
        ('Tegumentar', 'Tegumentar'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='assessments')
    system = models.CharField(max_length=50, choices=SYSTEM_CHOICES)
    findings = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.system} - {self.patient.name}"

    class Meta:
        verbose_name = "Avaliação Física"
        verbose_name_plural = "Avaliações Físicas"


class Shift(models.Model):
    date = models.DateField()
    shift_period = models.CharField(max_length=20)  # e.g., "Morning", "Afternoon", "Night"
    nurse_in_charge = models.CharField(max_length=100, default="Unknown")

    def __str__(self):
        return f"{self.date} - {self.shift_period}"

    class Meta:
        verbose_name = "Plantão"
        verbose_name_plural = "Plantoes"


class SBAR(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='sbar_records')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='sbar_records')
    situation = models.TextField()
    background = models.TextField()
    assessment = models.TextField()
    recommendation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SBAR - {self.patient.name} ({self.shift})"

    class Meta:
        verbose_name = "Registro SBAR"
        verbose_name_plural = "Registros SBAR"
