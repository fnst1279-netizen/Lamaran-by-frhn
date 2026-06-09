import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini client on the server side lazily
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add GEMINI_API_KEY to your Vercel Environment Variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
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
      tone = "Formal",
      sourceInfo,
    } = req.body;

    if (!senderName || !positionApplied || !companyName) {
      return res.status(400).json({ error: "Mohon isi nama Anda, posisi yang dilamar, dan nama perusahaan." });
    }

    const systemInstruction = `Anda adalah seorang ahli penulisan Surat Lamaran Pekerjaan (Cover Letter) profesional standar Indonesia.
Buat surat lamaran kerja yang sopan, persuasif, meyakinkan, menggunakan ejaan bahasa Indonesia yang disempurnakan (EYD V), terstruktur rapi, dan menarik perhatian HRD.
Pastikan struktur layout mengikuti standar surat bisnis Indonesia yang formal:
1. Tempat dan Tanggal pembuatan surat diletakkan di bagian kanan atas surat.
2. Perihal dan Lampiran diletakkan di bagian kiri atas.
3. Alamat Tujuan dimulai dengan kata "Yth." lalu nama jabatan (misalnya HRD Manager / Pimpinan) di baris baru, di bawahnya Nama Perusahaan, dan di bawahnya Alamat Perusahaan (atau "di tempat").
4. Salam pembuka formal seperti "Dengan hormat,".
5. Paragraf Pembuka yang menyatakan ketertarikan Anda, posisi yang dilamar, dan dari mana info lowongan didapatkan.
6. Biodata/Identitas Diri yang disajikan rapi menggunakan list berkolom agar rapi (gunakan titik dua ':' yang sejajar). Contoh:
   Nama: [Nama]
   Tempat/Tanggal Lahir: [Lahir]
   Pendidikan Terakhir: [Pendidikan]
   Alamat: [Alamat]
   Telepon: [Telepon]
   Email: [Email]
7. Paragraf Kualifikasi yang menguraikan secara padat pengalaman kerja, keterampilan yang cocok dengan posisi tersebut, kelebihan diri, dan kontribusi yang bisa diberikan.
8. Daftar berkas lampiran yang disertakan (misalnya CV, Ijazah, Portofolio, pasfoto, dll) dalam poin-poin yang jelas.
9. Paragraf penutup yang menyampaikan harapan dipanggil wawancara, komitmen, ucapan terima kasih yang tulus.
10. Salam penutup "Hormat saya," diletakkan di bagian kanan bawah surat, diberikan jarak/spasi kosong yang cukup untuk tanda tangan fisik pemohon, baru di bawahnya ditulis nama lengkap Anda dengan jelas.

Harap sesuaikan gaya bahasa dangan nada: ${tone} (bisa Formal, Profesional, Kreatif, Percaya Diri, atau Ramah).
Kirimkan langsung teks utuh surat lamaran pekerjaannya saja. Jangan ada penjelas tambahan, jangan kembalikan dalam blok kode markdown \`\`\` (cukup teks polos berformat baris baru/paragraf yang rapi), dan jangan berikan pengantar chat seperti "Berikut adalah hasil suratnya:".`;

    const generatedDate = senderDate || new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
    
    const prompt = `Datanya adalah sebagai berikut:
- Lokasi pembuatan surat: ${senderLocation || "Jakarta"}
- Tanggal surat: ${generatedDate}
- Penerima (Nama/Jabatan): ${recipient || "Manajer HRD"}
- Nama Perusahaan: ${companyName}
- Alamat Perusahaan: ${companyAddress || "di Tempat"}

- Nama Lengkap Pelamar: ${senderName}
- Tempat, Tanggal Lahir Pelamar: ${senderBirthDetails || "-"}
- Pendidikan Terakhir: ${senderEducation || "-"}
- Email: ${senderEmail || "-"}
- Telepon/WhatsApp: ${senderPhone || "-"}
- Alamat Lengkap: ${senderAddress || "-"}

- Posisi yang dilamar: ${positionApplied}
- Sumber informasi lowongan: ${sourceInfo || "informasi lowongan kerja terbaru"}
- Pengalaman kerja: ${experience || "Fresh graduate yang bersemangat"}
- Keterampilan utama: ${skills || "-"}
- Catatan tambahan/keunggulan diri: ${additionalNotes || "-"}

Tolong buat surat lamaran kerja Indonesia yang resmi dan optimal berdasarkan data tersebut.`;

    // Retry & Fallback mechanism to handle 503 "High Demand" or "Temporary Spikes"
    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest"
    ];
    
    let letterText = "";
    let lastError: any = null;
    let modelUsed = "";

    try {
      const ai = getAIClient();
      for (const modelName of candidateModels) {
        let delay = 500;
        const maxRetries = 2; // For each model, attempt up to 2 times
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`[Vercel API] Menghubungi AI Model ${modelName} (Percobaan ${attempt}/${maxRetries})...`);
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction,
                temperature: 0.65,
              },
            });

            if (response && response.text) {
              letterText = response.text;
              modelUsed = modelName;
              break;
            }
          } catch (err: any) {
            lastError = err;
            console.log(`[Vercel API] Model ${modelName} sedang sibuk (Percobaan ${attempt}/${maxRetries})`);
            
            const isTemporary = err.status === 429 || err.status === 503 || err.message?.includes("503") || err.message?.includes("UNAVAILABLE") || err.status === 408;
            if (isTemporary && attempt < maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, delay));
              delay *= 1.5; // Exponential backoff scaling
            } else {
              break; // Proceed to next candidate model
            }
          }
        }
        
        if (letterText) {
          break; // Successfully got response, stop trying other models
        }
      }
    } catch (apiError: any) {
      console.warn("[Vercel API] AI initialization or API client error (graceful fallback in effect):", apiError.message || apiError);
      lastError = apiError;
    }

    if (!letterText) {
      console.warn("[Vercel API] Semua model AI sedang sibuk. Menjalankan Generator Pintar Lokal...");
      const skillsList = skills ? skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [];
      let skillsParagraph = "-";
      if (skillsList.length > 0) {
        skillsParagraph = skillsList.map((skill: string) => ` - ${skill}`).join("\n");
      }

      letterText = `${senderLocation || "Jakarta"}, ${generatedDate}

Hal   : Lamaran Pekerjaan - ${positionApplied}
Lamp  : Pasfoto Berwarna & Berkas Administrative Lengkap

Yth. ${recipient || "Manajer HRD"}
${companyName}
${companyAddress || "di Tempat"}

Dengan hormat,

Berdasarkan informasi lowongan pekerjaan yang saya dapatkan dari ${sourceInfo || "sumber terpercaya"}, melalui surat ini saya berminat dan bermaksud untuk mendaftarkan diri saya guna menempati posisi posisi ${positionApplied} pada perusahaan Bapak/Ibu pimpin.

Saya sangat berkeyakinan bahwa latar belakang pendidikan, kualifikasi keterampilan, dan antusiasme profesi saya dapat memberikan sumbangsih positif yang berharga bagi kemajuan ${companyName}.

Berikut ini adalah perincian data pribadi saya secara ringkas:

Nama Lengkap          : ${senderName}
Tempat/Tanggal Lahir  : ${senderBirthDetails || "-"}
Pendidikan Terakhir   : ${senderEducation || "-"}
Alamat Rumah Lengkap  : ${senderAddress || "-"}
Telepon / WhatsApp    : ${senderPhone || "-"}
Alamat Surel / Email  : ${senderEmail || "-"}

Sebagai referensi dan bukti kompetensi pendukung, saya memiliki rekam jejak sebagai berikut:
${experience ? `\nPengalaman Profesional & Latar Belakang:\n${experience}\n` : ""}
Keterampilan Utama & Teknis:
${skillsParagraph}
${additionalNotes ? `\nNilai Tambah & Catatan Pendukung Lainnya:\n${additionalNotes}\n` : ""}
Saya merupakan pribadi yang tekun, tangguh, memiliki kemauan belajar yang kuat, serta siap bekerja secara sinergis dalam tim. Bersama dengan surat lamaran ini, saya lampirkan dokumen pendukung berupa Curriculum Vitae (CV) teranyar serta dokumen kelulusan akademik resmi saya demi kenyamanan peninjauan berkas Bapak/Ibu.

Besar harapan saya untuk dapat diberikan kesempatan menghadiri sesi wawancara langsung atau uji kompetensi, agar saya dapat memaparkan gambaran dedikasi luhur saya secara lebih komprensif.

Demikian surat lamaran pekerjaan ini saya sampaikan dengan penuh rasa hormat. Atas perhatian, waktu luang, dan kesempatan berharga yang Bapak/Ibu berikan, saya haturkan terima kasih yang sebesar-besarnya.

Hormat saya,



( ${senderName} )`;
      modelUsed = "Sistem Generator Lokal Pintar (Fallback)";
    }

    console.log(`[Vercel API] Berhasil menghasilkan surat lamaran menggunakan model: ${modelUsed}`);
    res.json({ letter: letterText.trim(), isFallback: modelUsed.includes("Fallback") });
  } catch (error: any) {
    console.error("[Vercel API] Generative AI Error:", error);
    res.status(500).json({ error: error.message || "Gagal menghasilkan surat lamaran kerja." });
  }
}
