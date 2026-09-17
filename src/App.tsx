import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { 
  MapPin, 
  Download,
  ExternalLink,
  Share2
} from "lucide-react";

// Artistic Editorial Section Title with gold trailing border line
const SectionTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-serif italic text-brand-primary text-[17px] md:text-[18px] print:text-[12px] mb-2.5 print:mb-1.5 flex items-center after:content-[''] after:flex-grow after:border-t-[1.5px] after:border-brand-gold/40 after:ml-3 print:after:border-brand-gold print:after:opacity-100 ${className}`}>
    {children}
  </h2>
);

const Section = ({ 
  title, 
  children, 
  delay = 0.1, 
  className = "" 
}: { 
  title: string; 
  children: ReactNode; 
  delay?: number; 
  className?: string; 
}) => (
  <motion.section 
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={`mb-6 print:mb-2.5 ${className}`}
  >
    <SectionTitle>{title}</SectionTitle>
    <div className="text-brand-text text-[13px] md:text-[13.5px] print:text-[9.5px] leading-[1.55] print:leading-[1.32] space-y-2 print:space-y-1">
      {children}
    </div>
  </motion.section>
);

const PHOTO_CANDIDATES = [
  "/IMG_6120.JPEG",
  "/mayara-barros.png",
];

export default function App() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "true") {
      setIsReadyToPrint(true);
      setTimeout(() => {
        window.print();
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 800);
    }
  }, []);

  const handleDownloadPDF = () => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isInAppBrowser = (ua.indexOf("FBAN") > -1) || 
                           (ua.indexOf("FBAV") > -1) || 
                           (ua.indexOf("Instagram") > -1) || 
                           (ua.indexOf("WhatsApp") > -1);

    if (isInAppBrowser) {
      alert("⚠️ Para salvar ou imprimir o PDF, abra no navegador padrão (Chrome ou Safari). Clique nos 3 pontinhos e escolha 'Abrir no navegador'.");
      return;
    }

    if (window.self !== window.top) {
      const url = window.location.href.split('?')[0] + '?print=true';
      window.open(url, "_blank");
    } else {
      window.print();
    }
  };

  const handleShare = () => {
    const baseUrl = window.location.href.split('?')[0]; 
    const cacheBusterUrl = baseUrl.endsWith('/') ? `${baseUrl}?v=2026` : `${baseUrl}/?v=2026`;
    
    const message = `*Biografia Institucional | Mayara Barros*\nMobilização Social • Articulação Institucional • Construção de Movimentos e Territórios\n${cacheBusterUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center selection:bg-brand-gold/30 selection:text-brand-primary print:min-h-0 print:bg-brand-bg relative antialiased">
      
      {/* Mobile / In-App Print Modal Fallback */}
      {isReadyToPrint && (
        <div className="print:hidden fixed inset-0 bg-[#F7F6F3]/95 backdrop-blur-sm z-[100000] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 md:p-12 w-full max-w-[420px] border-[1.5px] border-brand-gold shadow-[8px_8px_0_0_rgba(198,168,107,0.3)] flex flex-col items-center">
            <Download size={32} className="text-brand-primary mb-3" />
            <h2 className="text-brand-primary font-serif text-[22px] mb-2 font-normal">Biografia Institucional</h2>
            <p className="text-brand-text text-[13px] leading-relaxed mb-6">
              Se o diálogo de impressão não abriu automaticamente em seu dispositivo móvel, clique no botão abaixo:
            </p>
            <button 
               onClick={() => window.print()}
               className="w-full py-[12px] bg-brand-primary text-white uppercase tracking-[0.1em] text-[11px] font-semibold hover:opacity-95 transition-all mb-3 cursor-pointer"
            >
               Gerar PDF Agora
            </button>
            <button 
               onClick={() => setIsReadyToPrint(false)}
               className="text-[12px] text-brand-text underline cursor-pointer"
            >
               Voltar para Visualização
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="print:hidden fixed bottom-6 right-5 md:bottom-8 md:right-8 flex flex-col sm:flex-row gap-2.5 z-[9999]">
        <button 
          onClick={handleShare}
          title="Compartilhar no WhatsApp"
          className="p-3 bg-brand-primary text-white border border-brand-primary/30 flex items-center justify-center shadow-[3px_3px_0_0_rgba(198,168,107,0.35)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer rounded-[2px]"
        >
          <Share2 size={16} />
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="px-4 py-3 bg-brand-primary text-[#F7F6F3] flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.08em] shadow-[3px_3px_0_0_rgba(198,168,107,0.35)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer rounded-[2px] font-medium"
        >
          <Download size={14} />
          <span>Salvar / Imprimir PDF</span>
        </button>
      </div>

      {/* 
        A4 Document Container
        Screen: max-w-[1040px], px-6 py-10 md:px-12 md:py-10
        Print: exact 210mm x 297mm single page layout
      */}
      <div className="w-full max-w-[1040px] px-6 py-8 md:px-12 md:py-10 print:px-[10mm] print:py-[8mm] print:max-w-none print:w-[210mm] print:h-[297mm] print:overflow-hidden print:bg-brand-bg relative box-border flex flex-col justify-between">
        
        {/* Top Header Section */}
        <header className="flex justify-between items-start md:items-end print:items-center border-b-[1.5px] border-brand-gold pb-5 mb-5 print:pb-2.5 print:mb-2.5 flex-col md:flex-row print:flex-row gap-6 print:gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1"
          >
            <div className="text-[10px] md:text-[11px] print:text-[8px] uppercase tracking-[0.2em] text-brand-gold font-semibold mb-1">
              Biografia Institucional
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[54px] print:text-[34px] text-brand-primary font-normal leading-none mb-2 tracking-tight">
              Mayara Barros
            </h1>
            
            <p className="text-[11.5px] md:text-[12.5px] print:text-[8.5px] uppercase tracking-[0.08em] font-semibold text-brand-text leading-[1.4] max-w-[540px]">
              Mobilização Social • Articulação Institucional • Construção de Movimentos e Territórios
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative shrink-0 flex items-center justify-center print:!m-0"
          >
            <div className="w-[180px] h-[240px] md:w-[210px] md:h-[280px] print:w-[112px] print:h-[148px] bg-[#E0E0DE] border border-brand-gold rounded-[3px] overflow-hidden relative shadow-sm">
              <img 
                src={PHOTO_CANDIDATES[photoIndex]} 
                onError={() => {
                  setPhotoIndex(idx => (idx + 1 < PHOTO_CANDIDATES.length ? idx + 1 : idx));
                }}
                alt="Mayara Barros - Foto Institucional" 
                className="w-full h-full object-cover object-[center_35%] hover:scale-102 transition-transform duration-700 ease-in-out"
              />
            </div>
          </motion.div>
        </header>

        {/* 2-Column Balanced Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr] print:grid-cols-[1.18fr_0.82fr] gap-8 lg:gap-10 print:gap-5 flex-grow">
          
          {/* Coluna Principal (Left) */}
          <main className="flex flex-col">
            
            {/* Apresentação */}
            <Section title="Apresentação" delay={0.1}>
              <p>
                Mayara Barros construiu sua trajetória entre a administração pública, a mobilização social, a articulação institucional, a participação política e, mais recentemente, a formação e atuação prática no campo jurídico.
              </p>
              <p>
                Iniciou sua vida profissional aos 16 anos, na administração pública de Mato Grosso do Sul, construindo entre 2013 e 2024 uma trajetória de mais de uma década ligada às estruturas institucionais do Estado.
              </p>
              <p>
                A experiência aproximou sua atuação da gestão pública, do planejamento, da execução de projetos e da articulação entre pessoas, instituições e territórios.
              </p>
              <p>
                É fundadora do <strong className="font-semibold text-brand-primary">Movimento RÁZGA®</strong>, criado a partir de uma travessia pessoal que transformou experiência em posicionamento e, posteriormente, em movimento. Sua trajetória conecta hoje diferentes campos em torno de um mesmo eixo: pessoas, direitos, participação social e territórios.
              </p>
            </Section>

            {/* Movimento RÁZGA® */}
            <Section title="Movimento RÁZGA®" delay={0.2}>
              <p>
                Mayara transformou uma experiência individual de ruptura na origem de um movimento social. <span className="font-semibold text-brand-primary">RÁZGA significa RASGAR DE A A Z.</span>
              </p>
              <p>
                O movimento nasce das histórias e dos silenciamentos vividos por mulheres, mas compreende que romper sua normalização é uma responsabilidade que atravessa toda a sociedade. Mulheres, homens, lideranças, comunidades, movimentos e instituições podem encontrar seu lugar nessa construção.
              </p>
              <p>
                O RÁZGA não existe para falar por mulheres. Existe para contribuir para que suas próprias vozes encontrem espaço para serem ouvidas e para provocar responsabilidade diante daquilo que precisa ser visto, ouvido e transformado.
              </p>

              {/* RÁZGA Highlight Box */}
              <div className="mt-2.5 print:mt-1.5 p-3 print:p-2 bg-brand-primary/[0.03] border-l-2 border-brand-primary border-y border-r border-brand-gold/30 rounded-r-[2px] text-[12px] md:text-[12.5px] print:text-[8.5px] leading-relaxed">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                  <span className="font-serif italic font-semibold text-brand-primary">
                    “Quem não aceita o silêncio, RÁZGA.”
                  </span>
                  <span className="text-[10px] print:text-[7.5px] font-bold tracking-[0.1em] text-brand-gold uppercase px-1.5 py-0.5 border border-brand-gold/40">
                    EU RÁZGO.
                  </span>
                </div>
                <p className="italic text-brand-text/80 text-[11.5px] print:text-[8px]">
                  “Eu rasguei primeiro. Agora abro caminho.” — Frase da Fundadora
                </p>
                <div className="mt-2 print:mt-1 pt-1.5 border-t border-brand-gold/20 flex items-center justify-between">
                  <a 
                    href="https://razga.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] print:text-[8px] font-semibold text-brand-primary hover:underline"
                  >
                    <span>www.razga.vercel.app</span>
                    <ExternalLink size={12} className="print:hidden" />
                  </a>
                  <span className="text-[10px] print:text-[7.5px] uppercase tracking-wider text-brand-gold">
                    Movimento RÁZGA®
                  </span>
                </div>
              </div>
            </Section>

            {/* Trajetória: Administração Pública */}
            <Section title="Trajetória" delay={0.3}>
              <div className="text-[11px] print:text-[8px] uppercase tracking-[0.1em] font-semibold text-brand-gold mb-1">
                2013 — 2024 | ADMINISTRAÇÃO PÚBLICA
              </div>
              <p>
                Mayara iniciou sua trajetória profissional aos 16 anos e construiu, entre 2013 e 2024, uma trajetória de mais de uma década ligada à administração pública e às estruturas institucionais de Mato Grosso do Sul.
              </p>
              <div className="my-1.5 print:my-1 pl-3 print:pl-2 border-l border-brand-gold/40 text-[12.5px] print:text-[8.8px] leading-snug space-y-0.5 text-brand-text">
                <div>• Secretaria de Estado de Saúde</div>
                <div>• Secretaria de Estado de Fazenda</div>
                <div>• Secretaria de Estado de Educação</div>
                <div>• Fundação de Desporto e Lazer (Fundesporte)</div>
                <div>• Casa Civil</div>
              </div>
              <p>
                Sua experiência atravessou áreas administrativas, financeiras, controladoria, planejamento, gestão de projetos, gabinete e articulação institucional, acompanhando na prática a relação entre gestão, políticas públicas e a vida das pessoas.
              </p>
            </Section>

          </main>

          {/* Coluna Secundária (Right) */}
          <aside className="lg:border-l print:border-l border-brand-gold/30 lg:pl-8 print:pl-4 flex flex-col">
            
            {/* Mobilização Social e Atuação Institucional */}
            <Section title="Mobilização Social e Atuação Institucional" delay={0.25}>
              <p>
                Mayara atua na articulação de pessoas, projetos, lideranças e iniciativas voltadas à participação social e à construção de caminhos para mulheres, famílias e comunidades.
              </p>
              <p>
                É <strong className="font-semibold text-brand-primary">Vice-Presidente do Instituto Novo Horizonte</strong>, onde participa da estruturação de iniciativas sociais voltadas à cidadania, desenvolvimento social e fortalecimento de territórios.
              </p>
              <p>
                Também participa do <strong className="font-semibold text-brand-primary">Horizonte Mulher</strong>, programa do Instituto voltado ao acolhimento e encaminhamento de mulheres, fortalecendo redes e conexões comunitárias.
              </p>
            </Section>

            {/* Formação e Atuação Prática no Campo Jurídico */}
            <Section title="Formação e Atuação Prática no Campo Jurídico" delay={0.35}>
              <p>
                Em formação em Direito, Mayara também desenvolve atuação prática no campo jurídico, tanto em iniciativas sociais quanto no ambiente privado, sempre respeitados os limites profissionais aplicáveis à sua formação.
              </p>
              <p>
                No Instituto Novo Horizonte, participa de atendimentos, análise de demandas e construção de encaminhamentos junto a profissionais habilitados e à rede de acolhimento. Na esfera privada, integra rotinas de atendimento, análise documental e suporte jurídico prático.
              </p>
              <div className="pt-1 print:pt-0.5">
                <div className="text-[10px] print:text-[7.5px] uppercase tracking-[0.08em] text-brand-gold font-semibold mb-1">
                  Aproximação Temática:
                </div>
                <div className="text-[11px] print:text-[8px] font-semibold text-brand-primary uppercase tracking-[0.05em]">
                  Mulheres • Famílias • Violência Doméstica • Acesso a Direitos
                </div>
              </div>
            </Section>

            {/* Atuação Política */}
            <Section title="Atuação Política" delay={0.45}>
              <p>
                Participa de processos políticos e eleitorais desde 2016, com experiência em mobilização, organização de equipes, planejamento estratégico e operação de campanhas municipais, estaduais e federais.
              </p>
              <p>
                Foi candidata ao Legislativo Municipal de Campo Grande em 2024 e atualmente exerce a <strong className="font-semibold text-brand-primary">Presidência da Ação da Mulher Trabalhista de Mato Grosso do Sul — AMT/MS</strong>, integrando a construção de espaços de participação feminina.
              </p>
            </Section>

            {/* Formação Acadêmica */}
            <Section title="Formação" delay={0.5}>
              <div className="text-[13px] print:text-[9.5px]">
                <div className="font-semibold text-brand-primary">Bacharelado em Direito — UNIDERP</div>
                <div className="text-brand-gold text-[12px] print:text-[8.5px]">Em conclusão • 2026</div>
                <div className="text-brand-text/70 text-[11px] print:text-[8px]">Campo Grande — Mato Grosso do Sul</div>
              </div>
            </Section>

            {/* Áreas de Atuação */}
            <Section title="Áreas de Atuação" delay={0.55} className="mb-0 print:mb-0">
              <div className="flex flex-wrap gap-1 print:gap-0.5">
                {[
                  "Mobilização Social",
                  "Articulação Institucional",
                  "Gestão Pública",
                  "Construção de Movimentos",
                  "Desenvolvimento de Projetos",
                  "Conexão de Lideranças e Territórios",
                  "Formação e Atuação Prática no Campo Jurídico"
                ].map((area, i) => (
                  <span 
                    key={i} 
                    className="inline-block px-2 py-0.5 text-[10.5px] print:text-[7.5px] uppercase tracking-[0.04em] border border-brand-primary/40 text-brand-primary bg-white/40 print:bg-transparent rounded-[2px]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Section>

          </aside>

        </div>

        {/* Institutional Sign-off Footer */}
        <footer className="border-t border-brand-gold/30 pt-3 mt-4 print:pt-1.5 print:mt-2 text-brand-text flex flex-col md:flex-row print:flex-row justify-between items-start md:items-center print:items-center gap-2 text-[11px] print:text-[8px] leading-tight">
          <div>
            <div className="font-semibold text-brand-primary uppercase tracking-[0.08em] text-[12px] print:text-[8.5px]">
              Mayara Barros
            </div>
            <div className="text-brand-text/80 text-[11px] print:text-[7.5px]">
              Fundadora do Movimento RÁZGA® • Vice-Presidente do Instituto Novo Horizonte • Direito — em formação • Presidente da AMT/MS
            </div>
          </div>
          
          <div className="flex flex-col md:items-end print:items-end text-right">
            <div className="font-serif italic font-semibold text-brand-primary text-[11.5px] print:text-[8px]">
              RÁZGA® • QUEM NÃO ACEITA O SILÊNCIO, RÁZGA.
            </div>
            <div className="flex items-center gap-2 text-brand-gold text-[10px] print:text-[7.5px] uppercase tracking-[0.05em]">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="print:w-2.5 print:h-2.5" />
                Campo Grande – MS
              </span>
              <span>•</span>
              <a 
                href="https://razga.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-brand-primary"
              >
                www.razga.vercel.app
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
