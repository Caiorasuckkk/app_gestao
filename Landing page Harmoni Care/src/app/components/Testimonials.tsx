import { Star, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    name: 'Dr. Carlos Mendes',
    role: 'Médico Cardiologista',
    image: 'https://images.unsplash.com/photo-1770134223774-13b735e29201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2N0b3IlMjBzbWlsaW5nfGVufDF8fHx8MTc3Mzc4NDUxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'O Harmoni Care revolucionou minha clínica. Economizo cerca de 10 horas por semana com a automação de tarefas administrativas. Agora posso focar mais nos meus pacientes.',
    rating: 5,
  },
  {
    name: 'Dra. Juliana Santos',
    role: 'Psicóloga Clínica',
    image: 'https://images.unsplash.com/photo-1720874129553-1d2e66076b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjBwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3NzM3ODQ1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'A integração com outros profissionais é perfeita. Trabalho com nutricionistas e psiquiatras, e conseguimos compartilhar informações de forma segura e eficiente.',
    rating: 5,
  },
  {
    name: 'Dra. Ana Paula Costa',
    role: 'Nutricionista',
    image: 'https://images.unsplash.com/photo-1771343917024-0b5397850ccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb25pc3QlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzczNzg0NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'Interface intuitiva e fácil de usar. A emissão automática de notas fiscais me poupa muito tempo. Recomendo para todos os colegas de profissão.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FB7A7] font-semibold mb-2 block">DEPOIMENTOS</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
            Histórias de sucesso dos nossos clientes
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Veja como profissionais da saúde estão transformando suas práticas com Harmoni Care
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-to-b from-[#F6F8FA] to-white p-8 rounded-2xl border border-[#1F4E5F]/10 hover:shadow-xl transition-all relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#DCEFF3]" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#6FB7A7]">
                  <ImageWithFallback 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1F4E5F]">{testimonial.name}</h4>
                  <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#6FB7A7] text-[#6FB7A7]" />
                ))}
              </div>

              <p className="text-[#6B7280] leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
