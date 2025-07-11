from django.db import models

class Paciente(models.Model):
    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField(null=True, blank=True)
    nome_mae = models.CharField(max_length=100, null=True, blank=True)
    leito = models.CharField(max_length=10)
    data_admissao = models.DateTimeField()
    data_alta = models.DateTimeField(null=True, blank=True)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nome} - Leito {self.leito}"


class Dispositivo(models.Model):
    TIPO_CHOICES = [
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
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='dispositivos')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    data_insercao = models.DateTimeField()
    data_retirada = models.DateTimeField(null=True, blank=True)
    local_insercao = models.CharField(max_length=100, null=True, blank=True)
    observacoes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.paciente.nome}"


class Medicacao(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='medicacoes')
    nome = models.CharField(max_length=100)
    dose = models.CharField(max_length=50)
    via = models.CharField(max_length=50)
    horario = models.TimeField()

    def __str__(self):
        return f"{self.nome} - {self.paciente.nome}"


class AvaliacaoFisica(models.Model):
    SISTEMA_CHOICES = [
        ('Aparência Geral', 'Aparência Geral'),
        ('Cabeça_Pescoço', 'Cabeça_Pescoço'),
        ('Neurológico', 'Neurológico'),
        ('Respiratório', 'Respiratório'),
        ('Cardiovascular', 'Cardiovascular'),
        ('Gastrointestinal', 'Gastrointestinal'),
        ('Urinário', 'Urinário'),
        ('Musculoesquelético', 'Musculoesquelético'),
        ('Tegumentar', 'Tegumentar'),
        # expandir conforme necessário
    ]
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='avaliacoes')
    sistema = models.CharField(max_length=50, choices=SISTEMA_CHOICES)
    achados = models.TextField()
    data = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.sistema} - {self.paciente.nome}"


class Plantao(models.Model):
    data = models.DateField()
    turno = models.CharField(max_length=20)  # exemplo: "Manhã", "Tarde", "Noite"
    enfermeiro_responsavel = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.data} - {self.turno}"


class SBAR(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='sbar')
    plantao = models.ForeignKey(Plantao, on_delete=models.CASCADE, related_name='sbars')
    situation = models.TextField()
    background = models.TextField()
    assessment = models.TextField()
    recommendation = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SBAR - {self.paciente.nome} ({self.plantao})"
