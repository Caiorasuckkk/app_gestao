import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, Video, MapPin } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';

const appointments = [
  { id: 1, time: '08:00', duration: 60, patient: 'Maria Silva', type: 'Consulta', status: 'confirmed', mode: 'presencial' },
  { id: 2, time: '09:30', duration: 60, patient: 'João Santos', type: 'Retorno', status: 'confirmed', mode: 'presencial' },
  { id: 3, time: '11:00', duration: 60, patient: 'Ana Costa', type: 'Primeira Consulta', status: 'pending', mode: 'presencial' },
  { id: 4, time: '14:00', duration: 60, patient: 'Pedro Oliveira', type: 'Consulta', status: 'confirmed', mode: 'online' },
  { id: 5, time: '15:30', duration: 60, patient: 'Carlos Mendes', type: 'Retorno', status: 'confirmed', mode: 'online' },
  { id: 6, time: '17:00', duration: 60, patient: 'Juliana Ribeiro', type: 'Consulta', status: 'confirmed', mode: 'presencial' },
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
];

export function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Agenda</h1>
          <p className="text-[#6B7280] mt-1">Gerencie seus horários e consultas</p>
        </div>
        <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
          <Plus className="w-4 h-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6FB7A7]"></div>
                <span className="text-sm text-[#6B7280]">Confirmada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-[#6B7280]">Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm text-[#6B7280]">Disponível</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F4E5F]">
                    {date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="text-sm text-[#6B7280]">{appointments.length} consultas agendadas</p>
                </div>
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={view === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('day')}
                  className={view === 'day' ? 'bg-[#1F4E5F]' : ''}
                >
                  Dia
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('week')}
                  className={view === 'week' ? 'bg-[#1F4E5F]' : ''}
                >
                  Semana
                </Button>
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('month')}
                  className={view === 'month' ? 'bg-[#1F4E5F]' : ''}
                >
                  Mês
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {timeSlots.map((timeSlot) => {
                const appointment = appointments.find(apt => apt.time === timeSlot);
                return (
                  <div key={timeSlot} className="flex gap-4">
                    <div className="w-20 text-sm font-medium text-[#6B7280] pt-2">
                      {timeSlot}
                    </div>
                    {appointment ? (
                      <div className={`flex-1 p-4 rounded-lg border-l-4 ${
                        appointment.status === 'confirmed'
                          ? 'border-[#6FB7A7] bg-[#6FB7A7]/5'
                          : 'border-yellow-500 bg-yellow-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[#1F4E5F]">{appointment.patient}</p>
                            <p className="text-sm text-[#6B7280] mt-1">{appointment.type}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                                <Clock className="w-3 h-3" />
                                {appointment.duration} min
                              </div>
                              {appointment.mode === 'online' ? (
                                <div className="flex items-center gap-1 text-xs text-[#6FB7A7]">
                                  <Video className="w-3 h-3" />
                                  Teleconsulta
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                                  <MapPin className="w-3 h-3" />
                                  Presencial
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <p className="text-sm text-[#6B7280]">Horário disponível</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Consultas Hoje</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-1">6</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-[#6FB7A7]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Confirmadas</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-1">5</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#6FB7A7]/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#6FB7A7]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Pendentes</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-1">1</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Taxa de Ocupação</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-1">75%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1F4E5F]/10 flex items-center justify-center text-[#1F4E5F] text-xs font-bold">
                ↑
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
