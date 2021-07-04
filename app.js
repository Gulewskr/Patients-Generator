/* zmienne sterujące */
const liczba = 10000 //liczba pacjęntów do utworzenia
const plik = "pacjenci.JSON" //nazwa pliku do wygenerowania
const yearMin = 1900 //minimalny rok urodzenia pacjenta
const yearMax = 2016 //maksymalny rok urodzenia pacjenta

/*zmienne pomocnicze*/
const numberOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthP1900 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const monthP2000 = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"];

/* Funkcje programu*/
function readTextFile(file)
{
    fs = require('fs');
    return fs.readFileSync(file, 'utf8' );
}

function writeTextFile(text)
{
    fs = require('fs');
    fs.writeFile( plik, text, function (err) {
        if (err) return console.log(err);
        console.log("zapisano " + liczba + " pacjentów do pliku");
    });
}

const ReadCSV = (file) => {
    var fileText = readTextFile(file);
    fileText = fileText.replace( /[0-9]|\r|\n/g ,"");
    var res = fileText.split(',');
    return res;
}

const GeneratePatient = () => {
    var imie;
    var nazwisko;
    var rok = Math.floor(Math.random() * (yearMax - yearMin + 1)) + yearMin;
    var miesiac = Math.floor(Math.random() * 12) + 1;
    var dzien = GetRandomDay(rok, miesiac);
    var pesel;
    var tel = GetRandomPhoneNumber();
    var z = Math.floor(Math.random() * 6) + 1;

    if(Math.floor(Math.random()*100+1)%2 === 0 ){
        imie = GetRandomValueFromArray(imiona_m);
        nazwisko = GetRandomValueFromArray(nazwiska_m);
        pesel = GeneratePesel(dzien, miesiac, rok, true);
    }else{
        imie = GetRandomValueFromArray(imiona_z);
        nazwisko = GetRandomValueFromArray(nazwiska_z);
        pesel = GeneratePesel(dzien, miesiac, rok, false);
    }

    if(miesiac < 10) miesiac = "0" + miesiac;
    if(dzien < 10) dzien = "0" + dzien;

    return { 
        "nazwisko": nazwisko,
        "imie": imie,
        "pesel": pesel,
        "data_ur": [rok.toString(), miesiac.toString(), dzien.toString()], 
        "nr_tel": tel.toString(),
        "zagr": z.toString()
    };
}

const GetRandomValueFromArray = ( a ) => a[Math.floor(Math.random() * a.length)] 

const GetRandomPhoneNumber = () => Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;

const GetRandomDay = (y, m) => {
    var maxDay = CalculateMaxDayOfMonth(y, m)
    return Math.floor(Math.random() * maxDay) + 1;
}

const CalculateMaxDayOfMonth = (year, month) => {
    if(month == 2 && year % 4 == 0 && year % 100 != 0)
    {
      return 29;
    }
    return numberOfDays[month-1];
}

// sex - płeć - true === mężczyzna, false === kobieta
const GeneratePesel = (d, m, y ,sex) => {
    var res = ""
    res += y.toString().substring(2);
    res += GetMothPesel(y, m);
    res += d < 10 ? ("0" + d.toString()) : d.toString();
    res += Math.floor(Math.random() * 9);
    res += Math.floor(Math.random() * 9);
    res += Math.floor(Math.random() * 9);
    sex ? res += Math.floor(Math.random() * 4) * 2 : res += Math.floor(Math.random() * 4) * 2 + 1;
    res += CalculateControlSum(res);
    return res;
}

const GetMothPesel = (y, m) => (y < 2000) ? monthP1900[m-1] : monthP2000[m-1]

const CalculateControlSum = (numbers) => {
    var controlScale = [1,3,7,9,1,3,7,9,1,3]
    var res = 0;
    for(let i = 0, l = controlScale.length; i < l; i++ )
        res += (numbers[i] * controlScale[i]) % 10
    let w = res%10;
    return w !== 0 ? 10 - w : w
}

/* Główny program */
console.log("Generator pacjęntów v 1.0 stworzone na potrzeby testów programu Dariusza S.");

//utworzenie tabel ze zmiennymi
const nazwiska_z = ReadCSV("./nazwiska_żeńskie-z_uwzględnieniem_osób_zmarłych.csv");
const imiona_z = ReadCSV("./Wykaz_imion_żeńskich_nadanych_dzieciom_urodzonym_w_2020_r._wg_pola_imię_pierwsze__statystyka_ogólna_dla_całej_Polski.csv").filter((v) => v !== "KOBIETA");
const nazwiska_m = ReadCSV("./nazwiska_męskie-z_uwzględnieniem_osób_zmarłych.csv");
const imiona_m = ReadCSV("./Wykaz_imion_męskich_nadanych_dzieciom_urodzonym_w_2020_r._wg_pola_imię_pierwsze__statystyka_ogólna_dla_całej_Polski.csv").filter((v) => v !== "MĘŻCZYZNA");

//generowanie pacjentów
const ListOfPatients = [];
for(let i = 0; i < liczba; i++)
{
    ListOfPatients.push(GeneratePatient());
}

console.log("wygenerowani pacjenci");
console.log(ListOfPatients);

//zapis w pliku JSON
writeTextFile('{'+ '"' + "pacjenci" + '"' + ':' + JSON.stringify(ListOfPatients) + '}');

console.log("Koniec działania...");