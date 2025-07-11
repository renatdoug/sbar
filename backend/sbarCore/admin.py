from django.contrib import admin
from django import forms
from .models import (
    Paciente, Dispositivo, Medicacao,
    AvaliacaoFisica, Plantao, SBAR
)

# Formulário personalizado para Dispositivo


class DispositivoForm(forms.ModelForm):
    class Meta:
        model = Dispositivo
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        tipo = cleaned_data.get('tipo')
        local_insercao = cleaned_data.get('local_insercao')

        tipos_sem_local = ['SNE', 'SOG', 'TOT', 'TQT', 'SVD']
        if tipo in tipos_sem_local and local_insercao:
            self.add_error(
                'local_insercao', 'Este campo não deve ser preenchido para o tipo selecionado.')

        return cleaned_data

# Admin com script JS para ocultar campo


@admin.register(Dispositivo)
class DispositivoAdmin(admin.ModelAdmin):
    form = DispositivoForm
    list_display = ('paciente', 'tipo', 'data_insercao', 'data_retirada')

    class Media:
        # Caminho relativo à pasta static
        js = ('sbarCore/admin/dispositivo.js',)

# Registro dos demais modelos


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data_nascimento', 'nome_mae',
                    'leito', 'data_admissao', 'data_alta', 'ativo')

    class Media:
        js = ('sbarCore/admin/paciente.js',)


@admin.register(Medicacao)
class MedicacaoAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'nome', 'dose', 'via', 'horario')


@admin.register(AvaliacaoFisica)
class AvaliacaoFisicaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'data', 'sistema', 'achados')


@admin.register(Plantao)
class PlantaoAdmin(admin.ModelAdmin):
    list_display = ('data', 'turno', 'enfermeiro_responsavel')


@admin.register(SBAR)
class SBARAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'plantao', 'situation',
                    'background', 'assessment', 'recommendation', 'criado_em')
