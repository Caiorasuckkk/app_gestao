import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Activity, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Progress } from './ui/progress';

const SPECIALTIES = [
  'Medicina',
  'Psicologia',
  'Nutrição',
  'Fisioterapia',
  'Odontologia',
  'Fonoaudiologia',
  'Terapia Ocupacional',
  'Outro',
];

const PRACTICE_TYPES = [
  { value: 'individual', label: 'Atendimento Individual', desc: 'Consultório próprio ou alugado' },
  { value: 'clinica', label: 'Clínica Multidisciplinar', desc: 'Equipe com múltiplos profissionais' },
  { value: 'hospital', label: 'Hospital ou Instituição', desc: 'Atendimento institucional' },
  { value: 'home', label: 'Atendimento Domiciliar', desc: 'Atendimento em casa do paciente' },
];

const FEATURES = [
  'Agenda Online',
  'Prontuário Eletrônico',
  'Teleconsulta',
  'Gestão Financeira',
  'Notas Fiscais Automáticas',
  'Relatórios e Análises',
  'Gestão de Equipes',
  'Prescrição Digital',
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    specialty: '',
    crm: '',
    practiceType: '',
    clinicName: '',
    patients: '',
    features: [] as string[],
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter((f) => f !== feature)
        : [...formData.features, feature],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8FA] to-[#DCEFF3]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1F4E5F]">
            <Activity className="w-8 h-8" />
            <span className="font-semibold text-xl">Harmoni Care</span>
          </div>
          <div className="text-sm text-[#6B7280]">
            Etapa {currentStep + 1} de {totalSteps}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-8 py-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Step 0: Bem-vindo */}
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#6FB7A7]/10 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8 text-[#6FB7A7]" />
              </div>
              <h1 className="text-3xl font-bold text-[#1F4E5F]">
                Bem-vindo ao Harmoni Care!
              </h1>
              <p className="text-lg text-[#6B7280]">
                Vamos configurar sua conta em alguns passos simples. Isso levará apenas 2 minutos.
              </p>
              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="bg-[#1F4E5F] hover:bg-[#6FB7A7] text-white px-8 h-12"
                >
                  Começar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: Especialidade */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F4E5F] mb-2">
                  Qual é sua especialidade?
                </h2>
                <p className="text-[#6B7280]">
                  Isso nos ajuda a personalizar sua experiência
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SPECIALTIES.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setFormData({ ...formData, specialty })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.specialty === specialty
                        ? 'border-[#6FB7A7] bg-[#6FB7A7]/5'
                        : 'border-gray-200 hover:border-[#6FB7A7]/50'
                    }`}
                  >
                    <span className="font-medium text-[#1F4E5F]">{specialty}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm">Número do registro profissional (CRM, CRP, etc.)</Label>
                <Input
                  id="crm"
                  placeholder="Ex: CRM 12345"
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          )}

          {/* Step 2: Tipo de Prática */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F4E5F] mb-2">
                  Como você atende seus pacientes?
                </h2>
                <p className="text-[#6B7280]">
                  Selecione o tipo que melhor descreve sua prática
                </p>
              </div>

              <RadioGroup
                value={formData.practiceType}
                onValueChange={(value) => setFormData({ ...formData, practiceType: value })}
              >
                <div className="space-y-3">
                  {PRACTICE_TYPES.map((type) => (
                    <div
                      key={type.value}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.practiceType === type.value
                          ? 'border-[#6FB7A7] bg-[#6FB7A7]/5'
                          : 'border-gray-200 hover:border-[#6FB7A7]/50'
                      }`}
                      onClick={() => setFormData({ ...formData, practiceType: type.value })}
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <div className="flex-1">
                        <Label htmlFor={type.value} className="font-medium text-[#1F4E5F] cursor-pointer">
                          {type.label}
                        </Label>
                        <p className="text-sm text-[#6B7280] mt-1">{type.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Nome da Clínica */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F4E5F] mb-2">
                  Qual o nome da sua clínica ou consultório?
                </h2>
                <p className="text-[#6B7280]">
                  Este nome aparecerá nos documentos e comunicações
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicName">Nome da clínica/consultório</Label>
                <Input
                  id="clinicName"
                  placeholder="Ex: Clínica Saúde & Bem Estar"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patients">Quantos pacientes você atende por mês?</Label>
                <select
                  id="patients"
                  value={formData.patients}
                  onChange={(e) => setFormData({ ...formData, patients: e.target.value })}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="0-30">0 a 30 pacientes</option>
                  <option value="31-60">31 a 60 pacientes</option>
                  <option value="61-100">61 a 100 pacientes</option>
                  <option value="100+">Mais de 100 pacientes</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Funcionalidades */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F4E5F] mb-2">
                  Quais recursos são mais importantes para você?
                </h2>
                <p className="text-[#6B7280]">
                  Selecione todas as opções que desejar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FEATURES.map((feature) => (
                  <div
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.features.includes(feature)
                        ? 'border-[#6FB7A7] bg-[#6FB7A7]/5'
                        : 'border-gray-200 hover:border-[#6FB7A7]/50'
                    }`}
                  >
                    <Checkbox
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <span className="font-medium text-[#1F4E5F]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Concluído */}
          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#6FB7A7]/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-[#6FB7A7]" />
              </div>
              <h2 className="text-3xl font-bold text-[#1F4E5F]">
                Tudo pronto!
              </h2>
              <p className="text-lg text-[#6B7280]">
                Sua conta está configurada. Agora você pode começar a gerenciar sua prática de forma profissional.
              </p>
              <div className="bg-[#F6F8FA] rounded-lg p-6 text-left">
                <h3 className="font-semibold text-[#1F4E5F] mb-4">Próximos passos:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6FB7A7] text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      1
                    </div>
                    <span className="text-[#6B7280]">Configure sua agenda e horários de atendimento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6FB7A7] text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      2
                    </div>
                    <span className="text-[#6B7280]">Adicione seus primeiros pacientes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6FB7A7] text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      3
                    </div>
                    <span className="text-[#6B7280]">Explore os recursos e personalize sua experiência</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep > 0 && (
            <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
              {currentStep < totalSteps - 1 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="border-gray-300"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="ml-auto bg-[#1F4E5F] hover:bg-[#6FB7A7] text-white px-8 h-11"
              >
                {currentStep === totalSteps - 1 ? 'Ir para o Dashboard' : 'Continuar'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
