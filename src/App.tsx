import { useState, useRef } from "react";
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  Loader2,
  ExternalLink
} from "lucide-react";

export default function App() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  // Reliable PDF Export via html2pdf.js
  const handleExportPDF = async () => {
    if (!documentRef.current) return;
    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Dynamically import html2pdf for robust client-side execution
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

      const opt = {
        margin: 0,
        filename: "Mayara_Barros_Perfil_Executivo_2026.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          scrollY: 0,
          backgroundColor: "#FAF8F5"
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait" 
        },
        pagebreak: { 
          mode: ["avoid-all", "css", "legacy"],
          before: ".pdf-page-2"
        }
      };

      await html2pdf().set(opt).from(documentRef.current).save();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("PDF export error:", err);
      // Fallback to window.print if html2pdf encounters an issue
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href.split('?')[0];
    const message = `*Mayara Barros — Perfil Executivo | 2026*\nEstrategista em Desenvolvimento Institucional e Projetos de Impacto\nTransformar intenção em direção. E direção em projetos que acontecem.\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    const url = window.location.href.split('?')[0];
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#EAE7E1] text-[#2D2828] flex flex-col items-center py-3 sm:py-6 md:py-10 pb-8 sm:pb-12 print:py-0 print:pb-0 print:bg-[#FAF8F5] relative antialiased selection:bg-[#631B26] selection:text-white">
      
      {/* Top Action Bar (Header with all actions) */}
      <nav aria-label="Menu de Ações" className="print:hidden w-full max-w-[820px] px-2 sm:px-4 md:px-0 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold text-[#631B26] tracking-wide px-1 sm:px-0">
          <span className="w-2 h-2 rounded-full bg-[#631B26]" />
          <span>Mayara Barros • Perfil Oficial</span>
        </div>

        <div className="w-full sm:w-auto grid grid-cols-4 sm:flex items-center gap-1 sm:gap-2">
          <button 
            onClick={handleCopyLink}
            title="Copiar Link"
            className="min-w-0 w-full sm:w-auto px-1 sm:px-2.5 py-1.5 bg-white text-[#631B26] border border-[#631B26]/25 hover:border-[#631B26] rounded text-[10px] sm:text-[11px] font-medium shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            {copied ? <Check size={12} className="text-emerald-700 shrink-0" /> : <ExternalLink size={12} className="shrink-0" />}
            <span className="truncate hidden sm:inline">{copied ? "Copiado!" : "Copiar Link"}</span>
            <span className="truncate sm:hidden">{copied ? "Copiado!" : "Copiar"}</span>
          </button>

          <button 
            onClick={handleShare}
            title="Compartilhar no WhatsApp"
            className="min-w-0 w-full sm:w-auto px-1 sm:px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] sm:text-[11px] font-medium shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            <Share2 size={12} className="shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>

          <button 
            onClick={handlePrint}
            title="Imprimir"
            className="min-w-0 w-full sm:w-auto px-1 sm:px-2.5 py-1.5 bg-white text-[#631B26] border border-[#631B26]/25 hover:border-[#631B26] rounded text-[10px] sm:text-[11px] font-medium shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            <Printer size={12} className="shrink-0" />
            <span className="truncate">Imprimir</span>
          </button>

          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            title="Baixar PDF Oficial"
            className="min-w-0 w-full sm:w-auto px-1 sm:px-3 py-1.5 bg-[#631B26] hover:bg-[#4F131D] text-white rounded text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap"
          >
            {isExporting ? (
              <>
                <Loader2 size={12} className="animate-spin shrink-0" />
                <span className="truncate">Gerando...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check size={12} className="text-emerald-300 shrink-0" />
                <span className="truncate">Baixado!</span>
              </>
            ) : (
              <>
                <Download size={12} className="shrink-0" />
                <span className="truncate">Baixar PDF</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Multi-Page Document Container (Targeted for PDF Export & Print) */}
      <main ref={documentRef} className="print-wrapper w-full max-w-[820px] flex flex-col items-center gap-6 sm:gap-8 print:gap-0 px-2 sm:px-4 md:px-0">
        
        {/* ======================================================== */}
        {/* PAGE 1                                                   */}
        {/* ======================================================== */}
        <section className="a4-page relative flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.1)] print:shadow-none border border-[#631B26]/10 print:border-none overflow-hidden rounded-[2px] sm:rounded-none">
          
          {/* Top Wine Bar */}
          <div className="w-full h-[14px] sm:h-[18px] bg-[#631B26] shrink-0" />

          {/* Page 1 Body */}
          <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-14 md:pt-8 md:pb-6 flex-grow flex flex-col justify-between">
            
            {/* Top Area: Profile Intro & Photo */}
            <div>
              <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start gap-5 sm:gap-6 mb-5 sm:mb-6">
                
                {/* Left Text Block */}
                <div className="flex-1 w-full text-left">
                  <div className="font-sans font-bold text-[10.5px] sm:text-[11px] md:text-[11.5px] uppercase tracking-[0.2em] text-[#631B26] mb-1.5">
                    Perfil Executivo | 2026
                  </div>
                  
                  <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[50px] leading-[1] text-[#1A1818] tracking-tight mb-2 sm:mb-2.5">
                    MAYARA<br />BARROS
                  </h1>

                  <div className="font-sans font-semibold text-[13.5px] sm:text-[14.5px] md:text-[15.5px] leading-[1.3] text-[#631B26] mb-3 sm:mb-4">
                    Estrategista em Desenvolvimento Institucional<br />e Projetos de Impacto
                  </div>

                  <div className="font-serif font-bold text-[15px] sm:text-[16px] md:text-[17.5px] leading-[1.28] text-[#1A1818]">
                    Transformar intenção em direção.<br />
                    E direção em projetos que acontecem.
                  </div>
                </div>

                {/* Right Photo Block - Exact vertical proportion and hand visibility */}
                <div className="shrink-0 self-center md:self-start">
                  <div className="w-[160px] h-[225px] sm:w-[190px] sm:h-[265px] md:w-[215px] md:h-[285px] bg-[#E5E0D8] rounded-[2px] overflow-hidden shadow-sm border border-[#631B26]/20">
                    <img 
                      src="/mayara-barros-livro.jpeg"
                      alt="Mayara Barros"
                      className="w-full h-full object-cover object-[center_36%]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.indexOf("IMG_6120") === -1) {
                          target.src = "/IMG_6120.JPEG";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Summary Paragraphs */}
              <div className="space-y-2.5 text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.58] text-[#2D2828] mb-5">
                <p className="font-medium text-[#1A1818]">
                  Mayara Barros atua conectando estratégia, pessoas, instituições e territórios para transformar desafios em soluções, projetos e resultados concretos.
                </p>
                <p>
                  Sua trajetória atravessa a administração pública, a política, a iniciativa privada e o terceiro setor. Diferentes ambientes que construíram, ao longo dos anos, uma mesma capacidade: ler cenários, encontrar caminhos, aproximar pessoas e instituições e transformar ideias em projetos capazes de acontecer.
                </p>
                <p className="font-medium text-[#1A1818]">
                  Hoje, essa experiência converge para uma atuação voltada ao desenvolvimento institucional e à construção de projetos de impacto, conectando estratégia à execução e propósito a resultados.
                </p>
              </div>

              {/* Horizontal Wine Divider Line */}
              <div className="w-full border-b-[1.5px] border-[#631B26] mb-5" />

              {/* 2-Column Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 text-[12px] md:text-[12.5px] leading-[1.52] text-[#2D2828]">
                
                {/* Column 1 (Left) */}
                <div className="space-y-4">
                  {/* UMA TRAJETÓRIA */}
                  <div>
                    <h2 className="font-sans font-bold text-[11px] md:text-[11.5px] uppercase tracking-[0.05em] text-[#631B26] mb-1.5 sm:mb-2 leading-snug">
                      Uma Trajetória Construída por Dentro das Instituições
                    </h2>
                    <div className="space-y-2">
                      <p>
                        Mayara começou a trabalhar aos <strong>16 anos</strong>. Entre <strong>2013 e 2024</strong>, construiu mais de uma década de experiência na administração pública de Mato Grosso do Sul.
                      </p>
                      <p>
                        Passou pelas Secretarias de Estado de <strong>Saúde, Fazenda e Educação</strong>, pela <strong>Fundesporte</strong> e pela <strong>Casa Civil</strong>, atuando em administração e finanças, controladoria, planejamento, projetos, gabinete e articulação institucional.
                      </p>
                      <p>
                        Essa experiência lhe permitiu conhecer as estruturas públicas por dentro e compreender como decisões, instituições e projetos se conectam às pessoas e aos territórios onde seus efeitos realmente acontecem.
                      </p>
                    </div>
                  </div>

                  {/* POLÍTICA, MOBILIZAÇÃO E PARTICIPAÇÃO */}
                  <div>
                    <h2 className="font-sans font-bold text-[11px] md:text-[11.5px] uppercase tracking-[0.05em] text-[#631B26] mb-1.5 sm:mb-2 leading-snug">
                      Política, Mobilização e Participação
                    </h2>
                    <div className="space-y-2">
                      <p>
                        Sua trajetória política começou em <strong>2016</strong> e reúne experiências em estratégia, mobilização, organização e formação de equipes, planejamento e operações de campanhas municipais, estaduais e federais.
                      </p>
                      <p>
                        Em <strong>2024</strong>, foi candidata ao Legislativo Municipal de Campo Grande. Atualmente, preside a <strong>Ação da Mulher Trabalhista de Mato Grosso do Sul - AMT/MS | PDT</strong>, com atuação na organização e ampliação da participação das mulheres nos espaços políticos e de decisão.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2 (Right) */}
                <div>
                  {/* DA EXPERIÊNCIA À CONSTRUÇÃO */}
                  <div>
                    <h2 className="font-sans font-bold text-[11px] md:text-[11.5px] uppercase tracking-[0.05em] text-[#631B26] mb-1.5 sm:mb-2 leading-snug">
                      Da Experiência à Construção
                    </h2>
                    <div className="space-y-2">
                      <p>
                        Mayara é sócia e cofundadora do <strong>Grupo Novo Horizonte®</strong>, ecossistema que conecta quatro frentes: <strong>Synapt Essence, Escola da Consciência Viva, Mundial Business e Instituto Novo Horizonte</strong>.
                      </p>
                      <p>
                        Cada frente atua a partir de uma dimensão própria, conectando desenvolvimento humano, formação, estratégia, negócios e impacto social sob uma visão comum:
                      </p>
                      
                      {/* Highlighted 3 Lines */}
                      <div className="py-1 space-y-0.5 font-serif font-bold text-[13.5px] md:text-[14px] text-[#631B26]">
                        <div>Pessoas fortalecidas.</div>
                        <div>Comunidades vivas.</div>
                        <div>Territórios regenerados.</div>
                      </div>

                      <p>
                        Dentro desse ecossistema, a <strong>Mundial Business</strong> representa a frente de estratégia, desenvolvimento institucional e projetos de impacto - território diretamente conectado à atuação profissional que Mayara vem consolidando.
                      </p>
                      <p>
                        No <strong>Instituto Novo Horizonte</strong>, onde exerce a Vice-Presidência, participa do desenvolvimento de projetos voltados a mulheres, famílias e comunidades, entre eles o <strong>Horizonte Mulher</strong>.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Wine Bar */}
          <div className="w-full h-[14px] sm:h-[18px] bg-[#631B26] shrink-0" />
        </section>


        {/* ======================================================== */}
        {/* PAGE 2                                                   */}
        {/* ======================================================== */}
        <section className="a4-page pdf-page-2 relative flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.1)] print:shadow-none border border-[#631B26]/10 print:border-none overflow-hidden rounded-[2px] sm:rounded-none">
          
          {/* Top Wine Bar */}
          <div className="w-full h-[14px] sm:h-[18px] bg-[#631B26] shrink-0" />

          {/* Page 2 Body */}
          <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-14 md:pt-8 md:pb-8 flex-grow flex flex-col justify-between">
            
            <div>
              {/* Header Title */}
              <div className="font-sans font-bold text-[10.5px] sm:text-[11px] md:text-[11.5px] uppercase tracking-[0.2em] text-[#631B26] mb-1.5">
                Movimento, Formação e Direção
              </div>

              <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-[38px] leading-[1.1] text-[#1A1818] tracking-tight mb-3 sm:mb-4">
                RÁZGA: QUANDO UMA EXPERIÊNCIA<br />
                SE TORNA MOVIMENTO
              </h2>

              {/* RÁZGA Texts */}
              <div className="space-y-2.5 text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#2D2828] mb-4">
                <p>
                  Mayara é fundadora do <strong>Movimento RÁZGA®</strong>, que nasceu de sua própria travessia por experiências de violência e silenciamento familiar, político e institucional. O que começou como uma ruptura individual encontrou outras histórias e ganhou dimensão coletiva.
                </p>
                <p>
                  Hoje, o RÁZGA conecta pessoas, lideranças, comunidades, movimentos e instituições em torno de uma escolha comum: não normalizar o silenciamento das mulheres e construir caminhos para que suas próprias vozes e demandas encontrem espaço e possam chegar aos lugares onde decisões são tomadas.
                </p>
              </div>

              {/* Process Box: ESCUTAR → NOMEAR → ROMPER → CONSTRUIR */}
              <div className="w-full border-[1.5px] border-[#1A1818]/80 py-2 sm:py-2.5 px-2 sm:px-4 mb-3.5 flex items-center justify-between text-center rounded-[1px] bg-[#FAF8F5]">
                <span className="font-sans font-bold text-[9.5px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.05em] sm:tracking-[0.14em] text-[#1A1818]">
                  Escutar
                </span>
                <span className="text-[#631B26] font-bold text-[12px] sm:text-[14px]">→</span>
                <span className="font-sans font-bold text-[9.5px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.05em] sm:tracking-[0.14em] text-[#1A1818]">
                  Nomear
                </span>
                <span className="text-[#631B26] font-bold text-[12px] sm:text-[14px]">→</span>
                <span className="font-sans font-bold text-[9.5px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.05em] sm:tracking-[0.14em] text-[#1A1818]">
                  Romper
                </span>
                <span className="text-[#631B26] font-bold text-[12px] sm:text-[14px]">→</span>
                <span className="font-sans font-bold text-[9.5px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.05em] sm:tracking-[0.14em] text-[#1A1818]">
                  Construir
                </span>
              </div>

              {/* Highlight Quote */}
              <div className="text-center my-3 sm:my-3.5 px-2">
                <p className="font-serif font-bold text-[13.5px] sm:text-[15px] md:text-[16px] text-[#631B26] leading-snug">
                  “O que há de humano em mim não aceita mais normalizar o silenciamento de uma mulher.”
                </p>
              </div>

              {/* Horizontal Wine Divider Line */}
              <div className="w-full border-b-[1.5px] border-[#631B26] mb-5" />

              {/* 2-Column Lower Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 text-[12px] md:text-[12.5px] leading-[1.52] text-[#2D2828] mb-6 sm:mb-8">
                
                {/* Column 1 (Left): DIREITO E NOVOS CAMINHOS */}
                <div>
                  <h3 className="font-sans font-bold text-[11px] md:text-[11.5px] uppercase tracking-[0.05em] text-[#631B26] mb-1.5 sm:mb-2 leading-snug">
                    Direito e Novos Caminhos
                  </h3>
                  <div className="space-y-2">
                    <p>
                      Graduanda em <strong>Direito pela UNIDERP</strong>, Mayara também atua no campo jurídico em demandas desenvolvidas pelo Instituto Novo Horizonte e no ambiente privado.
                    </p>
                    <p>
                      A formação jurídica se soma a uma trajetória construída entre gestão pública, política, instituições, negócios e impacto social, ampliando seu repertório para compreender estruturas e desenvolver projetos e soluções que atravessam diferentes setores.
                    </p>
                    <p>
                      Mais do que reunir experiências em áreas distintas, sua trajetória revela um fio comum: <strong>entender o cenário, construir direção, conectar quem precisa estar à mesa e transformar intenção em projetos capazes de acontecer.</strong>
                    </p>
                  </div>
                </div>

                {/* Column 2 (Right): ATUAÇÃO ATUAL */}
                <div>
                  <h3 className="font-sans font-bold text-[11px] md:text-[11.5px] uppercase tracking-[0.05em] text-[#631B26] mb-2 sm:mb-2.5 leading-snug">
                    Atuação Atual
                  </h3>
                  
                  <div className="space-y-2 text-[12px] md:text-[12.5px] leading-tight">
                    <div>
                      <div className="font-bold text-[#1A1818]">Sócia e Cofundadora</div>
                      <div className="text-[#3D3838]">Grupo Novo Horizonte®</div>
                    </div>
                    
                    <div>
                      <div className="font-bold text-[#1A1818]">Direção Estratégica</div>
                      <div className="text-[#3D3838]">Mundial Business</div>
                    </div>

                    <div>
                      <div className="font-bold text-[#1A1818]">Fundadora</div>
                      <div className="text-[#3D3838]">Movimento RÁZGA®</div>
                    </div>

                    <div>
                      <div className="font-bold text-[#1A1818]">Vice-Presidente</div>
                      <div className="text-[#3D3838]">Instituto Novo Horizonte</div>
                    </div>

                    <div>
                      <div className="font-bold text-[#1A1818]">Presidente</div>
                      <div className="text-[#3D3838]">AMT/MS | PDT</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Closing Sign-off */}
            <div className="pt-2">
              <div className="font-serif font-bold text-[22px] sm:text-[25px] md:text-[27px] text-[#1A1818] leading-tight mb-0.5">
                MAYARA BARROS
              </div>
              <div className="font-sans font-medium text-[12.5px] sm:text-[13px] md:text-[14px] text-[#631B26] mb-2 sm:mb-3">
                Estrategista em Desenvolvimento Institucional e Projetos de Impacto
              </div>
              <div className="font-serif font-bold text-[14.5px] sm:text-[15.5px] md:text-[17px] text-[#1A1818] leading-[1.3]">
                Transformar intenção em direção.<br />
                E direção em projetos que acontecem.
              </div>
            </div>

          </div>

          {/* Bottom Wine Bar */}
          <div className="w-full h-[14px] sm:h-[18px] bg-[#631B26] shrink-0" />
        </section>

      </main>

    </div>
  );
}
