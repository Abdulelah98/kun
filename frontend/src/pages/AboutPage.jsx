import { Eye, Target, Heart, Handshake } from "lucide-react";

const values = [
  { icon: Eye, title: "الرؤية", desc: "أن نكون الخيار الأول لمساحات العمل المشتركة في المملكة العربية السعودية، ونقدم بيئة عمل ملهمة تدعم الابتكار والنمو." },
  { icon: Target, title: "الرسالة", desc: "توفير مساحات عمل احترافية ومرنة مع خدمات متكاملة تمكن رواد الأعمال والشركات من تحقيق أهدافهم بكفاءة." },
  { icon: Heart, title: "الشغف", desc: "نؤمن بأن بيئة العمل الاحترافية والتعاونية تنتج أعمالاً إبداعية. شغفنا هو دعم نجاح عملائنا." },
  { icon: Handshake, title: "التعاون", desc: "نبني مجتمعاً تعاونياً يجمع بين المهنيين ورواد الأعمال لتبادل الخبرات وبناء شراكات ناجحة." },
];

export default function AboutPage() {
  return (
    <main data-testid="about-page" className="pt-16">
      {/* Header - Dark navy */}
      <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f47424] mb-4">من نحن</p>
          <h1 data-testid="about-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.2]">
            تعرّف على كن
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            رائدون في توفير مساحات العمل المشتركة في الرياض
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">من نحن</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  أهلاً بكم معنا في كن، الرواد على مستوى الرياض في توفير مساحات العمل المشتركة. نؤمن في كن بأن بيئة العمل الاحترافية والتعاونية تنتج أعمالاً إبداعية.
                </p>
                <p>
                  ولأن نجاحك هو الأهم لنا نقدم لك مساحات مكتبية من الدرجة الأولى، مصممة لتلبية احتياجاتك وتحقيق أهدافك وتتناسب مع مختلف أنواع وأحجام المشاريع والأعمال.
                </p>
                <p>
                  مساحاتنا المكتبية مصممة ومنشأة لتأمين أفضل بيئة عمل احترافية وتشاركية، وتقع في شمال مدينة الرياض، صممت بابتكار واحتراف ليكون عملك أفضل دائماً.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85"
                alt="مساحة عمل كن"
                className="w-full h-72 md:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">قيمنا</h2>
            <p className="text-gray-500 text-base md:text-lg">المبادئ التي نؤمن بها ونعمل وفقها</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                data-testid={`about-value-${i}`}
                className="group p-8 bg-white rounded-xl border border-gray-100 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-5">
                  <v.icon className="w-6 h-6 text-[#f47424]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                <div className="card-hover-line" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
