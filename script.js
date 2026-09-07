// ======================================================
// OUR LITTLE STORY
// SCRIPT.JS
// ======================================================


// ======================================================
// VARIABEL
// ======================================================

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");

let fotoArray = [];

let namaUser = "";

let pertanyaanSekarang = 0;

let cameraStream = null;


// ======================================================
// DATA
// ======================================================

const tanggalJadianBenar = "26 desember 2024";

const tanggalPhotobooth = "26 Desember 2024";

const nomorWhatsApp = "6285776504819";


// ======================================================
// PERTANYAAN
// ======================================================

const pertanyaan = [

    {
        soal: "Apa warna favorit kamu?",
        jawaban: "hitam"
    },

    {
        soal: "Ukuran baju kamu?",
        jawaban: "l"
    },

    {
        soal: "Ukuran sepatu kamu?",
        jawaban: "42"
    },

    {
        soal: "Kapan tanggal lahir kamu?",
        jawaban: "23 november 2006"
    },

    {
        soal: "Apa genre musik favorit kamu?",
        jawaban: "rock"
    },

    {
        soal: "Sebutkan 3 band yang pernah kita tonton bareng!",
        jawaban: "lomba sihir, reality club, black horses"
    },

    {
        soal: "Ceritakan moment paling bahagia kamu sama saya?",
        jawaban: ""
    }

];


// ======================================================
// NORMALISASI
// ======================================================

function normalisasi(teks) {

    return teks
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}


// ======================================================
// CEK TANGGAL
// ======================================================

function cekTanggal() {

    const inputNama =
        document.getElementById("nama");

    const inputTanggal =
        document.getElementById("tanggal");

    const pesan =
        document.getElementById("pesanTanggal");


    // Ambil nama
    namaUser =
        inputNama.value.trim();


    // Nama wajib diisi
    if (namaUser === "") {

        pesan.textContent =
            "Isi nama kamu dulu ya ♡";

        return;
    }


    // Ambil tanggal
    const tanggal =
        normalisasi(inputTanggal.value);


    // Cek tanggal benar
    const tanggalBenar =

        tanggal === tanggalJadianBenar ||

        tanggal === "26 12 2024" ||

        tanggal === "26/12/2024" ||

        tanggal === "26-12-2024";


    if (tanggalBenar) {

        // Sembunyikan halaman awal
        document
            .getElementById("halamanAwal")
            .classList.remove("aktif");


        // Tampilkan halaman pertanyaan
        document
            .getElementById("halamanPertanyaan")
            .classList.add("aktif");


        // Mulai dari pertanyaan pertama
        pertanyaanSekarang = 0;


        tampilkanPertanyaan();


    } else {

        pesan.textContent =
            "Kamu udah ga sayang 😭";

    }

}


// ======================================================
// TAMPILKAN PERTANYAAN
// ======================================================

function tampilkanPertanyaan() {

    const nomor =
        document.getElementById("nomorPertanyaan");

    const soal =
        document.getElementById("pertanyaan");

    const input =
        document.getElementById("jawaban");

    const textarea =
        document.getElementById("saran");

    const pesan =
        document.getElementById("pesanJawaban");


    // Bersihkan pesan
    pesan.textContent = "";


    // Data pertanyaan
    const data =
        pertanyaan[pertanyaanSekarang];


    // Nomor
    nomor.textContent =
        `${pertanyaanSekarang + 1} / ${pertanyaan.length}`;


    // Pertanyaan
    soal.textContent =
        data.soal;


    // Bersihkan input
    input.value = "";

    textarea.value = "";


    // ==================================================
    // PERTANYAAN TERAKHIR
    // ==================================================

    if (
        pertanyaanSekarang ===
        pertanyaan.length - 1
    ) {

        // Sembunyikan input biasa
        input.style.display = "none";


        // Tampilkan textarea
        textarea.style.display = "block";


    } else {

        // Pertanyaan biasa
        input.style.display = "block";

        textarea.style.display = "none";

    }

}


// ======================================================
// CEK JAWABAN
// ======================================================

function cekJawaban() {

    const input =
        document.getElementById("jawaban");

    const textarea =
        document.getElementById("saran");

    const pesan =
        document.getElementById("pesanJawaban");


    // ==================================================
    // PERTANYAAN TERAKHIR
    // ==================================================

    if (
        pertanyaanSekarang ===
        pertanyaan.length - 1
    ) {

        const saran =
            textarea.value.trim();


        // Jangan kosong
        if (saran === "") {

            pesan.textContent =
                "Ceritakan dulu momentnya ya ♡";

            return;
        }


        // Simpan
        localStorage.setItem(
            "momentBahagia",
            saran
        );


        // Kirim ke WhatsApp
        kirimSaran(saran);


        return;
    }


    // ==================================================
    // PERTANYAAN BIASA
    // ==================================================

    const jawabanUser =
        normalisasi(input.value);


    // Kosong
    if (jawabanUser === "") {

        pesan.textContent =
            "Jawab dulu ya ♡";

        return;
    }


    // ==================================================
    // PERTANYAAN BAND
    // ==================================================

    if (pertanyaanSekarang === 5) {

        const wajib = [

            "lomba sihir",

            "reality club",

            "black horses"

        ];


        const benar =
            wajib.every(function(band) {

                return jawabanUser.includes(
                    band
                );

            });


        if (benar) {

            pertanyaanSekarang++;

            tampilkanPertanyaan();

        } else {

            tampilkanJawabanSalah();

        }


        return;
    }


    // ==================================================
    // PERTANYAAN NORMAL
    // ==================================================

    const jawabanBenar =
        normalisasi(
            pertanyaan[
                pertanyaanSekarang
            ].jawaban
        );


    if (
        jawabanUser ===
        jawabanBenar
    ) {

        // Jawaban benar
        pertanyaanSekarang++;


        // Next
        tampilkanPertanyaan();


    } else {

        tampilkanJawabanSalah();

    }

}


// ======================================================
// JAWABAN SALAH
// ======================================================

function tampilkanJawabanSalah() {

    const pesan =
        document.getElementById("pesanJawaban");


    pesan.textContent =
        "Hmm, kayaknya jawaban kamu salah deh 😭";

}


// ======================================================
// KIRIM SARAN KE WHATSAPP
// ======================================================

function kirimSaran(saran) {

    const pesanElement =
        document.getElementById(
            "pesanJawaban"
        );


    // ==================================================
    // ISI PESAN
    // ==================================================

    const isiPesan =

`💌 OUR LITTLE STORY ♡

Nama: ${namaUser}

Tanggal jadian: ${tanggalPhotobooth}

Moment paling bahagia:
${saran}

♡ Sent from Our Little Story`;


    // Encode
    const pesanEncoded =
        encodeURIComponent(
            isiPesan
        );


    // Link WhatsApp
    const linkWhatsApp =

        "https://wa.me/" +

        nomorWhatsApp +

        "?text=" +

        pesanEncoded;


    // Tampilkan pesan
    pesanElement.textContent =
        "Membuka WhatsApp... ♡";


    // ==================================================
    // BUKA WHATSAPP
    // ==================================================

    window.open(
        linkWhatsApp,
        "_blank"
    );


    // ==================================================
    // LANGSUNG NEXT KE PHOTOBOX
    // ==================================================

    setTimeout(function() {

        masukPhotobooth();

    }, 1000);

}


// ======================================================
// MASUK PHOTOBOX
// ======================================================

function masukPhotobooth() {


    // Reset foto
    fotoArray = [];


    // Hentikan kamera lama
    hentikanKamera();


    // ==================================================
    // SEMBUNYIKAN PERTANYAAN
    // ==================================================

    document
        .getElementById("halamanPertanyaan")
        .classList.remove("aktif");


    // ==================================================
    // TAMPILKAN PHOTOBOX
    // ==================================================

    document
        .getElementById("halamanPhotobooth")
        .classList.add("aktif");


    // Info tanggal
    document
        .getElementById("info")
        .textContent =
            tanggalPhotobooth + " ♡";


    // Status
    document
        .getElementById("statusFoto")
        .textContent =
            "Foto 1 dari 3 ♡";


    // Countdown kosong
    document
        .getElementById("countdown")
        .textContent = "";


    // Buka kamera
    bukaKamera();

}


// ======================================================
// BUKA KAMERA
// ======================================================

async function bukaKamera() {

    try {

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {

                        facingMode: "user"

                    },

                    audio: false

                });


        video =
            document.getElementById("video");


        video.srcObject =
            cameraStream;


        await video.play();


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        alert(
            "Kamera tidak bisa dibuka. Izinkan akses kamera terlebih dahulu ya ♡"
        );

    }

}


// ======================================================
// HENTIKAN KAMERA
// ======================================================

function hentikanKamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function(track) {

                track.stop();

            });


        cameraStream = null;

    }


    if (video) {

        video.srcObject = null;

    }

}


// ======================================================
// AMBIL FOTO
// ======================================================

function ambilFoto() {


    // Maksimal 3 foto
    if (fotoArray.length >= 3) {

        return;

    }


    const countdown =
        document.getElementById(
            "countdown"
        );


    let angka = 3;


    countdown.textContent =
        angka;


    const timer =
        setInterval(function() {


            angka--;


            if (angka > 0) {

                countdown.textContent =
                    angka;

            } else {

                countdown.textContent =
                    "📸";

            }


            if (angka <= 0) {

                clearInterval(timer);


                setTimeout(function() {

                    foto();

                }, 300);

            }


        }, 1000);

}


// ======================================================
// FOTO
// ======================================================

function foto() {


    video =
        document.getElementById("video");


    canvas =
        document.getElementById("canvas");


    if (
        !video ||
        !canvas ||
        video.videoWidth === 0
    ) {

        alert(
            "Kamera belum siap. Tunggu sebentar ya ♡"
        );

        return;

    }


    const ctx =
        canvas.getContext("2d");


    // Ukuran canvas
    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;


    // ==================================================
    // MIRROR
    // ==================================================

    ctx.save();


    ctx.translate(
        canvas.width,
        0
    );


    ctx.scale(
        -1,
        1
    );


    ctx.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height

    );


    ctx.restore();


    // ==================================================
    // SIMPAN FOTO
    // ==================================================

    const fotoData =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );


    fotoArray.push(
        fotoData
    );


    // ==================================================
    // UPDATE STATUS
    // ==================================================

    const status =
        document.getElementById(
            "statusFoto"
        );


    if (
        fotoArray.length < 3
    ) {

        status.textContent =
            `Foto ${fotoArray.length + 1} dari 3 ♡`;

    } else {

        status.textContent =
            "Semua foto selesai ♡";

    }


    document
        .getElementById("countdown")
        .textContent = "";


    // ==================================================
    // SELESAI 3 FOTO
    // ==================================================

    if (
        fotoArray.length === 3
    ) {

        setTimeout(function() {

            tampilkanHasil();

        }, 800);

    }

}


// ======================================================
// TAMPILKAN HASIL
// ======================================================

function tampilkanHasil() {


    // Matikan kamera
    hentikanKamera();


    // Sembunyikan photobox
    document
        .getElementById("halamanPhotobooth")
        .classList.remove("aktif");


    // Tampilkan hasil
    document
        .getElementById("halamanHasil")
        .classList.add("aktif");


    const hasil =
        document.getElementById(
            "hasilFoto"
        );


    hasil.innerHTML = "";


    // ==================================================
    // STRIP 1
    // ==================================================

    const strip1 =
        document.createElement("div");


    strip1.className =
        "photo-strip";


    strip1.innerHTML = `

        <div class="strip-title">
            🐱 OUR LITTLE STORY
        </div>

        <img src="${fotoArray[0]}">

        <img src="${fotoArray[1]}">

        <img src="${fotoArray[2]}">

        <div class="strip-date">
            ${tanggalPhotobooth}
        </div>

    `;


    // ==================================================
    // STRIP 2
    // ==================================================

    const strip2 =
        document.createElement("div");


    strip2.className =
        "photo-strip";


    strip2.innerHTML = `

        <div class="strip-title">
            🐱 OUR LITTLE STORY
        </div>

        <img src="${fotoArray[0]}">

        <img src="${fotoArray[1]}">

        <img src="${fotoArray[2]}">

        <div class="strip-date">
            ${tanggalPhotobooth}
        </div>

    `;


    hasil.appendChild(
        strip1
    );


    hasil.appendChild(
        strip2
    );

}


// ======================================================
// DOWNLOAD FOTO
// ======================================================

async function simpanFoto() {


    if (
        fotoArray.length < 3
    ) {

        alert(
            "Foto belum lengkap ♡"
        );

        return;

    }


    const width = 700;

    const height = 1200;


    const downloadCanvas =
        document.createElement(
            "canvas"
        );


    downloadCanvas.width =
        width;

    downloadCanvas.height =
        height;


    const ctx =
        downloadCanvas.getContext(
            "2d"
        );


    // ==================================================
    // BACKGROUND
    // ==================================================

    ctx.fillStyle =
        "#ffd6e7";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // ==================================================
    // JUDUL
    // ==================================================

    ctx.fillStyle =
        "#222";


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 30px Arial";


    ctx.fillText(
        "🐱 OUR LITTLE STORY",
        width / 2,
        50
    );


    // ==================================================
    // POSISI STRIP
    // ==================================================

    const stripWidth = 270;

    const stripHeight = 1000;

    const x1 = 60;

    const x2 = 370;

    const y = 90;


    // Background strip
    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        x1,
        y,
        stripWidth,
        stripHeight
    );


    ctx.fillRect(
        x2,
        y,
        stripWidth,
        stripHeight
    );


    // ==================================================
    // LOAD IMAGE
    // ==================================================

    const loadImage =
        function(src) {

            return new Promise(
                function(resolve) {

                    const img =
                        new Image();

                    img.onload =
                        function() {

                            resolve(img);

                        };

                    img.src = src;

                }
            );

        };


    const images =
        await Promise.all(

            fotoArray.map(
                function(src) {

                    return loadImage(
                        src
                    );

                }
            )

        );


    // ==================================================
    // GAMBAR FOTO
    // ==================================================

    const fotoWidth = 250;

    const fotoHeight = 270;


    function gambarCrop(
        img,
        x,
        yPos
    ) {

        const scale =
            Math.max(

                fotoWidth /
                    img.width,

                fotoHeight /
                    img.height

            );


        const sourceWidth =
            fotoWidth /
            scale;


        const sourceHeight =
            fotoHeight /
            scale;


        const sourceX =
            (
                img.width -
                sourceWidth
            ) / 2;


        const sourceY =
            (
                img.height -
                sourceHeight
            ) / 2;


        ctx.drawImage(

            img,

            sourceX,

            sourceY,

            sourceWidth,

            sourceHeight,

            x,

            yPos,

            fotoWidth,

            fotoHeight

        );

    }


    // Strip 1
    gambarCrop(
        images[0],
        x1 + 10,
        y + 15
    );


    gambarCrop(
        images[1],
        x1 + 10,
        y + 290
    );


    gambarCrop(
        images[2],
        x1 + 10,
        y + 565
    );


    // Strip 2
    gambarCrop(
        images[0],
        x2 + 10,
        y + 15
    );


    gambarCrop(
        images[1],
        x2 + 10,
        y + 290
    );


    gambarCrop(
        images[2],
        x2 + 10,
        y + 565
    );


    // ==================================================
    // TANGGAL
    // ==================================================

    ctx.fillStyle =
        "#222";


    ctx.font =
        "bold 18px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(

        tanggalPhotobooth,

        x1 +
            stripWidth / 2,

        y + 960

    );


    ctx.fillText(

        tanggalPhotobooth,

        x2 +
            stripWidth / 2,

        y + 960

    );


    // ==================================================
    // DOWNLOAD
    // ==================================================

    downloadCanvas.toBlob(

        function(blob) {

            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "our-little-moment.png";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        },

        "image/png"

    );

}


// ======================================================
// AMBIL ULANG
// ======================================================

function ulangFoto() {


    // Stop kamera
    hentikanKamera();


    // Reset foto
    fotoArray = [];


    // Sembunyikan hasil
    document
        .getElementById("halamanHasil")
        .classList.remove("aktif");


    // Tampilkan photobox
    document
        .getElementById("halamanPhotobooth")
        .classList.add("aktif");


    // Reset status
    document
        .getElementById("statusFoto")
        .textContent =
            "Foto 1 dari 3 ♡";


    // Buka kamera
    bukaKamera();

}


// ======================================================
// STOP KAMERA SAAT HALAMAN DITUTUP
// ======================================================

window.addEventListener(
    "beforeunload",
    function() {

        hentikanKamera();

    }
);
