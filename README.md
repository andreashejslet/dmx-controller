# 💡 DMX Controller PWA

Professionel DMX lyscontroller til gudstjenester og events - kører som app på din iPhone!

## 📦 Installation

### Trin 1: Upload til GitHub (2 min)

1. **Opret nyt repository:**
- Gå til https://github.com/new
- Navn: `dmx-controller` (eller hvad du vil)
- Public ✅
- Tryk “Create repository”
1. **Upload filer:**
- Klik “uploading an existing file”
- Træk disse filer ind:
  - `index.html`
  - `app.js`
  - `manifest.json`
  - `sw.js`
- Tryk “Commit changes”
1. **Enable GitHub Pages:**
- Gå til Settings → Pages
- Source: “main” branch
- Tryk “Save”
- Vent 1-2 minutter

### Trin 2: Installer på iPhone (30 sek)

1. Åbn Safari på iPhone
1. Gå til: `https://[dit-brugernavn].github.io/dmx-controller`
1. Tryk Del-knappen (📤)
1. Vælg “Tilføj til hjemmeskærm”
1. Giv den et navn (f.eks. “DMX”)
1. Tryk “Tilføj”

**Færdig!** App’en er nu på din hjemmeskærm! 🎉

### Trin 3: Upload ESP32 kode (2 min)

1. Åbn Arduino IDE
1. Kopiér koden fra `ESP32_DMX_Receiver.ino`
1. Upload til ESP32
1. Åbn Serial Monitor (115200 baud)
1. Find IP adressen

### Trin 4: Forbind app til ESP32 (1 min)

1. Åbn DMX app på iPhone
1. Tryk ☰ menu → “ESP32 Forbindelse”
1. Indtast IP adressen fra Serial Monitor
1. Tryk “Test Forbindelse”
1. Tryk “Gem”

**Nu er alt klar!** 🚀

-----

## 📱 App Features

### 🎭 Setliste

- 9 sange med professionelt lysdesign
- Multi-slide support (f.eks. 7 slides til solopgang)
- Næste/Forrige navigation
- Pause/Resume
- TEST-funktion til alle lamper

### 🎨 Kontrol

- Frontlys (uafhængig kontrol)
- RGB farvevalg
- Live sliders
- 8 preset farver

### ✨ Effekter

- Slow Fade
- Pulse
- Beat-sync
- Automatisk med sange

### 📊 Overblik

- Alle lamper og kanaler
- Live DMX kontrol
- Test individuelle kanaler

### ⚙️ Setup

- WiFi configuration for ESP32
- Lampe DMX adresser
- Gemmes lokalt på telefon
- Virker offline

-----

## 🔌 ESP32 Setup

### Hardware:

- ESP32 Dev Module
- RS485 modul
- GPIO2 → RS485 TX
- 3.3V/5V → RS485 VCC
- GND → RS485 GND

### Første gang:

1. ESP32 starter som “DMX-ESP32” access point
1. Password: `dmx12345`
1. Forbind med telefon
1. Åbn browser → `http://192.168.4.1/config`
1. Indtast dit WiFi
1. ESP genstarter og forbinder

### Normal brug:

- ESP forbinder automatisk til WiFi
- Find IP i Serial Monitor
- Indtast IP i app

-----

## 🎯 Lampeliste

**Baisun 60 LED Par** (DMX 1, 17, 33, 49)

- Ch 1: Master Dim
- Ch 2: Rød
- Ch 3: Grøn
- Ch 4: Blå

**XpCleoyz Moving Head** (DMX 65, 81)

- Ch 1: Pan (0-540°)
- Ch 3: Tilt (0-180°)
- Ch 6: Dimmer
- Ch 10: Rød
- Ch 11: Grøn
- Ch 12: Blå

**BKing LED Battery** (DMX 97, 113, 129, 145)

- Ch 1: Rød
- Ch 2: Grøn
- Ch 3: Blå
- Ch 4: Hvid

**White Par LED** (DMX 161, 177)

- Ch 1: Kold Hvid
- Ch 2: Varm Hvid

-----

## 🎵 Setliste

1. **TEST** - Systematisk test af alle lamper
1. **Gospel Medley** - Gul/rav med pulse effekt
1. **Human** - Blå/grå, intens
1. **Beautiful Things** - Grøn, slow fade
1. **I østen stiger solen op** - 7-slide solopgang 🌅
1. **En drøm** - Lilla/rosa slow fade
1. **Hallelujah** - Dyb lilla/amber, intim
1. **I morgen** - Lyseblå/orange, håbefuld
1. **Trosbekendelsen** - Rød/cyan/magenta beat

-----

## 🔧 Troubleshooting

**App virker ikke offline:**

- Refresh siden én gang efter installation
- Service Worker skal aktiveres

**ESP32 forbinder ikke:**

- Check Serial Monitor for IP
- Check at iPhone er på samme WiFi
- Test med http://[IP]/ping i browser

**DMX sender ikke:**

- Check RS485 forbindelser
- GPIO2 skal være forbundet til RS485 TX
- Check Serial Monitor for “DMX OUTPUT STARTED”

**Lamper reagerer ikke:**

- Check DMX adresser matcher
- Test i Overblik-fanen først
- Check at Master Dim/Dimmer er aktiveret

-----

## 📝 Opdatering

### Opdater App:

1. Rediger filer på GitHub
1. Commit changes
1. Refresh app på telefon (træk ned)

### Opdater ESP32:

1. Upload ny Arduino kode
1. Ingen WiFi config nødvendig (husket)

-----

## 💾 Backup

Alt gemmes lokalt på telefonen:

- Lampe setup
- ESP32 IP
- Frontlys indstillinger

**Backup**: Eksporter fra browser Developer Tools → Application → Local Storage

-----

## 🆘 Support

Problemer? Check:

1. Serial Monitor (ESP32)
1. Browser Console (Udviklerværktøjer)
1. Network tab (se HTTP requests)

-----

## 📜 Licens

MIT License - Brug frit!

-----

**Lavet med ❤️ til professionel lyscontrol**
