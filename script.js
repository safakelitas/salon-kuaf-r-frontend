
/* RANDEVU SİSTEMİ - HİZMET SEÇİMİ */

const hizmetKategorileri = [
    {
        kategori: "Saç Kesimi ve Şekillendirme",
        hizmetler: [
            "Flow Cut Kesimi",
            "Taper Fade Kesimi",
            "Drop Fade Mullet Kesimi",
            "Crop Fade Kesimi",
            "Wolf Cut Kesimi",
            "Burst Fade Mullet Kesimi",
            "Ustura Saç Kesimi",
            "Fön",
            "Düz Fön"
        ]
    },
    {
        kategori: "Sakal ve Damat Hizmetleri",
        hizmetler: [
            "Damat Tıraşı",
            "Damat Paketi",
            "Ustura Sakal Tıraşı",
            "Sakal Kesim Çeşitleri"
        ]
    },
    {
        kategori: "Saç Boyama ve Özel İşlemler",
        hizmetler: [
            "Saç Boyama",
            "Röfle",
            "Perma"
        ]
    },
    {
        kategori: "Saç Bakımları",
        hizmetler: [
            "Saç Bakım Protokolleri"
        ]
    },
    {
        kategori: "Cilt Bakımları",
        hizmetler: [
            "Cilt ve Saç Analizi",
            "Mini Cilt Bakımı",
            "Ozon Cilt Bakımı",
            "Profesyonel Cilt Bakımı",
            "Cilt Bakım Protokolleri (Akne, Skar, Leke, Kırışıklık)"
        ]
    },
    {
        kategori: "Diğer Bakım Hizmetleri",
        hizmetler: [
            "İğneli Epilasyon",
            "Manikür"
        ]
    }
];

const secilenHizmetler = [];

const hizmetListesi = document.getElementById("hizmetListesi");
const randevuOzeti = document.getElementById("secilenHizmetler");
const devamBtn = document.getElementById("devamBtn");

hizmetKategorileri.forEach((kategori) => {

    const kategoriKutusu = document.createElement("details");
    kategoriKutusu.classList.add("hizmet-kategori");

    const kategoriBaslik = document.createElement("summary");
    kategoriBaslik.textContent = kategori.kategori;

    kategoriKutusu.appendChild(kategoriBaslik);

    kategori.hizmetler.forEach((hizmet) => {

        const hizmetKart = document.createElement("button");

        hizmetKart.type = "button";
        hizmetKart.classList.add("hizmet-secim");
        hizmetKart.textContent = hizmet;
        hizmetKart.setAttribute("aria-pressed", "false");

        hizmetKart.addEventListener("click", () => {

            const hizmetIndex = secilenHizmetler.indexOf(hizmet);

            if (hizmetIndex === -1) {
                secilenHizmetler.push(hizmet);
                hizmetKart.classList.add("secili");
                hizmetKart.setAttribute("aria-pressed", "true");
            } else {
                secilenHizmetler.splice(hizmetIndex, 1);
                hizmetKart.classList.remove("secili");
                hizmetKart.setAttribute("aria-pressed", "false");
            }


            randevuOzetiniGuncelle();

            devamBtn.disabled = secilenHizmetler.length === 0;

        });

        kategoriKutusu.appendChild(hizmetKart);
    });

    hizmetListesi.appendChild(kategoriKutusu);
});


/* RANDEVU SİSTEMİ - PERSONEL SEÇİMİ */

const hizmetAdimi = document.getElementById("hizmetAdimi");
const personelAdimi = document.getElementById("personelAdimi");
const tarihAdimi = document.getElementById("tarihAdimi");
const saatAdimi = document.getElementById("saatAdimi");
const bilgilerAdimi = document.getElementById("bilgilerAdimi");
const onayAdimi = document.getElementById("onayAdimi");
const onayDetaylari = document.getElementById("onayDetaylari");
const musteriAd = document.getElementById("musteriAd");
const musteriTelefon = document.getElementById("musteriTelefon");
const saatKartlari = document.querySelectorAll(".saat-kart");
const randevuTarihi = document.getElementById("randevuTarihi");
const geriBtn = document.getElementById("geriBtn");

const personelKartlari = document.querySelectorAll(".personel-kart");
const randevuAdimlari = document.querySelectorAll(".randevu-adimlar span");

let aktifAdim = 0;
let secilenPersonel = null;
let secilenSaat = null;

// Devam Et butonuna basıldığında
devamBtn.addEventListener("click", () => {

    if (aktifAdim === 0) {

        if (secilenHizmetler.length === 0) return;

        hizmetAdimi.hidden = true;
        personelAdimi.hidden = false;

        aktifAdim = 1;
        geriBtn.hidden = false;

        devamBtn.disabled = secilenPersonel === null;

        randevuAdimlari[0].classList.remove("aktif");
        randevuAdimlari[1].classList.add("aktif");

    } else if (aktifAdim === 1) {

        if (secilenPersonel === null) return;

        personelAdimi.hidden = true;
        tarihAdimi.hidden = false;

        aktifAdim = 2;

        devamBtn.disabled =
            !randevuTarihi.value ||
            randevuTarihi.value < bugununTarihi();

        randevuAdimlari[1].classList.remove("aktif");
        randevuAdimlari[2].classList.add("aktif");

    } else if (aktifAdim === 2) {

        if (!randevuTarihi.value ||
            randevuTarihi.value < bugununTarihi()) return;

        tarihAdimi.hidden = true;
        saatAdimi.hidden = false;

        aktifAdim = 3;

        devamBtn.disabled = secilenSaat === null;

        randevuAdimlari[2].classList.remove("aktif");
        randevuAdimlari[3].classList.add("aktif");

    } else if (aktifAdim === 3) {

        if (secilenSaat === null) return;

        saatAdimi.hidden = true;
        bilgilerAdimi.hidden = false;

        aktifAdim = 4;

        devamBtn.disabled = true;

        randevuAdimlari[3].classList.remove("aktif");
        randevuAdimlari[4].classList.add("aktif");

    } else if (aktifAdim === 4) {

        // Müşteri bilgileri geçerli mi?
        const ad = musteriAd.value.trim();
        const telefon = musteriTelefon.value.trim();

        const adGecerli =
            ad.length >= 5 &&
            ad.split(/\s+/).length >= 2;

        const telefonGecerli = /^05\d{9}$/.test(telefon);

        if (!adGecerli || !telefonGecerli) return;

        bilgilerAdimi.hidden = true;
        onayAdimi.hidden = false;

        aktifAdim = 5;

        onayBilgileriniGoster();

        devamBtn.textContent = "Randevuyu Onayla";
        devamBtn.disabled = false;

                randevuAdimlari[4].classList.remove("aktif");
        randevuAdimlari[5].classList.add("aktif");

    } else if (aktifAdim === 5) {

        // Randevu bilgilerini kontrol et
        if (
            secilenHizmetler.length === 0 ||
            secilenPersonel === null ||
            !randevuTarihi.value ||
            randevuTarihi.value < bugununTarihi() ||
            secilenSaat === null
        ) {
            alert("Lütfen randevu bilgilerinizi kontrol edin.");
            return;
        }

        // Şimdilik örnek onay işlemi
        alert("Randevu talebiniz başarıyla alındı! (Demo)");

    }

});

// Personel seçildiğinde
personelKartlari.forEach((kart) => {

    kart.setAttribute("aria-pressed", "false");

    kart.addEventListener("click", () => {

        personelKartlari.forEach((digerKart) => {
            digerKart.classList.remove("secili");
            digerKart.setAttribute("aria-pressed", "false");
        });

        kart.classList.add("secili");
        kart.setAttribute("aria-pressed", "true");

        secilenPersonel = kart.dataset.personel;

        devamBtn.disabled = false;

        randevuOzetiniGuncelle();
    });

});

// Geri butonuna basıldığında
geriBtn.addEventListener("click", () => {

    if (aktifAdim === 5) {

        onayAdimi.hidden = true;
        bilgilerAdimi.hidden = false;

        aktifAdim = 4;

        devamBtn.textContent = "Devam Et →";

        musteriBilgileriniKontrolEt();

        randevuAdimlari[5].classList.remove("aktif");
        randevuAdimlari[4].classList.add("aktif");

    } else if (aktifAdim === 4) {

        bilgilerAdimi.hidden = true;
        saatAdimi.hidden = false;

        aktifAdim = 3;

        devamBtn.disabled = secilenSaat === null;

        randevuAdimlari[4].classList.remove("aktif");
        randevuAdimlari[3].classList.add("aktif");

    } else if (aktifAdim === 3) {

        saatAdimi.hidden = true;
        tarihAdimi.hidden = false;

        aktifAdim = 2;

        devamBtn.disabled =
            !randevuTarihi.value ||
            randevuTarihi.value < bugununTarihi();

        randevuAdimlari[3].classList.remove("aktif");
        randevuAdimlari[2].classList.add("aktif");
    } else if (aktifAdim === 2) {

        tarihAdimi.hidden = true;
        personelAdimi.hidden = false;

        aktifAdim = 1;

        devamBtn.disabled = secilenPersonel === null;

        randevuAdimlari[2].classList.remove("aktif");
        randevuAdimlari[1].classList.add("aktif");

    } else if (aktifAdim === 1) {

        personelAdimi.hidden = true;
        hizmetAdimi.hidden = false;

        aktifAdim = 0;
        geriBtn.hidden = true;

        devamBtn.disabled = secilenHizmetler.length === 0;

        randevuAdimlari[1].classList.remove("aktif");
        randevuAdimlari[0].classList.add("aktif");
    }

});
// Sağdaki randevu özetini güncelle
function randevuOzetiniGuncelle() {

    randevuOzeti.innerHTML = "";

    if (secilenHizmetler.length === 0) {
        randevuOzeti.textContent = "Henüz hizmet seçilmedi.";
        return;
    }

    secilenHizmetler.forEach((hizmet) => {

        const p = document.createElement("p");
        p.textContent = "✓ " + hizmet;

        randevuOzeti.appendChild(p);
    });

    if (secilenPersonel !== null) {

        const personelBilgisi = document.createElement("p");
        personelBilgisi.textContent = "Personel: " + secilenPersonel;

        randevuOzeti.appendChild(personelBilgisi);
    }

    // Seçilen tarihi randevu özetinde göster
    if (randevuTarihi.value) {

        const tarihBilgisi = document.createElement("p");

        const tarih = new Date(randevuTarihi.value + "T12:00:00");

        tarihBilgisi.textContent = "Tarih: " + tarih.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        randevuOzeti.appendChild(tarihBilgisi);
    }

    // Seçilen saati randevu özetinde göster
    if (secilenSaat !== null) {

        const saatBilgisi = document.createElement("p");

        saatBilgisi.textContent = "Saat: " + secilenSaat;

        randevuOzeti.appendChild(saatBilgisi);
    }
}


// Geçmiş tarihlerin seçilmesini engelle
function bugununTarihi() {
    const bugun = new Date();
    const yil = bugun.getFullYear();
    const ay = String(bugun.getMonth() + 1).padStart(2, "0");
    const gun = String(bugun.getDate()).padStart(2, "0");

    return `${yil}-${ay}-${gun}`;
}

randevuTarihi.min = bugununTarihi();

// Tarih seçildiğinde
randevuTarihi.addEventListener("change", () => {

    const gecerliTarih =
        randevuTarihi.value !== "" &&
        randevuTarihi.value >= bugununTarihi();

    devamBtn.disabled = !gecerliTarih;

    randevuOzetiniGuncelle();

});

// Saat seçimi
saatKartlari.forEach((kart) => {

    kart.setAttribute("aria-pressed", "false");

    kart.addEventListener("click", () => {

        saatKartlari.forEach((digerKart) => {
            digerKart.classList.remove("secili");
            digerKart.setAttribute("aria-pressed", "false");
        });

        kart.classList.add("secili");
        kart.setAttribute("aria-pressed", "true");

        secilenSaat = kart.dataset.saat;

        devamBtn.disabled = false;

        randevuOzetiniGuncelle();

    });

});

// Müşteri bilgilerini kontrol et
function musteriBilgileriniKontrolEt() {

    const ad = musteriAd.value.trim();
    const telefon = musteriTelefon.value.trim();

    // En az iki kelimeden oluşan ad soyad
    const adGecerli = ad.split(/\s+/).length >= 2 &&
        ad.length >= 5;

    // 05 ile başlayan 11 haneli telefon numarası
    const telefonGecerli = /^05\d{9}$/.test(telefon);

    if (aktifAdim === 4) {
        devamBtn.disabled = !(adGecerli && telefonGecerli);
    }
}

// Kullanıcı yazdıkça kontrol et
musteriAd.addEventListener("input", musteriBilgileriniKontrolEt);
musteriTelefon.addEventListener("input", musteriBilgileriniKontrolEt);

// Son aşamada randevu bilgilerini göster
function onayBilgileriniGoster() {

    onayDetaylari.innerHTML = "";

    const bilgiler = [
        ["Hizmetler", secilenHizmetler.join(", ")],
        ["Personel", secilenPersonel],
        ["Tarih", new Date(randevuTarihi.value + "T12:00:00")
            .toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })],
        ["Saat", secilenSaat],
        ["Ad Soyad", musteriAd.value.trim()],
        ["Telefon", musteriTelefon.value.trim()]
    ];

    bilgiler.forEach(([baslik, deger]) => {

        const p = document.createElement("p");

        const strong = document.createElement("strong");
        strong.textContent = baslik + ": ";

        p.appendChild(strong);
        p.appendChild(document.createTextNode(deger));

        onayDetaylari.appendChild(p);
    });
}

/* MOBİL MENÜ AÇMA / KAPATMA */

const mobilMenuBtn = document.getElementById("mobilMenuBtn");
const mobilMenu = document.getElementById("mobilMenu");

if (mobilMenuBtn && mobilMenu) {

    const mobilMenuIkon = mobilMenuBtn.querySelector("i");

    function mobilMenuyuKapat() {
        mobilMenu.classList.remove("mobil-acik");
        mobilMenuBtn.setAttribute("aria-expanded", "false");
        mobilMenuBtn.setAttribute("aria-label", "Menüyü aç");

        mobilMenuIkon.classList.remove("fa-xmark");
        mobilMenuIkon.classList.add("fa-bars");
    }

    mobilMenuBtn.addEventListener("click", () => {

        const acik = mobilMenu.classList.toggle("mobil-acik");

        mobilMenuBtn.setAttribute("aria-expanded", String(acik));
        mobilMenuBtn.setAttribute(
            "aria-label",
            acik ? "Menüyü kapat" : "Menüyü aç"
        );

        mobilMenuIkon.classList.toggle("fa-bars", !acik);
        mobilMenuIkon.classList.toggle("fa-xmark", acik);
    });

    mobilMenu.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", mobilMenuyuKapat);

    });
}

/* AKTİF MENÜ BAĞLANTISI */

const menuLinkleri = document.querySelectorAll(
    'header nav a, #mobilMenu a'
);

menuLinkleri.forEach((link) => {
    link.addEventListener("click", () => {

        const hedef = link.getAttribute("href");

        menuLinkleri.forEach((digerLink) => {
            digerLink.classList.toggle(
                "aktif",
                digerLink.getAttribute("href") === hedef
            );
        });

    });
});

/* SAYFA KAYDIRILDIĞINDA AKTİF MENÜYÜ GÜNCELLE */

const bolumler = document.querySelectorAll("main section[id]");

function aktifMenuGuncelle() {
    let aktifBolum = "";

    bolumler.forEach((bolum) => {
        const bolumUst = bolum.offsetTop;

        if (window.scrollY + 200 >= bolumUst) {
            aktifBolum = bolum.getAttribute("id");
        }
    });

    menuLinkleri.forEach((link) => {
        link.classList.remove("aktif");

        if (link.getAttribute("href") === "#" + aktifBolum) {
            link.classList.add("aktif");
        }
    });
}

window.addEventListener("scroll", aktifMenuGuncelle);
window.addEventListener("load", aktifMenuGuncelle);
