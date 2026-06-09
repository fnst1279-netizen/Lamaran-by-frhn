import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Download, 
  Copy, 
  FileText, 
  Check, 
  RefreshCw, 
  User, 
  Building2, 
  FileSpreadsheet, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  Calendar,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Wrench,
  BookOpen,
  Code,
  X
} from "lucide-react";
import { jsPDF } from "jspdf";
// @ts-ignore
import devAvatar from "./assets/images/dev_avatar_1781029747280.png";

// Default letter preset interface
interface LetterPreset {
  name: string;
  senderName: string;
  senderBirthDetails: string;
  senderEducation: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderLocation: string;
  senderDate: string;
  recipient: string;
  companyName: string;
  companyAddress: string;
  positionApplied: string;
  sourceInfo: string;
  experience: string;
  skills: string;
  additionalNotes: string;
  tone: string;
}

export default function App() {
  // Preset templates
  const presets: Record<string, LetterPreset> = {
    freshGraduate: {
      name: "Fresh Graduate IT (Budi)",
      senderName: "Budi Santoso, S.Kom.",
      senderBirthDetails: "Jakarta, 15 Juli 2003",
      senderEducation: "S1 Teknik Informatika, Universitas Indonesia (IPK 3.82)",
      senderEmail: "budi.santoso@email.com",
      senderPhone: "081234567890",
      senderAddress: "Jl. Margonda Raya No. 12, Depok, Jawa Barat",
      senderLocation: "Jakarta",
      senderDate: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
      recipient: "Pimpinan / HRD Manager",
      companyName: "PT. Global Teknologi Nusantara",
      companyAddress: "Gedung Cyber 2 Lt. 15, Jl. HR. Rasuna Said, Jakarta Selatan",
      positionApplied: "Junior Frontend Web Developer",
      sourceInfo: "lowongan karir LinkedIn PT. Global Teknologi Nusantara",
      experience: "Menyelesaikan magang selama 6 bulan di startup software house lokal. Berhasil membangun 3 modul dashboard interaktif dengan React.js dan Tailwind CSS, serta aktif berkontribusi di proyek open-source kampus.",
      skills: "React.js, TypeScript, Next.js, Tailwind CSS, RESTful API, Git & GitHub.",
      additionalNotes: "Saya memiliki motivasi tinggi untuk belajar cepat, disiplin tinggi dalam penyelesaian deadline, serta bersedia berkolaborasi aktif dalam tim pengembangan produk.",
      tone: "Profesional",
    },
    experiencedAdmin: {
      name: "Staf Admin Berpengalaman (Siti)",
      senderName: "Siti Rahma, A.Md.",
      senderBirthDetails: "Bandung, 3 Mei 1999",
      senderEducation: "D3 Administrasi Perkantoran, Politeknik Negeri Bandung",
      senderEmail: "siti.rahma@email.com",
      senderPhone: "085712345678",
      senderAddress: "Jl. Pasteur No. 45, Bandung, Jawa Barat",
      senderLocation: "Bandung",
      senderDate: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
      recipient: "Kepala HRD & Personalia",
      companyName: "PT. Sentosa Makmur Abadi",
      companyAddress: "Jl. Gatot Subroto No. 42, Batununggal, Bandung",
      positionApplied: "Executive Administrative Staff",
      sourceInfo: "iklan lowongan di portal karir JobStreet",
      experience: "Memiliki 3 tahun pengalaman kerja penuh waktu sebagai staf administrasi umum dan pengarsipan digital di perusahaan manufaktur. Sukses menyusun ribuan arsip perusahaan secara nir-kertas (paperless) dan mengoordinasikan akomodasi perjalanan dinas direksi.",
      skills: "Microsoft Office (Excel Advanced, Word, PPT), SAP Business One, manajemen arsip, korespondensi surat niaga, komunikasi antar personal.",
      additionalNotes: "Mampu bekerja di bawah tekanan tinggi dengan tingkat ketelitian 99% dalam verifikasi dokumen invoice, serta memiliki sertifikasi kompetensi administrasi perkantoran berstandar nasional.",
      tone: "Formal",
    },
    creativeDesigner: {
      name: "Desainer Grafis Percaya Diri (Rian)",
      senderName: "Rian Wijaya",
      senderBirthDetails: "Yogyakarta, 20 September 2001",
      senderEducation: "S1 Desain Komunikasi Visual (DKV), Institut Seni Indonesia Yogyakarta",
      senderEmail: "rian.wijaya@email.com",
      senderPhone: "081987654321",
      senderAddress: "Jl. Malioboro No. 101, Danurejan, Yogyakarta",
      senderLocation: "Yogyakarta",
      senderDate: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
      recipient: "Creative Director / HR Department",
      companyName: "PT. Media Kreatif Indonesia",
      companyAddress: "Epicentrum Walk Mall Lt. 3, Blok B-302, Jakarta Selatan",
      positionApplied: "Creative Graphic Designer",
      sourceInfo: "pemberitahuan lowongan kerja di Instagram Story @mediakreatif.id",
      experience: "Bekerja lepas (freelance) selama 2 tahun menggarap branding visual komprehensif untuk lebih dari 15 pelaku UMKM kuliner nasional. Berhasil meningkatkan interaksi pelanggan sosial media klien sebesar 35% melalui konten infografis unik.",
      skills: "Adobe Illustrator, Photoshop, Figma, After Effects, corporate branding, layout buku, digital illustration.",
      additionalNotes: "Portofolio desain lengkap serta ulasan klien dapat diakses secara terbuka melalui situs Behance.net/rianwijaya. Saya menyukai tantangan kreatif dan pemecahan isu pemasaran lewat komunikasi visual.",
      tone: "Percaya Diri & Kreatif",
    }
  };

  // State definitions for letter input fields
  const [senderName, setSenderName] = useState("Farhan Abdillah");
  const [senderBirthDetails, setSenderBirthDetails] = useState("Jakarta, 12 April 2001");
  const [senderEducation, setSenderEducation] = useState("S1 Sistem Informasi, Universitas Gunadarma");
  const [senderEmail, setSenderEmail] = useState("farhan.abdillah@email.com");
  const [senderPhone, setSenderPhone] = useState("081234567800");
  const [senderAddress, setSenderAddress] = useState("Jl. Salemba Raya No. 4, Senen, Jakarta Pusat");
  
  const [senderLocation, setSenderLocation] = useState("Jakarta");
  const [senderDate, setSenderDate] = useState(new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}));
  
  const [recipient, setRecipient] = useState("Manajer HRD");
  const [companyName, setCompanyName] = useState("PT. Solusi Digital Pratama");
  const [companyAddress, setCompanyAddress] = useState("Gedung AIA Central Lt. 21, Jl. Jend. Sudirman, Jakarta Selatan");
  
  const [positionApplied, setPositionApplied] = useState("Software QA Engineer");
  const [sourceInfo, setSourceInfo] = useState("Lowongan kerja di website karir PT. Solusi Digital Pratama");
  const [experience, setExperience] = useState("Memiliki pengalaman magang 6 bulan melakukan pengujian otomatisasi situs web e-commerce, sukses mengidentifikasi 40+ bug penting, serta terbiasa membuat dokumentasi pengujian/test case secara terstruktur.");
  const [skills, setSkills] = useState("Selenium WebDriver, Postman API, JavaScript, SQL, Manual Testing, Bug Tracking JIRA.");
  const [additionalNotes, setAdditionalNotes] = useState("Memiliki ketelitian yang tinggi, logis dalam melacak alur bug sistem, bersertifikasi ISTQB Foundation Level, serta siap bergabung secepatnya.");
  const [tone, setTone] = useState("Profesional");

  // State for generated letter (with a realistic initial dummy data for Indonesian format)
  const initialLetter = `Jakarta, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}

Hal : Lamaran Pekerjaan - Software QA Engineer
Lampiran : 5 Lembar

Yth. Manajer HRD
PT. Solusi Digital Pratama
Gedung AIA Central Lt. 21, Jl. Jend. Sudirman, Jakarta Selatan
di Tempat

Dengan hormat,

Sehubungan dengan adanya informasi lowongan pekerjaan yang saya dapatkan dari Lowongan kerja di website karir PT. Solusi Digital Pratama, melalui surat ini saya bermaksud untuk mengajukan diri guna bergabung dengan PT. Solusi Digital Pratama dalam menempati posisi Software QA Engineer.

Berikut adalah biodata singkat mengenai diri saya:

Nama : Farhan Abdillah
Tempat, Tanggal Lahir : Jakarta, 12 April 2001
Pendidikan Terakhir : S1 Sistem Informasi, Universitas Gunadarma
Email : farhan.abdillah@email.com
Telepon/WhatsApp : 081234567800
Alamat Lengkap : Jl. Salemba Raya No. 4, Senen, Jakarta Pusat

Saya memiliki latar belakang akademis Sistem Informasi dan berpengalaman magang 6 bulan melakukan pengujian otomatisasi situs web e-commerce, sukses mengidentifikasi 40+ bug penting, serta terbiasa membuat dokumentasi pengujian/test case secara terstruktur. Saya menguasai keterampilan utama seperti Selenium WebDriver, Postman API, JavaScript, SQL, Manual Testing, Bug Tracking JIRA. Tambahan lagi, saya memiliki ketelitian yang tinggi, logis dalam melacak alur bug sistem, bersertifikasi ISTQB Foundation Level, serta siap bergabung secepatnya.

Sebagai bahan pertimbangan Bapak/Ibu, bersama surat ini saya lampirkan dokumen pendukung:
1. Curriculum Vitae (CV) Terupat
2. Salinan Ijazah Terakhir dan Transkrip Nilai
3. Salinan Sertifikat Keahlian ISTQB
4. Pasfoto Terbaru

Besar harapan saya untuk diberikan kesempatan melakukan wawancara langsung agar saya dapat memaparkan lebih mendalam mengenai kualifikasi, dedikasi, dan potensi kontribusi nyata yang dapat saya berikan bagi PT. Solusi Digital Pratama.

Demikian surat lamaran pekerjaan ini saya sampaikan. Atas perhatian, waktu, serta kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih banyak.


Hormat saya,

[Tanda Tangan]

Farhan Abdillah`;

  const [generatedLetter, setGeneratedLetter] = useState(initialLetter);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "recipient" | "qualification">("personal");
  const [loadingTip, setLoadingTip] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDevModal, setShowDevModal] = useState(false);

  const loadingTips = [
    "Menganalisis kualifikasi pelamar terbaik...",
    "Menyusun pembuka surat formal yang sopan...",
    "Mensejajarkan tanda titik dua biodata agar seimbang...",
    "Memformulasikan argumen keunggulan pelamar...",
    "Merancang bagian penutup surat resmi Indonesia...",
    "Memeriksa kesesuaian istilah tata bahasa ejaan EYD V..."
  ];

  // Ref for Editable Textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Rotate loading tips when generating
  useEffect(() => {
    let intervalId: any;
    if (isGenerating) {
      setLoadingTip(loadingTips[0]);
      let index = 1;
      intervalId = setInterval(() => {
        setLoadingTip(loadingTips[index % loadingTips.length]);
        index++;
      }, 2500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating]);

  // Load Preset Handler
  const applyPreset = (key: string) => {
    const preset = presets[key];
    if (preset) {
      setSenderName(preset.senderName);
      setSenderBirthDetails(preset.senderBirthDetails);
      setSenderEducation(preset.senderEducation);
      setSenderEmail(preset.senderEmail);
      setSenderPhone(preset.senderPhone);
      setSenderAddress(preset.senderAddress);
      setSenderLocation(preset.senderLocation);
      setSenderDate(preset.senderDate || new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}));
      setRecipient(preset.recipient);
      setCompanyName(preset.companyName);
      setCompanyAddress(preset.companyAddress);
      setPositionApplied(preset.positionApplied);
      setSourceInfo(preset.sourceInfo);
      setExperience(preset.experience);
      setSkills(preset.skills);
      setAdditionalNotes(preset.additionalNotes);
      setTone(preset.tone);

      // Simple visual scroll/focus feedback or notification can happen
    }
  };

  // Generate Letter Call to Backend Express API
  const handleGenerateLetter = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderLocation,
          senderDate,
          recipient,
          companyName,
          companyAddress,
          senderName,
          senderEmail,
          senderPhone,
          senderAddress,
          senderBirthDetails,
          senderEducation,
          positionApplied,
          experience,
          skills,
          additionalNotes,
          tone,
          sourceInfo
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal memperoleh surat lamaran");
      }

      const data = await response.json();
      if (data.letter) {
        setGeneratedLetter(data.letter);
        if (data.isFallback) {
          setErrorMsg("Server AI pusat sedang dipadati lalu lintas tinggi. Sistem secara otomatis membuat surat berformat resmi (EYD V) super rapi untuk Anda di bawah.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal memperoleh surat lamaran");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset form to completely empty state
  const handleResetForm = () => {
    setSenderName("");
    setSenderBirthDetails("");
    setSenderEducation("");
    setSenderEmail("");
    setSenderPhone("");
    setSenderAddress("");
    setSenderLocation("Jakarta");
    setSenderDate("");
    setRecipient("");
    setCompanyName("");
    setCompanyAddress("");
    setPositionApplied("");
    setSourceInfo("");
    setExperience("");
    setSkills("");
    setAdditionalNotes("");
    setGeneratedLetter("");
    setErrorMsg(null);
  };

  // Copy Generated Letter Content to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  // Generate High Quality PDF File using jsPDF
  const handleExportPDF = () => {
    if (!generatedLetter.trim()) {
      alert("Teks surat kosong. Silakan buat atau tulis surat terlebih dahulu.");
      return;
    }

    try {
      // Standard A4 sizes in mm: 210 x 297
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const sideMargin = 25; // Standard business letter margin 2.5cm / 25mm
      const topMargin = 25;
      const bottomMargin = 25;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - (sideMargin * 2);

      // Traditional standard formal font 'Times' matches Indonesian official correspondence
      doc.setFont("times", "normal");
      doc.setFontSize(11); // Standard formal text spacing
      
      const paragraphs = generatedLetter.split("\n");
      let currentY = topMargin;
      const lineSpacing = 5.5; // mm spacing between text lines

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i];
        
        // Handle explicit paragraph blank space
        if (paragraphText.trim() === "") {
          currentY += 4.5;
          continue;
        }

        // Split long lines matching printable width
        const wrappedLines = doc.splitTextToSize(paragraphText, maxLineWidth);

        // Check page overflow boundaries before printing paragraph block
        if (currentY + (wrappedLines.length * lineSpacing) > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = topMargin;
        }

        // Write each line
        for (let j = 0; j < wrappedLines.length; j++) {
          doc.text(wrappedLines[j], sideMargin, currentY);
          currentY += lineSpacing;
        }
      }

      // Safe clean filename
      const formattedName = senderName.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Pelamar";
      const formattedPos = positionApplied.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Posisi";
      doc.save(`Surat_Lamaran_Kerja_${formattedName}_${formattedPos}.pdf`);
    } catch (err: any) {
      console.error("Gagal mengekspor berkas PDF", err);
      alert("Gagal mengunduh berkas PDF: " + err.message);
    }
  };

  // Generate TXT Text File fallback
  const handleExportTXT = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const formattedName = senderName.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Pelamar";
    link.download = `Surat_Lamaran_Kerja_${formattedName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" id="main_layout">
      {/* Primary Top Nav - Geometric Balance Style */}
      <nav className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs" id="app_header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-xs">
            LF
          </div>
          <div>
            <span className="font-bold text-sm md:text-md tracking-tight uppercase block leading-tight">
              LAMARAN <span className="text-indigo-600">By FRHN</span>
            </span>
            <span className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-wide block uppercase">
              Asisten Pembuat Surat Indonesia
            </span>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-2">
          {/* Quick presets controller */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              🚀 Isi Cepat:
            </span>
            <button
              onClick={() => applyPreset("freshGraduate")}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1.5 rounded border border-slate-200 cursor-pointer transition-colors"
              id="preset-graduate"
            >
              🎓 Fresh Graduate
            </button>
            <button
              onClick={() => applyPreset("experiencedAdmin")}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1.5 rounded border border-slate-200 cursor-pointer transition-colors"
              id="preset-admin"
            >
              💼 Staf Admin
            </button>
            <button
              onClick={() => applyPreset("creativeDesigner")}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1.5 rounded border border-slate-200 cursor-pointer transition-colors"
              id="preset-creative"
            >
              🎨 Desainer
            </button>
          </div>

          {/* Developer Button */}
          <button
            onClick={() => setShowDevModal(true)}
            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded border border-indigo-200 cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-sm"
            id="btn-developer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
        </div>
      </nav>

      {/* Main split work-desk */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="main_content">
        
        {/* Left Side: Parameters Form Sheet */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden" id="form_section">
          
          {/* Tab Navigation header */}
          <div className="flex border-b border-slate-200 bg-slate-50" id="form_tabs">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-3 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex justify-center items-center gap-1.5
                ${activeTab === "personal" 
                  ? "border-indigo-600 text-indigo-700 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
              id="tab-personal"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              1. Pengirim
            </button>
            <button
              onClick={() => setActiveTab("recipient")}
              className={`flex-1 py-3 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex justify-center items-center gap-1.5
                ${activeTab === "recipient" 
                  ? "border-indigo-600 text-indigo-700 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
              id="tab-recipient"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              2. Penerima
            </button>
            <button
              onClick={() => setActiveTab("qualification")}
              className={`flex-1 py-3 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex justify-center items-center gap-1.5
                ${activeTab === "qualification" 
                  ? "border-indigo-600 text-indigo-700 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
              id="tab-qualification"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              3. Profil
            </button>
          </div>

          {/* Form scrollable elements space */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[calc(100vh-270px)] lg:max-h-[640px]" id="form_container">
            
            {/* TAB 1: PERSONAL DATA SECTIONS */}
            {activeTab === "personal" && (
              <div className="space-y-4 animate-fade-in" id="personal_tab_panel">
                <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 text-xs text-indigo-900 flex gap-2.5 items-start">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                  <div>
                    <span className="font-bold">Informasi Data Pribadi</span>: Seluruh data Anda di bawah ini disusun sejajar menggunakan tanda titik dua (:) khas surat resmi Indonesia agar rapi.
                  </div>
                </div>

                {/* Sender Name */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Nama Lengkap Pelamar
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-senderName"
                  />
                </div>

                {/* Birth details */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Tempat & Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={senderBirthDetails}
                    onChange={(e) => setSenderBirthDetails(e.target.value)}
                    placeholder="Contoh: Jakarta, 15 Juli 2003"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-birth"
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={senderEducation}
                    onChange={(e) => setSenderEducation(e.target.value)}
                    placeholder="Contoh: S1 Teknik Informatika, Universitas Indonesia"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-education"
                  />
                </div>

                {/* Contacts row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                      id="input-email"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Telepon / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                      id="input-phone"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    rows={2}
                    placeholder="Contoh: Jl. Margonda Raya No. 12, Jawa Barat"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800 resize-y"
                    id="input-senderAddress"
                  ></textarea>
                </div>

                <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location of letter */}
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Kota Pembuatan Surat
                    </label>
                    <input
                      type="text"
                      value={senderLocation}
                      onChange={(e) => setSenderLocation(e.target.value)}
                      placeholder="Contoh: Jakarta"
                      className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                      id="input-location"
                    />
                  </div>

                  {/* Letter date */}
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                      Tanggal Surat
                    </label>
                    <input
                      type="text"
                      value={senderDate}
                      onChange={(e) => setSenderDate(e.target.value)}
                      placeholder="Contoh: 15 Juni 2026"
                      className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                      id="input-date"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RECIPIENT DATA (YTH.) */}
            {activeTab === "recipient" && (
              <div className="space-y-4 animate-fade-in" id="recipient_tab_panel">
                <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 text-xs text-indigo-900 flex gap-2.5 items-start">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                  <div>
                    <span className="font-bold">Format Yth. Resmi</span>: Isikan informasi pimpinan penerima lamaran di sini. Kata "Yth." akan ditambahkan secara dinamis di depan nama jabatan/penerima.
                  </div>
                </div>

                {/* Recipient Role */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Jabatan Penerima Surat (Yth.)
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Contoh: Manajer HRD / Kepala Personalia"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-recipient"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Akan diproses dalam kop tujuan: Yth. {recipient || "(Jabatan)"}</span>
                </div>

                {/* Company Name */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Nama Perusahaan Tujuan
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: PT. Global Teknologi Nusantara"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-companyName"
                  />
                </div>

                {/* Company Address */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Alamat Perusahaan Tujuan
                  </label>
                  <textarea
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    rows={3}
                    placeholder="Contoh: Gedung Cyber 2 Lt. 15, Jl. HR Rasuna Said, Jakarta Selatan"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800 resize-y"
                    id="input-companyAddress"
                  ></textarea>
                </div>
              </div>
            )}

            {/* TAB 3: QUALIFICATIONS, PROFILE, TONE */}
            {activeTab === "qualification" && (
              <div className="space-y-4 animate-fade-in" id="qualification_tab_panel">
                {/* Position Applied */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Posisi yang Dilamar
                  </label>
                  <input
                    type="text"
                    value={positionApplied}
                    onChange={(e) => setPositionApplied(e.target.value)}
                    placeholder="Contoh: Junior Frontend Web Developer"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-position"
                  />
                </div>

                {/* Source of job info */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Sumber Informasi Lowongan
                  </label>
                  <input
                    type="text"
                    value={sourceInfo}
                    onChange={(e) => setSourceInfo(e.target.value)}
                    placeholder="Contoh: LinkedIn Karir Perusahaan"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-source"
                  />
                </div>

                {/* Work experience */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Pengalaman Kerja / Latar Belakang
                  </label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={3}
                    placeholder="Uraikan pengalaman kerja primer Anda..."
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800 resize-y"
                    id="input-experience"
                  ></textarea>
                </div>

                {/* Top skills */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Keterampilan Utama / Teknis
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Pisahkan dengan koma (Contoh: React.js, Git, Pemrograman Web)"
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800"
                    id="input-skills"
                  />
                </div>

                {/* Additional notes */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                    Nilai Tambah / Catatan Pendukung
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={2}
                    placeholder="Contoh: Bersertifikasi internasional, siap bergabung secepatnya..."
                    className="w-full text-sm border border-slate-200 rounded p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all text-slate-800 resize-y"
                    id="input-notes"
                  ></textarea>
                </div>

                {/* Tone settings */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1.5">Gaya Bahasa Surat (Tone)</label>
                  <div className="grid grid-cols-2 gap-2" id="tone-selector">
                    {["Formal", "Profesional", "Percaya Diri", "Kreatif"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`py-1.5 px-3 rounded text-xs font-semibold border text-center transition-all cursor-pointer
                          ${tone === t 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        id={`tone-${t.toLowerCase().replace(" ", "-")}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Dynamic Error Warning Banner */}
          {errorMsg && (
            <div className="mx-4 mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded text-rose-900 text-xs flex gap-2.5 items-start relative animate-fade-in" id="generation-error-banner">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 pr-6">
                <span className="font-bold block mb-0.5">Gagal Terhubung ke AI:</span> 
                <span className="leading-relaxed">{errorMsg}</span>
                <p className="mt-1 text-[11px] text-rose-700">Sistem telah otomatis melakukan percobaan ulang dengan beberapa server cadangan. Jika masih sibuk, silakan tunggu 5-10 detik lalu klik tombol <b>Tulis Dengan AI</b> di bawah.</p>
              </div>
              <button 
                onClick={() => setErrorMsg(null)}
                className="absolute top-2 right-2.5 text-rose-400 hover:text-rose-700 font-bold text-base cursor-pointer p-0.5 line-none transition-colors"
                title="Tutup"
              >
                ×
              </button>
            </div>
          )}

          {/* Form actionable footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2" id="form_footer">
            <button
              onClick={handleResetForm}
              title="Reset Form"
              className="px-3 py-2.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-805 transition-colors flex items-center justify-center cursor-pointer"
              id="btn-reset-form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleGenerateLetter}
              disabled={isGenerating || !senderName || !companyName || !positionApplied}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-generate-ai"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Tulis Dengan AI</span>
                </>
              )}
            </button>
          </div>

          {/* Tip message during generation */}
          {isGenerating && (
            <div className="bg-indigo-900 text-indigo-100 px-4 py-3 text-xs flex items-center gap-2.5 transition-all animate-pulse" id="generation-tip-bar">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
              <p className="font-light italic flex-1 text-left">{loadingTip}</p>
            </div>
          )}

        </section>

        {/* Right Side: Document Work Space (Geometric Balance style) */}
        <section className="lg:col-span-7 flex flex-col space-y-4" id="preview_section">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="toolbar_actions">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Preview & Editor Lembar</h2>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide block uppercase mt-0.5">Editable: Anda dapat merevisi teks secara langsung</p>
            </div>

            <div className="flex flex-wrap items-center gap-2" id="preview_buttons">
              <button
                onClick={handleCopyToClipboard}
                disabled={!generatedLetter}
                className={`py-1.5 px-3 rounded text-xs font-semibold cursor-pointer border flex items-center gap-1.5 transition-all
                  ${copySuccess 
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"}`}
                id="btn-copy-clipboard"
                title="Salin ke Clipboard"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? "Tersalin!" : "Salin Teks"}</span>
              </button>

              <button
                onClick={handleExportTXT}
                disabled={!generatedLetter}
                className="py-1.5 px-3 rounded text-xs font-semibold bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-all"
                id="btn-export-txt"
                title="Unduh TXT"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>TXT</span>
              </button>

              <button
                onClick={handleExportPDF}
                disabled={!generatedLetter}
                className="py-1.5 px-3.5 rounded text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 cursor-pointer flex items-center gap-1.5 transition-all"
                id="btn-export-pdf"
                title="Unduh PDF Resmi"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan PDF</span>
              </button>
            </div>
          </div>

          {/* Interactive Document Sheet Canvas (Indigo top accent + Watermark) */}
          <div className="bg-slate-200 rounded-xl p-4 sm:p-6 md:p-8 flex justify-center border border-slate-300 max-h-[750px] overflow-y-auto relative" id="paper_stage">
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <div className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-[10px] font-bold text-slate-600 tracking-wider">PREVIEW MODE</div>
              <div className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-bold text-white tracking-wider">A4 SIZE</div>
            </div>

            <div 
              className="bg-white max-w-[210mm] w-full min-h-[297mm] shadow-2xl border-t-4 border-indigo-600 p-8 sm:p-12 relative flex flex-col font-serif mt-8" 
              id="a4_paper_container"
            >
              
              {/* Floating watermark */}
              <div className="absolute bottom-5 right-5 text-[8px] text-slate-300 font-sans uppercase tracking-widest pointer-events-none border border-slate-200/50 px-1.5 py-0.5 rounded">
                Dibuat via LamaranAI
              </div>

              {/* Editable area inside simulated paper sheet with classic formal serif guidelines */}
              <textarea
                ref={textareaRef}
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                placeholder="Gunakan panel kiri untuk mengisi informasi lalu klik 'Buat Surat Lamaran AI', atau mulailah menulis surat Anda langsung di lembar kerja ini secara manual..."
                className="w-full h-full flex-1 min-h-[500px] border-0 outline-none p-0 focus:ring-0 text-[13px] text-slate-900 font-serif leading-[1.8] bg-transparent resize-none overflow-visible whitespace-pre-wrap select-text focus:outline-none"
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                id="letter-textarea-editor"
              />
            </div>
          </div>

          <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100 flex gap-3 text-xs text-indigo-900" id="bottom-info-tip">
            <Info className="w-4 h-4 shrink-0 text-indigo-600 font-bold mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">💡 Tips Format Surat Bisnis Resmi Indonesia</p>
              <p className="font-light">Sistem menghasilkan surat dengan ejaan resmi (EYD V) lengkap dengan format <b>Yth.</b>, perihal, rincian titik dua (:) sejajar, dan spasi tanda tangan penutup pemohon di pojok kanan bawah surat.</p>
            </div>
          </div>

        </section>

      </main>

      {/* Geometric Balance Bottom Status Bar */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 text-[10px] text-slate-400">
        <div className="flex gap-4">
          <span className="font-medium">TOKEN TERSEDIA: 1,450</span>
          <span className="font-medium">ESTIMASI BIAYA: 0.02 USD</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-semibold uppercase tracking-wider">AI SISTEM ONLINE</span>
        </div>
      </footer>

      {/* Developer Modal Overlays */}
      {showDevModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 min-w-full" id="developer_modal_backdrop" onClick={() => setShowDevModal(false)}>
          <div 
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 p-6 relative overflow-hidden flex flex-col items-center text-center animate-fade-in" 
            id="developer_modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image banner background */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>

            {/* Close Button */}
            <button 
              onClick={() => setShowDevModal(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all cursor-pointer z-10"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Picture */}
            <div className="relative mt-10 mb-4 z-10">
              <div className="w-24 h-24 rounded-full p-1 bg-white shadow-md">
                <img 
                  src={devAvatar} 
                  alt="Farhan" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  id="developer-avatar-img"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center" title="Online"></div>
            </div>

            {/* Bio Info */}
            <h3 className="font-bold text-lg text-slate-900 leading-tight">Farhan Abdillah</h3>
            <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wider">Lead Fullstack Developer</p>

            {/* Divider */}
            <div className="w-12 h-1 bg-indigo-600/20 rounded-full my-4"></div>

            {/* Bio text */}
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-4">
              Halo! Saya adalah pengembang di balik aplikasi <b>LAMARAN By FRHN</b>. 
              Sistem asisten lamaran kerja ini dirancang menggunakan algoritma ejaan resmi Bahasa Indonesia (EYD V) 
              lengkap dengan sistem fallback AI generator lokal yang handal.
            </p>

            {/* Skills chip badges */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-5">
              {["Fullstack Dev", "QA Automation", "React / Vite", "Gemini AI", "Tailwind CSS"].map((tech) => (
                <span key={tech} className="bg-indigo-50 text-[10px] text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100/50">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action buttons inside developer profile */}
            <div className="w-full">
              <button 
                onClick={() => setShowDevModal(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
              >
                Kembali ke Aplikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Sub-Components
function BriefcaseLabel() {
  return (
    <span className="flex items-center gap-1">
      <FileText className="w-3.5 h-3.5 text-slate-400" /> Posisi yang Dilamar
    </span>
  );
}
