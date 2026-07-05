import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Phone, 
  MessageSquare, 
  Heart, 
  BookOpen, 
  Compass, 
  ShieldAlert,
  Sparkles,
  Award
} from 'lucide-react';

interface ResourcesProps {
  onBack: () => void;
}

export const SimulatorResources: React.FC<ResourcesProps> = ({ onBack }) => {
  // Safe helper to trigger tel/sms dial in the simulator.
  // It matches the dial format of other screens
  const handleTriggerDial = (number: string) => {
    window.parent.postMessage({ type: 'DIAL_NUMBER', number }, '*');
    // Also trigger standard device window action
    window.location.href = `tel:${number}`;
  };

  const categories = [
    {
      title: "Immediate & Crisis Support",
      icon: <ShieldAlert size={14} className="text-rose-600" />,
      items: [
        {
          name: "988 Suicide & Crisis Lifeline",
          desc: " provides free, confidential 24/7 support for anyone experiencing suicidal thoughts or emotional distress.",
          link: "https://988lifeline.org",
          badge: "24/7 Support",
          badgeColor: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",
          action: { type: "phone", label: "Call 988", value: "988" }
        },
        {
          name: "The Trevor Project",
          desc: "Leading suicide prevention and crisis intervention services targeting LGBTQ+ young people worldwide.",
          link: "https://www.thetrevorproject.org",
          badge: "LGBTQ+ Youth",
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50",
          action: { type: "phone", label: "Call Helpline", value: "18664887386" }
        },
        {
          name: "Crisis Text Line",
          desc: "Connects with a volunteer crisis counselor 24/7 over SMS to talk through hard thoughts safely.",
          link: "https://www.crisistextline.org",
          badge: "Text HOME",
          badgeColor: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50",
          action: { type: "sms", label: "Text 741741", value: "741741" }
        }
      ]
    },
    {
      title: "Community & Clinical Directories",
      icon: <Award size={14} className="text-emerald-600" />,
      items: [
        {
          name: "NAMI",
          desc: "National Alliance on Mental Illness. Offers support groups, clinical education plans, and advocacy tools.",
          link: "https://www.nami.org",
          badge: "Community",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
        },
        {
          name: "Mental Health America (MHA)",
          desc: "Provides free, anonymous, and clinically validated mental health screening tests and educational materials.",
          link: "https://mhanational.org",
          badge: "Self-Screening",
          badgeColor: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50"
        },
        {
          name: "SAMHSA National Directory",
          desc: "Treatment referral and resource information service for mental wellness and substance care.",
          link: "https://www.samhsa.gov",
          badge: "Referral Program",
          badgeColor: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50"
        },
        {
          name: "The Family Acceptance Project",
          desc: "Research-based family support initiative to prevent wellness risks and promote acceptance for LGBTQ+ children and youth.",
          link: "https://familyproject.sfsu.edu",
          badge: "LGBTQ+ & Family Support",
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50"
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] overflow-y-auto no-scrollbar">
      {/* Header bar */}
      <div className="flex items-center space-x-2.5 p-5 pb-3 sticky top-0 bg-[#F1F5F2]/95 backdrop-blur-md z-10">
        <button 
          type="button"
          onClick={onBack}
          className="p-1 px-1.5 rounded-xl hover:bg-[#E1E8E3] text-[#4A6741] transition active:scale-95 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
        </button>
        <div className="text-left">
          <span className="text-[9px] font-black tracking-widest text-[#4A6741] uppercase">Self-Guided Support</span>
          <h2 className="text-base font-black text-slate-800 leading-none mt-1">Resource Web Links</h2>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 pt-1 space-y-6">
        
        {/* Intro banner */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/40 shadow-xs text-left relative overflow-hidden">
          <div className="absolute top-1 right-1 opacity-10">
            <BookOpen size={60} className="text-[#4A6741]" />
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <h3 className="text-xs font-black text-slate-800">Support Resources</h3>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Here is a curated directory of validated support networks, clinical databases, and daily self-care platforms. Tap any organization to visit their official website or initiate direct messaging support channels safely.
          </p>
        </div>

        {/* Categories list */}
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center space-x-2 px-1 text-left">
              <span className="p-1 rounded-lg bg-white/80 border border-slate-200/30 shadow-3xs">{cat.icon}</span>
              <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-600">{cat.title}</h4>
            </div>

            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  className="bg-white p-4 rounded-[24px] border border-slate-200/40 shadow-3xs hover:border-[#CBD9CC] transition flex flex-col justify-between text-left relative"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
                      <h5 className="text-[11px] font-black text-slate-800 leading-tight">{item.name}</h5>
                    </div>

                    <p className="text-[9.5px] text-slate-500 leading-relaxed mb-3.5 pr-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    {/* Direct Outbound Web Link */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[34px] bg-[#E1E8E3] hover:bg-[#CAD9CC] text-[#4A6741] font-extrabold text-[10px] rounded-xl flex items-center justify-center space-x-1.5 transition active:scale-97 border-0 outline-none decoration-none"
                    >
                      <span>Visit Site</span>
                      <ExternalLink size={10} className="stroke-[2.5]" />
                    </a>

                    {/* Quick Call or SMS triggers */}
                    {item.action && (
                      <button
                        type="button"
                        onClick={() => handleTriggerDial(item.action!.value)}
                        className={`px-3.5 min-h-[34px] font-black text-[10px] rounded-xl flex items-center justify-center space-x-1 transition active:scale-97 border ${
                          item.action.type === 'phone'
                            ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                            : 'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100'
                        }`}
                        title={`${item.action.label}`}
                      >
                        {item.action.type === 'phone' ? <Phone size={10} /> : <MessageSquare size={10} />}
                        <span>{item.action.label}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Closing Notice */}
        <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-3xl text-center select-none">
          <p className="text-[9px] text-slate-400 font-medium">
            Mental Health Toolkit does not track outbound links. Your clinical resources search remains private and confidential within your local session data at all times.
          </p>
        </div>

      </div>
    </div>
  );
};
